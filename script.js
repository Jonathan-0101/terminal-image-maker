const refs = {
  modeToggle: document.querySelector(".mode-toggle"),
  controls: document.querySelector(".controls"),
  saveButton: document.querySelector(".save-button"),
  saveLabel: document.querySelector(".save-label"),
  copyHtmlButton: document.querySelector(".copy-html-button"),
  copyHtmlLabel: document.querySelector(".copy-html-label"),
  exportActions: document.querySelector(".export-actions"),
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
  fontVariantInput: document.getElementById("ctrl-font-variant"),
  fontVariantLabel: document.getElementById("ctrl-font-variant-label"),
  floatingTooltip: document.getElementById("ctrl-floating-tooltip"),
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
const snapshotTextStyleProps = [
  "color",
  "fontWeight",
  "fontStyle",
  "textDecorationLine",
  "backgroundColor",
  "opacity",
];
const modeOrder = ["system", "light", "dark"];
const firstLinePlaceholder = "type here...";
const firstLinePlaceholders = new Set([firstLinePlaceholder]);
const defaults = {
  title: "user@host:~$",
  width: 600,
  height: 330,
  fontSize: 16,
  fontFamily: "'JetBrains Mono', monospace",
  fontVariant: "400:normal",
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

const fontVariantsByFamily = {
  "'JetBrains Mono', monospace": [
    { value: "400:normal", label: "Regular", weight: "400", style: "normal" },
    { value: "500:normal", label: "Medium", weight: "500", style: "normal" },
    { value: "600:normal", label: "Semibold", weight: "600", style: "normal" },
    { value: "700:normal", label: "Bold", weight: "700", style: "normal" },
    { value: "400:italic", label: "Italic", weight: "400", style: "italic" },
    {
      value: "500:italic",
      label: "Medium Italic",
      weight: "500",
      style: "italic",
    },
    {
      value: "600:italic",
      label: "Semibold Italic",
      weight: "600",
      style: "italic",
    },
    {
      value: "700:italic",
      label: "Bold Italic",
      weight: "700",
      style: "italic",
    },
  ],
  "Menlo, Monaco, monospace": [
    { value: "400:normal", label: "Regular", weight: "400", style: "normal" },
    { value: "700:normal", label: "Bold", weight: "700", style: "normal" },
    { value: "400:italic", label: "Italic", weight: "400", style: "italic" },
    {
      value: "700:italic",
      label: "Bold Italic",
      weight: "700",
      style: "italic",
    },
  ],
  "ui-monospace, 'SF Mono', SFMono-Regular, monospace": [
    { value: "400:normal", label: "Regular", weight: "400", style: "normal" },
    { value: "500:normal", label: "Medium", weight: "500", style: "normal" },
    { value: "600:normal", label: "Semibold", weight: "600", style: "normal" },
    { value: "700:normal", label: "Bold", weight: "700", style: "normal" },
    { value: "400:italic", label: "Italic", weight: "400", style: "italic" },
    {
      value: "700:italic",
      label: "Bold Italic",
      weight: "700",
      style: "italic",
    },
  ],
  "'Courier New', Courier, monospace": [
    { value: "400:normal", label: "Regular", weight: "400", style: "normal" },
    { value: "700:normal", label: "Bold", weight: "700", style: "normal" },
    { value: "400:italic", label: "Italic", weight: "400", style: "italic" },
    {
      value: "700:italic",
      label: "Bold Italic",
      weight: "700",
      style: "italic",
    },
  ],
  "Consolas, monospace": [
    { value: "400:normal", label: "Regular", weight: "400", style: "normal" },
    { value: "700:normal", label: "Bold", weight: "700", style: "normal" },
    { value: "400:italic", label: "Italic", weight: "400", style: "italic" },
    {
      value: "700:italic",
      label: "Bold Italic",
      weight: "700",
      style: "italic",
    },
  ],
  "Arial, Helvetica, sans-serif": [
    { value: "400:normal", label: "Regular", weight: "400", style: "normal" },
    { value: "700:normal", label: "Bold", weight: "700", style: "normal" },
    { value: "400:italic", label: "Italic", weight: "400", style: "italic" },
    {
      value: "700:italic",
      label: "Bold Italic",
      weight: "700",
      style: "italic",
    },
  ],
  default: [
    { value: "400:normal", label: "Regular", weight: "400", style: "normal" },
    { value: "700:normal", label: "Bold", weight: "700", style: "normal" },
    { value: "400:italic", label: "Italic", weight: "400", style: "italic" },
    {
      value: "700:italic",
      label: "Bold Italic",
      weight: "700",
      style: "italic",
    },
  ],
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
  fontVariant: defaults.fontVariant,
  detectedCodeLanguage: defaults.codeLanguage,
  terminalTitle: defaults.title,
};

let autoExtendTerminalHeightFrame = 0;

function withPromptSpacing(value) {
  if (!value) return "";
  return /\s$/.test(value) ? value : `${value} `;
}

function firstPrompt() {
  return refs.terminalContent.querySelector(".first-char");
}

function getPromptNodes() {
  return refs.terminalContent.querySelectorAll(".first-char");
}

function isTerminalMode() {
  return state.editorMode === "terminal";
}

function isCodeMode() {
  return state.editorMode === "code";
}

function getActiveSelection() {
  const selection = window.getSelection();
  return selection?.rangeCount ? selection : null;
}

function setSelectionRange(range, selection = window.getSelection()) {
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

function createPromptNode(text = state.promptPrefix) {
  const prompt = document.createElement("span");
  prompt.className = "first-char";
  prompt.textContent = text;
  return prompt;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setCssVar(name, value) {
  root.style.setProperty(name, value);
}

function setTextColors(value) {
  setCssVar("--terminal-text", value);
  setCssVar("--code-plain-text", value);
}

function setUserHostInputsEnabled(enabled) {
  refs.userInput.disabled = !enabled;
  refs.hostInput.disabled = !enabled;
}

function getFontVariantsForFamily(fontFamily) {
  return fontVariantsByFamily[fontFamily] || fontVariantsByFamily.default;
}

function hideFloatingTooltip() {
  if (!refs.floatingTooltip) return;
  refs.floatingTooltip.classList.remove("is-visible");
  refs.floatingTooltip.hidden = true;
}

function showFloatingTooltipForLabel(labelNode) {
  if (!refs.floatingTooltip || !labelNode) return;

  const message = labelNode.dataset.errorMessage;
  if (!message) {
    hideFloatingTooltip();
    return;
  }

  refs.floatingTooltip.textContent = message;
  refs.floatingTooltip.hidden = false;

  const gap = 8;
  const viewportPadding = 8;
  const labelRect = labelNode.getBoundingClientRect();
  const tipRect = refs.floatingTooltip.getBoundingClientRect();

  let left = labelRect.right - tipRect.width;
  left = Math.max(
    viewportPadding,
    Math.min(left, window.innerWidth - tipRect.width - viewportPadding),
  );

  let top = labelRect.bottom + gap;
  if (top + tipRect.height > window.innerHeight - viewportPadding) {
    top = labelRect.top - tipRect.height - gap;
  }
  top = Math.max(viewportPadding, top);

  refs.floatingTooltip.style.left = `${Math.round(left)}px`;
  refs.floatingTooltip.style.top = `${Math.round(top)}px`;
  refs.floatingTooltip.classList.add("is-visible");
}

function setFontStyleWarning(message = "") {
  if (!refs.fontVariantLabel) return;

  refs.fontVariantLabel.classList.toggle("is-error", Boolean(message));
  if (message) {
    refs.fontVariantLabel.setAttribute("data-error-message", message);
    refs.fontVariantLabel.setAttribute(
      "aria-label",
      `Font style warning: ${message}`,
    );
    return;
  }

  refs.fontVariantLabel.removeAttribute("data-error-message");
  refs.fontVariantLabel.removeAttribute("aria-label");
  hideFloatingTooltip();
}

function applyFontVariant(variantValue) {
  const variants = getFontVariantsForFamily(refs.fontFamilyInput.value);
  const variant =
    variants.find((item) => item.value === variantValue) || variants[0];
  if (!variant) return;

  state.fontVariant = variant.value;
  refs.fontVariantInput.value = variant.value;
  setCssVar("--terminal-font-weight", variant.weight);
  setCssVar("--terminal-font-style", variant.style);
}

function parseVariantValue(variantValue) {
  const [weightRaw, styleRaw] = String(variantValue || "").split(":");
  const weight = Number(weightRaw);
  return {
    weight: Number.isFinite(weight) ? weight : 400,
    style: styleRaw === "italic" ? "italic" : "normal",
  };
}

function findClosestVariant(variants, preferredVariant) {
  if (!variants.length) return null;

  const preferred = parseVariantValue(preferredVariant);
  const styleMatches = variants.filter(
    (variant) => variant.style === preferred.style,
  );
  const pool = styleMatches.length ? styleMatches : variants;

  let closest = pool[0];
  let smallestDistance = Math.abs(Number(pool[0].weight) - preferred.weight);

  for (const variant of pool.slice(1)) {
    const distance = Math.abs(Number(variant.weight) - preferred.weight);
    if (distance < smallestDistance) {
      closest = variant;
      smallestDistance = distance;
    }
  }

  return closest;
}

function syncFontVariantOptions(
  preferredVariant,
  { warnOnFallback = false } = {},
) {
  const variants = getFontVariantsForFamily(refs.fontFamilyInput.value);
  if (!variants.length) return;

  refs.fontVariantInput.replaceChildren();
  variants.forEach((variant) => {
    const option = document.createElement("option");
    option.value = variant.value;
    option.textContent = variant.label;
    refs.fontVariantInput.append(option);
  });

  const preferred = preferredVariant || defaults.fontVariant;
  const preferredSupported = variants.some(
    (variant) => variant.value === preferred,
  );
  const fallbackVariant = findClosestVariant(variants, preferred);
  const nextValue = preferredSupported
    ? preferred
    : fallbackVariant
      ? fallbackVariant.value
      : variants[0].value;

  applyFontVariant(nextValue);

  if (warnOnFallback && preferred && !preferredSupported) {
    const fallback =
      variants.find((variant) => variant.value === nextValue) ||
      fallbackVariant;
    const fallbackLabel = fallback ? fallback.label : "Regular";
    setFontStyleWarning(
      `Selected style is not available for this font. Switched to ${fallbackLabel}.`,
    );
    return;
  }

  setFontStyleWarning("");
}

function setAllPromptTexts(text) {
  getPromptNodes().forEach((node) => {
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
  if (!isCodeMode()) return;
  const language =
    state.codeLanguage === "auto"
      ? state.detectedCodeLanguage || "auto"
      : state.codeLanguage;
  refs.title.textContent = getLanguageLabel(language);
}

function autoExtendTerminalHeight() {
  const activeEditor = isCodeMode() ? refs.codeInput : refs.terminalContent;
  if (!activeEditor) return;

  const overflow = activeEditor.scrollHeight - activeEditor.clientHeight;
  if (overflow <= 0) return;

  const currentHeight = refs.terminal.getBoundingClientRect().height;
  const nextHeight = Math.ceil(currentHeight + overflow + 2);
  refs.terminal.style.height = `${nextHeight}px`;
  refs.heightInput.value = String(nextHeight);
}

function queueAutoExtendTerminalHeight() {
  if (autoExtendTerminalHeightFrame) return;

  autoExtendTerminalHeightFrame = window.requestAnimationFrame(() => {
    autoExtendTerminalHeightFrame = 0;
    autoExtendTerminalHeight();
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
  return isCodeMode()
    ? state.codeTitleTextVisible
    : state.terminalTitleTextVisible;
}

function setCurrentModeTitleVisibility(visible) {
  if (isCodeMode()) {
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

function syncTitleWithDefault() {
  if (state.titleUsesDefault) {
    refs.title.textContent = getDefaultTitle();
  }
}

function updateTitleUsesDefault() {
  state.titleUsesDefault = refs.title.textContent === getDefaultTitle();
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
  group.hidden = false;
  group.setAttribute("aria-hidden", String(!visible));

  if (visible) {
    // Delay class add by one frame so CSS transitions can run from collapsed state.
    window.requestAnimationFrame(() => {
      group.classList.add("is-visible");
    });
    return;
  }

  group.classList.remove("is-visible");
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

function getFirstLineState() {
  const textNode = getFirstLineTextNode();
  return {
    textNode,
    placeholderActive:
      Boolean(textNode) &&
      firstLinePlaceholders.has(
        textNode.textContent.replace(/\u00a0/g, " ").trim(),
      ),
  };
}

function detectPlaceholderActive() {
  return getFirstLineState().placeholderActive;
}

function normalizeInitialPlaceholderLine() {
  const { textNode, placeholderActive } = getFirstLineState();
  if (textNode && placeholderActive) {
    textNode.textContent = firstLinePlaceholder;
  }
}

function isPlaceholderActive() {
  return state.firstLineHasPlaceholder;
}

function setCaretAfterFirstPrompt() {
  const prompt = firstPrompt();
  if (!prompt) return;
  const sel = getActiveSelection() || window.getSelection();
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
  const sel = getActiveSelection();
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
    const sel = getActiveSelection() || window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (_) {}
}

function clearCommandWordSpans() {
  refs.terminalContent.querySelectorAll(".cmd-word").forEach((span) => {
    span.replaceWith(document.createTextNode(span.textContent));
  });
  refs.terminalContent.normalize();
}

function updateCommandWords() {
  if (!isTerminalMode()) return;

  const caret = getCaretOffset(refs.terminalContent);
  const initialPrompt = firstPrompt();

  clearCommandWordSpans();

  if (isPlaceholderActive()) {
    applyPlaceholderWordStyling();
  }

  if (state.cmdWordEnabled) {
    getPromptNodes().forEach((prompt) => {
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

function finalizeCodeRender(language) {
  state.detectedCodeLanguage = language;
  updateCodeModeTitle();
  syncCodeScroll();
  queueAutoExtendTerminalHeight();
}

function renderCodeMode() {
  if (!refs.codeOutput || !refs.codeInput) return;

  const source = refs.codeInput.value;
  refs.codeOutput.className = "code-output hljs";

  if (!source) {
    refs.codeOutput.textContent = " ";
    finalizeCodeRender("auto");
    return;
  }

  if (!window.hljs) {
    refs.codeOutput.textContent = source;
    finalizeCodeRender(state.codeLanguage);
    return;
  }

  if (state.codeLanguage === "auto") {
    const result = window.hljs.highlightAuto(source);
    refs.codeOutput.innerHTML = result.value;
    finalizeCodeRender(result.language || "plaintext");
    return;
  }

  refs.codeOutput.classList.add(`language-${state.codeLanguage}`);
  refs.codeOutput.textContent = source;
  window.hljs.highlightElement(refs.codeOutput);
  finalizeCodeRender(state.codeLanguage);
}

function applyEditorMode(mode) {
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
    updateTitleUsesDefault();
  }

  if (isCodeMode()) {
    renderCodeMode();
    refs.title.setAttribute("aria-label", "Detected code language");
    syncTextColorControls();
    syncTitleVisibilityForCurrentMode();
    return;
  }

  refs.title.setAttribute("aria-label", "Terminal title");
  syncTextColorControls();
  syncTitleVisibilityForCurrentMode();

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

function bindNumericInput(input, min, max, apply) {
  input.addEventListener("input", ({ target }) => {
    const value = clamp(Number(target.value), min, max);
    if (value) apply(value);
  });
}

function clearCurrentContent() {
  if (isCodeMode()) {
    refs.codeInput.value = "";
    renderCodeMode();
    refs.codeInput.focus();
    queueAutoExtendTerminalHeight();
    return;
  }

  refs.terminalContent.replaceChildren();
  refs.terminalContent.append(
    createPromptNode(),
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
  syncFontVariantOptions(defaults.fontVariant);
  applyWordWrap(defaults.wordWrapEnabled);

  refs.textColorInput.value = defaults.textColor;
  refs.bgColorInput.value = defaults.bgColor;
  setTextColors(defaults.textColor);
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
    setUserHostInputsEnabled(defaults.userHostEnabled);

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
    if (isCodeMode()) return;

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
      updateTitleUsesDefault();
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
  const keepPlaceholderCaret = () => {
    if (!isTerminalMode()) return;
    if (isPlaceholderActive()) setCaretAfterFirstPrompt();
  };

  refs.terminalContent.addEventListener("click", keepPlaceholderCaret);
  refs.terminalContent.addEventListener("focus", keepPlaceholderCaret);

  refs.terminalContent.addEventListener("keydown", (event) => {
    if (!isTerminalMode()) return;

    if (event.key === "Tab") {
      event.preventDefault();

      const sel = getActiveSelection();
      if (!sel) return;

      const range = sel.getRangeAt(0);
      range.deleteContents();

      const tabText = document.createTextNode("\t");
      range.insertNode(tabText);
      range.setStartAfter(tabText);
      range.collapse(true);
      setSelectionRange(range, sel);
      updateCommandWords();
      queueAutoExtendTerminalHeight();
      return;
    }

    if (event.key !== "Enter") return;
    event.preventDefault();

    const sel = getActiveSelection();
    if (!sel) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const newline = document.createTextNode("\n");
    range.insertNode(newline);
    range.setStartAfter(newline);
    range.collapse(true);

    const prompt = createPromptNode();
    range.insertNode(prompt);
    range.setStartAfter(prompt);
    range.collapse(true);
    setSelectionRange(range, sel);
    queueAutoExtendTerminalHeight();
  });

  refs.terminalContent.addEventListener("beforeinput", (event) => {
    if (!isTerminalMode()) return;

    if (
      isPlaceholderActive() &&
      ["insertText", "insertFromPaste", "insertCompositionText"].includes(
        event.inputType,
      )
    ) {
      clearFirstLinePlaceholder();
    }

    if (event.inputType !== "insertText" || !event.data) return;

    const sel = getActiveSelection();
    if (!sel) return;
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
    setSelectionRange(range, sel);
  });

  refs.terminalContent.addEventListener("input", () => {
    if (!isTerminalMode()) return;

    const sel = getActiveSelection();
    if (!sel) return;

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
        setSelectionRange(range, sel);
      } catch (_) {}
    }

    updateCommandWords();
    queueAutoExtendTerminalHeight();
  });
}

function initEditorTabs() {
  refs.modeTabs.forEach((button) => {
    button.addEventListener("click", () =>
      applyEditorMode(button.dataset.editorMode),
    );
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
  refs.codeInput.addEventListener("scroll", syncCodeScroll);
}

function initControls() {
  bindColorInput(refs.promptColorInput, "--terminal-prompt");
  bindColorInput(refs.bgColorInput, "--terminal-bg");
  bindColorInput(refs.commandColorInput, "--command-color");
  bindNumericInput(refs.widthInput, 320, 1400, (value) => {
    refs.terminal.style.width = `${value}px`;
  });
  bindNumericInput(refs.heightInput, 180, 900, (value) => {
    refs.terminal.style.height = `${value}px`;
  });
  bindNumericInput(refs.fontSizeInput, 10, 32, (value) => {
    setCssVar("--terminal-font-size", `${value}px`);
    queueAutoExtendTerminalHeight();
  });

  refs.textColorInput.addEventListener("input", (e) =>
    setTextColors(e.target.value),
  );

  refs.fontFamilyInput.addEventListener("change", (event) => {
    const previousVariant = state.fontVariant;
    setCssVar("--terminal-font-family", event.target.value);
    syncFontVariantOptions(previousVariant, { warnOnFallback: true });
    queueAutoExtendTerminalHeight();
  });

  refs.fontVariantInput.addEventListener("change", (e) => {
    applyFontVariant(e.target.value);
    setFontStyleWarning("");
    queueAutoExtendTerminalHeight();
  });
  refs.wordWrapInput.addEventListener("change", (e) =>
    applyWordWrap(e.target.checked),
  );
  refs.titleTextVisibleInput.addEventListener("change", (e) =>
    setCurrentModeTitleVisibility(e.target.checked),
  );
  refs.promptStyleInput.addEventListener("change", (e) =>
    e.target.value === "custom"
      ? enterCustomPromptMode()
      : syncPromptWithSelectedOption(),
  );

  refs.promptStyleCustomInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      refs.promptStyleCustomInput.value = state.customPrompt;
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      refs.promptStyleCustomInput.blur();
    }
  });
  refs.promptStyleCustomInput.addEventListener("blur", () =>
    exitCustomPromptMode(true),
  );

  refs.userHostEnabledInput.addEventListener("change", (e) => {
    setUserHostFieldVisibility(e.target.checked);
    setUserHostInputsEnabled(e.target.checked);
    syncUserHostBindings();
  });

  [refs.userInput, refs.hostInput].forEach((el) =>
    el.addEventListener("input", syncUserHostBindings),
  );

  refs.cmdWordInput.addEventListener("change", (e) => {
    state.cmdWordEnabled = e.target.checked;
    refs.commandColorInput.disabled = !state.cmdWordEnabled;
    updateCommandWords();
  });
  refs.codeLanguageInput.addEventListener("change", (e) => {
    state.codeLanguage = e.target.value;
    renderCodeMode();
  });
  refs.codeThemeInput.addEventListener("change", (e) =>
    applyCodeTheme(e.target.value),
  );
  refs.codeTextColorEnabledInput.addEventListener("change", (e) => {
    state.codeTextColorEnabled = e.target.checked;
    syncTextColorControls();
  });

  const showFontVariantTooltip = () => {
    if (!refs.fontVariantLabel?.classList.contains("is-error")) return;
    showFloatingTooltipForLabel(refs.fontVariantLabel);
  };
  ["mouseenter", "mousemove"].forEach((ev) =>
    refs.fontVariantLabel?.addEventListener(ev, showFontVariantTooltip),
  );
  refs.fontVariantLabel?.addEventListener("mouseleave", hideFloatingTooltip);

  refs.resetButton.addEventListener("click", resetControls);
  refs.clearButton.addEventListener("click", clearCurrentContent);
}

function setInlineStyles(node, styles) {
  Object.entries(styles).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    node.style[key] = value;
  });
}

function isTransparentColor(value) {
  return (
    !value ||
    value === "transparent" ||
    value === "rgba(0, 0, 0, 0)" ||
    value === "rgba(0, 0, 0, 0.0)"
  );
}

function getSnapshotDimensions() {
  const { width, height } = refs.terminal.getBoundingClientRect();
  return {
    width: `${Math.round(width)}px`,
    height: `${Math.round(height)}px`,
  };
}

function appendSanitizedTerminalNode(sourceNode, targetParent) {
  if (sourceNode.nodeType === Node.TEXT_NODE) {
    targetParent.append(document.createTextNode(sourceNode.textContent || ""));
    return;
  }

  if (sourceNode.nodeType !== Node.ELEMENT_NODE) return;

  const tagName = sourceNode.tagName.toLowerCase();
  if (tagName === "br") {
    targetParent.append(document.createTextNode("\n"));
    return;
  }

  const classList = sourceNode.classList;
  if (tagName === "span" && classList.contains("first-char")) {
    const prompt = document.createElement("span");
    prompt.textContent = sourceNode.textContent || "";
    setInlineStyles(prompt, { color: getComputedStyle(sourceNode).color });
    targetParent.append(prompt);
    return;
  }

  if (tagName === "span" && classList.contains("cmd-word")) {
    const commandWord = document.createElement("span");
    commandWord.textContent = sourceNode.textContent || "";
    setInlineStyles(commandWord, { color: getComputedStyle(sourceNode).color });
    targetParent.append(commandWord);
    return;
  }

  [...sourceNode.childNodes].forEach((child) =>
    appendSanitizedTerminalNode(child, targetParent),
  );
}

function cloneCodeNodeWithInlineStyles(sourceNode, inheritedStyles = {}) {
  if (sourceNode.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(sourceNode.textContent || "");
  }

  if (sourceNode.nodeType !== Node.ELEMENT_NODE) {
    return document.createTextNode("");
  }

  const clone = document.createElement(sourceNode.tagName.toLowerCase());
  const computed = getComputedStyle(sourceNode);
  const nextInherited = { ...inheritedStyles };

  snapshotTextStyleProps.forEach((prop) => {
    const value = computed[prop];
    const previous = inheritedStyles[prop];

    if (prop === "backgroundColor" && isTransparentColor(value)) {
      nextInherited[prop] = value;
      return;
    }

    if (value && value !== previous) {
      if (prop === "textDecorationLine") {
        clone.style.textDecoration = value;
      } else {
        clone.style[prop] = value;
      }
    }

    nextInherited[prop] = value;
  });

  [...sourceNode.childNodes].forEach((child) => {
    clone.append(cloneCodeNodeWithInlineStyles(child, nextInherited));
  });

  return clone;
}

function buildTerminalSnapshotHtml() {
  const terminalStyle = getComputedStyle(refs.terminal);
  const titlebar = refs.terminal.querySelector(".titlebar");
  const terminalMain = refs.terminal.querySelector(".terminal-main");
  const titlebarStyle = titlebar ? getComputedStyle(titlebar) : null;
  const titleStyle = getComputedStyle(refs.title);
  const terminalContentStyle = getComputedStyle(refs.terminalContent);
  const codeContent = refs.codeLayer?.querySelector(".code-content");
  const codeContentStyle = codeContent
    ? getComputedStyle(codeContent)
    : terminalContentStyle;
  const { width, height } = getSnapshotDimensions();

  const snapshot = document.createElement("div");
  setInlineStyles(snapshot, {
    width,
    height,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: terminalStyle.borderRadius,
    background: terminalStyle.backgroundColor,
    color: terminalStyle.color,
    fontFamily: terminalContentStyle.fontFamily,
    boxShadow: terminalStyle.boxShadow,
  });

  const titlebarNode = document.createElement("div");
  setInlineStyles(titlebarNode, {
    display: "flex",
    alignItems: "center",
    gap: titlebarStyle?.gap || "8px",
    padding: titlebarStyle?.padding || "12px",
    background: titlebarStyle?.backgroundColor || "#2d2d2d",
    borderTopLeftRadius: terminalStyle.borderTopLeftRadius,
    borderTopRightRadius: terminalStyle.borderTopRightRadius,
  });

  ["#ff5f57", "#fdbc2e", "#28c840"].forEach((color) => {
    const dot = document.createElement("span");
    setInlineStyles(dot, {
      display: "inline-block",
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background: color,
    });
    titlebarNode.append(dot);
  });

  const titleNode = document.createElement("span");
  titleNode.textContent = refs.title.textContent;
  setInlineStyles(titleNode, {
    display: "inline-block",
    minWidth: "140px",
    marginLeft: "8px",
    height: "12px",
    color: titleStyle.color,
    lineHeight: "1",
    visibility: getCurrentModeTitleVisibility() ? "visible" : "hidden",
  });
  titlebarNode.append(titleNode);

  const main = document.createElement("div");
  setInlineStyles(main, {
    position: "relative",
    flex: "1",
    padding: getComputedStyle(terminalMain).padding,
  });

  if (isTerminalMode()) {
    const terminalPre = document.createElement("pre");
    setInlineStyles(terminalPre, {
      position: "absolute",
      inset: "0",
      margin: terminalContentStyle.margin,
      padding: terminalContentStyle.padding,
      whiteSpace: state.wordWrapEnabled ? "pre-wrap" : "pre",
      overflowWrap: state.wordWrapEnabled ? "anywhere" : "normal",
      overflow: "auto",
      outline: "none",
      color: terminalContentStyle.color,
      fontFamily: terminalContentStyle.fontFamily,
      fontSize: terminalContentStyle.fontSize,
      fontWeight: terminalContentStyle.fontWeight,
      fontStyle: terminalContentStyle.fontStyle,
      lineHeight: terminalContentStyle.lineHeight,
      tabSize: terminalContentStyle.tabSize,
      boxSizing: "border-box",
    });

    [...refs.terminalContent.childNodes].forEach((child) =>
      appendSanitizedTerminalNode(child, terminalPre),
    );
    main.append(terminalPre);
  } else {
    const codePre = document.createElement("pre");
    setInlineStyles(codePre, {
      position: "absolute",
      inset: "0",
      margin: codeContentStyle.margin,
      padding: codeContentStyle.padding,
      whiteSpace: state.wordWrapEnabled ? "pre-wrap" : "pre",
      overflowWrap: state.wordWrapEnabled ? "anywhere" : "normal",
      overflow: "auto",
      color: codeContentStyle.color,
      fontFamily: codeContentStyle.fontFamily,
      fontSize: codeContentStyle.fontSize,
      fontWeight: codeContentStyle.fontWeight,
      fontStyle: codeContentStyle.fontStyle,
      lineHeight: codeContentStyle.lineHeight,
      tabSize: codeContentStyle.tabSize,
      boxSizing: "border-box",
    });

    const codeRoot = cloneCodeNodeWithInlineStyles(refs.codeOutput, {
      color: codeContentStyle.color,
      fontWeight: codeContentStyle.fontWeight,
      fontStyle: codeContentStyle.fontStyle,
      textDecorationLine: "none",
      backgroundColor: codeContentStyle.backgroundColor,
      opacity: codeContentStyle.opacity,
    });
    setInlineStyles(codeRoot, {
      display: "block",
      minHeight: "100%",
      margin: "0",
    });
    codePre.append(codeRoot);
    main.append(codePre);
  }

  snapshot.append(titlebarNode, main);
  return snapshot.outerHTML;
}

async function copyTextToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_) {}
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "true");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  input.style.opacity = "0";
  document.body.append(input);

  input.focus();
  input.select();
  input.setSelectionRange(0, input.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (_) {
    copied = false;
  }

  input.remove();
  return copied;
}

function initCopyHtmlButton() {
  if (!refs.copyHtmlButton || !refs.copyHtmlLabel) return;

  const defaultLabel = " Copy Terminal HTML";

  refs.copyHtmlButton.addEventListener("click", async () => {
    refs.copyHtmlButton.disabled = true;
    refs.copyHtmlLabel.textContent = " Copying...";

    try {
      const snapshotHtml = buildTerminalSnapshotHtml();
      const copied = await copyTextToClipboard(snapshotHtml);

      refs.copyHtmlLabel.textContent = copied ? " Copied!" : " Copy failed";
      if (!copied) {
        window.alert(
          "Could not copy HTML to clipboard. Your browser may be blocking clipboard access.",
        );
      }
    } finally {
      window.setTimeout(() => {
        refs.copyHtmlButton.disabled = false;
        refs.copyHtmlLabel.textContent = defaultLabel;
      }, 1400);
    }
  });
}

function initSaveButton() {
  if (refs.exportActions) {
    refs.exportActions.style.minWidth = `${refs.exportActions.offsetWidth}px`;
  }

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

      refs.saveLabel.textContent = " Saved!";
    } finally {
      window.setTimeout(() => {
        refs.saveButton.disabled = false;
        refs.saveLabel.textContent = " Save Terminal Image";
      }, 1400);
    }
  });
}

function initModeToggle() {
  applyMode("system");
  refs.modeToggle.addEventListener("click", () => {
    applyMode(
      modeOrder[
        (modeOrder.indexOf(refs.modeToggle.dataset.mode || "system") + 1) %
          modeOrder.length
      ],
    );
  });
}

function init() {
  initModeToggle();
  normalizeInitialPlaceholderLine();
  state.firstLineHasPlaceholder = detectPlaceholderActive();
  setCssVar("--command-color", refs.commandColorInput.value);
  setTextColors(refs.textColorInput.value);
  setCssVar("--terminal-font-family", refs.fontFamilyInput.value);
  syncFontVariantOptions(defaults.fontVariant);
  applyWordWrap(refs.wordWrapInput.checked);
  refs.codeLanguageInput.value = state.codeLanguage;
  applyCodeTheme(defaults.codeTheme);
  refs.codeInput.value = defaults.codeSnippet;
  state.terminalTitle = refs.title.textContent;
  setUserHostFieldVisibility(refs.userHostEnabledInput.checked);
  setUserHostInputsEnabled(refs.userHostEnabledInput.checked);
  syncUserHostBindings();
  initEditorTabs();
  initTerminalInput();
  initCodeInput();
  initControls();
  initTitleEditing();
  initSaveButton();
  initCopyHtmlButton();
  applyEditorMode(state.editorMode);
  syncTextColorControls();
  syncTitleVisibilityForCurrentMode();
  renderCodeMode();
  updateCommandWords();
  queueAutoExtendTerminalHeight();
}

init();
