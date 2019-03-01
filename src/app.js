import React, { useState, useEffect } from "react";
import History from "./history";
import Landing from "./landing";
import { useDocumentTitle, Loading, Error } from "./app-helpers";
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

  const [versions, loading, error, loadMore] = useVersionsLoader(
    gitProvider,
    path
  );

  if (error) {
    return <Error error={error} gitProvider={gitProvider} />;
  }

  if (!versions && loading) {
    return <Loading path={path} />;
  }

  if (!versions.length) {
    return <Error error={{ status: 404 }} gitProvider={gitProvider} />;
  }

  const commits = versions.map(v => v.commit);
  const slideLines = versions.map(v => v.lines);

  return (
    <History commits={commits} slideLines={slideLines} loadMore={loadMore} />
  );
}

function useVersionsLoader(gitProvider) {
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
      .getVersions(state.last)
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
        setState(old => ({
          ...old,
          loading: false,
          error: error.message
        }));
      });
  }, [state.last]);

  return [state.data, state.loading, state.error, loadMore];
}
