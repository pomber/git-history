import React from "react";
import History from "./history";
import Landing from "./landing";
import {
  getUrlParams,
  useLanguageLoader,
  useCommitsFetcher,
  useDocumentTitle,
  Loading,
  Error,
  useCliCommitsFetcher
} from "./app-helpers";

const cli = window._CLI;

export default function App() {
  if (cli) {
    const path = new URLSearchParams(window.location.search).get("path");
    return <CliApp path={path} />;
  }

  const [repo, sha, path] = getUrlParams();

  if (!repo) {
    return <Landing />;
  } else {
    return <GitHubApp repo={repo} sha={sha} path={path} />;
  }
}

function CliApp({ path }) {
  const fileName = path.split("/").pop();
  useDocumentTitle(`Git History - ${fileName}`);

  const [commits, commitsLoading, commitsError] = useCliCommitsFetcher({
    path
  });
  const [lang, langLoading, langError] = useLanguageLoader(path);

  const loading = langLoading || commitsLoading;
  const error = langError || commitsError;

  if (error) {
    return <Error error={error} />;
  }

  if (loading) {
    return <Loading path={path} />;
  }

  if (!commits.length) {
    return <Error error={{ status: 404 }} />;
  }

  return <History commits={commits} language={lang} />;
}

function GitHubApp({ repo, sha, path }) {
  const fileName = path.split("/").pop();
  useDocumentTitle(`Git History - ${fileName}`);

  const [lang, langLoading, langError] = useLanguageLoader(path);
  const [commits, commitsLoading, commitsError] = useCommitsFetcher({
    repo,
    sha,
    path
  });

  const loading = langLoading || commitsLoading;
  const error = langError || commitsError;

  if (error) {
    return <Error error={error} />;
  }

  if (loading) {
    return <Loading repo={repo} path={path} />;
  }

  if (!commits.length) {
    return <Error error={{ status: 404 }} />;
  }

  return <History commits={commits} language={lang} />;
}
