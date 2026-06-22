const app =
  document.getElementById("capricorn-avatar-app") ||
  document.getElementById("app");

const claimantStateText =
  document.getElementById("claimantStateText") ||
  document.getElementById("statusText");

const statusText = document.getElementById("statusText");
const voiceText = document.getElementById("voiceText");
const memoryText = document.getElementById("memoryText");
const modeText = document.getElementById("modeText");

const tooltip =
  document.getElementById("moduleTooltip") ||
  document.getElementById("tooltip");

const tooltipTitle =
  document.getElementById("tooltipTitle") ||
  document.getElementById("tipTitle");

const tooltipBody =
  document.getElementById("tooltipBody") ||
  document.getElementById("tipBody");

const nodeMap = {
  QFN: document.getElementById("nodeQfn") || document.getElementById("qfn"),
  VAULT: document.getElementById("nodeVault") || document.getElementById("vault"),
  TIMELINE: document.getElementById("nodeTimeline") || document.getElementById("timeline"),
  CERTIFICATES: document.getElementById("nodeCertificates") || document.getElementById("cert"),
  REPORTS: document.getElementById("nodeReports") || document.getElementById("reports"),
  LEARNING: document.getElementById("nodeLearning") || document.getElementById("learning"),
  MI8: document.getElementById("nodeMi8") || document.getElementById("mi8"),
  DOSSIER: document.getElementById("nodeDossier") || document.getElementById("dossier")
};

const buttonMap = {
  QFN: document.querySelector('[data-module="QFN"]'),
  VAULT: document.querySelector('[data-module="VAULT"]'),
  TIMELINE: document.querySelector('[data-module="TIMELINE"]'),
  CERTIFICATES: document.querySelector('[data-module="CERTIFICATES"]'),
  REPORTS: document.querySelector('[data-module="REPORTS"]'),
  LEARNING: document.querySelector('[data-module="LEARNING"]'),
  MI8: document.querySelector('[data-module="MI8"]'),
  DOSSIER: document.querySelector('[data-module="DOSSIER"]')
};

let commandDeckData = {};

function clean(value, fallback = "--") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function numeric(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function safeSetText(element, value) {
  if (element) element.textContent = value;
}

function setAppHealth(data = {}) {
  if (!app) return;

  const health = numeric(data.platformHealth);

  app.classList.remove(
    "health-excellent",
    "health-strong",
    "health-stable",
    "health-weak",
    "health-critical",
    "mission-active",
    "event-active",
    "galaxy-active"
  );

  if (health >= 90) app.classList.add("health-excellent");
  else if (health >= 75) app.classList.add("health-strong");
  else if (health >= 55) app.classList.add("health-stable");
  else if (health >= 35) app.classList.add("health-weak");
  else app.classList.add("health-critical");

  if (numeric(data.missionCount) > 0) app.classList.add("mission-active");
  if (numeric(data.eventCount) > 0) app.classList.add("event-active");
  if (numeric(data.galaxyNodes) > 0) app.classList.add("galaxy-active");
}

function setNodeState(module, value) {
  const node = buttonMap[module];
  if (!node) return;

  node.classList.remove("live", "empty", "warn", "alert");

  if (module === "DOSSIER") {
    node.classList.add("live");
    return;
  }

  if (module === "QFN") {
    const v = String(value || "").toLowerCase();

    if (
      v.includes("active") ||
      v.includes("ready") ||
      v.includes("verified") ||
      v.includes("approved")
    ) {
      node.classList.add("live");
    } else if (
      v.includes("pending") ||
      v.includes("not") ||
      v.includes("awaiting")
    ) {
      node.classList.add("warn");
    } else {
      node.classList.add("empty");
    }

    return;
  }

  if (numeric(value) > 0) node.classList.add("live");
  else node.classList.add("empty");
}

function setMode(mode = "idle", label = "") {
  if (!app) return;

  app.classList.remove(
    "mode-idle",
    "mode-speaking",
    "mode-listening",
    "mode-thinking",
    "mode-error",
    "mode-success",
    "mode-verified"
  );

  app.classList.add(`mode-${mode}`);

  safeSetText(
    statusText,
    mode === "speaking" ? "SPEAKING" :
    mode === "listening" ? "LISTENING" :
    mode === "thinking" ? "THINKING" :
    mode === "error" ? "ERROR" :
    mode === "success" ? "SUCCESS" :
    mode === "verified" ? "ONLINE" :
    "IDLE"
  );

  safeSetText(modeText, label || mode.toUpperCase());

  if (label && claimantStateText) {
    claimantStateText.textContent = label;
  }
}

function setClaimantClass(payload = {}) {
  if (!app) return;

  const value = String(
    payload.claimantLevel ||
    payload.status ||
    payload.level ||
    "Observer"
  ).toLowerCase();

  app.classList.remove(
    "claimant-observer",
    "claimant-participant",
    "claimant-active",
    "claimant-verified",
    "claimant-advanced",
    "claimant-command",
    "claimant-alert"
  );

  let className = "claimant-observer";

  if (value.includes("alert") || value.includes("risk") || value.includes("critical")) {
    className = "claimant-alert";
  } else if (
    value.includes("command") ||
    value.includes("chief") ||
    value.includes("root") ||
    value.includes("excellent")
  ) {
    className = "claimant-command";
  } else if (
    value.includes("advanced") ||
    value.includes("ultimate") ||
    value.includes("strong")
  ) {
    className = "claimant-advanced";
  } else if (
    value.includes("verified") ||
    value.includes("active claimant") ||
    value.includes("stable")
  ) {
    className = "claimant-verified";
  } else if (value.includes("active")) {
    className = "claimant-active";
  } else if (value.includes("participant")) {
    className = "claimant-participant";
  }

  app.classList.add(className);

  if (claimantStateText) {
    claimantStateText.textContent = `${value.toUpperCase()} COMMAND DECK`;
  }
}

function setCommandDeck(data = {}) {
  commandDeckData = data || {};

  safeSetText(nodeMap.QFN, clean(data.qfnStatus || data.qfnTier || data.qfnCount));
  safeSetText(nodeMap.VAULT, clean(data.vaultCount, "0"));
  safeSetText(nodeMap.TIMELINE, clean(data.timelineCount, "0"));
  safeSetText(nodeMap.CERTIFICATES, clean(data.certificateCount, "0"));
  safeSetText(nodeMap.REPORTS, clean(data.reportCount, "0"));
  safeSetText(nodeMap.LEARNING, clean(data.learningCount, "0"));
  safeSetText(nodeMap.MI8, clean(data.mi8Count, "0"));

  safeSetText(
    nodeMap.DOSSIER,
    data.platformHealth !== undefined
      ? `${clean(data.platformHealth, "0")}%`
      : clean(data.dossierStatus, "READY")
  );

  safeSetText(
    memoryText,
    data.missionCount !== undefined
      ? `M${clean(data.missionCount, "0")} / E${clean(data.eventCount, "0")}`
      : clean(data.memoryStatus, "ONLINE")
  );

  safeSetText(
    modeText,
    data.galaxyNodes !== undefined
      ? `GALAXY ${clean(data.galaxyNodes, "0")}/${clean(data.galaxyLinks, "0")}`
      : "COMMAND DECK"
  );

  setAppHealth(data);

  setNodeState("QFN", data.qfnStatus || data.qfnTier || data.qfnCount);
  setNodeState("VAULT", data.vaultCount);
  setNodeState("TIMELINE", data.timelineCount);
  setNodeState("CERTIFICATES", data.certificateCount);
  setNodeState("REPORTS", data.reportCount);
  setNodeState("LEARNING", data.learningCount);
  setNodeState("MI8", data.mi8Count);
  setNodeState("DOSSIER", data.dossierStatus || data.platformHealth);
}

function moduleBody(module) {
  const d = commandDeckData || {};

  const map = {
    QFN: `Tier: ${clean(d.qfnTier)} | Account: ${clean(d.qfnStatus)} | Units: ${clean(d.unitBalance, "0")}`,
    VAULT: `${clean(d.vaultCount, "0")} vault file(s) connected.`,
    TIMELINE: `${clean(d.timelineCount, "0")} timeline entrie(s) connected.`,
    CERTIFICATES: `${clean(d.certificateCount, "0")} certificate record(s) connected.`,
    REPORTS: `${clean(d.reportCount, "0")} report record(s) connected.`,
    LEARNING: `${clean(d.learningCount, "0")} learning record(s) connected.`,
    MI8: `${clean(d.mi8Count, "0")} MI8 intelligence record(s) connected.`,
    DOSSIER: [
      `Platform Health: ${clean(d.platformHealth, "0")}%`,
      `Health Status: ${clean(d.healthStatus, "HEALTH_LOADING")}`,
      `Missions: ${clean(d.missionCount, "0")}`,
      `Events: ${clean(d.eventCount, "0")}`,
      `Galaxy: ${clean(d.galaxyNodes, "0")} nodes / ${clean(d.galaxyLinks, "0")} links`,
      `Primary Mission: ${clean(d.primaryMission, "No mission loaded")}`
    ].join(" | ")
  };

  return map[module] || "Command module ready.";
}

document.querySelectorAll(".command-node, .node").forEach(node => {
  node.addEventListener("mouseenter", () => {
    const module = node.dataset.module;

    if (tooltipTitle) tooltipTitle.textContent = module;
    if (tooltipBody) tooltipBody.textContent = moduleBody(module);
    if (tooltip) tooltip.classList.add("active");
  });

  node.addEventListener("mouseleave", () => {
    if (tooltip) tooltip.classList.remove("active");
  });

  node.addEventListener("click", () => {
    const module = node.dataset.module;

    window.parent.postMessage({
      type: "capricorn:moduleClick",
      module
    }, "*");

    setMode("thinking", `OPENING ${module}`);
  });
});

window.addEventListener("message", event => {
  const msg = event.data || {};

  if (msg.type === "capricorn:setMode") {
    setMode(msg.mode, msg.label);
  }

  if (msg.type === "capricorn:setClaimantClass") {
    setClaimantClass(msg);
  }

  if (msg.type === "capricorn:setCommandDeck") {
    setCommandDeck(msg.data || {});
  }
});

setMode("idle", "COMMAND DECK V8");
