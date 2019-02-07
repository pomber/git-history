import netlify from "netlify-auth-providers";
const TOKEN_KEY = "github-token";

function getHeaders() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `bearer ${token}` } : {};
}

export function isLoggedIn() {
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
  const content = window.atob(contentJson.content);
  return { content, url: contentJson.html_url };
}

export async function getHistory(repo, sha, path, top = 10) {
  const commitsResponse = await fetch(
    `https://api.github.com/repos/${repo}/commits?sha=${sha}&path=${path}`,
    { headers: getHeaders() }
  );
  if (!commitsResponse.ok) {
    throw commitsResponse;
  }
  const commitsJson = await commitsResponse.json();
  // console.log(commitsJson);
  const commits = commitsJson
    .slice(0, top)
    .map(commit => ({
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
    }))
    .sort(function(a, b) {
      return a.date - b.date;
    });

  await Promise.all(
    commits.map(async commit => {
      const info = await getContent(repo, commit.sha, path);
      commit.content = info.content;
      commit.fileUrl = info.url;
    })
  );

  return commits;
}

export function auth() {
  return new Promise((resolve, reject) => {
    var authenticator = new netlify({
      site_id: "ccf3a0e2-ac06-4f37-9b17-df1dd41fb1a6"
    });
    authenticator.authenticate({ provider: "github", scope: "repo" }, function(
      err,
      data
    ) {
      if (err) {
        reject(err);
      }
      window.localStorage.setItem(TOKEN_KEY, data.token);
      resolve(data);
    });
  });
}
