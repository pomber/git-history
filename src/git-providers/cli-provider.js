function getPath() {
  return new URLSearchParams(window.location.search).get("path");
}

function showLanding() {
  return false;
}

async function getCommits() {
  const path = getPath();
  const response = await fetch(`/api/commits?path=${encodeURIComponent(path)}`);
  const commits = await response.json();
  commits.forEach(c => (c.date = new Date(c.date)));
  return commits;
}

export default {
  showLanding,
  getPath,
  getCommits
};
