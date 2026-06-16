const input = document.querySelector("#json-input");
const output = document.querySelector("#json-output");
const indentSize = document.querySelector("#indent-size");

const inputLines = document.querySelector("[data-input-lines]");
const inputSize = document.querySelector("[data-input-size]");
const outputLines = document.querySelector("[data-output-lines]");
const outputSize = document.querySelector("[data-output-size]");
const inputStatus = document.querySelector("[data-input-status]");
const outputStatus = document.querySelector("[data-output-status]");
const message = document.querySelector("[data-message]");

const actions = document.querySelectorAll("[data-action]");

function parseJSON() {
  const value = input.value.trim();

  if (!value) {
    throw new Error("Paste JSON to begin.");
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
}

function setValid(messageText) {
  input.classList.remove("has-error");
  setStatus(inputStatus, "Valid", "success");
  setMessage(messageText, "success");
}

function setError(error) {
  input.classList.add("has-error");
  setStatus(inputStatus, "Invalid", "error");
  setStatus(outputStatus, "Idle", "muted");
  setMessage(error.message, "error");
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
  input.focus();
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;

  try {
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
  updateStats();
}

input.addEventListener("input", handleInput);
actions.forEach((button) => button.addEventListener("click", handleAction));
updateStats();
