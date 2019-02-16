import React from "react";
import History from "./history";
import Landing from "./landing";
import {
  getUrlParams,
  useLanguageLoader,
  useCommitsFetcher,
  useDocumentTitle,
  Loading,
  Error
} from "./app-helpers";

const cli = window._CLI;

export default function App() {
  if (cli) {
    return <CliApp data={cli} />;
  }

  const [repo, path] = getUrlParams();

  if (!repo) {
    return <Landing />;
  } else {
    return <GitHubApp repo={repo} path={path} />;
  }
}

function CliApp({ data }) {
  let { commits, path } = data;

  const fileName = path.split("/").pop();
  useDocumentTitle(`Git History - ${fileName}`);

  commits = commits.map(commit => ({ ...commit, date: new Date(commit.date) }));
  const [lang, loading, error] = useLanguageLoader(path);

  if (error) {
    return <Error error={error} />;
  }

  if (loading) {
    return <Loading path={path} />;
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
