import cliProvider from "./cli-provider";

export default function getGitProvider() {
  switch (process.env.REACT_APP_GIT_PROVIDER) {
    case "cli":
      return cliProvider;
    case "vscode":
      return null;
    default:
      return null;
  }
}
