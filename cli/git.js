const execa = require("execa");

async function getCommits(path, options = {}) {
  const format = `{"hash":"%h","author":{"login":"%aN"},"date":"%ad"},`;
  const { stdout } = await execa("git", filterEmptyOption([
    "log",
    options.follow ? "--follow" : null,
    "--reverse",
    `--pretty=format:${format}`,
    "--date=iso",
    "--",
    path
  ]));
  const json = `[${stdout.slice(0, -1)}]`;

  const messagesOutput = await execa("git", filterEmptyOption([
    "log",
    options.follow ? "--follow" : null,
    "--reverse",
    `--pretty=format:%s`,
    "--",
    path
  ]));

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
  const { stdout } = await execa("git", ["show", `${commit.hash}:${path}`]);
  return stdout;
}

function filterEmptyOption(options) {
  return options.filter(option => {
    return option;
  });
}

module.exports = async function(path, options = {}) {
  const commits = await getCommits(path, options);
  await Promise.all(
    commits.map(async commit => {
      commit.content = await getContent(commit, path);
    })
  );
  return commits;
};
