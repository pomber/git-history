import React from "react";
import ReactDOM from "react-dom";
import History from "./history";

function App({ commits, language }) {
  return <History commits={commits} language={language} />;
}

export function render(commits, root, lang) {
  ReactDOM.render(<App commits={commits} language={lang} />, root);
}
