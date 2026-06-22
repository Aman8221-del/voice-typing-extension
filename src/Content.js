// Tracks the field the user last focused so text can be inserted even after
// the popup steals focus from the page.
let lastFocusedField = null;
console.log("CONTENT SCRIPT LOADED");
const TEXT_INPUT_TYPES = new Set([
  "text",
  "search",
  "email",
  "url",
  "tel",
  "number",
  "password",
]);

function isEditable(el) {
  if (!el) return false;
  if (el.isContentEditable) return true;
  if (el.tagName === "TEXTAREA") return !el.disabled && !el.readOnly;
  if (el.tagName === "INPUT") {
    const type = (el.getAttribute("type") || "text").toLowerCase();
    return TEXT_INPUT_TYPES.has(type) && !el.disabled && !el.readOnly;
  }
  return false;
}

document.addEventListener(
  "focusin",
  (e) => {
    if (isEditable(e.target)) lastFocusedField = e.target;
  },
  true,
);

// Sets the value through the native setter so frameworks with controlled
// inputs (React, Vue) see the change instead of ignoring it.
function setNativeValue(el, value) {
  const proto =
    el.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
  setter.call(el, value);
}

function insertText(text) {
  const target = isEditable(document.activeElement)
    ? document.activeElement
    : lastFocusedField;

  if (!target || !target.isConnected) return false;

  target.focus();

  if (target.isContentEditable) {
    document.execCommand("insertText", false, text);
    return true;
  }

  // Insert at the cursor (or replace the selection) instead of always appending.
  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? target.value.length;
  const newValue = text;

  setNativeValue(target, newValue);

  const caret = text.length;
  try {
    target.setSelectionRange(caret, caret);
  } catch {
    // Some input types (e.g. number) don't support selection ranges.
  }

  target.dispatchEvent(new Event("input", { bubbles: true }));
  target.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("MESSAGE RECEIVED", message);

  if (message.action === "insertText" || message.action === "liveTranscript") {
    const inserted = insertText(message.text);
    sendResponse({ inserted });
  }

  return true;
});
