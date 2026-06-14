const app = document.getElementById("capricorn-avatar-app");

const statusText = document.getElementById("statusText");
const voiceText = document.getElementById("voiceText");
const memoryText = document.getElementById("memoryText");
const moduleText = document.getElementById("moduleText");

const leftEye = document.querySelector(".eye-left");
const rightEye = document.querySelector(".eye-right");

const nodes = document.querySelectorAll(".node");

let activeModule = "CORE";

function setMode(mode, label = "") {

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

  switch (mode) {

    case "listening":
      voiceText.textContent = "LISTENING";
      break;

    case "thinking":
      voiceText.textContent = "ANALYSING";
      break;

    case "speaking":
      voiceText.textContent = "SPEAKING";
      break;

    case "error":
      voiceText.textContent = "ERROR";
      break;

    case "verified":
      voiceText.textContent = "READY";
      break;

    default:
      voiceText.textContent = "ONLINE";
      break;
  }
}

function activateModule(moduleName) {

  activeModule = moduleName;

  app.setAttribute(
    "data-active-module",
    moduleName
  );

  moduleText.textContent = moduleName;

  statusText.textContent =
    `${moduleName} ACTIVE`;

  console.log(
    "Capricorn Module Activated:",
    moduleName
  );
}

nodes.forEach(node => {

  node.addEventListener("click", () => {

    const moduleName =
      node.dataset.module || "CORE";

    activateModule(moduleName);

    setMode(
      "speaking",
      `${moduleName} LINKED`
    );

    setTimeout(() => {

      setMode(
        "verified",
        `${moduleName} READY`
      );

    }, 2500);

  });

});

document.addEventListener(
  "mousemove",
  (event) => {

    const x =
      (event.clientX / window.innerWidth - 0.5) * 12;

    const y =
      (event.clientY / window.innerHeight - 0.5) * 12;

    if (leftEye) {
      leftEye.style.transform =
        `translate(${x}px, ${y}px)`;
    }

    if (rightEye) {
      rightEye.style.transform =
        `translate(${x}px, ${y}px)`;
    }

  }
);

window.addEventListener(
  "message",
  (event) => {

    const data = event.data || {};

    if (
      data.type !== "capricorn:setMode"
    ) {
      return;
    }

    setMode(
      data.mode || "idle",
      data.label || ""
    );

  }
);

memoryText.textContent = "ONLINE";
voiceText.textContent = "READY";
moduleText.textContent = "CORE";

setMode(
  "verified",
  "CAPRICORN READY"
);

activateModule("CORE");
