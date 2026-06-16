const input = document.querySelector("#json-input");
const output = document.querySelector("#json-output");
const indentSize = document.querySelector("#indent-size");
const themeButton = document.querySelector('[data-action="theme"]');
const copyButton = document.querySelector('[data-action="copy"]');

const inputLines = document.querySelector("[data-input-lines]");
const inputSize = document.querySelector("[data-input-size]");
const outputLines = document.querySelector("[data-output-lines]");
const outputSize = document.querySelector("[data-output-size]");
const inputStatus = document.querySelector("[data-input-status]");
const outputStatus = document.querySelector("[data-output-status]");
const message = document.querySelector("[data-message]");

const actions = document.querySelectorAll("[data-action]");
const root = document.documentElement;
const themeStorageKey = "json-viewer-theme";
const themes = ["system", "light", "dark"];

const sampleJSON = {
  project: "json-viewer",
  domain: "json.furkansahin.dev",
  features: ["format", "minify", "validate", "copy"],
  deploy: {
    runtime: "go",
    proxy: "caddy",
    memoryMB: 1024
  },
  updatedAt: "2026-06-16T13:00:00Z"
};

function parseJSON() {
  const value = input.value.trim();

  if (!value) {
    const error = new Error("Paste JSON to begin.");
    error.name = "EmptyInputError";
    throw error;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    const detail = error instanceof SyntaxError ? describeParseError(error.message, value) : "Invalid JSON.";
    throw new Error(detail);
  }
}

function describeParseError(message, value) {
  const match = message.match(/position (\d+)/i);

  if (!match) {
    return message;
  }

  const position = Number(match[1]);
  const beforeError = value.slice(0, position);
  const line = beforeError.split("\n").length;
  const column = beforeError.length - beforeError.lastIndexOf("\n");

  return `${message} at line ${line}, column ${column}.`;
}

function byteSize(value) {
  return new Blob([value]).size;
}

function lineCount(value) {
  if (!value) {
    return 0;
  }
  return value.split("\n").length;
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function updateStats() {
  const inputValue = input.value;
  const outputValue = output.value;
  const inputLineCount = lineCount(inputValue);
  const outputLineCount = lineCount(outputValue);

  inputLines.textContent = `${inputLineCount} ${inputLineCount === 1 ? "line" : "lines"}`;
  inputSize.textContent = formatBytes(byteSize(inputValue));
  outputLines.textContent = `${outputLineCount} ${outputLineCount === 1 ? "line" : "lines"}`;
  outputSize.textContent = formatBytes(byteSize(outputValue));
}

function updateControls() {
  copyButton.disabled = !output.value;
}

function setStatus(target, text, state = "muted") {
  target.textContent = text;
  target.classList.remove("muted", "success", "error");
  target.classList.add(state);
}

function setMessage(text, state = "muted") {
  message.textContent = text;
  message.classList.remove("success", "error");

  if (state !== "muted") {
    message.classList.add(state);
  }
}

function setOutput(value, status = "Ready") {
  output.value = value;
  setStatus(outputStatus, status, value ? "success" : "muted");
  updateStats();
  updateControls();
}

function setValid(messageText) {
  input.classList.remove("has-error");
  setStatus(inputStatus, "Valid", "success");
  setMessage(messageText, "success");
}

function setError(error) {
  if (error.name === "EmptyInputError") {
    input.classList.remove("has-error");
    setStatus(inputStatus, "Ready", "muted");
    setStatus(outputStatus, output.value ? outputStatus.textContent : "Idle", output.value ? "success" : "muted");
    setMessage(error.message);
    updateControls();
    return;
  }

  input.classList.add("has-error");
  setStatus(inputStatus, "Invalid", "error");
  setStatus(outputStatus, "Idle", "muted");
  setMessage(error.message, "error");
  updateControls();
}

function formatJSON() {
  const parsed = parseJSON();
  const spaces = Number(indentSize.value);

  setOutput(JSON.stringify(parsed, null, spaces), "Formatted");
  setValid(`JSON formatted with ${spaces} spaces.`);
}

function minifyJSON() {
  const parsed = parseJSON();

  setOutput(JSON.stringify(parsed), "Minified");
  setValid("JSON minified.");
}

function validateJSON() {
  parseJSON();
  setValid("JSON is valid.");
}

async function copyOutput() {
  const value = output.value;

  if (!value) {
    setMessage("Nothing to copy yet.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
  } catch (_error) {
    output.focus();
    output.select();
    document.execCommand("copy");
  }

  setStatus(outputStatus, "Copied", "success");
  setMessage("Output copied to clipboard.", "success");
}

function clearAll() {
  input.value = "";
  output.value = "";
  input.classList.remove("has-error");
  setStatus(inputStatus, "Ready", "muted");
  setStatus(outputStatus, "Idle", "muted");
  setMessage("Paste JSON to begin.");
  updateStats();
  updateControls();
  input.focus();
}

function loadSample() {
  input.value = JSON.stringify(sampleJSON, null, Number(indentSize.value));
  input.classList.remove("has-error");
  formatJSON();
  input.focus();
}

function applyTheme(theme) {
  const normalizedTheme = themes.includes(theme) ? theme : "system";
  root.dataset.theme = normalizedTheme;
  saveTheme(normalizedTheme);

  const nextTheme = themes[(themes.indexOf(normalizedTheme) + 1) % themes.length];
  const labels = {
    system: "Use light theme",
    light: "Use dark theme",
    dark: "Use system theme"
  };

  themeButton.setAttribute("aria-label", labels[normalizedTheme]);
  themeButton.setAttribute("aria-pressed", normalizedTheme === "dark" ? "true" : "false");
  themeButton.title = `Theme: ${normalizedTheme}`;
  themeButton.dataset.nextTheme = nextTheme;
}

function toggleTheme() {
  applyTheme(themeButton.dataset.nextTheme || "light");
}

function loadTheme() {
  try {
    return localStorage.getItem(themeStorageKey) || "system";
  } catch (_error) {
    return "system";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (_error) {
    return;
  }
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;

  try {
    if (action === "theme") {
      toggleTheme();
      return;
    }
    if (action === "format") {
      formatJSON();
      return;
    }
    if (action === "minify") {
      minifyJSON();
      return;
    }
    if (action === "validate") {
      validateJSON();
      return;
    }
    if (action === "copy") {
      void copyOutput();
      return;
    }
    if (action === "sample") {
      loadSample();
      return;
    }
    if (action === "clear") {
      clearAll();
      return;
    }
  } catch (error) {
    setError(error);
  }
}

function handleInput() {
  input.classList.remove("has-error");
  setStatus(inputStatus, input.value ? "Editing" : "Ready", "muted");
  setMessage(input.value ? "Editing JSON." : "Paste JSON to begin.");
  updateStats();
}

function handleShortcut(event) {
  const modifier = event.metaKey || event.ctrlKey;

  if (!modifier) {
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    try {
      formatJSON();
    } catch (error) {
      setError(error);
    }
    return;
  }

  if (event.shiftKey && event.key.toLowerCase() === "m") {
    event.preventDefault();
    try {
      minifyJSON();
    } catch (error) {
      setError(error);
    }
    return;
  }

  if (event.shiftKey && event.key.toLowerCase() === "c") {
    event.preventDefault();
    void copyOutput();
  }
}

applyTheme(loadTheme());
input.addEventListener("input", handleInput);
document.addEventListener("keydown", handleShortcut);
actions.forEach((button) => button.addEventListener("click", handleAction));
updateStats();
updateControls();
