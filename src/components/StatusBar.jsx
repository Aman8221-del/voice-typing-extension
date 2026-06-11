import React from "react";

const StatusBar = ({listening}) => {
  return <div>Status:{listening ? "🎤 Listening..." : "■ Idel"}</div>;
};

export default StatusBar;
