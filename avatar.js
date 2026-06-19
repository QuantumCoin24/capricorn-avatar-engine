const app = document.getElementById("capricorn-avatar-app");
const claimantStateText = document.getElementById("claimantStateText");
const statusText = document.getElementById("statusText");
const voiceText = document.getElementById("voiceText");
const memoryText = document.getElementById("memoryText");
const modeText = document.getElementById("modeText");

const tooltip = document.getElementById("moduleTooltip");
const tooltipTitle = document.getElementById("tooltipTitle");
const tooltipBody = document.getElementById("tooltipBody");

const nodeMap = {
  QFN: document.getElementById("nodeQfn"),
  VAULT: document.getElementById("nodeVault"),
  TIMELINE: document.getElementById("nodeTimeline"),
  CERTIFICATES: document.getElementById("nodeCertificates"),
  REPORTS: document.getElementById("nodeReports"),
  LEARNING: document.getElementById("nodeLearning"),
  MI8: document.getElementById("nodeMi8"),
  DOSSIER: document.getElementById("nodeDossier")
};

let commandDeckData = {};

function clean(value, fallback = "--") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function setMode(mode = "idle", label = "") {
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

  statusText.textContent =
    mode === "speaking" ? "SPEAKING" :
    mode === "listening" ? "LISTENING" :
    mode === "thinking" ? "THINKING" :
    mode === "error" ? "ERROR" :
    mode === "success" ? "SUCCESS" :
    mode === "verified" ? "ONLINE" :
    "IDLE";

  modeText.textContent = label || mode.toUpperCase();

  if (label) claimantStateText.textContent = label;
}

function setClaimantClass(payload = {}) {
  const value = String(payload.claimantLevel || payload.status || "Observer").toLowerCase();

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

  if (value.includes("alert") || value.includes("risk")) className = "claimant-alert";
  else if (value.includes("command") || value.includes("chief") || value.includes("root")) className = "claimant-command";
  else if (value.includes("advanced") || value.includes("ultimate")) className = "claimant-advanced";
  else if (value.includes("verified") || value.includes("active claimant")) className = "claimant-verified";
  else if (value.includes("active")) className = "claimant-active";
  else if (value.includes("participant")) className = "claimant-participant";

  app.classList.add(className);

  claimantStateText.textContent = `${value.toUpperCase()} COMMAND DECK`;
}

function setCommandDeck(data = {}) {
  commandDeckData = data || {};

  nodeMap.QFN.textContent = clean(data.qfnStatus || data.qfnTier || data.qfnCount);
  nodeMap.VAULT.textContent = clean(data.vaultCount, "0");
  nodeMap.TIMELINE.textContent = clean(data.timelineCount, "0");
  nodeMap.CERTIFICATES.textContent = clean(data.certificateCount, "0");
  nodeMap.REPORTS.textContent = clean(data.reportCount, "0");
  nodeMap.LEARNING.textContent = clean(data.learningCount, "0");
  nodeMap.MI8.textContent = clean(data.mi8Count, "0");
  nodeMap.DOSSIER.textContent = clean(data.dossierStatus, "READY");

  memoryText.textContent = clean(data.memoryStatus, "ONLINE");
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
    DOSSIER: "Build full claimant intelligence dossier."
  };

  return map[module] || "Command module ready.";
}

document.querySelectorAll(".command-node").forEach(node => {
  node.addEventListener("mouseenter", () => {
    const module = node.dataset.module;
    tooltipTitle.textContent = module;
    tooltipBody.textContent = moduleBody(module);
    tooltip.classList.add("active");
  });

  node.addEventListener("mouseleave", () => {
    tooltip.classList.remove("active");
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

setMode("idle", "COMMAND DECK ONLINE");
