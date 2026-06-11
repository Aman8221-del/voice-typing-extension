chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "insertText") {
    const activeElement = document.activeElement;

    if (
      activeElement &&
      (activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "INPUT")
    ) {
      activeElement.value += message.text;
      activeElement.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }
});
