const refs = {
  modeToggle: document.querySelector(".mode-toggle"),
  saveButton: document.querySelector(".save-button"),
  saveLabel: document.querySelector(".save-label"),
  terminal: document.querySelector(".terminal"),
  terminalContent: document.querySelector(".content"),
  title: document.querySelector(".title"),
  commandColorInput: document.getElementById("ctrl-color-cmd"),
  widthInput: document.getElementById("ctrl-width"),
  heightInput: document.getElementById("ctrl-height"),
  fontSizeInput: document.getElementById("ctrl-font-size"),
  fontFamilyInput: document.getElementById("ctrl-font-family"),
  promptStyleInput: document.getElementById("ctrl-prompt-style"),
  promptStyleCustomInput: document.getElementById("ctrl-prompt-style-custom"),
  userHostEnabledInput: document.getElementById("ctrl-user-host-enabled"),
  userHostGroup: document.getElementById("ctrl-user-host-group"),
  userInput: document.getElementById("ctrl-user"),
  hostInput: document.getElementById("ctrl-host"),
  promptColorInput: document.getElementById("ctrl-color-prompt"),
  textColorInput: document.getElementById("ctrl-color-text"),
  bgColorInput: document.getElementById("ctrl-color-bg"),
  cmdWordInput: document.getElementById("ctrl-cmd-word"),
  resetButton: document.getElementById("ctrl-reset"),
};

const root = document.documentElement;
const exportScale = Math.max(16, window.devicePixelRatio * 4);
const modeOrder = ["system", "light", "dark"];
const firstLinePlaceholder = "type here...";
const firstLinePlaceholders = new Set([firstLinePlaceholder]);
const defaults = {
  title: "user@host:~$",
  width: 600,
  height: 330,
  fontSize: 16,
  fontFamily: "'JetBrains Mono', monospace",
  promptStyle: "~ $ ",
  user: "user",
  host: "host",
  userHostEnabled: false,
  promptColor: "#ffffff",
  textColor: "#999999",
  bgColor: "#1e1e1e",
  cmdColor: "#08ff02",
  cmdWordEnabled: false,
};

const state = {
  promptPrefix: defaults.promptStyle,
  customPrompt: "",
  cmdWordEnabled: defaults.cmdWordEnabled,
  firstLineHasPlaceholder: false,
  titleUsesDefault: true,
};

function withPromptSpacing(value) {
  if (!value) return "";
  return /\s$/.test(value) ? value : `${value} `;
}

function firstPrompt() {
  return refs.terminalContent.querySelector(".first-char");
}

function setCssVar(name, value) {
  root.style.setProperty(name, value);
}

function setAllPromptTexts(text) {
  refs.terminalContent.querySelectorAll(".first-char").forEach((node) => {
    node.textContent = text;
  });
}

function getActiveUserHost() {
  return {
    user: refs.userHostEnabledInput.checked
      ? refs.userInput.value.trim() || defaults.user
      : defaults.user,
    host: refs.userHostEnabledInput.checked
      ? refs.hostInput.value.trim() || defaults.host
      : defaults.host,
  };
}

function resolveUserHostTemplate(template) {
  const { user, host } = getActiveUserHost();
  return template.replaceAll("{user}", user).replaceAll("{host}", host);
}

function getDefaultTitle() {
  return resolveUserHostTemplate("{user}@{host}:~$");
}

function syncTitleWithDefault() {
  if (state.titleUsesDefault) {
    refs.title.textContent = getDefaultTitle();
  }
}

function syncUserHostPromptOptions() {
  refs.promptStyleInput
    .querySelectorAll("[data-user-host-template]")
    .forEach((option) => {
      option.textContent = resolveUserHostTemplate(option.value).trimEnd();
    });
}

function syncPromptWithSelectedOption() {
  if (refs.promptStyleInput.value === "custom") {
    updatePromptPrefix(withPromptSpacing(state.customPrompt));
    return;
  }

  const selected = refs.promptStyleInput.selectedOptions[0];
  if (!selected) return;

  const value = selected.hasAttribute("data-user-host-template")
    ? resolveUserHostTemplate(selected.value)
    : selected.value;

  updatePromptPrefix(value);
}

function syncUserHostBindings() {
  syncUserHostPromptOptions();
  syncTitleWithDefault();
  syncPromptWithSelectedOption();
}

function setUserHostFieldVisibility(visible) {
  const group = refs.userHostGroup;
  if (!group) return;

  if (visible) {
    group.hidden = false;
    // Delay class add by one frame so CSS transitions can run from collapsed state.
    window.requestAnimationFrame(() => {
      group.classList.add("is-visible");
    });
    return;
  }

  group.classList.remove("is-visible");

  const onTransitionEnd = (event) => {
    if (event.propertyName !== "max-height") return;
    if (!group.classList.contains("is-visible")) {
      group.hidden = true;
    }
    group.removeEventListener("transitionend", onTransitionEnd);
  };

  group.addEventListener("transitionend", onTransitionEnd);
}

function enterCustomPromptMode() {
  refs.promptStyleInput.hidden = true;
  refs.promptStyleCustomInput.hidden = false;
  refs.promptStyleCustomInput.value = state.customPrompt;
  refs.promptStyleCustomInput.focus();
  refs.promptStyleCustomInput.select();
}

function exitCustomPromptMode(applyChanges) {
  if (applyChanges) {
    state.customPrompt = refs.promptStyleCustomInput.value.trimEnd();
    updatePromptPrefix(withPromptSpacing(state.customPrompt));
  }

  refs.promptStyleInput.hidden = false;
  refs.promptStyleCustomInput.hidden = true;
  refs.promptStyleInput.value = "custom";
}

function getFirstLineTextNode() {
  const prompt = firstPrompt();
  const next = prompt?.nextSibling;
  return next?.nodeType === Node.TEXT_NODE ? next : null;
}

function detectPlaceholderActive() {
  const textNode = getFirstLineTextNode();
  if (!textNode) return false;
  return firstLinePlaceholders.has(
    textNode.textContent.replace(/\u00a0/g, " ").trim(),
  );
}

function normalizeInitialPlaceholderLine() {
  const textNode = getFirstLineTextNode();
  if (textNode && detectPlaceholderActive()) {
    textNode.textContent = firstLinePlaceholder;
  }
}

function isPlaceholderActive() {
  return state.firstLineHasPlaceholder;
}

function setCaretAfterFirstPrompt() {
  const prompt = firstPrompt();
  if (!prompt) return;
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.setStartAfter(prompt);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

function clearFirstLinePlaceholder() {
  const prompt = firstPrompt();
  if (!prompt) return;

  const next = prompt.nextSibling;
  if (next?.nodeType === Node.TEXT_NODE) {
    next.textContent = "";
  } else if (
    next?.nodeType === Node.ELEMENT_NODE &&
    next.classList.contains("cmd-word")
  ) {
    const trailing = next.nextSibling;
    next.remove();
    if (trailing?.nodeType === Node.TEXT_NODE) {
      trailing.textContent = "";
    } else {
      prompt.after(document.createTextNode(""));
    }
  }

  state.firstLineHasPlaceholder = false;
  setCaretAfterFirstPrompt();
}

function applyPlaceholderWordStyling() {
  const prompt = firstPrompt();
  if (!prompt) return;

  let textNode = getFirstLineTextNode();
  if (!textNode) {
    textNode = document.createTextNode(firstLinePlaceholder);
    prompt.after(textNode);
  }
  textNode.textContent = firstLinePlaceholder;

  if (!state.cmdWordEnabled) return;

  const match = firstLinePlaceholder.match(/^(\S+)([\s\S]*)$/);
  if (!match) return;

  const wordSpan = document.createElement("span");
  wordSpan.className = "cmd-word";
  wordSpan.textContent = match[1];
  textNode.textContent = match[2] || "";
  textNode.before(wordSpan);
}

function getCaretOffset(rootNode) {
  const sel = window.getSelection();
  if (!sel?.rangeCount) return -1;
  const range = sel.getRangeAt(0);
  if (!rootNode.contains(range.startContainer)) return -1;

  let offset = 0;
  function walk(node) {
    if (node === range.startContainer) {
      offset += range.startOffset;
      return true;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      offset += node.length;
      return false;
    }
    for (const child of node.childNodes) {
      if (walk(child)) return true;
    }
    return false;
  }

  walk(rootNode);
  return offset;
}

function setCaretOffset(rootNode, target) {
  let remaining = target;
  let found = null;

  function walk(node) {
    if (found) return;
    if (node.nodeType === Node.TEXT_NODE) {
      if (remaining <= node.length) {
        found = { node, offset: remaining };
      } else {
        remaining -= node.length;
      }
      return;
    }
    for (const child of node.childNodes) walk(child);
  }

  walk(rootNode);
  if (!found) return;

  try {
    const range = document.createRange();
    range.setStart(found.node, found.offset);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (_) {}
}

function updateCommandWords() {
  const caret = getCaretOffset(refs.terminalContent);
  const initialPrompt = firstPrompt();

  refs.terminalContent.querySelectorAll(".cmd-word").forEach((span) => {
    span.replaceWith(document.createTextNode(span.textContent));
  });
  refs.terminalContent.normalize();

  if (isPlaceholderActive()) {
    applyPlaceholderWordStyling();
  }

  if (state.cmdWordEnabled) {
    refs.terminalContent.querySelectorAll(".first-char").forEach((prompt) => {
      if (isPlaceholderActive() && prompt === initialPrompt) return;
      const next = prompt.nextSibling;
      if (!next || next.nodeType !== Node.TEXT_NODE) return;

      const match = next.textContent.match(/^(\S+)/);
      if (!match) return;

      const wordSpan = document.createElement("span");
      wordSpan.className = "cmd-word";
      wordSpan.textContent = match[1];

      if (match[1].length >= next.textContent.length) {
        next.replaceWith(wordSpan);
      } else {
        next.textContent = next.textContent.slice(match[1].length);
        next.before(wordSpan);
      }
    });
  }

  if (caret >= 0) setCaretOffset(refs.terminalContent, caret);
}

function applyMode(mode) {
  document.body.classList.toggle("light-mode", mode === "light");
  document.body.classList.toggle("dark-mode", mode === "dark");
  refs.modeToggle.dataset.mode = mode;

  if (mode === "system") {
    refs.modeToggle.setAttribute("aria-label", "Use system colour mode");
    refs.modeToggle.setAttribute("aria-pressed", "mixed");
    return;
  }

  refs.modeToggle.setAttribute(
    "aria-label",
    `${mode.charAt(0).toUpperCase()}${mode.slice(1)} colour mode`,
  );
  refs.modeToggle.setAttribute("aria-pressed", "true");
}

function updatePromptPrefix(value) {
  state.promptPrefix = value;
  setAllPromptTexts(value);
}

function bindColorInput(input, cssVar) {
  input.addEventListener("input", (event) => {
    setCssVar(cssVar, event.target.value);
  });
}

function resetControls() {
  refs.widthInput.value = String(defaults.width);
  refs.heightInput.value = String(defaults.height);
  refs.terminal.style.width = `${defaults.width}px`;
  refs.terminal.style.height = `${defaults.height}px`;

  refs.fontSizeInput.value = String(defaults.fontSize);
  refs.fontFamilyInput.value = defaults.fontFamily;
  setCssVar("--terminal-font-size", `${defaults.fontSize}px`);
  setCssVar("--terminal-font-family", defaults.fontFamily);

  refs.promptStyleInput.value = defaults.promptStyle;
  refs.promptStyleInput.hidden = false;
  refs.promptStyleCustomInput.hidden = true;
  state.customPrompt = "";
  updatePromptPrefix(defaults.promptStyle);
  refs.userHostEnabledInput.checked = defaults.userHostEnabled;
  refs.userInput.value = defaults.user;
  refs.hostInput.value = defaults.host;
  setUserHostFieldVisibility(defaults.userHostEnabled);
  refs.userInput.disabled = !defaults.userHostEnabled;
  refs.hostInput.disabled = !defaults.userHostEnabled;
  syncUserHostBindings();

  refs.promptColorInput.value = defaults.promptColor;
  refs.textColorInput.value = defaults.textColor;
  refs.bgColorInput.value = defaults.bgColor;
  refs.commandColorInput.value = defaults.cmdColor;

  setCssVar("--terminal-prompt", defaults.promptColor);
  setCssVar("--terminal-text", defaults.textColor);
  setCssVar("--terminal-bg", defaults.bgColor);
  setCssVar("--command-color", defaults.cmdColor);

  refs.cmdWordInput.checked = defaults.cmdWordEnabled;
  state.cmdWordEnabled = defaults.cmdWordEnabled;
  refs.commandColorInput.disabled = !defaults.cmdWordEnabled;
  updateCommandWords();
}

function initTitleEditing() {
  refs.title.addEventListener("click", () => {
    const currentText = refs.title.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className = "title-input";
    refs.title.replaceWith(input);
    input.focus();
    input.select();

    function commit() {
      refs.title.textContent = input.value.trim();
      state.titleUsesDefault = refs.title.textContent === getDefaultTitle();
      input.replaceWith(refs.title);
    }

    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        input.blur();
      }
      if (event.key === "Escape") {
        input.value = currentText;
        input.blur();
      }
    });
  });
}

function initTerminalInput() {
  refs.terminalContent.addEventListener("click", () => {
    if (isPlaceholderActive()) setCaretAfterFirstPrompt();
  });

  refs.terminalContent.addEventListener("focus", () => {
    if (isPlaceholderActive()) setCaretAfterFirstPrompt();
  });

  refs.terminalContent.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const sel = window.getSelection();
    if (!sel?.rangeCount) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const newline = document.createTextNode("\n");
    range.insertNode(newline);
    range.setStartAfter(newline);
    range.collapse(true);

    const prompt = document.createElement("span");
    prompt.className = "first-char";
    prompt.textContent = state.promptPrefix;
    range.insertNode(prompt);
    range.setStartAfter(prompt);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);
  });

  refs.terminalContent.addEventListener("beforeinput", (event) => {
    if (
      isPlaceholderActive() &&
      ["insertText", "insertFromPaste", "insertCompositionText"].includes(
        event.inputType,
      )
    ) {
      clearFirstLinePlaceholder();
    }

    if (event.inputType !== "insertText" || !event.data) return;

    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const { startContainer, startOffset } = sel.getRangeAt(0);

    let promptSpan = null;
    if (startContainer === refs.terminalContent) {
      const prev = refs.terminalContent.childNodes[startOffset - 1];
      if (prev?.classList?.contains("first-char")) promptSpan = prev;
    }
    if (
      !promptSpan &&
      startContainer.nodeType === Node.TEXT_NODE &&
      startContainer.parentElement?.classList.contains("first-char")
    ) {
      promptSpan = startContainer.parentElement;
    }
    if (!promptSpan) return;

    event.preventDefault();
    const range = document.createRange();
    range.setStartAfter(promptSpan);
    range.collapse(true);
    const text = document.createTextNode(event.data);
    range.insertNode(text);
    range.setStartAfter(text);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  });

  refs.terminalContent.addEventListener("input", () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;

    let anchor = sel.getRangeAt(0).startContainer;
    let offset = sel.getRangeAt(0).startOffset;
    let moved = false;

    refs.terminalContent
      .querySelectorAll("span:not(.first-char):not(.cmd-word)")
      .forEach((span) => {
        const inside = span === anchor || span.contains(anchor);
        const text = document.createTextNode(span.textContent);
        span.replaceWith(text);
        if (inside) {
          anchor = text;
          offset = Math.min(offset, text.length);
          moved = true;
        }
      });

    if (moved) {
      try {
        const range = document.createRange();
        range.setStart(anchor, offset);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (_) {}
    }

    updateCommandWords();
  });
}

function initControls() {
  bindColorInput(refs.promptColorInput, "--terminal-prompt");
  bindColorInput(refs.textColorInput, "--terminal-text");
  bindColorInput(refs.bgColorInput, "--terminal-bg");
  bindColorInput(refs.commandColorInput, "--command-color");

  refs.widthInput.addEventListener("input", (event) => {
    const value = Math.max(320, Math.min(1400, Number(event.target.value)));
    if (value) refs.terminal.style.width = `${value}px`;
  });

  refs.heightInput.addEventListener("input", (event) => {
    const value = Math.max(180, Math.min(900, Number(event.target.value)));
    if (value) refs.terminal.style.height = `${value}px`;
  });

  refs.fontSizeInput.addEventListener("input", (event) => {
    const value = Math.max(10, Math.min(32, Number(event.target.value)));
    if (value) setCssVar("--terminal-font-size", `${value}px`);
  });

  refs.fontFamilyInput.addEventListener("change", (event) => {
    setCssVar("--terminal-font-family", event.target.value);
  });

  refs.promptStyleInput.addEventListener("change", (event) => {
    if (event.target.value === "custom") {
      enterCustomPromptMode();
      return;
    }
    syncPromptWithSelectedOption();
  });

  refs.promptStyleCustomInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      refs.promptStyleCustomInput.blur();
      return;
    }
    if (event.key === "Escape") {
      refs.promptStyleCustomInput.value = state.customPrompt;
      event.preventDefault();
      refs.promptStyleCustomInput.blur();
    }
  });

  refs.promptStyleCustomInput.addEventListener("blur", () => {
    exitCustomPromptMode(true);
  });

  refs.userHostEnabledInput.addEventListener("change", (event) => {
    setUserHostFieldVisibility(event.target.checked);
    refs.userInput.disabled = !event.target.checked;
    refs.hostInput.disabled = !event.target.checked;
    syncUserHostBindings();
  });

  [refs.userInput, refs.hostInput].forEach((input) => {
    input.addEventListener("input", () => {
      syncUserHostBindings();
    });
  });

  refs.cmdWordInput.addEventListener("change", (event) => {
    state.cmdWordEnabled = event.target.checked;
    refs.commandColorInput.disabled = !state.cmdWordEnabled;
    updateCommandWords();
  });

  refs.resetButton.addEventListener("click", resetControls);
}

function initSaveButton() {
  refs.saveButton.addEventListener("click", async () => {
    if (!window.html2canvas) {
      window.alert(
        "Image export is unavailable because html2canvas failed to load.",
      );
      return;
    }

    refs.saveButton.disabled = true;
    refs.saveLabel.textContent = " Saving...";

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const { width, height } = refs.terminal.getBoundingClientRect();
      const canvas = await window.html2canvas(refs.terminal, {
        backgroundColor: null,
        scale: exportScale,
        width,
        height,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = "terminal-screen.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      refs.saveButton.disabled = false;
      refs.saveLabel.textContent = " Save Terminal Image";
    }
  });
}

function initModeToggle() {
  applyMode("system");
  refs.modeToggle.addEventListener("click", () => {
    const currentMode = refs.modeToggle.dataset.mode || "system";
    const nextMode =
      modeOrder[(modeOrder.indexOf(currentMode) + 1) % modeOrder.length];
    applyMode(nextMode);
  });
}

function init() {
  initModeToggle();
  normalizeInitialPlaceholderLine();
  state.firstLineHasPlaceholder = detectPlaceholderActive();
  setCssVar("--command-color", refs.commandColorInput.value);
  setUserHostFieldVisibility(refs.userHostEnabledInput.checked);
  syncUserHostBindings();
  initTerminalInput();
  initControls();
  initTitleEditing();
  initSaveButton();
  updateCommandWords();
}

init();
