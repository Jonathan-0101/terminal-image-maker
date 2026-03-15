const refs = {
  modeToggle: document.querySelector(".mode-toggle"),
  controls: document.querySelector(".controls"),
  saveButton: document.querySelector(".save-button"),
  saveLabel: document.querySelector(".save-label"),
  modeTabs: document.querySelectorAll(".control-tab[data-editor-mode]"),
  terminal: document.querySelector(".terminal"),
  terminalContent: document.querySelector(".terminal-content"),
  codeLayer: document.querySelector(".code-layer"),
  codeInput: document.getElementById("code-input"),
  codeOutput: document.getElementById("code-output"),
  title: document.querySelector(".title"),
  commandColorInput: document.getElementById("ctrl-color-cmd"),
  widthInput: document.getElementById("ctrl-width"),
  heightInput: document.getElementById("ctrl-height"),
  fontSizeInput: document.getElementById("ctrl-font-size"),
  fontFamilyInput: document.getElementById("ctrl-font-family"),
  wordWrapInput: document.getElementById("ctrl-word-wrap"),
  titleTextVisibleInput: document.getElementById("ctrl-title-text-visible"),
  promptStyleInput: document.getElementById("ctrl-prompt-style"),
  promptStyleCustomInput: document.getElementById("ctrl-prompt-style-custom"),
  userHostEnabledInput: document.getElementById("ctrl-user-host-enabled"),
  userHostGroup: document.getElementById("ctrl-user-host-group"),
  userInput: document.getElementById("ctrl-user"),
  hostInput: document.getElementById("ctrl-host"),
  promptColorInput: document.getElementById("ctrl-color-prompt"),
  textColorInput: document.getElementById("ctrl-color-text"),
  codeTextColorEnabledInput: document.getElementById(
    "ctrl-code-text-color-enabled",
  ),
  bgColorInput: document.getElementById("ctrl-color-bg"),
  codeLanguageInput: document.getElementById("ctrl-code-language"),
  codeThemeInput: document.getElementById("ctrl-code-theme"),
  highlightThemeLink: document.getElementById("highlight-theme-link"),
  cmdWordInput: document.getElementById("ctrl-cmd-word"),
  resetButton: document.getElementById("ctrl-reset"),
  clearButton: document.getElementById("ctrl-clear"),
};

const root = document.documentElement;
const exportScale = Math.max(8, window.devicePixelRatio * 2);
const exportPadding = 24;
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
  wordWrapEnabled: true,
  codeTextColorEnabled: false,
  terminalTitleTextVisible: true,
  codeTitleTextVisible: true,
  editorMode: "terminal",
  codeLanguage: "auto",
  codeTheme: "gruvbox-light-soft",
  codeSnippet: "",
};

const languageLabels = {
  auto: "Auto",
  plaintext: "Plain Text",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  javascript: "JavaScript",
  jsx: "JSX",
  typescript: "TypeScript",
  tsx: "TSX",
  python: "Python",
  bash: "Bash",
  shell: "Shell",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  dart: "Dart",
  diff: "Diff",
  dockerfile: "Dockerfile",
  go: "Go",
  graphql: "GraphQL",
  ini: "INI",
  java: "Java",
  kotlin: "Kotlin",
  lua: "Lua",
  markdown: "Markdown",
  php: "PHP",
  powershell: "PowerShell",
  ruby: "Ruby",
  rust: "Rust",
  scala: "Scala",
  sql: "SQL",
  swift: "Swift",
  toml: "TOML",
  xml: "XML",
  yaml: "YAML",
};

const highlightThemes = {
  "gruvbox-light-soft":
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/base16/gruvbox-light-soft.min.css",
  github:
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css",
  "github-dark":
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css",
  "atom-one-light":
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-light.min.css",
  "atom-one-dark":
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css",
  "night-owl":
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/night-owl.min.css",
  "tokyo-night-dark":
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/tokyo-night-dark.min.css",
  monokai:
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/monokai.min.css",
  dracula:
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/dracula.min.css",
  nord: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/nord.min.css",
  "stackoverflow-light":
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/stackoverflow-light.min.css",
  "stackoverflow-dark":
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/stackoverflow-dark.min.css",
  xcode:
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/xcode.min.css",
};

const state = {
  promptPrefix: defaults.promptStyle,
  customPrompt: "",
  cmdWordEnabled: defaults.cmdWordEnabled,
  firstLineHasPlaceholder: false,
  titleUsesDefault: true,
  wordWrapEnabled: defaults.wordWrapEnabled,
  codeTextColorEnabled: defaults.codeTextColorEnabled,
  terminalTitleTextVisible: defaults.terminalTitleTextVisible,
  codeTitleTextVisible: defaults.codeTitleTextVisible,
  editorMode: defaults.editorMode,
  codeLanguage: defaults.codeLanguage,
  codeTheme: defaults.codeTheme,
  detectedCodeLanguage: defaults.codeLanguage,
  terminalTitle: defaults.title,
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

function getLanguageLabel(language) {
  if (!language) return languageLabels.auto;
  return languageLabels[language] || language;
}

function updateCodeModeTitle() {
  if (state.editorMode !== "code") return;
  const language =
    state.codeLanguage === "auto"
      ? state.detectedCodeLanguage || "auto"
      : state.codeLanguage;
  refs.title.textContent = `${getLanguageLabel(language)}`;
}

function queueAutoExtendTerminalHeight() {
  window.requestAnimationFrame(() => {
    const activeEditor =
      state.editorMode === "code" ? refs.codeInput : refs.terminalContent;
    if (!activeEditor) return;

    const overflow = activeEditor.scrollHeight - activeEditor.clientHeight;
    if (overflow <= 0) return;

    const currentHeight = refs.terminal.getBoundingClientRect().height;
    const nextHeight = Math.ceil(currentHeight + overflow + 2);
    refs.terminal.style.height = `${nextHeight}px`;
    refs.heightInput.value = String(nextHeight);
  });
}

function applyWordWrap(enabled) {
  state.wordWrapEnabled = Boolean(enabled);
  refs.terminal.dataset.wordWrap = state.wordWrapEnabled ? "on" : "off";
  refs.wordWrapInput.checked = state.wordWrapEnabled;
  queueAutoExtendTerminalHeight();
}

function syncTextColorControls() {
  refs.terminal.dataset.codeTextColor = state.codeTextColorEnabled
    ? "on"
    : "off";

  refs.codeTextColorEnabledInput.checked = state.codeTextColorEnabled;
  const colorInputEnabled =
    state.editorMode === "terminal" || state.codeTextColorEnabled;
  refs.textColorInput.disabled = !colorInputEnabled;
}

function applyCodeTheme(themeName) {
  const resolvedTheme = highlightThemes[themeName]
    ? themeName
    : defaults.codeTheme;
  state.codeTheme = resolvedTheme;
  refs.codeThemeInput.value = resolvedTheme;
  if (refs.highlightThemeLink) {
    refs.highlightThemeLink.href = highlightThemes[resolvedTheme];
  }
}

function getCurrentModeTitleVisibility() {
  return state.editorMode === "code"
    ? state.codeTitleTextVisible
    : state.terminalTitleTextVisible;
}

function setCurrentModeTitleVisibility(visible) {
  if (state.editorMode === "code") {
    state.codeTitleTextVisible = visible;
  } else {
    state.terminalTitleTextVisible = visible;
  }

  refs.title.classList.toggle("is-hidden", !visible);
  refs.titleTextVisibleInput.checked = visible;
}

function syncTitleVisibilityForCurrentMode() {
  setCurrentModeTitleVisibility(getCurrentModeTitleVisibility());
}

function animateControlsModeSwitch(startHeight) {
  const controls = refs.controls;
  if (!controls) return;

  const maxHeight = parseFloat(getComputedStyle(controls).maxHeight);
  let targetHeight = controls.scrollHeight;
  if (Number.isFinite(maxHeight) && maxHeight > 0) {
    targetHeight = Math.min(targetHeight, maxHeight);
  }

  if (Math.abs(targetHeight - startHeight) < 1) return;

  controls.classList.add("is-mode-switching");
  controls.style.height = `${startHeight}px`;
  // Force layout so the height transition starts from the current rendered size.
  void controls.offsetHeight;
  controls.style.height = `${targetHeight}px`;

  const onTransitionEnd = (event) => {
    if (event.propertyName !== "height") return;
    controls.style.height = "";
    controls.classList.remove("is-mode-switching");
    controls.removeEventListener("transitionend", onTransitionEnd);
  };

  controls.addEventListener("transitionend", onTransitionEnd);
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
  if (state.editorMode !== "terminal") return;

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

function syncCodeScroll() {
  const codeView = refs.codeLayer?.querySelector(".code-content");
  if (!codeView || !refs.codeInput) return;
  codeView.scrollTop = refs.codeInput.scrollTop;
  codeView.scrollLeft = refs.codeInput.scrollLeft;
}

function renderCodeMode() {
  if (!refs.codeOutput || !refs.codeInput) return;

  const source = refs.codeInput.value;
  refs.codeOutput.className = "code-output hljs";

  if (!source) {
    state.detectedCodeLanguage = "auto";
    refs.codeOutput.textContent = " ";
    updateCodeModeTitle();
    syncCodeScroll();
    queueAutoExtendTerminalHeight();
    return;
  }

  if (!window.hljs) {
    state.detectedCodeLanguage = state.codeLanguage;
    refs.codeOutput.textContent = source;
    updateCodeModeTitle();
    syncCodeScroll();
    queueAutoExtendTerminalHeight();
    return;
  }

  if (state.codeLanguage === "auto") {
    const result = window.hljs.highlightAuto(source);
    state.detectedCodeLanguage = result.language || "plaintext";
    refs.codeOutput.innerHTML = result.value;
    updateCodeModeTitle();
    syncCodeScroll();
    queueAutoExtendTerminalHeight();
    return;
  }

  state.detectedCodeLanguage = state.codeLanguage;
  refs.codeOutput.classList.add(`language-${state.codeLanguage}`);
  refs.codeOutput.textContent = source;
  window.hljs.highlightElement(refs.codeOutput);
  updateCodeModeTitle();
  syncCodeScroll();
  queueAutoExtendTerminalHeight();
}

function applyEditorMode(mode) {
  const controlsStartHeight =
    refs.controls?.getBoundingClientRect().height || 0;
  const previousMode = state.editorMode;
  const resolvedMode = mode === "code" ? "code" : "terminal";
  state.editorMode = resolvedMode;

  document.body.dataset.editorMode = resolvedMode;
  refs.terminal.dataset.editorMode = resolvedMode;
  refs.terminalContent.contentEditable = String(resolvedMode === "terminal");
  refs.codeInput.disabled = resolvedMode !== "code";
  refs.codeLayer.setAttribute("aria-hidden", String(resolvedMode !== "code"));

  refs.modeTabs.forEach((button) => {
    const isActive = button.dataset.editorMode === resolvedMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  if (previousMode !== "code" && resolvedMode === "code") {
    state.terminalTitle = refs.title.textContent;
  }

  if (previousMode === "code" && resolvedMode === "terminal") {
    refs.title.textContent = state.terminalTitle;
    state.titleUsesDefault = refs.title.textContent === getDefaultTitle();
  }

  if (resolvedMode === "code") {
    renderCodeMode();
    refs.title.setAttribute("aria-label", "Detected code language");
    syncTextColorControls();
    syncTitleVisibilityForCurrentMode();
    if (previousMode !== resolvedMode) {
      animateControlsModeSwitch(controlsStartHeight);
    }
    return;
  }

  refs.title.setAttribute("aria-label", "Terminal title");
  syncTextColorControls();
  syncTitleVisibilityForCurrentMode();
  if (previousMode !== resolvedMode) {
    animateControlsModeSwitch(controlsStartHeight);
  }

  updateCommandWords();
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

function clearCurrentContent() {
  if (state.editorMode === "code") {
    refs.codeInput.value = "";
    renderCodeMode();
    refs.codeInput.focus();
    queueAutoExtendTerminalHeight();
    return;
  }

  refs.terminalContent.replaceChildren();

  const prompt = document.createElement("span");
  prompt.className = "first-char";
  prompt.textContent = state.promptPrefix;

  refs.terminalContent.append(
    prompt,
    document.createTextNode(firstLinePlaceholder),
  );
  state.firstLineHasPlaceholder = true;

  updateCommandWords();
  setCaretAfterFirstPrompt();
  refs.terminalContent.focus();
  queueAutoExtendTerminalHeight();
}

function resetControls() {
  const activeMode = state.editorMode;

  refs.widthInput.value = String(defaults.width);
  refs.heightInput.value = String(defaults.height);
  refs.terminal.style.width = `${defaults.width}px`;
  refs.terminal.style.height = `${defaults.height}px`;

  refs.fontSizeInput.value = String(defaults.fontSize);
  refs.fontFamilyInput.value = defaults.fontFamily;
  setCssVar("--terminal-font-size", `${defaults.fontSize}px`);
  setCssVar("--terminal-font-family", defaults.fontFamily);
  applyWordWrap(defaults.wordWrapEnabled);

  refs.textColorInput.value = defaults.textColor;
  refs.bgColorInput.value = defaults.bgColor;
  setCssVar("--terminal-text", defaults.textColor);
  setCssVar("--code-plain-text", defaults.textColor);
  setCssVar("--terminal-bg", defaults.bgColor);
  state.codeTextColorEnabled = defaults.codeTextColorEnabled;

  if (activeMode === "terminal") {
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

    refs.promptColorInput.value = defaults.promptColor;
    setCssVar("--terminal-prompt", defaults.promptColor);

    refs.commandColorInput.value = defaults.cmdColor;
    setCssVar("--command-color", defaults.cmdColor);

    refs.cmdWordInput.checked = defaults.cmdWordEnabled;
    state.cmdWordEnabled = defaults.cmdWordEnabled;
    refs.commandColorInput.disabled = !defaults.cmdWordEnabled;

    state.titleUsesDefault = true;
    state.terminalTitle = getDefaultTitle();
    refs.title.textContent = state.terminalTitle;
    state.terminalTitleTextVisible = defaults.terminalTitleTextVisible;

    syncUserHostBindings();
    updateCommandWords();
  } else {
    refs.codeLanguageInput.value = defaults.codeLanguage;
    state.codeLanguage = defaults.codeLanguage;
    applyCodeTheme(defaults.codeTheme);
    refs.codeInput.value = defaults.codeSnippet;
    state.detectedCodeLanguage = defaults.codeLanguage;
    state.codeTitleTextVisible = defaults.codeTitleTextVisible;

    renderCodeMode();
  }

  syncTitleVisibilityForCurrentMode();
  syncTextColorControls();
  queueAutoExtendTerminalHeight();
}

function initTitleEditing() {
  refs.title.addEventListener("click", () => {
    if (state.editorMode === "code") return;

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
      state.terminalTitle = refs.title.textContent;
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
    if (state.editorMode !== "terminal") return;
    if (isPlaceholderActive()) setCaretAfterFirstPrompt();
  });

  refs.terminalContent.addEventListener("focus", () => {
    if (state.editorMode !== "terminal") return;
    if (isPlaceholderActive()) setCaretAfterFirstPrompt();
  });

  refs.terminalContent.addEventListener("keydown", (event) => {
    if (state.editorMode !== "terminal") return;

    if (event.key === "Tab") {
      event.preventDefault();

      const sel = window.getSelection();
      if (!sel?.rangeCount) return;

      const range = sel.getRangeAt(0);
      range.deleteContents();

      const tabText = document.createTextNode("\t");
      range.insertNode(tabText);
      range.setStartAfter(tabText);
      range.collapse(true);

      sel.removeAllRanges();
      sel.addRange(range);
      updateCommandWords();
      queueAutoExtendTerminalHeight();
      return;
    }

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
    queueAutoExtendTerminalHeight();
  });

  refs.terminalContent.addEventListener("beforeinput", (event) => {
    if (state.editorMode !== "terminal") return;

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
    if (state.editorMode !== "terminal") return;

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
    queueAutoExtendTerminalHeight();
  });
}

function initEditorTabs() {
  refs.modeTabs.forEach((button) => {
    button.addEventListener("click", () => {
      applyEditorMode(button.dataset.editorMode);
    });
  });
}

function initCodeInput() {
  if (!refs.codeInput) return;

  refs.codeInput.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    event.preventDefault();
    const start = refs.codeInput.selectionStart;
    const end = refs.codeInput.selectionEnd;
    const value = refs.codeInput.value;

    refs.codeInput.value = `${value.slice(0, start)}\t${value.slice(end)}`;
    refs.codeInput.selectionStart = start + 1;
    refs.codeInput.selectionEnd = start + 1;
    renderCodeMode();
  });

  refs.codeInput.addEventListener("input", () => {
    renderCodeMode();
    queueAutoExtendTerminalHeight();
  });

  refs.codeInput.addEventListener("scroll", () => {
    syncCodeScroll();
  });
}

function initControls() {
  bindColorInput(refs.promptColorInput, "--terminal-prompt");
  bindColorInput(refs.bgColorInput, "--terminal-bg");
  bindColorInput(refs.commandColorInput, "--command-color");

  refs.textColorInput.addEventListener("input", (event) => {
    setCssVar("--terminal-text", event.target.value);
    setCssVar("--code-plain-text", event.target.value);
  });

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
    if (value) {
      setCssVar("--terminal-font-size", `${value}px`);
      queueAutoExtendTerminalHeight();
    }
  });

  refs.fontFamilyInput.addEventListener("change", (event) => {
    setCssVar("--terminal-font-family", event.target.value);
    queueAutoExtendTerminalHeight();
  });

  refs.wordWrapInput.addEventListener("change", (event) => {
    applyWordWrap(event.target.checked);
  });

  refs.titleTextVisibleInput.addEventListener("change", (event) => {
    setCurrentModeTitleVisibility(event.target.checked);
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

  refs.codeLanguageInput.addEventListener("change", (event) => {
    state.codeLanguage = event.target.value;
    renderCodeMode();
  });

  refs.codeThemeInput.addEventListener("change", (event) => {
    applyCodeTheme(event.target.value);
  });

  refs.codeTextColorEnabledInput.addEventListener("change", (event) => {
    state.codeTextColorEnabled = event.target.checked;
    syncTextColorControls();
  });

  refs.resetButton.addEventListener("click", resetControls);
  refs.clearButton.addEventListener("click", clearCurrentContent);
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

      const paddingPx = Math.round(exportPadding * exportScale);
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width + paddingPx * 2;
      exportCanvas.height = canvas.height + paddingPx * 2;

      const exportContext = exportCanvas.getContext("2d");
      exportContext.drawImage(canvas, paddingPx, paddingPx);

      const link = document.createElement("a");
      link.download = "terminal-screen.png";
      link.href = exportCanvas.toDataURL("image/png");
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
  setCssVar("--code-plain-text", refs.textColorInput.value);
  applyWordWrap(refs.wordWrapInput.checked);
  refs.codeLanguageInput.value = state.codeLanguage;
  applyCodeTheme(defaults.codeTheme);
  refs.codeInput.value = defaults.codeSnippet;
  state.terminalTitle = refs.title.textContent;
  setUserHostFieldVisibility(refs.userHostEnabledInput.checked);
  syncUserHostBindings();
  initEditorTabs();
  initTerminalInput();
  initCodeInput();
  initControls();
  initTitleEditing();
  initSaveButton();
  applyEditorMode(state.editorMode);
  syncTextColorControls();
  syncTitleVisibilityForCurrentMode();
  renderCodeMode();
  updateCommandWords();
}

init();
