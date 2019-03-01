import { Base64 } from "js-base64";

const cache = {};

async function getCommits({ repo, sha, path, token, last }) {
  if (!cache[path]) {
    const commitsResponse = await fetch(
      `https://gitlab.com/api/v4/projects/${encodeURIComponent(
        repo
      )}/repository/commits?path=${encodeURIComponent(path)}&ref_name=${sha}`,
      { headers: token ? { Authorization: `bearer ${token}` } : {} }
    );

    const commitsJson = await commitsResponse.json();

    if (!commitsResponse.ok) {
      throw {
        status: commitsResponse.status,
        body: commitsJson
      };
    }

    cache[path] = commitsJson.map(commit => ({
      sha: commit.id,
      date: new Date(commit.authored_date),
      author: {
        login: commit.author_name
      },
      // commitUrl: commit.html_url,
      message: commit.title
    }));
  }

  const commits = cache[path].slice(0, last);

  await Promise.all(
    commits.map(async commit => {
      if (!commit.content) {
        const info = await getContent(repo, commit.sha, path, token);
        commit.content = info.content;
      }
    })
  );

  return commits;
}

async function getContent(repo, sha, path, token) {
  const contentResponse = await fetch(
    `https://gitlab.com/api/v4/projects/${encodeURIComponent(
      repo
    )}/repository/files/${encodeURIComponent(path)}?ref=${sha}`,
    { headers: token ? { Authorization: `bearer ${token}` } : {} }
  );

  if (contentResponse.status === 404) {
    return { content: "" };
  }

  if (!contentResponse.ok) {
    throw {
      status: contentResponse.status,
      body: contentJson
    };
  }

  const contentJson = await contentResponse.json();
  const content = Base64.decode(contentJson.content);
  return { content };
}

export default {
  getCommits
};
