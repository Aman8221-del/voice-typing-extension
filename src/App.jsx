import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import LanguageSelector from "./components/LanguageSelector";
import StatusBar from "./components/StatusBar";

const App = () => {
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const [screen, setScreen] = useState("home");

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
      const text = event.results[event.results.length - 1][0].transcript;

      setTranscript(text);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) return;

        chrome.tabs.sendMessage(tabs[0].id, {
          action: "liveTranscript",
          text: text.trim(),
        });
      });
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

  //////////////////////////////

  function GearIcon() {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.14 12.94a7.43 7.43 0 0 0 .05-.94 7.43 7.43 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.08 7.08 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.49-.42H10.1a.5.5 0 0 0-.49.42l-.36 2.54a7.08 7.08 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.43 7.43 0 0 0-.05.94 7.43 7.43 0 0 0 .05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.39 1.05.71 1.63.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.58-.23 1.13-.55 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64Zm-7.14 2.06A3 3 0 1 1 12 9a3 3 0 0 1 0 6Z" />
      </svg>
    );
  }

  function ArrowLeftIcon() {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M15.5 19.5 8 12l7.5-7.5" />
      </svg>
    );
  }

  function CloseIcon() {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    );
  }

  function MicGlyph() {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-4a3.5 3.5 0 1 0-7 0v4A3.5 3.5 0 0 0 12 15Zm6-3.5a1 1 0 0 0-2 0 4 4 0 0 1-8 0 1 1 0 0 0-2 0 6 6 0 0 0 5 5.91V20H9.5a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2H13v-2.59A6 6 0 0 0 18 11.5Z" />
      </svg>
    );
  }

  //////////////////////////

  if (screen === "settings") {
    return (
      <div className="app-shell">
        <div className="surface-card settings-surface">
          <div className="settings-header">
            <button className="icon-button" onClick={() => setScreen("home")}>
              <ArrowLeftIcon />
            </button>

            <h2 className="settings-title">Settings</h2>

            <button className="icon-button" onClick={() => setScreen("home")}>
              <CloseIcon />
            </button>
          </div>

          <div className="settings-body">
            <LanguageSelector language={language} onChange={setLanguage} />
          </div>

          <div className="settings-footer">
            <strong>Voice Form Filler</strong>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="surface-card">
        <div className="main-header">
          <div className="brand-icon">
            <svg viewBox="0 0 32 32">
              <path
                d="M10 12v8M14 8v16M18 5v22M22 10v12"
                fill="none"
                stroke="white"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2>Voice Form Filler</h2>

          <button className="icon-button" onClick={() => setScreen("settings")}>
            <GearIcon />
          </button>
        </div>
        <p className="subtitle">Click a form field and start speaking.</p>

        {/* <div className="lang-row">
          <LanguageSelector language={language} onChange={setLanguage} />
        </div> */}

        <div className="mic-stage">
          <button
            className={`voice-toggle ${listening ? "listening" : "idle"}`}
            onClick={listening ? stopListening : startListening}
          >
            <span className="voice-toggle__status">
              <span
                className={`voice-toggle__dot ${listening ? "on" : "off"}`}
              />
              <span>{listening ? "Mic is ON" : "Mic is OFF"}</span>
            </span>

            <span className="voice-toggle__main">
              <MicGlyph />
              <strong>
                {listening ? "Stop Listening" : "Start Listening"}
              </strong>
            </span>

            <span className="voice-toggle__hint">
              {listening
                ? "Click to turn the mic off."
                : "Click to turn the mic on."}
            </span>
          </button>
        </div>

        <StatusBar listening={listening} />

        <div className="result-card neutral-card">
          <div className="result-card__content">
            <div className="result-card__icon neutral">i</div>
            <div>
              <strong>Transcript</strong>
              <p>{transcript || "Your speech will appear here..."}</p>
            </div>
          </div>
        </div>

        {status && <div className="status-card">{status}</div>}
      </div>
    </div>
  );
};

export default App;
