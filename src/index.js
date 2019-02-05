import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { getHistory } from "./github";

function getParams() {
  const [
    ,
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

  root.innerHTML = `Loading <strong>${repo}</strong> <strong>${path}</strong> history...`;

  getHistory(repo, sha, path)
    .then(commits => {
      ReactDOM.render(<App commits={commits} />, root);
    })
    .catch(error => {
      if (error.status === 403) {
        root.innerText =
          "GitHub API rate limit exceeded for your IP (60 requests per hour). I need to add authentication.";
      } else {
        console.error(error);
        root.innerText = `Unexpected error. Check the console.`;
      }
    });
}
