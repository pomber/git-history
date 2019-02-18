import React from "react";
import History from "./history";
import Landing from "./landing";
import {
  useLanguageLoader,
  useDocumentTitle,
  Loading,
  Error,
  useLoader
} from "./app-helpers";
import getGitProvider from "./git-providers/providers";

export default function App() {
  const gitProvider = getGitProvider();

  if (gitProvider.showLanding()) {
    return <Landing />;
  } else {
    return <InnerApp gitProvider={gitProvider} />;
  }
}

function InnerApp({ gitProvider }) {
  const path = gitProvider.getPath();
  const fileName = path.split("/").pop();

  useDocumentTitle(`Git History - ${fileName}`);

  const [commits, commitsLoading, commitsError] = useLoader(
    gitProvider.getCommits,
    []
  );
  const [lang, langLoading, langError] = useLanguageLoader(path);

  const loading = langLoading || commitsLoading;
  const error = langError || commitsError;

  if (error) {
    return <Error error={error} gitProvider={gitProvider} />;
  }

  if (loading) {
    return <Loading path={path} />;
  }

  if (!commits.length) {
    return <Error error={{ status: 404 }} gitProvider={gitProvider} />;
  }

  return <History commits={commits} language={lang} />;
}
