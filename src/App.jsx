import React, { useEffect, useRef, useState } from "react";

// import VoiceControls from "./components/VoiceControls";
import LanguageSelector from "./components/LanguageSelector";
import StatusBar from "./components/StatusBar";

const App = () => {
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [transcript, setTransscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-us";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTransscript(text);
    };
    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTransscript("")
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      chrome.tabs.query({ active: true, currentwindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "insertText",
          text: transcript,
        });
      });
    }
  };

  return (
    <div style={{ padding: "20px", width: "350px" }}>
      <h2>Voice Typing Extension</h2>
      <LanguageSelector language={language} onChange={setLanguage} />

      <button onClick={listening ? stopListening : startListening}>
        {listening ? "stop Recording" : "start Recording"}
      </button>
      <StatusBar listening={listening} />

      <textarea
        value={transcript}
        readOnly
        rows={8}
        style={{ widht: "100%" }}
      />
    </div>
  );
};

export default App;
