import { getHistory } from "./github";
import { getLanguage, getLanguageDependencies } from "./language-detector";

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

  Promise.all([
    getHistory(repo, sha, path),
    import("./app"),
    loadLanguage(lang)
  ])
    .then(([commits, app]) => {
      app.render(commits, root, lang);
    })
    .catch(error => {
      if (error.status === 403) {
        message.innerHTML =
          "<p>GitHub API rate limit exceeded for your IP (60 requests per hour).</p><p>I need to add authentication.</p>";
      } else {
        console.error(error);
        message.innerHTML = `<p>Unexpected error. Check the console.</p>`;
      }
    });
}

function loadLanguage(lang) {
  if (["js", "css", "html"].includes(lang)) {
    return Promise.resolve();
  }

  const deps = getLanguageDependencies(lang);

  let depPromise = import("prismjs");

  if (deps) {
    depPromise = depPromise.then(() =>
      Promise.all(deps.map(dep => import(`prismjs/components/prism-${dep}`)))
    );
  }

  return depPromise.then(() => import(`prismjs/components/prism-${lang}`));
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
