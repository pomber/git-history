import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const repo = "pomber/didact";
const sha = "master";
const path = "/src/element.js";

async function getContent(repo, sha, path) {
  const contentResponse = await fetch(
    `https://api.github.com/repos/${repo}/contents${path}?ref=${sha}`
  );
  const contentJson = await contentResponse.json();
  const content = window.atob(contentJson.content);
  // console.log(content);
  return content;
}

async function getHistory(repo, sha, path, top = 10) {
  const commitsResponse = await fetch(
    `https://api.github.com/repos/${repo}/commits?sha=${sha}&path=${path}`
  );
  const commitsJson = await commitsResponse.json();
  const commits = commitsJson.map(commit => ({
    sha: commit.sha,
    author: {
      // or commiter?
      login: commit.author.login,
      avatar: commit.author.avatar_url
    },
    url: commit.html_url,
    message: commit.commit.message
  }));

  await Promise.all(
    commits.slice(0, top).map(async commit => {
      commit.content = await getContent(repo, commit.sha, path);
    })
  );

  return commits;
}

getHistory(repo, sha, path).then(console.log);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
