import cliProvider from "./cli-provider";

export default function getGetProvider() {
  if (window._CLI) {
    return cliProvider;
  }
}
