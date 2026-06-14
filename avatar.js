const app = document.getElementById("capricorn-avatar-app");

const statusText = document.getElementById("statusText");
const voiceText = document.getElementById("voiceText");
const memoryText = document.getElementById("memoryText");
const modeText = document.getElementById("modeText");

const eyeLeft = document.getElementById("eyeLeft");
const eyeRight = document.getElementById("eyeRight");
const avatarCard = document.getElementById("avatarCard");
const humanAvatar = document.getElementById("humanAvatar");
const mouthLight = document.getElementById("mouthLight");

const validModes = [
  "idle",
  "verified",
  "listening",
  "thinking",
  "speaking",
  "success",
  "error"
];

let currentMode = "idle";
let mouseX = 0;
let mouseY = 0;
let idleTick = 0;

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

  const eyeMoveX = clamp(mouseX * 8, -7, 7);
  const eyeMoveY = clamp(mouseY * 6, -5, 5);

  const headMoveX = clamp(mouseX * 8, -8, 8);
  const headMoveY = clamp(mouseY * 6, -6, 6);

  if (eyeLeft) {
    eyeLeft.style.transform = `translate(${eyeMoveX}px, ${eyeMoveY}px)`;
  }

  if (eyeRight) {
    eyeRight.style.transform = `translate(${eyeMoveX}px, ${eyeMoveY}px)`;
  }

  if (humanAvatar) {
    humanAvatar.style.transform = `
      translate(${headMoveX * 0.45}px, ${headMoveY * 0.35}px)
      scale(1.025)
    `;
  }

  if (avatarCard) {
    avatarCard.style.transform = `
      rotateY(${mouseX * 3}deg)
      rotateX(${-mouseY * 2}deg)
    `;
  }
}

function randomBlink() {
  const eyes = [eyeLeft, eyeRight];

  eyes.forEach((eye) => {
    if (!eye) return;

    const lid = eye.querySelector(".eyelid");
    if (!lid) return;

    lid.style.transform = "scaleY(1)";

    setTimeout(() => {
      lid.style.transform = "scaleY(0)";
    }, 120);
  });

  const nextBlink = 2500 + Math.random() * 5000;
  setTimeout(randomBlink, nextBlink);
}

function idleLife() {
  idleTick += 1;

  if (currentMode === "idle" || currentMode === "verified" || currentMode === "success") {
    const swayX = Math.sin(idleTick / 20) * 2.5;
    const swayY = Math.cos(idleTick / 24) * 2;

    if (avatarCard) {
      avatarCard.style.marginLeft = `${swayX}px`;
      avatarCard.style.marginTop = `${swayY}px`;
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
    if (currentMode === "thinking") {
      if (statusText) {
        statusText.textContent = "PROCESSING MEMORY";
      }
    }
  }, 700);

  setTimeout(() => {
    if (currentMode === "thinking") {
      if (statusText) {
        statusText.textContent = "SCANNING CONTEXT";
      }
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

  if (mouthLight) {
    const width = 18 + Math.random() * 34;
    const opacity = 0.5 + Math.random() * 0.5;
    mouthLight.style.width = `${width}px`;
    mouthLight.style.opacity = opacity;
  }

  setTimeout(speakingPulse, 90);
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
  setMode("idle", "CAPRICORN BOOTING");

  setTimeout(() => {
    setMode("thinking", "LOADING AVATAR CORE");
  }, 600);

  setTimeout(() => {
    setMode("verified", "CAPRICORN READY");
  }, 1500);
}

window.CapricornAvatar = {
  setMode,
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

  if (data.type !== "capricorn:setMode") {
    return;
  }

  setMode(data.mode || "idle", data.label || "");

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

randomBlink();
idleLife();
bootSequence();
