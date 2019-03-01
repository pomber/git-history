const { SOURCE, getSource } = require("./sources");

let providers;
if (process.env.REACT_APP_GIT_PROVIDER === SOURCE.VSCODE) {
  // We can't use web workers on vscode webview
  providers = {
    [SOURCE.VSCODE]: require("./vscode-provider").default
  };
} else {
  providers = {
    [SOURCE.CLI]: require("./cli-provider").default,
    [SOURCE.GITLAB]: require("./gitlab-provider").default,
    [SOURCE.GITHUB]: require("./github-provider").default,
    [SOURCE.BITBUCKET]: require("./bitbucket-provider").default
  };
}

export default function getGitProvider(source) {
  source = source || getSource();
  const provider = providers[source];
  return provider;
}
