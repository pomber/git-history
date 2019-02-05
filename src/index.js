import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { getHistory } from "./github";

// const repo = "pomber/didact";
// const sha = "master";
// const path = "/src/element.js";

function getParams() {
  const [
    _,
    owner,
    reponame,
    action,
    sha,
    ...paths
  ] = window.location.pathname.split("/");

  if (action !== "commits") {
    return [];
  }

  return [owner + "/" + reponame, sha, "/" + paths.join("/")];
}

const [repo, sha, path] = getParams();

const root = document.getElementById("root");
if (!repo) {
  // show docs
  root.innerText = `URL should be something like https://github-history.netlify.com/user/repo/commits/master/path/to/file.js `;
} else {
  // show loading

  root.innerText = `Loading ${repo} ${path} history...`;

  getHistory(repo, sha, path).then(commits => {
    ReactDOM.render(<App commits={commits} />, root);
  });
}
