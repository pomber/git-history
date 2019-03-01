import React, { useEffect } from "react";

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
  const { LogInButton } = gitProvider;
  if (error.status === 403) {
    // FIX bitbucket uses 403 for private repos
    return (
      <Center>
        <p>
          GitHub API rate limit exceeded for your IP (60 requests per hour).
        </p>
        <p>Sign in with GitHub for more:</p>
        <LogInButton />
      </Center>
    );
  }

  if (error.status === 404) {
    return (
      <Center>
        <p>File not found.</p>
        {gitProvider.isLoggedIn && !gitProvider.isLoggedIn() && (
          <React.Fragment>
            <p>Is it from a private repo? Sign in:</p>
            <LogInButton />
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

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
