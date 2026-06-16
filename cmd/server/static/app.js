const input = document.querySelector("#json-input");
const output = document.querySelector("#json-output");

const inputLines = document.querySelector("[data-input-lines]");
const inputSize = document.querySelector("[data-input-size]");
const outputLines = document.querySelector("[data-output-lines]");
const outputSize = document.querySelector("[data-output-size]");

const actions = document.querySelectorAll("[data-action]");

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
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function updateStats() {
  const inputValue = input.value;
  const outputValue = output.value;

  inputLines.textContent = `${lineCount(inputValue)} lines`;
  inputSize.textContent = formatBytes(byteSize(inputValue));
  outputLines.textContent = `${lineCount(outputValue)} lines`;
  outputSize.textContent = formatBytes(byteSize(outputValue));
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  console.info(`Action selected: ${action}`);
}

input.addEventListener("input", updateStats);
actions.forEach((button) => button.addEventListener("click", handleAction));
updateStats();
