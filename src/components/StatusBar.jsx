import React from "react";

const StatusBar = ({ listening }) => {
  return (
    <div className="status-summary">
      <span
        className={`status-badge ${
          listening ? "live" : "neutral"
        }`}
      >
        {listening ? "Listening" : "Idle"}
      </span>
    </div>
  );
};

export default StatusBar;