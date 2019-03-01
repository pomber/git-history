import { Base64 } from "js-base64";

const cache = {};

async function getCommits({ repo, sha, path, token, last }) {
  if (!cache[path]) {
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${repo}/commits?sha=${sha}&path=${path}`,
      { headers: token ? { Authorization: `bearer ${token}` } : {} }
    );

    if (!commitsResponse.ok) {
      throw {
        status: commitsResponse.status,
        body: commitsJson
      };
    }

    const commitsJson = await commitsResponse.json();

    cache[path] = commitsJson.map(commit => ({
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
  }

  const commits = cache[path].slice(0, last);

  await Promise.all(
    commits.map(async commit => {
      if (!commit.content) {
        const info = await getContent(repo, commit.sha, path, token);
        commit.content = info.content;
        commit.fileUrl = info.url;
      }
    })
  );

  return commits;
}

async function getContent(repo, sha, path, token) {
  const contentResponse = await fetch(
    `https://api.github.com/repos/${repo}/contents${path}?ref=${sha}`,
    { headers: token ? { Authorization: `bearer ${token}` } : {} }
  );

  if (contentResponse.status === 404) {
    return { content: "" };
  }

  const contentJson = await contentResponse.json();

  if (!contentResponse.ok) {
    throw {
      status: contentResponse.status,
      body: contentJson
    };
  }

  const content = Base64.decode(contentJson.content);
  return { content, url: contentJson.html_url };
}

export default {
  getCommits
};
