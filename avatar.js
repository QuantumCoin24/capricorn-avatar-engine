const app = document.getElementById("capricorn-avatar-app");

const statusText = document.getElementById("statusText");
const voiceText = document.getElementById("voiceText");
const memoryText = document.getElementById("memoryText");

const leftEye = document.querySelector(".eye-left");
const rightEye = document.querySelector(".eye-right");
const avatarImage = document.querySelector(".human-avatar");

function setMode(mode = "idle", label = "") {
  app.classList.remove(
    "mode-idle",
    "mode-listening",
    "mode-thinking",
    "mode-speaking",
    "mode-error",
    "mode-success",
    "mode-verified"
  );

  app.classList.add(`mode-${mode}`);

  if (statusText) {
    statusText.textContent = label || mode.toUpperCase();
  }

  if (voiceText) {
    if (mode === "listening") voiceText.textContent = "LISTENING";
    else if (mode === "thinking") voiceText.textContent = "ANALYSING";
    else if (mode === "speaking") voiceText.textContent = "SPEAKING";
    else if (mode === "error") voiceText.textContent = "ERROR";
    else voiceText.textContent = "READY";
  }
}

document.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * 10;

  if (leftEye) {
    leftEye.style.transform = `translate(${x}px, ${y}px)`;
  }

  if (rightEye) {
    rightEye.style.transform = `translate(${x}px, ${y}px)`;
  }

  if (avatarImage) {
    avatarImage.style.transform = `translate(${x * 0.35}px, ${y * 0.25}px) scale(1.01)`;
  }
});

window.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type !== "capricorn:setMode") {
    return;
  }

  setMode(data.mode || "idle", data.label || "");
});

if (memoryText) {
  memoryText.textContent = "ONLINE";
}

if (voiceText) {
  voiceText.textContent = "READY";
}

setMode("verified", "CAPRICORN READY");
