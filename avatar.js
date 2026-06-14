const app = document.getElementById("capricorn-avatar-app");
const statusText = document.getElementById("statusText");

const validModes = ["idle", "verified", "listening", "thinking", "speaking", "success", "error"];

function setAvatarMode(mode = "idle", label = "") {
  if (!validModes.includes(mode)) mode = "idle";

  validModes.forEach(m => app.classList.remove(`mode-${m}`));
  app.classList.add(`mode-${mode}`);

  const display = label || `CAPRICORN ${mode.toUpperCase()}`;
  if (statusText) statusText.textContent = display;

  window.parent?.postMessage({
    source: "capricorn-avatar",
    type: "modeChanged",
    mode,
    label: display
  }, "*");
}

window.CapricornAvatar = {
  setMode: setAvatarMode,
  idle: () => setAvatarMode("idle"),
  verified: () => setAvatarMode("verified"),
  listen: () => setAvatarMode("listening"),
  think: () => setAvatarMode("thinking"),
  speak: () => setAvatarMode("speaking"),
  success: () => setAvatarMode("success"),
  error: () => setAvatarMode("error")
};

window.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "capricorn:setMode") {
    setAvatarMode(data.mode, data.label);
  }
});

setAvatarMode("idle", "CAPRICORN IDLE");
