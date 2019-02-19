import React, { useState, useEffect } from "react";
import History from "./history";
import Landing from "./landing";
import {
  useLanguageLoader,
  useDocumentTitle,
  Loading,
  Error
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

  const [commits, commitsLoading, commitsError, loadMore] = useCommitsLoader(
    gitProvider,
    path
  );
  const [lang, langLoading, langError] = useLanguageLoader(path);

  const loading = langLoading || (!commits && commitsLoading);
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

  return <History commits={commits} language={lang} loadMore={loadMore} />;
}

function useCommitsLoader(gitProvider, path) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
    last: 10,
    noMore: false
  });

  const loadMore = () => {
    setState(old => {
      const shouldFetchMore = !old.loading && !old.noMore;
      return shouldFetchMore
        ? { ...old, last: old.last + 10, loading: true }
        : old;
    });
  };

  useEffect(() => {
    gitProvider
      .getCommits(path, state.last)
      .then(data => {
        setState(old => ({
          data,
          loading: false,
          error: false,
          last: old.last,
          noMore: data.length < old.last
        }));
      })
      .catch(error => {
        setState({
          loading: false,
          error
        });
      });
  }, [path, state.last]);

  return [state.data, state.loading, state.error, loadMore];
}
