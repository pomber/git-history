import netlify from "netlify-auth-providers";
import { Base64 } from "js-base64";
const TOKEN_KEY = "gitlab-token";

function getHeaders() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  return token ? { "PRIVATE-TOKEN": `${token}` } : {};
}

function isLoggedIn() {
  return !!window.localStorage.getItem(TOKEN_KEY);
}

// async function getContent(repo, sha, path) {
//   const contentResponse = await fetch(
//     `https://gitlab.com/api/v4/projects/${encodeURIComponent(
//       repo
//     )}/repository/commits?path=${encodeURIComponent(path)}&ref_name=${sha}`,
//     { headers: getHeaders() }
//   );

//   if (!contentResponse.ok) {
//     throw contentResponse;
//   }
//   const contentJson = await contentResponse.json();
//   const content = Base64.decode(contentJson.content);
//   return { content, url: contentJson.html_url };
// }

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
    const commitsResponse = await fetch(
      `https://gitlab.com/api/v4/projects/${encodeURIComponent(
        repo
      )}/repository/commits?path=${encodeURIComponent(path)}&ref_name=${sha}`,
      { headers: getHeaders() }
    );
    if (!commitsResponse.ok) {
      throw commitsResponse;
    }
    const commitsJson = await commitsResponse.json();

    cache[path] = commitsJson.map(commit => ({
      sha: commit.id,
      date: new Date(commit.authored_date),
      author: {
        login: commit.author_name
      },
      // commitUrl: commit.html_url,
      message: commit.title,
      content: "foo"
    }));
  }

  const commits = cache[path].slice(0, last);

  // await Promise.all(
  //   commits.map(async commit => {
  //     if (!commit.content) {
  //       const info = await getContent(repo, commit.sha, path);
  //       commit.content = info.content;
  //       commit.fileUrl = info.url;
  //     }
  //   })
  // );

  return commits;
}

function logIn() {
  // return new Promise((resolve, reject) => {
  var authenticator = new netlify({
    site_id: "ccf3a0e2-ac06-4f37-9b17-df1dd41fb1a6"
  });
  authenticator.authenticate({ provider: "gitlab", scope: "api" }, function(
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
