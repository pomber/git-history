const execa = require("execa");

async function getCommits(path) {
  const format = `{"hash":"%h","author":{"login":"%aN"},"date":"%ad","message":"%s"},`;
  const { stdout } = await execa("git", [
    "log",
    "--follow",
    "--reverse",
    "--abbrev-commit",
    `--pretty=format:${format}`,
    "--date=iso",
    "--",
    path
  ]);
  const json = `[${stdout.slice(0, -1)}]`;
  const result = JSON.parse(json).map(commit => ({
    ...commit,
    date: new Date(commit.date)
  }));
  return result;
}

async function getContent(commit, path) {
  const { stdout } = await execa("git", ["show", `${commit.hash}:${path}`]);
  return stdout;
}

module.exports = async function(path) {
  const commits = await getCommits(path);
  await Promise.all(
    commits.map(async commit => {
      commit.content = await getContent(commit, path);
    })
  );
  return commits;
};
