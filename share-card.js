const SHARE_CARD_LOGO_PATH = "./assets/logo/kocpa-logo.png";
const SHARE_CARD_SHORT_DESCRIPTIONS = {
  clinical: "심리평가와 심리상담(심리치료)을 통해<br>마음의 어려움을 자세히 이해하고 회복을 돕습니다.",
  nurse: "몸과 마음의 상태를 살피고, 약물·수면·건강 루틴을 함께 관리합니다.",
  social: "생활 문제와 복지서비스, 지역사회 자원 연결을 함께 돕습니다.",
  ot: "일상생활과 작업 수행을 살피고, 필요한 기능 회복을 돕습니다."
};

function shareCardDescriptionText(key, resultNpcText) {
  return SHARE_CARD_SHORT_DESCRIPTIONS[key] || resultNpcText(key);
}

function createShareCard(data) {
  const {
    services,
    primaryKeys,
    considerationKeys,
    allSameScore,
    triggers,
    resultNpcText
  } = data;

  const mainKeys = allSameScore ? considerationKeys : primaryKeys.slice(0, 2);
  const npcStageClass = mainKeys.length >= 4
    ? "is-quad"
    : mainKeys.length > 1
      ? "is-duo"
      : "is-single";
  const considerKeys = allSameScore
    ? []
    : considerationKeys.filter((key) => !primaryKeys.includes(key));
  const isSinglePrimary = !allSameScore && mainKeys.length === 1;
  const isDuoPrimary = !allSameScore && mainKeys.length === 2;
  const reasonLimit = isSinglePrimary && !considerKeys.length ? 4 : 3;

  const titleName = allSameScore
    ? "함께 고려해볼 수 있는 정신건강전문요원"
    : isDuoPrimary
      ? "공동 추천 정신건강전문요원"
    : mainKeys.map((key) => services[key].expert).join(" · ");

const descriptionHtml = allSameScore
  ? `<div class="mhShareDescText">이번 선택에서는 특정 직역이 뚜렷하게 높게 나타나지 않았습니다.</div>`
  : isDuoPrimary
    ? ""
  : mainKeys.length > 1
    ? mainKeys.map((key) => `
      <div class="mhShareDescLine">
        <strong>${services[key].expert}</strong>
        <span>${shareCardDescriptionText(key, resultNpcText)}</span>
      </div>
    `).join("")
    : `<div class="mhShareDescText">${shareCardDescriptionText(mainKeys[0], resultNpcText)}</div>`;

const reasonKeys = allSameScore ? considerationKeys : mainKeys;

const reasonHtml = reasonKeys.map((key) => {
  const picked = triggers[key] || [];
  const reasons = picked.length
    ? picked
    : [`전체 답변의 흐름상 ${services[key].expert}의 도움을 함께 고려할 수 있습니다.`];

  return `
    <div class="mhShareReasonGroup">
      <div class="mhShareReasonName">${services[key].expert}</div>
      <ul class="mhShareReasonList">
        ${reasons.slice(0, reasonLimit).map((reason) => `<li>${reason}</li>`).join("")}
      </ul>
    </div>
  `;
}).join("");

const considerHtml = considerKeys.length ? `
        <section class="mhShareConsider ${isSinglePrimary ? "is-compact" : ""}">
          ${isSinglePrimary ? "" : `<div class="mhShareSectionTitle">함께 고려해볼 전문가</div>`}
          <div class="mhShareConsiderList">
            ${considerKeys.slice(0, 4).map((key) => {
              const picked = triggers[key] || [];
              const considerName = isSinglePrimary
                ? `함께 고려해볼 전문가: ${services[key].expert}`
                : `${services[key].emoji} ${services[key].expert}`;
              const considerBody = isSinglePrimary
                ? `
                  <ul class="mhShareConsiderBullets">
                    <li><strong>역할:</strong> ${shareCardDescriptionText(key, resultNpcText)}</li>
                    ${picked.length ? `<li><strong>선택 반영:</strong> ${picked[0]}</li>` : ""}
                  </ul>
                `
                : `<div class="mhShareConsiderDesc">${shareCardDescriptionText(key, resultNpcText)}</div>`;

              return `
                <div class="mhShareConsiderItem">
                  <div class="mhShareConsiderName">${considerName}</div>
                  ${considerBody}
                </div>
              `;
            }).join("")}
          </div>
        </section>
      ` : "";

const reasonSectionHtml = `
      <section class="mhShareReason ${reasonKeys.length >= 4 ? "is-quad" : reasonKeys.length > 1 ? "is-duo" : "is-single"}">
      <div class="mhShareSectionTitle">왜 추천되었나요?</div>
  <div class="mhShareReasonGroups">
    ${reasonHtml}
  </div>
</section>
`;

const duoDetailHtml = isDuoPrimary ? `
      <section class="mhShareDuoPanel">
        ${mainKeys.map((key) => {
          const picked = triggers[key] || [];

          return `
            <article class="mhShareDuoColumn">
              <div class="mhShareDuoTab">${services[key].expert}</div>
              <div class="mhShareDuoDesc">${shareCardDescriptionText(key, resultNpcText)}</div>
              <div class="mhShareDuoReasonTitle">왜 추천되었나요?</div>
              <ul class="mhShareDuoReasons">
                ${picked.slice(0, 2).map((reason) => `<li>${reason}</li>`).join("")}
              </ul>
            </article>
          `;
        }).join("")}
      </section>
` : "";

const shareDetailHtml = isSinglePrimary && considerKeys.length
  ? `${reasonSectionHtml}${considerHtml}`
  : isDuoPrimary
    ? duoDetailHtml
  : `${considerHtml}${reasonSectionHtml}`;

  const card = document.createElement("article");
  card.className = [
    "mhShareCard",
    isSinglePrimary && considerKeys.length ? "is-single-with-consider" : "",
    isSinglePrimary && !considerKeys.length ? "is-single-only" : "",
    isDuoPrimary ? "is-duo-primary" : "",
    allSameScore ? "is-all-same" : ""
  ].filter(Boolean).join(" ");
  card.setAttribute("aria-label", "공유용 결과 카드");

  card.innerHTML = `
    <div class="mhShareInner">
      <h1 class="mhShareTitle">🌿 당신에게 가장 잘 맞는<br>정신건강전문요원</h1>

      <div class="mhShareNpcStage ${npcStageClass}">
  ${allSameScore
    ? `<img class="mhShareLineup" src="./assets/npc/title_lineup-opt.png" alt="정신건강전문요원 네 명">`
    : mainKeys.map((key) => `
      <img class="mhShareNpc mhShareNpc-${key}" src="${services[key].resultNpc}" alt="${services[key].expert}">
    `).join("")
  }
</div>

      <h2 class="mhShareExpertName">${titleName}</h2>

      ${isDuoPrimary ? "" : `<div class="mhShareDesc ${allSameScore ? "is-single" : mainKeys.length > 1 ? "is-duo" : "is-single"}">
  ${descriptionHtml}
</div>`}

      ${shareDetailHtml}

      <footer class="mhShareCredits">
        <p class="mhShareCreditsLead">
          정신건강전문요원은 함께 협력하지만, 각자의 전문 역할은 다릅니다.
        </p>

        <p class="mhShareProject">🌿 나에게 맞는 정신건강전문요원 찾기</p>

        <div class="mhShareCreditRows">
          <div>기획 │ 이혜현 · 제작 │ 유튜브「심리실언니들」</div>
          <div>배포·감수 │ 한국임상심리전문가협회</div>
        </div>

        <img
          class="mhShareLogoImg"
          src="${SHARE_CARD_LOGO_PATH}"
          alt="한국임상심리전문가협회(KOCPA)"
          onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'mhShareLogoText', textContent: '한국임상심리전문가협회(KOCPA)' }))"
        >
      </footer>
    </div>
  `;

  return card;
}

function waitForShareCardImages(card) {
  const images = Array.from(card.querySelectorAll("img"));

  return Promise.all(images.map((img) => {
    if (img.complete) return Promise.resolve();

    return new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  }));
}

async function captureShareCard(card) {
  if (typeof html2canvas === "undefined") {
    throw new Error("html2canvas가 로드되지 않았습니다.");
  }

  await waitForShareCardImages(card);

  return html2canvas(card, {
    scale: 1,
    useCORS: true,
    backgroundColor: "#f2dfb8",
    width: 1080,
    height: 1350,
    windowWidth: 1080,
    windowHeight: 1350
  });
}

async function downloadShareCard(card, filename = "mind-health-share-card.png") {
  const canvas = await captureShareCard(card);
  const url = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  return canvas;
}
