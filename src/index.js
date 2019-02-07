import { getHistory, auth, isLoggedIn } from "./github";
import { getLanguage } from "./language-detector";

const [repo, sha, path] = getParams();
const lang = getLanguage(path);
const root = document.getElementById("root");
const message = document.getElementById("message");

if (!repo) {
  // show docs
  message.innerHTML = `<p>URL should be something like https://github-history.netlify.com/user/repo/commits/master/path/to/file.js</p>`;
} else {
  // show loading
  message.innerHTML = `<p>Loading <strong>${repo}</strong> <strong>${path}</strong> history...</p>`;
  document.title = `GitHub History - ${path.split("/").pop()}`;

  Promise.all([getHistory(repo, sha, path, lang), import("./app")])
    .then(([commits, app]) => {
      if (!commits.length) {
        throw new Error("No commits for this file? Maybe the path is wrong");
      }
      console.log(commits);
      app.render(commits, root, lang);
    })
    .catch(handleError);
}

function handleError(error) {
  const message = document.getElementById("message");
  if (error.status === 403) {
    message.innerHTML =
      "<p>GitHub API rate limit exceeded for your IP (60 requests per hour).</p><p>Log in with GitHub for more</p>";
    const button = document.createElement("button");
    button.textContent = "Login";
    button.onclick = () => {
      auth()
        .then(data => {
          window.location.reload(false);
        })
        .catch(console.error);
    };
    message.appendChild(button);
  } else if (error.status === 404) {
    message.innerHTML = `<p>File not found</p>${
      isLoggedIn() ? "" : "<p>Is it from a private repo? Log in with GitHub"
    }`;

    if (!isLoggedIn) {
      const button = document.createElement("button");
      button.textContent = "Login";
      button.onclick = () => {
        auth()
          .then(data => {
            window.location.reload(false);
          })
          .catch(console.error);
      };
      message.appendChild(button);
    }
  } else {
    console.error(error);
    message.innerHTML = `<p>Unexpected error. Check the console.</p>`;
  }
}

function getParams() {
  const [
    ,
    owner,
    reponame,
    action,
    sha,
    ...paths
  ] = window.location.pathname.split("/");

  if (action !== "commits" && action !== "blob") {
    return [];
  }

  return [owner + "/" + reponame, sha, "/" + paths.join("/")];
}
