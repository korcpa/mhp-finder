/**
 * Google Apps Script backend for anonymous game analytics.
 *
 * Privacy: only random browser/session/play IDs are stored. No name, email,
 * IP address, URL, user-agent, or free text is accepted into the sheet.
 *
 * Deploy as a Web App with "Execute as: Me" and access for "Anyone".
 */
const SHEET_NAME = "Analytics";
const DASHBOARD_NAME = "Dashboard";
const TIME_ZONE = "Asia/Seoul";
const SCORE_KEYS = ["clinical", "social", "nurse", "occupational"];
const ALLOWED_EVENTS = new Set(["visit", "complete", "share"]);
const HEADERS = [
  "timestamp", "month", "event", "version", "result", "pattern", "scores",
  "week", "visitor_id", "session_id", "play_id", "visit_type", "is_repeat",
  "result_count",
  "clinical_included", "social_included", "nurse_included", "occupational_included",
  "clinical_weight", "social_weight", "nurse_weight", "occupational_weight"
];

function doGet() {
  return jsonResponse_({ ok: true, service: "mind-health-game-analytics-v2" });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const row = validateAndBuildRow_(body);

    lock.waitLock(10000);
    getOrCreateSheet_().appendRow(row);
    return jsonResponse_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function validateAndBuildRow_(body) {
  const eventName = String(body.event || "");
  const version = safeCell_(body.version, 32);
  const visitorId = safeId_(body.visitor_id, "visitor_id", true);
  const sessionId = safeId_(body.session_id, "session_id", true);
  const playId = safeId_(body.play_id, "play_id", eventName !== "visit");
  const visitType = eventName === "visit" ? String(body.visit_type || "") : "";
  const isRepeat = body.is_repeat === true;
  const pattern = safeCell_(body.pattern, 32);
  const scores = safeCell_(body.scores, 500);

  if (!ALLOWED_EVENTS.has(eventName)) throw new Error("Invalid event");
  if (!version) throw new Error("Missing version");
  if (visitType && !["new", "returning"].includes(visitType)) {
    throw new Error("Invalid visit_type");
  }

  const clientDate = new Date(body.timestamp);
  const timestamp = Number.isNaN(clientDate.getTime()) ? new Date() : clientDate;
  const month = Utilities.formatDate(timestamp, TIME_ZONE, "yyyy-MM");
  const week = isoWeekKey_(timestamp);

  let result = "";
  let resultKeys = [];
  let parsedScores = null;

  if (eventName === "complete") {
    resultKeys = parseResult_(body.result);
    result = resultKeys.length === SCORE_KEYS.length ? "all" : resultKeys.join("+");
    if (!pattern || !scores) throw new Error("Incomplete result data");

    parsedScores = JSON.parse(scores);
    SCORE_KEYS.forEach((key) => {
      if (!Number.isFinite(Number(parsedScores[key]))) throw new Error("Invalid scores");
    });
  }

  const resultCount = resultKeys.length;
  const included = SCORE_KEYS.map((key) => resultKeys.includes(key) ? 1 : 0);
  const totalScore = parsedScores
    ? SCORE_KEYS.reduce((sum, key) => sum + Number(parsedScores[key]), 0)
    : 0;
  const weights = SCORE_KEYS.map((key) => (
    parsedScores && totalScore ? Number(parsedScores[key]) / totalScore : 0
  ));

  return [
    timestamp, month, eventName, version, result, pattern,
    parsedScores ? JSON.stringify(parsedScores) : "",
    week, visitorId, sessionId, playId, visitType, isRepeat, resultCount,
    ...included, ...weights
  ];
}

function parseResult_(value) {
  const text = String(value || "");
  if (text === "all") return [...SCORE_KEYS];

  const requested = text.split("+").filter(Boolean);
  const unique = SCORE_KEYS.filter((key) => requested.includes(key));
  if (
    !unique.length ||
    requested.length !== new Set(requested).size ||
    unique.length !== requested.length
  ) {
    throw new Error("Invalid result");
  }
  return unique;
}

function safeId_(value, fieldName, required) {
  const text = safeCell_(value, 80);
  if (required && !text) throw new Error(`Missing ${fieldName}`);
  if (text && !/^[a-z0-9_-]+$/i.test(text)) throw new Error(`Invalid ${fieldName}`);
  return text;
}

function safeCell_(value, maxLength) {
  let text = String(value == null ? "" : value).slice(0, maxLength);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function isoWeekKey_(date) {
  const localDate = Utilities.formatDate(date, TIME_ZONE, "yyyy-MM-dd")
    .split("-")
    .map(Number);
  const utc = new Date(Date.UTC(localDate[0], localDate[1] - 1, localDate[2]));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utc - yearStart) / 86400000) + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.setSpreadsheetTimeZone(TIME_ZONE);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else {
    // Keeps the original seven columns intact and appends v2 columns safely.
    const currentHeaders = sheet
      .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1))
      .getValues()[0];
    HEADERS.forEach((header, index) => {
      if (currentHeaders[index] !== header) {
        sheet.getRange(1, index + 1).setValue(header);
      }
    });
  }

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight("bold")
    .setBackground("#d9ead3");
  sheet.getRange("A:A").setNumberFormat("yyyy-mm-dd hh:mm:ss");
  sheet.getRange("B:B").setNumberFormat("@");
  sheet.getRange("D:D").setNumberFormat("@");
  sheet.getRange("H:H").setNumberFormat("@");
  return sheet;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run once after pasting this version. Existing v1 rows remain usable.
 */
function setupDashboard() {
  getOrCreateSheet_();
  refreshDashboard();
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("게임 통계")
    .addItem("Dashboard 새로고침", "refreshDashboard")
    .addToUi();
}

/**
 * Rebuilds the dashboard from Analytics. It is intentionally manual so every
 * game event remains a fast, reliable append-only write.
 */
function refreshDashboard() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const analytics = getOrCreateSheet_();
  let dashboard = spreadsheet.getSheetByName(DASHBOARD_NAME);
  if (!dashboard) dashboard = spreadsheet.insertSheet(DASHBOARD_NAME);
  // Unfreeze first; merged title/card areas can otherwise cross a frozen boundary.
  dashboard.setFrozenRows(0);
  dashboard.setFrozenColumns(0);
  dashboard.getCharts().forEach((chart) => dashboard.removeChart(chart));
  dashboard.getDataRange().breakApart();
  dashboard.clear();
  dashboard.clearFormats();

  const values = analytics.getDataRange().getValues();
  const headers = values.shift() || HEADERS;
  const index = Object.fromEntries(headers.map((name, position) => [name, position]));
  const rows = values.filter((row) => row[index.event]);

  const visitors = new Set();
  const completedVisitors = new Set();
  let legacyVisitors = 0;
  let legacyCompletedVisitors = 0;
  let sessions = 0;
  let newSessions = 0;
  let returningSessions = 0;
  let completes = 0;
  let firstCompletes = 0;
  let repeatCompletes = 0;
  let shares = 0;

  const monthly = new Map();
  const weekly = new Map();
  const versions = new Map();
  const combinations = new Map();
  const patterns = new Map();
  const professionIncluded = Object.fromEntries(SCORE_KEYS.map((key) => [key, 0]));
  const professionWeight = Object.fromEntries(SCORE_KEYS.map((key) => [key, 0]));

  rows.forEach((row) => {
    const eventName = String(row[index.event] || "");
    const visitorId = String(row[index.visitor_id] || "");
    const monthValue = row[index.month];
    const month = monthValue instanceof Date && !Number.isNaN(monthValue.getTime())
      ? Utilities.formatDate(monthValue, TIME_ZONE, "yyyy-MM")
      : String(monthValue || "");
    const week = String(row[index.week] || "");
    const version = String(row[index.version] || "");
    const repeat = row[index.is_repeat] === true || String(row[index.is_repeat]).toLowerCase() === "true";

    if (visitorId) visitors.add(visitorId);
    if (eventName === "visit") {
      sessions += 1;
      if (!visitorId) legacyVisitors += 1;
      const type = String(row[index.visit_type] || "");
      if (type === "returning") returningSessions += 1;
      else newSessions += 1;
    }
    if (eventName === "complete") {
      completes += 1;
      if (repeat) repeatCompletes += 1;
      else firstCompletes += 1;
      if (visitorId) completedVisitors.add(visitorId);
      else legacyCompletedVisitors += 1;

      increment_(combinations, String(row[index.result] || "unknown"));
      increment_(patterns, String(row[index.pattern] || "unknown"));

      const resultKeys = legacyResultKeys_(row[index.result]);
      const scoreWeights = scoreWeightsFromRow_(row, index, resultKeys);
      resultKeys.forEach((key) => {
        professionIncluded[key] += 1;
      });
      SCORE_KEYS.forEach((key) => {
        professionWeight[key] += scoreWeights[key];
      });
    }
    if (eventName === "share") shares += 1;

    updatePeriod_(monthly, month, eventName, repeat, row[index.visit_type]);
    updatePeriod_(weekly, week, eventName, repeat, row[index.visit_type]);
    updatePeriod_(versions, version, eventName, repeat, row[index.visit_type]);
  });

  const uniqueVisitors = visitors.size + legacyVisitors;
  const uniqueCompleted = completedVisitors.size + legacyCompletedVisitors;
  dashboard.getRange("A1:F2").merge()
    .setValue("정신건강전문요원 찾기 · 통계 Dashboard")
    .setFontSize(18)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBackground("#274e3f")
    .setFontColor("#ffffff");
  dashboard.getRange("A3:F3").merge()
    .setValue(`마지막 새로고침: ${Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd HH:mm")}`)
    .setHorizontalAlignment("right")
    .setFontColor("#666666");

  writeKpiCard_(dashboard, 5, 1, "순 방문자", uniqueVisitors, "0", "#d9ead3");
  writeKpiCard_(dashboard, 5, 3, "재방문율", ratio_(returningSessions, sessions), "0.0%", "#d9eaf7");
  writeKpiCard_(dashboard, 5, 5, "방문자 완료율", ratio_(uniqueCompleted, uniqueVisitors), "0.0%", "#fce5cd");
  writeKpiCard_(dashboard, 9, 1, "전체 플레이 완료", completes, "0", "#fff2cc");
  writeKpiCard_(dashboard, 9, 3, "반복 플레이율", ratio_(repeatCompletes, completes), "0.0%", "#eadcf8");
  writeKpiCard_(dashboard, 9, 5, "완료 대비 공유율", ratio_(shares, completes), "0.0%", "#f4cccc");

  dashboard.getRange("A13:F13").merge()
    .setValue("지표 읽는 법")
    .setFontWeight("bold")
    .setBackground("#eeeeee");
  dashboard.getRange("A14:F18").merge()
    .setValue(
      "• 순 방문자: 익명 브라우저 ID 기준 방문자 수\n" +
      "• 재방문율: 30분 이상 활동이 없다가 다시 접속한 세션 비율(30분 기준은 방문 세션에만 적용)\n" +
      "• 방문자 완료율: 한 번 이상 완료한 방문자 ÷ 순 방문자\n" +
      "• 전체 플레이 완료: 결과 화면에 도달한 모든 플레이. 30분 이내 반복 플레이도 각각 집계\n" +
      "• 반복 플레이율: 두 번째 이후 완료 ÷ 전체 완료\n" +
      "• 공유율: 공유한 플레이 ÷ 전체 완료\n" +
      "• 응답 점수 지분: 각 직역 점수 ÷ 전체 점수. 예: 2·1·1·0 → 50%·25%·25%·0%"
    )
    .setWrap(true)
    .setVerticalAlignment("middle")
    .setBackground("#fafafa");

  const professionNames = {
    clinical: "임상심리",
    social: "사회복지",
    nurse: "간호",
    occupational: "작업치료"
  };
  const professionRows = [["직역", "최종 추천 포함", "응답 점수 지분", "점수 비율"]];
  SCORE_KEYS.forEach((key) => {
    professionRows.push([
      professionNames[key],
      professionIncluded[key],
      professionWeight[key],
      ratio_(professionWeight[key], completes)
    ]);
  });
  writeSectionTitle_(dashboard, 20, "직역별 추천 통계");
  dashboard.getRange("A21:F21").merge()
    .setValue("‘최종 추천 포함’은 결과에 표시된 직역 횟수이며, ‘응답 점수 지분’은 모든 선택 점수를 비율로 나눈 값입니다.")
    .setWrap(true)
    .setFontColor("#555555");
  writeTable_(dashboard, 22, 1, professionRows);
  dashboard.getRange(23, 4, SCORE_KEYS.length, 1).setNumberFormat("0.0%");

  const combinationRows = distributionTable_("추천 조합", combinations, completes, resultLabel_);
  writeSectionTitle_(dashboard, 29, "단독·공동 추천 조합");
  dashboard.getRange("A30:F30").merge()
    .setValue("한 번의 완료는 아래 조합 중 정확히 한 곳에만 집계됩니다.")
    .setFontColor("#555555");
  writeTable_(dashboard, 31, 1, combinationRows);

  const monthlyStart = 34 + Math.max(combinationRows.length, 3);
  writeSectionTitle_(dashboard, monthlyStart, "월별 추이");
  writeTable_(dashboard, monthlyStart + 1, 1, periodTable_("월", monthly));

  const weeklyStart = monthlyStart + Math.max(monthly.size + 5, 8);
  writeSectionTitle_(dashboard, weeklyStart, "주별 추이");
  writeTable_(dashboard, weeklyStart + 1, 1, periodTable_("주", weekly));

  const versionStart = weeklyStart + Math.max(weekly.size + 5, 8);
  writeSectionTitle_(dashboard, versionStart, "Version별 통계");
  writeTable_(dashboard, versionStart + 1, 1, periodTable_("Version", versions));

  const patternStart = versionStart + Math.max(versions.size + 5, 8);
  writeSectionTitle_(dashboard, patternStart, "응답 Pattern 분포");
  dashboard.getRange(patternStart + 1, 1, 1, 6).merge()
    .setValue("예: 4000은 한 직역 집중, 2200은 두 직역 동점, 1111은 네 직역 균등")
    .setFontColor("#555555");
  writeTable_(dashboard, patternStart + 2, 1, distributionTable_("Pattern", patterns, completes));

  dashboard.setFrozenRows(3);
  dashboard.showColumns(1, 6);
  dashboard.setColumnWidths(1, 6, 120);
  dashboard.setColumnWidth(1, 190);
  dashboard.setRowHeights(5, 7, 28);
  dashboard.setRowHeights(14, 5, 24);
  dashboard.hideColumns(7, Math.max(dashboard.getMaxColumns() - 6, 1));
}

function updatePeriod_(map, key, eventName, repeat, visitType) {
  if (!key) return;
  if (!map.has(key)) {
    map.set(key, { visits: 0, newVisits: 0, returning: 0, first: 0, repeats: 0, completes: 0, shares: 0 });
  }
  const item = map.get(key);
  if (eventName === "visit") {
    item.visits += 1;
    if (visitType === "returning") item.returning += 1;
    else item.newVisits += 1;
  } else if (eventName === "complete") {
    item.completes += 1;
    if (repeat) item.repeats += 1;
    else item.first += 1;
  } else if (eventName === "share") {
    item.shares += 1;
  }
}

function periodTable_(title, map) {
  const table = [[title, "방문", "재방문", "완료", "반복", "공유", "완료율"]];
  [...map.entries()]
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
    .forEach(([key, item]) => {
      table.push([
        displayPeriod_(key), item.visits, item.returning, item.completes,
        item.repeats, item.shares, ratio_(item.first, item.visits)
      ]);
    });
  return table;
}

function distributionTable_(title, map, total, labeler) {
  const table = [[title, "횟수", "비율"]];
  [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([key, count]) => table.push([
      labeler ? labeler(key) : key,
      count,
      ratio_(count, total)
    ]));
  return table;
}

function resultLabel_(value) {
  const names = {
    clinical: "임상심리",
    social: "사회복지",
    nurse: "간호",
    occupational: "작업치료"
  };
  if (value === "all") return "전체 직역(균등)";
  return String(value || "알 수 없음")
    .split("+")
    .map((key) => names[key] || key)
    .join(" + ");
}

function displayPeriod_(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return Utilities.formatDate(value, TIME_ZONE, "yyyy-MM");
  }
  return String(value || "");
}

function legacyResultKeys_(value) {
  const text = String(value || "");
  if (text === "all") return [...SCORE_KEYS];
  return SCORE_KEYS.filter((key) => text.split("+").includes(key));
}

function scoreWeightsFromRow_(row, index, fallbackKeys) {
  const stored = {};
  let storedTotal = 0;
  SCORE_KEYS.forEach((key) => {
    const value = Number(row[index[`${key}_weight`]]);
    stored[key] = Number.isFinite(value) ? value : 0;
    storedTotal += stored[key];
  });
  if (storedTotal > 0) return stored;

  try {
    const scores = JSON.parse(String(row[index.scores] || "{}"));
    const total = SCORE_KEYS.reduce((sum, key) => sum + Number(scores[key] || 0), 0);
    if (total > 0) {
      return Object.fromEntries(
        SCORE_KEYS.map((key) => [key, Number(scores[key] || 0) / total])
      );
    }
  } catch (_) {
    // Legacy rows can fall back to equal shares of their final result.
  }

  const share = fallbackKeys.length ? 1 / fallbackKeys.length : 0;
  return Object.fromEntries(
    SCORE_KEYS.map((key) => [key, fallbackKeys.includes(key) ? share : 0])
  );
}

function increment_(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function ratio_(numerator, denominator) {
  return denominator ? numerator / denominator : 0;
}

function writeTable_(sheet, row, column, values) {
  if (!values.length) return;
  const width = Math.max(...values.map((item) => item.length));
  const padded = values.map((item) => [...item, ...Array(width - item.length).fill("")]);
  const range = sheet.getRange(row, column, padded.length, width);
  range.setNumberFormat("General");
  range.setValues(padded);
  range.setBorder(true, true, true, true, true, true);
  sheet.getRange(row, column, 1, width)
    .setFontWeight("bold")
    .setBackground("#d9ead3");

  if (width >= 3 && row >= 14) {
    sheet.getRange(row + 1, column + width - 1, Math.max(padded.length - 1, 1), 1)
      .setNumberFormat("0.0%");
  }
}

function writeSectionTitle_(sheet, row, title) {
  sheet.getRange(row, 1, 1, 6).merge()
    .setValue(title)
    .setFontSize(13)
    .setFontWeight("bold")
    .setBackground("#d9ead3")
    .setBorder(false, false, true, false, false, false, "#274e3f", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function writeKpiCard_(sheet, row, column, title, value, numberFormat, color) {
  sheet.getRange(row, column, 1, 2).merge()
    .setValue(title)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground(color);
  sheet.getRange(row + 1, column, 2, 2).merge()
    .setValue(value)
    .setNumberFormat(numberFormat)
    .setFontSize(18)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBackground(color)
    .setBorder(true, true, true, true, false, false);
}
