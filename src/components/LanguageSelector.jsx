import React from "react";

const LanguageSelector = ({language, onChange}) => {
  return (
    <div>
      <select value={language} onChange={(e) => onChange(e.target.value)}>
        <option value="en-US">English</option>
        <option value="hi-IN">Hindi</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
