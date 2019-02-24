import netlify from "netlify-auth-providers";
import React from "react";
const TOKEN_KEY = "bitbucket-token";

function getHeaders() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function isLoggedIn() {
  return !!window.localStorage.getItem(TOKEN_KEY);
}

async function getContent(repo, sha, path) {
  const contentResponse = await fetch(
    `https://api.bitbucket.org/2.0/repositories/${repo}/src/${sha}/${path}`,
    { headers: getHeaders() }
  );

  if (contentResponse.status === 404) {
    return { content: "" };
  }

  if (!contentResponse.ok) {
    throw contentResponse;
  }

  const content = await contentResponse.text();

  return { content };
}

function getUrlParams() {
  const [, owner, reponame, , sha, ...paths] = window.location.pathname.split(
    "/"
  );

  if (!sha) {
    return [];
  }

  return [owner + "/" + reponame, sha, paths.join("/")];
}

function getPath() {
  const [, , path] = getUrlParams();
  return path;
}

function showLanding() {
  const [repo, ,] = getUrlParams();
  return !repo;
}

const cache = {};

async function getCommits(path, last) {
  const [repo, sha] = getUrlParams();

  if (!cache[path]) {
    let fields =
      "values.path,values.commit.date,values.commit.message,values.commit.hash,values.commit.author.*,values.commit.links.html, values.commit.author.user.nickname, values.commit.author.user.links.avatar.href, values.commit.links.html.href";
    // fields = "*.*.*.*.*";
    const commitsResponse = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${repo}/filehistory/${sha}/${path}?fields=${fields}`,
      { headers: getHeaders() }
    );
    if (!commitsResponse.ok) {
      throw commitsResponse;
    }
    const commitsJson = await commitsResponse.json();

    cache[path] = commitsJson.values.map(({ commit }) => ({
      sha: commit.hash,
      date: new Date(commit.date),
      author: {
        login: commit.author.user
          ? commit.author.user.nickname
          : commit.author.raw,
        avatar: commit.author.user && commit.author.user.links.avatar.href
      },
      commitUrl: commit.links.html.href,
      message: commit.message
    }));
  }

  const commits = cache[path].slice(0, last);

  await Promise.all(
    commits.map(async commit => {
      if (!commit.content) {
        const info = await getContent(repo, commit.sha, path);
        commit.content = info.content;
      }
    })
  );

  return commits;
}

function logIn() {
  // return new Promise((resolve, reject) => {
  var authenticator = new netlify({
    site_id: "ccf3a0e2-ac06-4f37-9b17-df1dd41fb1a6"
  });
  authenticator.authenticate({ provider: "bitbucket" }, function(err, data) {
    if (err) {
      console.error(err);
      return;
    }
    window.localStorage.setItem(TOKEN_KEY, data.token);
    window.location.reload(false);
  });
  // });
}

function LogInButton() {
  return (
    <button
      onClick={logIn}
      style={{ fontWeight: 600, padding: "0.5em 0.7em", cursor: "pointer" }}
    >
      <div>Sign in with Bitbucket</div>
    </button>
  );
}

export default {
  showLanding,
  getPath,
  getCommits,
  logIn,
  isLoggedIn,
  LogInButton
};
