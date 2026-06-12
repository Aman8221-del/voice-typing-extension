import React from "react";

const LanguageSelector = ({ language, onChange }) => {
  return (
    <div>
      <select
        style={{
          // width: "160px",
          height: "30px",
          padding: "0 10px",
          boxSizing: "border-box",
          borderRadius:"5px"
        }}
        value={language}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="en-US">English</option>
        <option value="hi-IN">Hindi</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
