const FIXED_DESCRIPTIONS = {
  clinical: "우울증, 불안장애는 물론 강박증, ADHD, 조현병, 성격장애 및 트라우마 등 다양한 마음의 어려움을 과학적으로 평가하고 치료적으로 돕는 전문요원입니다.\n\n먼저 '종합심리평가'를 통해 지적능력과 주의력 등의 인지 기능을 정밀하게 확인하고, 정서와 성격 상태를 객관적으로 측정합니다.\n\n평가 결과를 바탕으로 내면의 어려움을 함께 이해한 뒤, 고통스러운 증상을 완화하고 삶의 방식이 건강하게 변화하도록 돕는 '근거 기반의 전문 심리치료(심리상담)'를 제공하여 당신이 마음의 상처를 치유하고 스스로 일어설 수 있도록 돕습니다.",
  
  nurse: "요즘 잠은 잘 자는지, 몸 어디가 아프거나 불편하진 않은지, 그리고 처방받은 약은 규칙적으로 잘 챙겨 드시고 있는지 전체적인 '건강 상태를 관찰하고 자료를 수집'하는 전문요원입니다.\n\n정신과적 증상이 안정될 수 있도록 세심하게 케어해 드리는 것은 물론, 지친 몸과 마음의 면역력을 높이고 건강한 일상 루틴을 유지할 수 있도록 다방면의 '건강증진 활동'을 기획하고 수행합니다.",
  
  social: "마음이 아플 때는 나를 둘러싼 현실적 환경—가족 간의 갈등이나 경제적인 어려움, 직장이나 주거 문제 등이 겹쳐서 일상이 더 무겁게 느껴지곤 하죠.\n\n정신건강사회복지사는 당신이 처한 현실적인 환경과 필요한 사회서비스를 함께 살피고, 정부 지원, 맞춤형 복지 혜택, 그리고 당신에게 꼭 맞는 지역사회 전문 기관을 찾아갈 수 있도록 든든하게 안내하고 연계하는 정신건강전문요원입니다.",
  
  ot: "조현병, 만성 정신질환, 또는 인지/신체 기능 저하로 인해 무너진 삶의 기능을 다시 회복하는 '정신재활과 자립'을 돕는 전문요원입니다.\n\n정밀한 '작업 수행 평가'를 통해 주의력과 기억력을 깨우는 컴퓨터/교구 인지치료를 실시하며, 신체적·정신적 기능을 향상시킵니다. 씻기, 옷 입기, 식사하기, 요리하기 같은 기본적이고 독립적인 일상생활을 남의 도움 없이 스스로 다시 씩씩하게 해낼 수 있도록 체계적인 생활·작업 훈련을 제공합니다."
};

const services = {
  clinical: {
    emoji: "💬❤️",
    room: "임상심리실",
    expert: "정신건강임상심리사",
    service: "심리평가 · 심리상담",
    color: "#8357c7",
    table: "종합심리평가 · 전문 심리치료 · 마음 이해",
    desc: FIXED_DESCRIPTIONS.clinical,
    roomNpc: "./assets/npc/clinical-room-opt.png",
    resultNpc: "./assets/npc/clinical-result-opt.png",
    subLabel: "심리평가 · 심리상담"
  },
  nurse: {
    emoji: "💊",
    room: "간호실",
    expert: "정신건강간호사",
    service: "증상관리 · 복약관리 · 수면 · 신체건강",
    color: "#d35252",
    table: "건강상태 관찰 · 복약 및 수면체크 · 건강증진",
    desc: FIXED_DESCRIPTIONS.nurse,
    roomNpc: "./assets/npc/nurse-room-opt.png",
    resultNpc: "./assets/npc/nurse-result-opt.png",
    subLabel: "건강관리 · 약물관리"
  },
  social: {
    emoji: "🏠",
    room: "사회사업실",
    expert: "정신건강사회복지사",
    service: "가족 · 경제 · 주거 · 복지서비스 · 자원연계",
    color: "#4d9a45",
    table: "환경 및 사회서비스 조사 · 복지상담 · 자원연계",
    desc: FIXED_DESCRIPTIONS.social,
    roomNpc: "./assets/npc/social-room-opt.png",
    resultNpc: "./assets/npc/social-result-opt.png",
    subLabel: "복지연계 · 지역사회 지원"
  },
  ot: {
    emoji: "🌱",
    room: "작업치료실",
    expert: "정신건강작업치료사",
    service: "작업적 일상생활훈련 · 감각/활동훈련 · 작업재활",
    color: "#2f70b7",
    table: "작업수행평가 · 인지재활치료 · 일상생활훈련",
    desc: FIXED_DESCRIPTIONS.ot,
    roomNpc: "./assets/npc/ot-room-opt.png",
    resultNpc: "./assets/npc/ot-result-opt.png",
    subLabel: "일상생활 · 사회복귀"
  }
};

const SCORE_PER_CHOICE = 2.5; 

const flow = { 
  q1: { 
    progress: ["요즘의 변화", 25], 
    text: "요즘 가장 신경 쓰이는 변화는 무엇인가요?", 
    choices: [ 
      ["생각도 많아지고 마음도 자꾸 지쳐요.", { clinical: SCORE_PER_CHOICE }, { clinical: ["생각과 감정의 과부하 및 지침"] }, "q2"], 
      ["잠을 잘 못 자거나 몸이 자주 아프고 불편해요.", { nurse: SCORE_PER_CHOICE }, { nurse: ["수면 및 신체 건강 저하"] }, "q2"], 
      ["경제·주거·가족 문제로 일상이 버거워요.", { social: SCORE_PER_CHOICE }, { social: ["경제·주거·가족 문제로 인한 생활 부담"] }, "q2"], 
      ["예전보다 일상생활을 하는 것이 점점 불편해졌어요.", { ot: SCORE_PER_CHOICE }, { ot: ["작업 수행 및 일상 기능 변화"] }, "q2"] 
    ] 
  }, 
  q2: { 
    progress: ["가장 힘든 문제", 50], 
    text: "지금 나를 가장 힘들게 만드는 문제는 무엇인가요?", 
    choices: [ 
      ["마음이 너무 힘든데, 왜 이런지 스스로도 잘 모르겠어요.", { clinical: SCORE_PER_CHOICE }, { clinical: ["원인 불명의 심리적 고통"] }, "q3"], 
      ["제때 약을 챙겨 먹거나 건강 관리를 하기 어려워졌어요.", { nurse: SCORE_PER_CHOICE }, { nurse: ["복약 및 건강 루틴 관리"] }, "q3"], 
      ["제도나 기관 도움을 어디서 찾을지 모르겠어요.", { social: SCORE_PER_CHOICE }, { social: ["제도 및 기관 정보 탐색의 어려움"] }, "q3"], 
      ["씻기, 옷 입기, 식사 같은 일상이 예전보다 어려워졌어요.", { ot: SCORE_PER_CHOICE }, { ot: ["기본적 일상생활 수행 어려움"] }, "q3"] 
    ] 
  }, 
  q3: { 
    progress: ["원하는 도움", 75], 
    text: "오늘 전문가를 만난다면 가장 먼저 받고 싶은 도움은 무엇인가요?", 
    choices: [ 
      ["내가 왜 이런지 이해하고, 마음을 회복할 방법을 찾고 싶어요.", { clinical: SCORE_PER_CHOICE }, { clinical: ["심리평가 및 심리상담"] }, "q4"], 
      ["증상을 안정시키고 건강을 꾸준히 관리하고 싶어요.", { nurse: SCORE_PER_CHOICE }, { nurse: ["건강 관리 및 증상 조절"] }, "q4"], 
      ["복지서비스 신청과 기관 연계가 필요해요.", { social: SCORE_PER_CHOICE }, { social: ["복지서비스 신청 및 기관 연계 필요"] }, "q4"], 
      ["일상생활을 더 편하게 하고, 필요한 기능을 회복하고 싶어요.", { ot: SCORE_PER_CHOICE }, { ot: ["작업 수행 및 기능 회복"] }, "q4"] 
    ] 
  }, 
  q4: { 
    progress: ["장기적 회복 방향", 80], 
    text: "앞으로 건강한 삶을 위해 가장 필요한 것은 무엇인가요?", 
    choices: [ 
      ["내 마음을 더 깊이 이해하고, 스스로 회복하는 힘을 기르고 싶어요.", { clinical: SCORE_PER_CHOICE }, { clinical: ["자기 이해와 회복탄력성"] }, "finish"], 
      ["몸과 마음의 변화를 잘 살피며 건강을 꾸준히 관리하고 싶어요.", { nurse: SCORE_PER_CHOICE }, { nurse: ["건강 유지 및 재발 예방"] }, "finish"], 
      ["생활 문제를 꾸준히 살피며 필요한 기관과 이어지고 싶어요.", { social: SCORE_PER_CHOICE }, { social: ["생활 문제 점검 및 지속적인 기관 연계"] }, "finish"], 
      ["나에게 맞는 훈련을 통해 혼자서도 일상을 해낼 수 있었으면 좋겠어요.", { ot: SCORE_PER_CHOICE }, { ot: ["독립적인 일상생활"] }, "finish"] 
    ] 
  } 
};

let scores;
let route;
let triggers;
let primaryKeys;
let considerationKeys;
let allSameScore;
let currentRoom;
let historyStack;
let currentNode;
let browseOnlyMode;

function byId(id) {
  return document.getElementById(id);
}

function freshScores() {
  return { clinical: 0, nurse: 0, social: 0, ot: 0 };
}

function resetState() {
  scores = freshScores();
  route = [];
  triggers = { clinical: [], nurse: [], social: [], ot: [] };
  primaryKeys = [];
  considerationKeys = [];
  allSameScore = false;
  currentRoom = null;
  historyStack = [];
  currentNode = "title";
  browseOnlyMode = false;
}

function snapshot() {
  return JSON.parse(JSON.stringify({
    scores,
    route,
    triggers,
    primaryKeys,
    considerationKeys,
    allSameScore,
    currentRoom,
    currentNode,
    browseOnlyMode
  }));
}

function restore(state) {
  scores = state.scores;
  route = state.route;
  triggers = state.triggers;
  primaryKeys = state.primaryKeys || [];
  considerationKeys = state.considerationKeys || [];
  allSameScore = Boolean(state.allSameScore);
  currentRoom = state.currentRoom;
  currentNode = state.currentNode;
  browseOnlyMode = Boolean(state.browseOnlyMode);
}

function push() {
  historyStack.push(snapshot());
}

function scene(id) {
  ["titleScene", "hallScene", "roleIntroScene", "roomScene", "resultScene"].forEach((sceneId) => {
    const el = byId(sceneId);
    if (el) el.classList.add("hidden");
  });

  const current = byId(id);
  if (current) current.classList.remove("hidden");
}

function setBadge(text) {
  byId("badge").textContent = text;
}

function setProgress(label, pct) {
  byId("progressLabel").textContent = label;
  byId("progressFill").style.width = `${pct}%`;
}

function updateBack() {
  byId("backBtn").disabled = historyStack.length <= 1;
}

function dialog(speaker, text, choices = []) {
  byId("speaker").textContent = speaker;

  const textbox = byId("textbox");
  textbox.style.animation = "none";
  void textbox.offsetWidth;
  textbox.style.animation = "";
  textbox.textContent = text;
  textbox.scrollTop = 0;

  const choicesBox = byId("choices");
  choicesBox.innerHTML = "";

  choices.forEach(([label, action]) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = `▶ ${label}`;
    button.addEventListener("click", action);
    choicesBox.appendChild(button);
  });

  updateBack();
}

function addAnswer(label, points, triggerMap) {
  route.push(label);

  Object.entries(points).forEach(([key, value]) => {
    scores[key] += value;
  });

  Object.entries(triggerMap || {}).forEach(([key, values]) => {
    values.forEach((value) => {
      if (!triggers[key].includes(value)) {
        triggers[key].push(value);
      }
    });
  });
}

function sortedScores() {
  return Object.entries(scores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return Object.keys(services).indexOf(a[0]) - Object.keys(services).indexOf(b[0]);
  });
}

function hasResult() {
  return primaryKeys.length > 0 || considerationKeys.length > 0;
}

function safetyChoices() {
  return [
    ["🚨 지금 자해·타해 위험이 있거나 증상이 매우 심해요.", () => {
      push();
      emergency();
    }],
    ["🤝 지금 당장 위급한 상황은 아니지만, 나에게 맞는 전문가를 찾고 싶어요.", () => {
      push();
      ask("q1");
    }],
    ["📖 특별한 어려움은 없지만 정신건강전문요원이 궁금해요.", () => {
      push();
      showRoleIntroduction();
    }]
  ];
}

function showSafetyHall() {
  currentNode = "safety";
  scene("hallScene");

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  const roomScene = byId("roomScene");
  if (roomScene) roomScene.className = "scene hidden";

  setBadge("접수");
  setProgress("시작 안내", 10);
  renderRooms(false);

  dialog(
    "접수 직원",
    "『나에게 맞는 정신건강전문요원 찾기』에 오신 것을 환영합니다.\n\n" +
    "정신건강전문요원은 보건복지부 국가자격을 취득한 전문인력입니다. 네 분야의 전문요원이 서로 다른 역할을 담당합니다.\n\n" +
    "❤️ 정신건강임상심리사\n" +
    "🏠 정신건강사회복지사\n" +
    "💊 정신건강간호사\n" +
    "🌱 정신건강작업치료사\n\n" +
    "몇 가지 질문을 통해 지금 나에게 필요한 전문가를 찾아보세요.",
    safetyChoices()
  );
}

function showRoleIntroduction() {
  currentNode = "roleIntroduction";
  scene("roleIntroScene");

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  setBadge("직역 소개");
  setProgress("직역 소개", 20);

  dialog(
    "접수 직원",
    "❤️ 정신건강임상심리사\n" +
    "심리평가를 통해 마음과 인지·정서 상태를 이해하고, 전문적인 심리상담과 심리치료를 제공합니다.\n\n" +
    "🏠 정신건강사회복지사\n" +
    "가족·경제·주거 등 생활환경을 살피고, 복지서비스와 지역사회 기관을 연결합니다.\n\n" +
    "💊 정신건강간호사\n" +
    "증상과 건강 상태를 살피고, 복약·수면·신체건강 관리와 치료 과정을 지원합니다.\n\n" +
    "🌱 정신건강작업치료사\n" +
    "일상생활과 사회참여에 필요한 기능을 살피고, 독립적인 생활과 회복을 위한 훈련을 지원합니다.",
    [
      ["🎮 나에게 맞는 전문요원 찾아보기", () => {
        push();
        ask("q1");
      }],
      ["🏢 접수실로 돌아가기", showSafetyHall]
    ]
  );
}

function showBrowseHall() {
  currentNode = "browse";
  browseOnlyMode = true;
  scene("hallScene");

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  const roomScene = byId("roomScene");
  if (roomScene) roomScene.className = "scene hidden";

  setBadge("둘러보기");
  setProgress("직역소개", 30);
  renderRooms(false);

  dialog(
    "접수 직원",
    "위의 '전문가' 중 궁금한 정신건강전문요원을 직접 터치하여, 각 전문가가 어떤 일을 하는지 천천히 둘러보세요.",
    []
  );
}

function showHallResult() {
  currentNode = "hallResult";
  scene("hallScene");

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  setBadge("서비스 정리");
  setProgress("결과 정리", 100); 
  renderRooms(true);

  let message;

  if (allSameScore) {
    message =
      "답변을 종합했습니다.\n이번 선택에서는 특정 직역이 다른 직역보다 뚜렷하게 높게 나타나지 않았습니다.\n\n상황과 필요에 따라 여러 정신건강전문요원을 함께 고려해볼 수 있습니다.";
  } else {
    const primaryNames = primaryKeys.map((key) => services[key].expert).join(", ");
    const considerationNames = considerationKeys.map((key) => services[key].expert).join(", ");

    message =
      `답변을 종합했습니다.\n당신에게 가장 잘 맞는 전문가는\n‘${primaryNames}’입니다.`;

    if (considerationNames) {
      message += `\n\n또한 ‘${considerationNames}’도 함께 고려해볼 수 있습니다.`;
    }
  }

  dialog(
    "접수 직원",
    `${message}\n\n상단의 버튼을 눌러 나에게 추천된 전문가의 상세 설명을 읽어보거나, 아래 버튼을 눌러 종합 리포트를 확인해 보세요.`,
    [
      ["나의 맞춤 전문가 확인하기", () => {
        push();
        showResult();
      }]
    ]
  );
}

function start() {
  resetState();
  if (window.GameAnalytics) {
    window.GameAnalytics.beginPlay();
  }
  push();
  showSafetyHall();
}

function emergency() {
  currentNode = "emergency";
  setBadge("위기안내");
  setProgress("위기안내", 100);

  dialog(
    "응급 안내",
    "지금은 온라인 게임 결과보다 즉각적인 안전 확보가 우선입니다.\n가까운 응급실, 정신건강의학과 진료, 자살예방상담전화 109 또는 112에 도움을 요청하세요.",
    [["접수 직원에게 돌아가기", showSafetyHall]]
  );
}

function ask(id) {
  currentNode = id;
  const node = flow[id];

  scene("hallScene");

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  setBadge(id.toUpperCase());
  setProgress(node.progress[0], node.progress[1]);

  const choices = node.choices.map(([label, points, triggerMap, next]) => [
    label,
    () => {
      push();
      addAnswer(label, points, triggerMap);

      if (next === "browse") {
        showBrowseHall();
        return;
      }

      if (next === "finish") {
        finishTriage();
        return;
      }

      ask(next);
    }
  ]);

  dialog("접수 직원", node.text, choices);
}

function finishTriage() {
  const sorted = sortedScores();
  const values = sorted.map(([, value]) => value);
  const maxScore = Math.max(...values);

  allSameScore = values.every((value) => value === values[0]);

  if (allSameScore) {
    primaryKeys = [];
    considerationKeys = sorted.map(([key]) => key);
  } else {
    primaryKeys = sorted
      .filter(([, value]) => value === maxScore)
      .map(([key]) => key);

    considerationKeys = sorted
      .filter(([key, value]) => !primaryKeys.includes(key) && value > 0)
      .map(([key]) => key);
  }

  showHallResult();
}

function roomMarkClass(key) {
  if (!hasResult()) return "";

  if (!allSameScore && primaryKeys.includes(key)) {
    return "recommended";
  }

  if (considerationKeys.includes(key)) {
    return "secondaryMark";
  }

  return "";
}

function roomLabel(key, service, showRecommendation) {
  if (!showRecommendation || !hasResult()) return service.subLabel;

  if (!allSameScore && primaryKeys.includes(key)) {
    return "추천 전문가";
  }

  if (considerationKeys.includes(key)) {
    return "함께 고려";
  }

  return service.subLabel;
}

function renderRooms(showRecommendation) {
  const grid = byId("roomGrid");
  if (!grid) return;

  grid.innerHTML = "";

  Object.entries(services).forEach(([key, service]) => {
    const button = document.createElement("button");
    button.type = "button";

    button.className = `roomBtn ${roomMarkClass(key)}`;
    button.innerHTML = `
      <span class="roomIcon">${service.emoji}</span>
      ${service.expert}
      <span class="roomSmall">${roomLabel(key, service, showRecommendation)}</span>
    `;

    button.addEventListener("click", () => {
      push();
      enterRoom(key);
    });

    grid.appendChild(button);
  });
}

function roomChoices() {
  if (browseOnlyMode) {
    return [
      ["접수실로 돌아가기", () => {
        showBrowseHall();
      }],
      ["처음으로 돌아가기", () => {
        restart();
      }]
    ];
  }

  if (hasResult()) {
    return [
      ["나의 맞춤 전문가 확인하기", () => {
        push();
        showResult();
      }],
      ["추천 화면으로 돌아가기", () => {
        goBack();
      }]
    ];
  }

  return [
    ["접수 안내 계속하기", () => {
      goBack();
    }]
  ];
}

function ensureRoomNpcImg() {
  let img = byId("roomNpcImg");

  if (!img) {
    img = document.createElement("img");
    img.id = "roomNpcImg";
    img.className = "roomNpcImg";
    img.alt = "";

    const roomScene = byId("roomScene");
    if (roomScene) roomScene.appendChild(img);
  }

  return img;
}

function enterRoom(key) {
  currentNode = "room";
  currentRoom = key;

  const service = services[key];

  scene("roomScene");

  const roomScene = byId("roomScene");
  if (roomScene) roomScene.className = `scene roomScene room-${key}`;

  setBadge(service.expert);
  setProgress("상담실", 96);

  const tableText = byId("tableText");
  if (tableText) tableText.textContent = service.table;

  const roomNpcImg = ensureRoomNpcImg();
  roomNpcImg.src = service.roomNpc;
  roomNpcImg.alt = service.expert;

  let headerLabel = "";
  let intro = `안녕하세요! 저는 ${service.expert}입니다.\n\n${service.desc}`;

  if (!browseOnlyMode && hasResult()) {
    if (!allSameScore && primaryKeys.includes(key)) {
      headerLabel = `[추천 전문가]\n현재 응답 분석 결과, 나에게 가장 필요하다고 매칭된 요원입니다.\n\n`;
      intro = `${headerLabel}안녕하세요! 저는 ${service.expert}입니다.\n\n${service.desc}`;
    } else if (considerationKeys.includes(key)) {
      headerLabel = `[함께 고려]\n현재 응답 흐름상 함께 참고하고 도움을 받아보기에 유용한 요원입니다.\n\n`;
      intro = `${headerLabel}안녕하세요! 저는 ${service.expert}입니다.\n\n${service.desc}`;
    }
  }

  dialog(
    service.expert,
    intro,
    roomChoices()
  );
}

function reasonFor(key) {
  const service = services[key];
  const picked = triggers[key];

  if (picked && picked.length) {
    return `선택하신 답변 중 ${picked.map((item) => `‘${item}’`).join(", ")} 관련 내용이 포함되어 있어 ${service.expert}의 도움이 필요할 수 있습니다.`;
  }

  return `전체 답변의 흐름상 ${service.expert}도 함께 살펴볼 수 있습니다.`;
}

function resultSpeech(key) {
  const map = {
    clinical: "마음을 정확하게 이해하는 것부터 시작하겠습니다!",
    nurse: "증상과 건강관리를 함께 살펴보겠습니다!",
    social: "생활 속 어려움도 함께 연결해 보겠습니다!",
    ot: "일상을 다시 해낼 수 있도록 도와드리겠습니다!"
  };

  return map[key] || "지금 필요한 도움을 함께 찾아보겠습니다!";
}

function resultNpcText(key) {
  const map = {
    clinical: "심리평가와 심리상담을 통해 마음의 어려움을 자세히 이해하고 회복을 돕습니다.",
    nurse: "상태 관찰, 자료수집, 간호 활동, 복약·수면·신체건강 관리와 건강증진을 돕습니다.",
    social: "가족, 경제, 주거, 복지서비스와 자원연계를 중심으로 생활 속 어려움을 함께 살핍니다.",
    ot: "작업 수행을 평가하고, 신체적·정신적 기능 향상을 위한 작업치료와 일상생활훈련을 돕습니다."
  };

  return map[key] || services[key].desc;
}

function scoreLabel(value) {
  return `${Number(value).toFixed(1).replace(".0", "")} / 10`;
}

function selectedReasonList(key) {
  const picked = triggers[key];

  if (!picked || !picked.length) {
    return `<li>전체 답변의 흐름상 ${services[key].expert}의 도움도 함께 고려할 수 있습니다.</li>`;
  }

  return picked.map((item) => `<li>${item}</li>`).join("");
}

function getExpertLocation(key) {
  const locations = {
    clinical: "대학병원·종합병원 정신건강의학과, 정신병원, 지역 정신건강복지센터, 전문 심리상담센터 등",
    nurse: "정신건강의학과 병·의원, 정신병원, 정신재활시설, 지역 정신건강복지센터 등",
    social: "병원 사회사업실, 지역 정신건강복지센터, 정신재활시설, 중독관리통합지원센터 등",
    ot: "정신병원, 정신재활시설, 낮병원, 치매안심센터, 보건소 등"
  };
  return locations[key] || "지역 정신건강복지센터 및 관련 전문 기관";
}

function resultExpertCard(key, labelText) {
  const service = services[key];

  return `
    <article class="mhResultExpertCard" style="--accent:${service.color}">
      <div class="mhResultTag">${labelText}</div>

      <div class="mhResultBubble">
        ${resultSpeech(key)}
      </div>

      <div class="mhResultImgWrap">
        <img src="${service.resultNpc}" alt="${service.expert}" class="mhResultCharacter">
      </div>

      <div class="mhResultExpertName">
        ${service.emoji} ${service.expert}
      </div>

      <p class="mhResultDesc">
        ${resultNpcText(key)}
      </p>

      <div class="mhResultLocation" style="margin: 15px 0; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${service.color}; text-align: left;">
        <div class="mhResultLocationTitle" style="font-weight: bold; font-size: 0.9rem; color: #333; margin-bottom: 4px;">📍 어디서 만날 수 있나요?</div>
        <p style="font-size: 0.85rem; color: #555; margin: 0; line-height: 1.4;">${getExpertLocation(key)}</p>
      </div>

      <div class="mhResultReason">
        <div class="mhResultReasonTitle">이런 선택이 반영되었어요</div>
        <ul>
          ${selectedReasonList(key)}
        </ul>
      </div>
    </article>
  `;
}

function considerationSimpleCard(key) {
  const service = services[key];

  return `
    <article class="mhConsiderCard" style="--accent:${service.color}">
      <div class="mhConsiderName">${service.emoji} ${service.expert}</div>
      <div class="mhConsiderDesc">${service.desc}</div>
      <div class="mhConsiderReason">${reasonFor(key)}</div>
    </article>
  `;
}

function scoreBars() {
  const sorted = sortedScores();

  return sorted.map(([key, value]) => {
    const service = services[key];
    const pct = Math.round((value / 10) * 100);

    return `
      <div class="bar">
        <div class="barTop">
          <span>${service.emoji} ${service.expert}</span>
          <span>${scoreLabel(value)}</span>
        </div>
        <div class="track">
          <div class="fill" style="width:${pct}%;background:${service.color}"></div>
        </div>
      </div>
    `;
  }).join("");
}

function showResult() {
  currentNode = "result";

  scene("resultScene");

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  setBadge("RESULT");
  setProgress("결과", 100);

  const heroTitle = allSameScore
    ? "함께 고려해볼 수 있는<br>정신건강전문요원"
    : "당신에게 가장 잘 맞는<br>정신건강전문요원";

  let heroText = "";
  if (allSameScore) {
    heroText = "이번 선택에서는 특정 직역이 뚜렷하게 높게 나타나지 않았습니다. 상황과 필요에 따라 여러 전문가를 함께 고려해볼 수 있습니다.";
  } else if (primaryKeys.length === 1 && considerationKeys.length === 0) {
    heroText = "당신의 답변을 바탕으로 현재 시점에서 당신의 마음에 가장 필요한 맞춤 전문가를 안내해 드립니다.";
  } else {
    heroText = "당신의 답변을 바탕으로 현재 시점에서 가장 잘 맞는 전문가와 함께 고려해볼 수 있는 전문가를 안내해 드립니다.";
  }

  const mainCardsHtml = allSameScore
    ? considerationKeys.map((key) => resultExpertCard(key, "함께 고려")).join("")
    : primaryKeys.map((key) => resultExpertCard(key, primaryKeys.length > 1 ? "공동 추천" : "추천")).join("");

  const considerHtml = !allSameScore && considerationKeys.length
    ? `
      <section class="mhResultSection">
        <div class="mhSectionTitle">함께 고려해볼 수 있는 전문가</div>
        <div class="mhConsiderGrid">
          ${considerationKeys.map((key) => considerationSimpleCard(key)).join("")}
        </div>
      </section>
    `
    : "";

  byId("resultPaper").innerHTML = `
    <section class="resultHero">
      <h2>🌿 ${heroTitle}</h2>
      <p class="resultSub">${heroText}</p>
    </section>

    <div id="shareCard" class="mhResultWrap">
      <section class="mhResultSection">
        <div class="mhSectionTitle">
          ${allSameScore ? "함께 고려해볼 수 있는 전문가" : "당신에게 가장 잘 맞는 전문가"}
        </div>
        <div class="mhResultExpertGrid">
          ${mainCardsHtml}
        </div>
      </section>

      ${considerHtml}

      <section class="evidence">
        <div class="cardTitle">서비스 필요도</div>
        ${scoreBars()}
      </section>

      <section class="resultNotice">
        이 결과는 현재 응답을 기준으로 한 안내입니다. 상황이나 필요에 따라 다른 전문가의 도움이 필요할 수 있습니다.
      </section>
    </div>

    <div class="resultCredits">
      <div>
        기획 이혜현 ｜ 제작: 유튜브 「심리실언니들」
        <a
          class="resultCreditLink"
          href="https://youtube.com/channel/UC66vhhTaUHt4p-fH-bbN8qw?si=WAW6P0TEOHRbbMVm"
          target="_blank"
          rel="noopener noreferrer"
        >[채널 바로가기]</a>
      </div>
      <div>
        배포·감수: 한국임상심리전문가협회
        <a
          class="resultCreditLink"
          href="https://kocpa.kr/"
          target="_blank"
          rel="noopener noreferrer"
        >[홈페이지 바로가기]</a>
      </div>
    </div>

    <button class="saveBtn" type="button" onclick="saveResultImage()">결과 카드 이미지 만들기</button>
    <a id="downloadLink" download="mind-health-center-result.png">이미지 다운로드</a>
    <button class="copyBtn" type="button" onclick="copyResult()">결과 복사하기</button>
  `;

  let dialogMessage = "";
  if (allSameScore) {
    dialogMessage = "결과가 완성되었습니다.\n이번 선택에서는 여러 전문가를 함께 고려해볼 수 있습니다.";
  } else if (primaryKeys.length === 1 && considerationKeys.length === 0) {
    dialogMessage = "결과가 완성되었습니다.\n현재 응답을 바탕으로 당신에게 가장 필요한 맞춤 전문가를 정리했습니다.";
  } else {
    dialogMessage = "결과가 완성되었습니다.\n현재 응답을 바탕으로 가장 잘 맞는 전문가와 함께 고려하면 좋은 전문가를 정리했습니다.";
  }

  dialog("이용기록", dialogMessage);

  // Analytics is optional and fail-safe; result calculation remains untouched.
  if (window.GameAnalytics) {
    window.GameAnalytics.trackComplete({
      resultKeys: allSameScore ? considerationKeys : primaryKeys,
      scores
    });
  }
}

async function copyResult() {
  const lines = [
    "나에게 맞는 정신건강전문요원 찾기 결과",
    ""
  ];

  if (!allSameScore && primaryKeys.length) {
    lines.push("당신에게 가장 잘 맞는 전문가");
    primaryKeys.forEach((key) => {
      lines.push(`- ${services[key].expert}`);
      lines.push(`  설명: ${services[key].desc}`);
      lines.push(`  이유: ${reasonFor(key)}`);
    });
    lines.push("");
  }

  if (considerationKeys.length) {
    lines.push("함께 고려해볼 수 있는 전문가");
    considerationKeys.forEach((key) => {
      lines.push(`- ${services[key].expert}`);
      lines.push(`  설명: ${services[key].desc}`);
      lines.push(`  이유: ${reasonFor(key)}`);
    });
  }

  const text = lines.filter(Boolean).join("\n");

  try {
    await navigator.clipboard.writeText(text);
    alert("결과가 복사되었습니다.");
  } catch (error) {
    window.prompt("아래 내용을 길게 눌러 복사하세요.", text);
  }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = String(text).split("");
  let line = "";

  chars.forEach((char) => {
    const test = line + char;

    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = char;
      y += lineHeight;
    } else {
      line = test;
    }
  });

  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }

  return y;
}

function drawPanel(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#120b06";
  ctx.lineWidth = 10;
  ctx.strokeRect(x, y, w, h);
  ctx.strokeStyle = "#ffffff80";
  ctx.lineWidth = 4;
  ctx.strokeRect(x + 14, y + 14, w - 28, h - 28);
}

async function saveResultImage() {
  const container = document.getElementById("shareCardContainer");

  if (!container) {
    alert("shareCardContainer를 찾을 수 없습니다.");
  }

  const shareCard = createShareCard({
    services,
    primaryKeys,
    considerationKeys,
    allSameScore,
    triggers,
    resultNpcText
  });

  try {
    container.innerHTML = "";
    container.appendChild(shareCard);

    await downloadShareCard(shareCard, "mind-health-share-card.png");
  } catch (error) {
    console.error(error);
    alert("공유 카드 저장에 실패했습니다.\n\n" + error.message);
  } finally {
    shareCard.remove();
  }
}

function renderRestoredState() {
  if (currentNode === "title") {
    scene("titleScene");

    const roomScene = byId("roomScene");
    if (roomScene) roomScene.className = "scene hidden";

    const oldImg = byId("roomNpcImg");
    if (oldImg) oldImg.remove();

    setBadge("START");
    setProgress("대기", 0);
    dialog("안내", "시작하기를 눌러 마음건강센터에 들어가 보세요.");
    return;
  }

  if (currentNode === "safety") {
    showSafetyHall();
    return;
  }

  if (currentNode === "roleIntroduction") {
    showRoleIntroduction();
    return;
  }

  if (currentNode === "hallResult") {
    showHallResult();
    return;
  }

  if (currentNode === "browse") {
    showBrowseHall();
    return;
  }

  if (currentNode === "emergency") {
    emergency();
    return;
  }

  if (currentNode === "room" && currentRoom) {
    enterRoom(currentRoom);
    return;
  }

  if (flow[currentNode]) {
    ask(currentNode);
  }
}

function goBack() {
  if (historyStack.length <= 1) return;

  const previousState = historyStack.pop();
  restore(previousState);
  renderRestoredState();
}

function showHistory() {
  const modal = byId("historyModal");
  const list = byId("historyList");

  if (!modal || !list) return;

  if (!route.length) {
    list.innerHTML = "<p>아직 선택한 답변이 없습니다.</p>";
  } else {
    list.innerHTML = route
      .map((item, index) => `<p><strong>${index + 1}.</strong> ${item}</p>`)
      .join("");
  }

  modal.classList.remove("hidden");
}

function onClickHistoryBack() {
  closeHistory();
  goBack();
}

function closeHistory() {
  const modal = byId("historyModal");
  if (modal) modal.classList.add("hidden");
}

function restart() {
  resetState();
  scene("titleScene");

  const roomScene = byId("roomScene");
  if (roomScene) roomScene.className = "scene hidden";

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  setBadge("START");
  setProgress("대기", 0);
  dialog("안내", "시작하기를 눌러 마음건강센터에 들어가 보세요.");
  historyStack = [snapshot()];
}

document.addEventListener("DOMContentLoaded", () => {
  const setViewportHeight = () => {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  };

  setViewportHeight();
  window.addEventListener("resize", setViewportHeight);
  window.addEventListener("orientationchange", setViewportHeight);

  const startBtn = document.getElementById("startBtn");

  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    start();
  });
});

restart();
function shareKakao() {
  if (!window.Kakao || !Kakao.isInitialized()) {
    alert("카카오 공유를 준비하지 못했어요.");
    return;
  }

  if (window.GameAnalytics) {
    window.GameAnalytics.trackShare();
  }

  Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: "지금 내게 필요한 정신건강전문요원은?",
      description: getKakaoShareDescription(),
      imageUrl: `https://jeonbomyi.github.io/KCPA-Match/assets/share/${getKakaoShareImageName()}`,
      link: {
  mobileWebUrl: "https://jeonbomyi.github.io/KCPA-Match/",
  webUrl: "https://jeonbomyi.github.io/KCPA-Match/"
      }
    },
    buttons: [
      {
        title: "나도 해보기",
        link: {
          mobileWebUrl: "https://jeonbomyi.github.io/KCPA-Match/",
          webUrl: "https://jeonbomyi.github.io/KCPA-Match/"
        }
      }
    ]
  });
}

function getShareResultKeys() {
  return allSameScore ? considerationKeys : primaryKeys;
}

function getSortedShareKeys(keys) {
  return keys.slice().sort((a, b) => {
    return Object.keys(services).indexOf(a) - Object.keys(services).indexOf(b);
  });
}

function getKakaoShareImageName() {
  const mainKeys = getSortedShareKeys(getShareResultKeys());

  if (allSameScore || mainKeys.length >= 3) {
    return "result-all.png";
  }

  if (mainKeys.length === 1) {
    return `result-${mainKeys[0]}.png`;
  }

  if (mainKeys.length === 2) {
    const pairName = mainKeys.join("-");
    return `result-${pairName}-v3.png`;
  }

  return "title-preview.png";
}

function getKakaoShareDescription() {
  const shareNames = {
    clinical: "임상심리사",
    nurse: "간호사",
    social: "사회복지사",
    ot: "작업치료사"
  };
  const primary = getSortedShareKeys(primaryKeys);
  const additional = getSortedShareKeys(considerationKeys);
  const namesFor = (keys) => keys.map((key) => shareNames[key]);

  if (allSameScore) {
    return "모든 전문요원이 추천됐어요!\n당신에게는 어떤 전문요원이 필요할까요?";
  }

  if (primary.length > 1) {
    return `${namesFor(primary).join("와 ")}가 추천됐어요!\n당신에게는 어떤 전문요원이 필요할까요?`;
  }

  const primaryName = namesFor(primary)[0];

  if (additional.length > 0) {
    return `${primaryName}가 추천됐어요!\n${namesFor(additional).join("와 ")}도 고려해 보세요.`;
  }

  return `${primaryName}가 추천됐어요!\n당신에게는 어떤 전문요원이 필요할까요?`;
}
