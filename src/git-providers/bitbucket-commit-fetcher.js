const cache = {};

async function getCommits({ repo, sha, path, last, token }) {
  if (!cache[path]) {
    let fields =
      "values.path,values.commit.date,values.commit.message,values.commit.hash,values.commit.author.*,values.commit.links.html, values.commit.author.user.nickname, values.commit.author.user.links.avatar.href, values.commit.links.html.href";
    // fields = "*.*.*.*.*";
    const commitsResponse = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${repo}/filehistory/${sha}/${path}?fields=${fields}`,
      { headers: token ? { Authorization: `bearer ${token}` } : {} }
    );

    if (!commitsResponse.ok) {
      throw {
        status: commitsResponse.status === 403 ? 404 : commitsResponse.status,
        body: commitsJson
      };
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
        const info = await getContent(repo, commit.sha, path, token);
        commit.content = info.content;
      }
    })
  );

  return commits;
}

async function getContent(repo, sha, path, token) {
  const contentResponse = await fetch(
    `https://api.bitbucket.org/2.0/repositories/${repo}/src/${sha}/${path}`,
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

  const content = await contentResponse.text();

  return { content };
}

export default {
  getCommits
};
