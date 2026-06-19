import React from "react";

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.93 9h-3.09a15.7 15.7 0 0 0-1.39-5A8.03 8.03 0 0 1 18.93 11ZM12 4.07A13.64 13.64 0 0 1 13.82 11h-3.64A13.64 13.64 0 0 1 12 4.07ZM4.07 13h3.09a15.7 15.7 0 0 0 1.39 5A8.03 8.03 0 0 1 4.07 13Zm3.09-2H4.07a8.03 8.03 0 0 1 4.48-5 15.7 15.7 0 0 0-1.39 5ZM12 19.93A13.64 13.64 0 0 1 10.18 13h3.64A13.64 13.64 0 0 1 12 19.93Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

const LanguageSelector = ({ language, onChange }) => {
  return (
    <div className="settings-block">
      <h3>Language</h3>
      <p>Choose your preferred language</p>

      <label className="language-select">
        <div className="language-select__left">
          <GlobeIcon />
          <span>
            {language === "hi-IN"
              ? "Hindi (India)"
              : "English (India)"}
          </span>
        </div>

        <select
          value={language}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="en-US">English (India)</option>
          <option value="hi-IN">Hindi (India)</option>
        </select>
      </label>
    </div>
  );
};

export default LanguageSelector;