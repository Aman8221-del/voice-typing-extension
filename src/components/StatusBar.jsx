import React from "react";

const StatusBar = ({listening}) => {
  return <div>Status: {listening ? "🎤 Listening..." : "■ Idle"}</div>;
};

export default StatusBar;
