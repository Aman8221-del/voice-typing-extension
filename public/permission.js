const statusEl = document.getElementById("status");

document.getElementById("request").addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    statusEl.textContent = "✓ Microphone access granted. You can close this tab.";
    statusEl.style.color = "green";
  } catch (err) {
    statusEl.textContent =
      "✗ Access denied. Enable the microphone for this extension in your browser's site settings.";
    statusEl.style.color = "red";
    console.error(err);
  }
});
