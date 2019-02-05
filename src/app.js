import React from "react";
import ReactDOM from "react-dom";
import History from "./history";

function App({ commits }) {
  return <History commits={commits} />;
}

export function render(commits, root) {
  ReactDOM.render(<App commits={commits} />, root);
}
