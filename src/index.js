import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { getHistory } from "./github";

const repo = "pomber/didact";
const sha = "master";
const path = "/src/element.js";

getHistory(repo, sha, path).then(commits => {
  ReactDOM.render(<App commits={commits} />, document.getElementById("root"));
});
