/**
 * Anonymous analytics for "나에게 맞는 정신건강전문요원 찾기".
 *
 * Privacy: no name, email, IP address, URL, user-agent, or free text is sent.
 * Change GAME_VERSION whenever a released game version should be reported separately.
 */
(function (window) {
  "use strict";

  const GAME_VERSION = "1.1.0";

  // Paste the deployed Google Apps Script Web App URL (/exec) here.
  // An empty URL safely disables network transmission while keeping the game operational.
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyLBtYShrTseoqEJ-giL9P0DM0vMO9Euh8YuK44WJA9Ld1oAupDTLOme_G4Ha-d0THo/exec";

  const STORAGE_PREFIX = "mh-game-analytics-v2";
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
  const ALLOWED_EVENTS = new Set(["visit", "complete", "share"]);
  const inFlightEvents = new Set();
  const SCORE_KEYS = ["clinical", "social", "nurse", "occupational"];
  const INTERNAL_SCORE_KEYS = {
    clinical: "clinical",
    social: "social",
    nurse: "nurse",
    ot: "occupational",
    occupational: "occupational"
  };

  function normalizeScores(rawScores) {
    const normalized = {
      clinical: 0,
      social: 0,
      nurse: 0,
      occupational: 0
    };

    Object.entries(rawScores || {}).forEach(([key, value]) => {
      const publicKey = INTERNAL_SCORE_KEYS[key];
      const numericValue = Number(value);
      if (publicKey && Number.isFinite(numericValue)) {
        normalized[publicKey] = numericValue;
      }
    });

    return normalized;
  }

  let currentPlayId = "";
  let currentPlayIsRepeat = false;

  function makeId(prefix) {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return `${prefix}_${window.crypto.randomUUID()}`;
      }
    } catch (_) {
      // Fall through to a non-identifying random value.
    }

    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    } catch (_) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}:${key}`, String(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function readJson(key) {
    try {
      return JSON.parse(readStorage(key) || "null");
    } catch (_) {
      return null;
    }
  }

  function getVisitor() {
    const existingId = readStorage("visitor-id");
    if (existingId) return { id: existingId, isNew: false };

    const id = makeId("v");
    writeStorage("visitor-id", id);
    return { id, isNew: true };
  }

  function getSession(visitor) {
    const now = Date.now();
    const saved = readJson("session");

    if (
      saved &&
      saved.id &&
      Number.isFinite(saved.lastSeen) &&
      now - saved.lastSeen < SESSION_TIMEOUT_MS
    ) {
      const active = { ...saved, lastSeen: now };
      writeStorage("session", JSON.stringify(active));
      return active;
    }

    const created = {
      id: makeId("s"),
      lastSeen: now,
      visitType: visitor.isNew ? "new" : "returning"
    };
    writeStorage("session", JSON.stringify(created));
    return created;
  }

  const visitor = getVisitor();
  let session = getSession(visitor);

  function touchSession() {
    session = { ...session, lastSeen: Date.now() };
    writeStorage("session", JSON.stringify(session));
  }

  function makePattern(scores) {
    return SCORE_KEYS
      .map((key) => scores[key])
      .sort((a, b) => b - a)
      .join("");
  }

  function resultKeysFromScores(scores) {
    const values = SCORE_KEYS.map((key) => scores[key]);
    const maxScore = Math.max(...values);
    const allEqual = values.every((value) => value === values[0]);
    return allEqual
      ? [...SCORE_KEYS]
      : SCORE_KEYS.filter((key) => scores[key] === maxScore);
  }

  function normalizeResultKeys(rawKeys, scores) {
    const requested = Array.isArray(rawKeys) ? rawKeys : [];
    const mapped = requested
      .map((key) => INTERNAL_SCORE_KEYS[key])
      .filter((key) => SCORE_KEYS.includes(key));
    const unique = SCORE_KEYS.filter((key) => mapped.includes(key));
    return unique.length ? unique : resultKeysFromScores(scores);
  }

  function resultCombination(keys) {
    return keys.length === SCORE_KEYS.length ? "all" : keys.join("+");
  }

  function eventStorageKey(eventName, scopeId) {
    return `recorded:${GAME_VERSION}:${eventName}:${scopeId}`;
  }

  function wasRecorded(eventName, scopeId) {
    return readStorage(eventStorageKey(eventName, scopeId)) === "1";
  }

  function markRecorded(eventName, scopeId) {
    writeStorage(eventStorageKey(eventName, scopeId), "1");
  }

  function completionCount() {
    return Number(readStorage(`completion-count:${GAME_VERSION}`) || 0);
  }

  function beginPlay() {
    currentPlayId = makeId("p");
    currentPlayIsRepeat = completionCount() > 0;
    touchSession();
    return currentPlayId;
  }

  async function send(eventName, details = {}) {
    const scopeId = eventName === "visit"
      ? session.id
      : (currentPlayId || beginPlay());
    const flightKey = `${eventName}:${scopeId}`;

    if (
      !ALLOWED_EVENTS.has(eventName) ||
      wasRecorded(eventName, scopeId) ||
      inFlightEvents.has(flightKey)
    ) {
      return false;
    }

    const now = new Date();
    touchSession();
    const payload = {
      timestamp: now.toISOString(),
      event: eventName,
      version: GAME_VERSION,
      visitor_id: visitor.id,
      session_id: session.id,
      play_id: eventName === "visit" ? "" : scopeId,
      visit_type: eventName === "visit" ? session.visitType : "",
      is_repeat: eventName === "complete" || eventName === "share"
        ? currentPlayIsRepeat
        : false,
      result: "",
      pattern: "",
      scores: ""
    };

    if (eventName === "complete") {
      const normalizedScores = normalizeScores(details && details.scores);
      const resultKeys = normalizeResultKeys(details.resultKeys, normalizedScores);
      payload.result = resultCombination(resultKeys);
      payload.pattern = makePattern(normalizedScores);
      payload.scores = JSON.stringify(normalizedScores);
    }

    // No configured backend means analytics is intentionally disabled.
    if (!WEB_APP_URL) return false;

    inFlightEvents.add(flightKey);
    try {
      await window.fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        cache: "no-store",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      markRecorded(eventName, scopeId);
      if (eventName === "complete") {
        writeStorage(`completion-count:${GAME_VERSION}`, completionCount() + 1);
      }
      return true;
    } catch (error) {
      // Analytics must never interrupt or alter the game.
      console.warn("[Analytics] Event delivery failed.", error);
      return false;
    } finally {
      inFlightEvents.delete(flightKey);
    }
  }

  const Analytics = Object.freeze({
    GAME_VERSION,
    beginPlay,
    trackVisit: () => void send("visit"),
    trackComplete: (details) => void send("complete", details),
    trackShare: () => void send("share")
  });

  window.GameAnalytics = Analytics;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", Analytics.trackVisit, { once: true });
  } else {
    Analytics.trackVisit();
  }
})(window);
