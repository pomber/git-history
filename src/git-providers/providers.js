import cliProvider from "./cli-provider";
import githubProvider from "./github-provider";
import vscodeProvider from "./vscode-provider";
import gitlabProvider from "./gitlab-provider";
import bitbucketProvider from "./bitbucket-provider";

export default function getGitProvider() {
  switch (process.env.REACT_APP_GIT_PROVIDER) {
    case "cli":
      return cliProvider;
    case "vscode":
      return vscodeProvider;
    default: {
      const [cloud] = window.location.host.split(".");
      if (cloud === "gitlab") {
        return gitlabProvider;
      } else if (cloud === "bitbucket") {
        return bitbucketProvider;
      }
      return githubProvider;
    }
  }
}
