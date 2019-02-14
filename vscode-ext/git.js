const execa = require("execa");
const pather = require("path");

async function getCommits(path) {
  const format = `{"hash":"%h","author":{"login":"%aN"},"date":"%ad"},`;
  const { stdout } = await execa(
    "git",
    [
      "log",
      // "--follow",
      "--reverse",
      `--pretty=format:${format}`,
      "--date=iso",
      "--",
      pather.basename(path)
    ],
    { cwd: pather.dirname(path) }
  );
  const json = `[${stdout.slice(0, -1)}]`;

  const messagesOutput = await execa(
    "git",
    [
      "log",
      // "--follow",
      "--reverse",
      `--pretty=format:%s`,
      "--",
      pather.basename(path)
    ],
    { cwd: pather.dirname(path) }
  );

  const messages = messagesOutput.stdout.replace('"', '\\"').split(/\r?\n/);

  const result = JSON.parse(json)
    .map((commit, i) => ({
      ...commit,
      date: new Date(commit.date),
      message: messages[i]
    }))
    .slice(-20);

  return result;
}

async function getContent(commit, path) {
  const { stdout } = await execa(
    "git",
    ["show", `${commit.hash}:./${pather.basename(path)}`],
    { cwd: pather.dirname(path) }
  );
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
