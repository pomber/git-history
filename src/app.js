import React, { useState, useEffect } from "react";
import History from "./history";
import { getHistory, auth, isLoggedIn } from "./github";
import demo from "./demo.gif";

export default function AppWrapper(props) {
  if (props.repo) {
    return <App {...props} />;
  } else {
    return <Landing />;
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
        height: "100%",
        padding: "0 40px"
      }}
    >
      {children}
    </div>
  );
}

function Landing() {
  const url = `${window.location.protocol}//${
    window.location.host
  }/babel/babel/blob/master/packages/babel-core/test/browserify.js`;
  return (
    <Center>
      <img src={demo} alt="demo" style={{ width: 900, maxWidth: "100%" }} />
      <h1>Git History</h1>
      <div>
        <p>
          Quickly browse the history of any GitHub file:
          <ol>
            <li>
              Replace <strong>github.com</strong> with{" "}
              <strong>github.githistory.xyz</strong> in any file url
            </li>
            <li>There's no step two</li>
          </ol>
          <a href={url}>Try it</a>
        </p>

        <p>
          You can also add an <strong>Open in Git History</strong> button to
          GitHub with the{" "}
          <a href="https://chrome.google.com/webstore/detail/github-history-browser-ex/laghnmifffncfonaoffcndocllegejnf">
            Chrome
          </a>{" "}
          and{" "}
          <a href="https://addons.mozilla.org/es/firefox/addon/github-history/">
            Firefox
          </a>{" "}
          extensions.
        </p>
      </div>
      <div style={{ height: "20%" }} />
    </Center>
  );
}

function App({ repo, sha, path, lang }) {
  const fileName = path.split("/").pop();
  useDocumentTitle(`Git History - ${fileName}`);

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
        <p>Sign in with GitHub for more:</p>
        <GitHubButton onClick={login} />
      </Center>
    );
  }

  if (error.status === 404) {
    return (
      <Center>
        <p>File not found.</p>
        {!isLoggedIn() && (
          <React.Fragment>
            <p>Is it from a private repo? Sign in with GitHub:</p>
            <GitHubButton onClick={login} />
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
