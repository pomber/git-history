function getPath() {
  return new URLSearchParams(window.location.search).get("path");
}

function showLanding() {
  return false;
}

const cache = {
  path: null,
  commits: null,
  promise: null
};

async function getCommits(path, last) {
  // if (path !== cache.path) {
  //   cache = {};
  // }

  const response = await fetch(
    `/api/commits?path=${encodeURIComponent(path)}&last=${last}`
  );
  const commits = await response.json();
  commits.forEach(c => (c.date = new Date(c.date)));

  return commits;
}

export default {
  showLanding,
  getPath,
  getCommits
};
