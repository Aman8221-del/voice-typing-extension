import React from "react";

const StatusBar = ({listening}) => {
  return <div style={{padding:"5px"}}>Status: {listening ? "🎤 Listening..." : "■ Idle"}</div>;
};

export default StatusBar;
