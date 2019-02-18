import netlify from "netlify-auth-providers";
import { Base64 } from "js-base64";
const TOKEN_KEY = "github-token";

function getHeaders() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `bearer ${token}` } : {};
}

function isLoggedIn() {
  return !!window.localStorage.getItem(TOKEN_KEY);
}

async function getContent(repo, sha, path) {
  const contentResponse = await fetch(
    `https://api.github.com/repos/${repo}/contents${path}?ref=${sha}`,
    { headers: getHeaders() }
  );

  if (!contentResponse.ok) {
    throw contentResponse;
  }
  const contentJson = await contentResponse.json();
  const content = Base64.decode(contentJson.content);
  return { content, url: contentJson.html_url };
}

function getUrlParams() {
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

function getPath() {
  const [, , path] = getUrlParams();
  return path;
}

function showLanding() {
  const [repo, ,] = getUrlParams();
  return !repo;
}

async function getCommits(last = 10) {
  const [repo, sha, path] = getUrlParams();
  const commitsResponse = await fetch(
    `https://api.github.com/repos/${repo}/commits?sha=${sha}&path=${path}`,
    { headers: getHeaders() }
  );
  if (!commitsResponse.ok) {
    throw commitsResponse;
  }
  const commitsJson = await commitsResponse.json();

  const commits = commitsJson.slice(0, last).map(commit => ({
    sha: commit.sha,
    date: new Date(commit.commit.author.date),
    author: {
      login: commit.author ? commit.author.login : commit.commit.author.name,
      avatar: commit.author
        ? commit.author.avatar_url
        : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    },
    commitUrl: commit.html_url,
    message: commit.commit.message
  }));

  await Promise.all(
    commits.map(async commit => {
      const info = await getContent(repo, commit.sha, path);
      commit.content = info.content;
      commit.fileUrl = info.url;
    })
  );

  return commits;
}

function logIn() {
  // return new Promise((resolve, reject) => {
  var authenticator = new netlify({
    site_id: "ccf3a0e2-ac06-4f37-9b17-df1dd41fb1a6"
  });
  authenticator.authenticate({ provider: "github", scope: "repo" }, function(
    err,
    data
  ) {
    if (err) {
      console.error(err);
      return;
    }
    window.localStorage.setItem(TOKEN_KEY, data.token);
    window.location.reload(false);
  });
  // });
}

export default {
  showLanding,
  getPath,
  getCommits,
  logIn,
  isLoggedIn
};
