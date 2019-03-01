export const SOURCE = {
  GITHUB: "github",
  GITLAB: "gitlab",
  BITBUCKET: "bitbucket",
  CLI: "cli",
  VSCODE: "vscode"
};

export function getSource() {
  if (process.env.REACT_APP_GIT_PROVIDER)
    return process.env.REACT_APP_GIT_PROVIDER;

  const [cloud] = window.location.host.split(".");
  if ([SOURCE.GITLAB, SOURCE.GITHUB, SOURCE.BITBUCKET].includes(cloud)) {
    return cloud;
  }
  const source = new URLSearchParams(window.location.search).get("source");
  return source || SOURCE.GITHUB;
}
