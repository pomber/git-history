import React, { useState, useEffect } from "react";
import History from "./history";
import { getHistory, auth, isLoggedIn } from "./github";

export default function AppWrapper(props) {
  if (props.repo) {
    return <App {...props} />;
  } else {
    return (
      <Center>
        <Landing />
      </Center>
    );
  }
}

function Center({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      }}
    >
      {children}
    </div>
  );
}

function Landing() {
  return (
    <p>
      URL should be something like
      https://github-history.netlify.com/user/repo/commits/master/path/to/file.js
    </p>
  );
}

function App({ repo, sha, path, lang }) {
  const fileName = path.split("/").pop();
  useDocumentTitle(`GitHub History - ${fileName}`);

  const { commits, loading, error } = useCommitsFetcher({
    repo,
    sha,
    path,
    lang
  });

  if (error) {
    return <Error error={error} />;
  }

  if (loading) {
    return <Loading repo={repo} sha={sha} path={path} />;
  }

  if (!commits.length) {
    return <Error error={{ status: 404 }} />;
  }

  return <History commits={commits} language={lang} />;
}

function Error({ error }) {
  if (error.status === 403) {
    return (
      <Center>
        <p>
          GitHub API rate limit exceeded for your IP (60 requests per hour).
        </p>
        <p>Log in with GitHub for more:</p>
        <button onClick={login}>Log In</button>
      </Center>
    );
  }

  if (error.status === 404) {
    return (
      <Center>
        <p>File not found.</p>
        {!isLoggedIn() && (
          <React.Fragment>
            <p>Is it from a private repo? Log in with GitHub:</p>
            <button onClick={login}>Log In</button>
          </React.Fragment>
        )}
      </Center>
    );
  }

  console.error(error);
  return (
    <Center>
      <p>Unexpected error. Check the console.</p>
    </Center>
  );
}

function Loading({ repo, sha, path }) {
  return (
    <Center>
      <p>
        Loading <strong>{repo}</strong> <strong>{path} history...</strong>
      </p>
    </Center>
  );
}

function login() {
  auth()
    .then(data => {
      window.location.reload(false);
    })
    .catch(console.error);
}

function useCommitsFetcher({ repo, sha, path, lang }) {
  const [state, setState] = useState({
    commits: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    getHistory(repo, sha, path, lang)
      .then(commits => {
        setState({
          commits,
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
  }, [repo, sha, path, lang]);

  return state;
}

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
