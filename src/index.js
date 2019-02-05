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

  if (action !== "commits" && action !== "blob") {
    return [];
  }

  return [owner + "/" + reponame, sha, "/" + paths.join("/")];
}

const [repo, sha, path] = getParams();

const root = document.getElementById("root");
const message = document.getElementById("message");
if (!repo) {
  // show docs
  message.innerHTML = `<p>URL should be something like https://github-history.netlify.com/user/repo/commits/master/path/to/file.js</p>`;
} else {
  // show loading

  message.innerHTML = `<p>Loading <strong>${repo}</strong> <strong>${path}</strong> history...</p>`;
  document.title = `GitHub History - ${path.split("/").pop()}`;

  getHistory(repo, sha, path)
    .then(commits => {
      ReactDOM.render(<App commits={commits} />, root);
    })
    .catch(error => {
      if (error.status === 403) {
        message.innerHTML =
          "<p>GitHub API rate limit exceeded for your IP (60 requests per hour).</p><p>I need to add authentication.</p>";
      } else {
        console.error(error);
        message.innerHTML = `<p>Unexpected error. Check the console.</p>`;
      }
    });
}
