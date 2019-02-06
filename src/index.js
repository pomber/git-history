import { getHistory } from "./github";
import { getLanguage, getLanguageDependencies } from "./language-detector";
import './index.css';

const [repo, sha, path] = getParams();
const lang = getLanguage(path);
const root = document.getElementById("root");
const message = document.getElementById("message");

if (!repo) {
  // show docs

  const indexTemplate = `
    <p>URL should be something like https://github-history.netlify.com/user/repo/commits/master/path/to/file.js</p>
    <form id="url-form">
      <input type="text" placeholder="Enter your github file URL" id="url-input" />
    </form>
  `;

  message.innerHTML = indexTemplate;
  document.getElementById("url-form").addEventListener('submit', handleFormSubmit);
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

function handleFormSubmit(event) {
  event.preventDefault();
  const urlInput = document.getElementById("url-input");
  window.location.href = getLocation(urlInput.value).pathname;
}

function getLocation(href) {
  var fakeLink = document.createElement("a");
  fakeLink.href = href;
  return fakeLink;
};

function loadLanguage(lang) {
  if (["js", "css", "html"].includes(lang)) {
    return Promise.resolve();
  }
  return import("prismjs").then(() =>
    import(`prismjs/components/prism-${lang}`)
  );
}

function getParams() {
  const [,
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
