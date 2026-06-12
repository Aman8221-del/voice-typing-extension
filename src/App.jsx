import React, { useEffect, useRef, useState } from "react";

import LanguageSelector from "./components/LanguageSelector";
import StatusBar from "./components/StatusBar";

const App = () => {
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      transcriptRef.current = text;
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed") {
        setStatus("Microphone blocked. Opening permission page...");
        chrome.tabs.create({ url: chrome.runtime.getURL("permission.html") });
      } else if (event.error !== "aborted") {
        setStatus(`Speech error: ${event.error}`);
      }
    };

    // Fires both when the user clicks stop and when recognition times out on
    // silence — insert here so late-arriving final results are included.
    recognition.onend = () => {
      setListening(false);
      const text = transcriptRef.current.trim();
      if (!text) return;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) return;
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "insertText", text },
          (response) => {
            if (chrome.runtime.lastError) {
              setStatus(
                "Couldn't reach this page. Reload the tab and try again."
              );
            } else if (response?.inserted) {
              setStatus("Text inserted ✓");
            } else {
              setStatus(
                "No field selected. Click a form field on the page first."
              );
            }
          }
        );
      });
    };

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    transcriptRef.current = "";
    setTranscript("");
    setStatus("");
    recognitionRef.current.lang = language;
    recognitionRef.current.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div style={{ padding: "20px", width: "350px" }}>
      <h2>Voice Form Filler</h2>
      <p style={{ fontSize: "12px", color: "#666" }}>
        Click the form field on the page, then start recording. Text is
        inserted when you stop.
      </p>
      <LanguageSelector language={language} onChange={setLanguage} />

      <button onClick={listening ? stopListening : startListening}>
        {listening ? "Stop Recording" : "Start Recording"}
      </button>
      <StatusBar listening={listening} />

      <textarea
        value={transcript}
        readOnly
        rows={8}
        style={{ width: "100%" }}
        placeholder="Your speech will appear here..."
      />
      {status && <div style={{ fontSize: "12px" }}>{status}</div>}
    </div>
  );
};

export default App;
