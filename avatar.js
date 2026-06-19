const app = document.getElementById("capricorn-avatar-app");

const statusText = document.getElementById("statusText");
const voiceText = document.getElementById("voiceText");
const memoryText = document.getElementById("memoryText");
const modeText = document.getElementById("modeText");
const claimantStateText = document.getElementById("claimantStateText");

const coreCard = document.getElementById("coreCard");
const coreLogo = document.getElementById("coreLogo");

const validModes = [
  "idle",
  "verified",
  "listening",
  "thinking",
  "speaking",
  "success",
  "error"
];

const claimantClasses = [
  "claimant-observer",
  "claimant-verified",
  "claimant-active",
  "claimant-command",
  "claimant-alert"
];

let currentMode = "idle";
let idleTick = 0;
let mouseX = 0;
let mouseY = 0;

function setClaimantClass(value = "") {
  const raw = String(value || "").toLowerCase();

  claimantClasses.forEach((name) => {
    app.classList.remove(name);
  });

  let selected = "claimant-verified";
  let label = "CENTRAL INTELLIGENCE CORE";

  if (raw.includes("observer") || raw.includes("participant")) {
    selected = "claimant-observer";
    label = "OBSERVER CORE";
  }

  if (raw.includes("verified")) {
    selected = "claimant-verified";
    label = "VERIFIED CLAIMANT CORE";
  }

  if (raw.includes("active")) {
    selected = "claimant-active";
    label = "ACTIVE CLAIMANT CORE";
  }

  if (
    raw.includes("command") ||
    raw.includes("commander") ||
    raw.includes("chief") ||
    raw.includes("executive")
  ) {
    selected = "claimant-command";
    label = "COMMAND CORE";
  }

  if (raw.includes("alert") || raw.includes("risk") || raw.includes("error")) {
    selected = "claimant-alert";
    label = "ALERT CORE";
  }

  app.classList.add(selected);

  if (claimantStateText) {
    claimantStateText.textContent = label;
  }
}

function setMode(mode = "idle", label = "") {
  if (!validModes.includes(mode)) {
    mode = "idle";
  }

  currentMode = mode;

  validModes.forEach((m) => {
    app.classList.remove(`mode-${m}`);
  });

  app.classList.add(`mode-${mode}`);

  const display = label || `CAPRICORN ${mode.toUpperCase()}`;

  if (statusText) {
    statusText.textContent = display;
  }

  if (modeText) {
    modeText.textContent = mode.toUpperCase();
  }

  if (voiceText) {
    if (mode === "listening") {
      voiceText.textContent = "LISTENING";
    } else if (mode === "thinking") {
      voiceText.textContent = "ANALYSING";
    } else if (mode === "speaking") {
      voiceText.textContent = "SPEAKING";
    } else if (mode === "error") {
      voiceText.textContent = "ERROR";
    } else {
      voiceText.textContent = "READY";
    }
  }

  if (memoryText) {
    memoryText.textContent = "ONLINE";
  }

  window.parent?.postMessage({
    source: "capricorn-avatar",
    type: "modeChanged",
    mode,
    label: display
  }, "*");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function handlePointerMove(event) {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;

  const cardMoveX = clamp(mouseX * 5, -5, 5);
  const cardMoveY = clamp(mouseY * 4, -4, 4);
  const logoMoveX = clamp(mouseX * 6, -6, 6);
  const logoMoveY = clamp(mouseY * 5, -5, 5);

  if (coreCard) {
    coreCard.style.transform = `
      rotateY(${mouseX * 3}deg)
      rotateX(${-mouseY * 2}deg)
      translate(${cardMoveX}px, ${cardMoveY}px)
    `;
  }

  if (coreLogo) {
    coreLogo.style.marginLeft = `${logoMoveX}px`;
    coreLogo.style.marginTop = `${logoMoveY}px`;
  }
}

function idleLife() {
  idleTick += 1;

  if (
    currentMode === "idle" ||
    currentMode === "verified" ||
    currentMode === "success"
  ) {
    const swayX = Math.sin(idleTick / 22) * 2.5;
    const swayY = Math.cos(idleTick / 26) * 2;

    if (coreCard) {
      coreCard.style.marginLeft = `${swayX}px`;
      coreCard.style.marginTop = `${swayY}px`;
    }
  }

  requestAnimationFrame(idleLife);
}

function pulseThinking() {
  if (currentMode !== "thinking") return;

  if (statusText) {
    statusText.textContent = "CAPRICORN ANALYSING";
  }

  setTimeout(() => {
    if (currentMode === "thinking" && statusText) {
      statusText.textContent = "PROCESSING MEMORY";
    }
  }, 700);

  setTimeout(() => {
    if (currentMode === "thinking" && statusText) {
      statusText.textContent = "SCANNING CONTEXT";
    }
  }, 1400);

  setTimeout(() => {
    if (currentMode === "thinking") {
      pulseThinking();
    }
  }, 2200);
}

function speakingPulse() {
  if (currentMode !== "speaking") return;

  if (coreLogo) {
    const scale = 1.03 + Math.random() * 0.06;
    coreLogo.style.transform = `scale(${scale})`;
  }

  setTimeout(speakingPulse, 120);
}

function listeningPulse() {
  if (currentMode !== "listening") return;

  if (statusText) {
    statusText.textContent = "CAPRICORN LISTENING";
  }

  setTimeout(() => {
    if (currentMode === "listening" && statusText) {
      statusText.textContent = "VOICE INPUT OPEN";
    }
  }, 900);

  setTimeout(() => {
    if (currentMode === "listening") {
      listeningPulse();
    }
  }, 1800);
}

function bootSequence() {
  setClaimantClass("verified");
  setMode("idle", "CAPRICORN CORE BOOTING");

  setTimeout(() => {
    setMode("thinking", "CONSTRUCTING CORE");
  }, 600);

  setTimeout(() => {
    setMode("verified", "CAPRICORN CORE READY");
  }, 1700);
}

window.CapricornAvatar = {
  setMode,
  setClaimantClass,
  idle: () => setMode("idle"),
  verified: () => setMode("verified"),
  listen: () => setMode("listening"),
  think: () => setMode("thinking"),
  speak: () => setMode("speaking"),
  success: () => setMode("success"),
  error: () => setMode("error")
};

window.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "capricorn:setClaimantClass") {
    setClaimantClass(data.claimantLevel || data.status || "");
    return;
  }

  if (data.type !== "capricorn:setMode") {
    return;
  }

  setMode(data.mode || "idle", data.label || "");

  if (data.claimantLevel || data.status) {
    setClaimantClass(data.claimantLevel || data.status);
  }

  if (data.mode === "thinking") {
    pulseThinking();
  }

  if (data.mode === "speaking") {
    speakingPulse();
  }

  if (data.mode === "listening") {
    listeningPulse();
  }
});

document.addEventListener("mousemove", handlePointerMove);

document.addEventListener("touchmove", (event) => {
  if (!event.touches || !event.touches[0]) return;
  handlePointerMove(event.touches[0]);
}, { passive: true });

if (memoryText) {
  memoryText.textContent = "ONLINE";
}

if (voiceText) {
  voiceText.textContent = "READY";
}

idleLife();
bootSequence();
