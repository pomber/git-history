import React, { useState, useEffect } from "react";
import { getLanguage, loadLanguage } from "./language-detector";

export function Center({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "0 40px"
      }}
    >
      {children}
    </div>
  );
}

export function Loading({ repo, path }) {
  return (
    <Center>
      <p>
        Loading <strong>{path}</strong> history {repo ? "from " + repo : ""}...
      </p>
    </Center>
  );
}

export function Error({ error, gitProvider }) {
  if (error.status === 403) {
    return (
      <Center>
        <p>
          GitHub API rate limit exceeded for your IP (60 requests per hour).
        </p>
        <p>Sign in with GitHub for more:</p>
        <GitHubButton onClick={gitProvider.logIn} />
      </Center>
    );
  }

  if (error.status === 404) {
    return (
      <Center>
        <p>File not found.</p>
        {gitProvider.isLoggedIn && !gitProvider.isLoggedIn() && (
          <React.Fragment>
            <p>Is it from a private repo? Sign in with GitHub:</p>
            <GitHubButton onClick={gitProvider.login} />
          </React.Fragment>
        )}
      </Center>
    );
  }

  console.error(error);
  console.error(
    "Let us know of the error at https://github.com/pomber/git-history/issues"
  );
  return (
    <Center>
      <p>Unexpected error. Check the console.</p>
    </Center>
  );
}

function GitHubButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ fontWeight: 600, padding: "0.5em 0.7em", cursor: "pointer" }}
    >
      <div>
        <svg
          fill="currentColor"
          preserveAspectRatio="xMidYMid meet"
          height="1em"
          width="1em"
          viewBox="0 0 40 40"
          style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
        >
          <g>
            <path d="m20 0c-11 0-20 9-20 20 0 8.8 5.7 16.3 13.7 19 1 0.2 1.3-0.5 1.3-1 0-0.5 0-2 0-3.7-5.5 1.2-6.7-2.4-6.7-2.4-0.9-2.3-2.2-2.9-2.2-2.9-1.9-1.2 0.1-1.2 0.1-1.2 2 0.1 3.1 2.1 3.1 2.1 1.7 3 4.6 2.1 5.8 1.6 0.2-1.3 0.7-2.2 1.3-2.7-4.5-0.5-9.2-2.2-9.2-9.8 0-2.2 0.8-4 2.1-5.4-0.2-0.5-0.9-2.6 0.2-5.3 0 0 1.7-0.5 5.5 2 1.6-0.4 3.3-0.6 5-0.6 1.7 0 3.4 0.2 5 0.7 3.8-2.6 5.5-2.1 5.5-2.1 1.1 2.8 0.4 4.8 0.2 5.3 1.3 1.4 2.1 3.2 2.1 5.4 0 7.6-4.7 9.3-9.2 9.8 0.7 0.6 1.4 1.9 1.4 3.7 0 2.7 0 4.9 0 5.5 0 0.6 0.3 1.2 1.3 1 8-2.7 13.7-10.2 13.7-19 0-11-9-20-20-20z" />
          </g>
        </svg>
        Sign in with GitHub
      </div>
    </button>
  );
}

export function useLoader(promiseFactory, deps) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    promiseFactory()
      .then(data => {
        setState({
          data,
          loading: false,
          error: false
        });
      })
      .catch(error => {
        setState({
          loading: false,
          error
        });
      });
  }, deps);

  return [state.data, state.loading, state.error];
}

export function useLanguageLoader(path) {
  return useLoader(async () => {
    const lang = getLanguage(path);
    await loadLanguage(lang);
    return lang;
  }, [path]);
}

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
