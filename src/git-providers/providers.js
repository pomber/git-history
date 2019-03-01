import cliProvider from "./cli-provider";
import githubProvider from "./github-provider";
import vscodeProvider from "./vscode-provider";
import gitlabProvider from "./gitlab-provider";
import bitbucketProvider from "./bitbucket-provider";
import { SOURCE, getSource } from "./sources";

const providers = {
  [SOURCE.CLI]: cliProvider,
  [SOURCE.VSCODE]: vscodeProvider,
  [SOURCE.GITLAB]: gitlabProvider,
  [SOURCE.GITHUB]: githubProvider,
  [SOURCE.BITBUCKET]: bitbucketProvider
};

export default function getGitProvider(source) {
  source = source || getSource();
  const provider = providers[source];
  return provider;
}
