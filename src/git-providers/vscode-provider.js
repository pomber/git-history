import { getLanguage, loadLanguage } from "./language-detector";
import { getSlides, getChanges } from "./differ";

const vscode = window.vscode;

function getPath() {
  return window._PATH;
}

function showLanding() {
  return false;
}

function getCommits(path, last) {
  return new Promise((resolve, reject) => {
    window.addEventListener(
      "message",
      event => {
        const commits = event.data;
        commits.forEach(c => (c.date = new Date(c.date)));
        resolve(commits);
      },
      { once: true }
    );

    vscode.postMessage({
      command: "commits",
      params: {
        path,
        last
      }
    });
  });
}

async function getVersions(last) {
  const path = getPath();
  const lang = getLanguage(path);
  const langPromise = loadLanguage(lang);

  const commits = await getCommits(path, last);
  await langPromise;

  const codes = commits.map(commit => commit.content);
  const slides = getSlides(codes, lang);
  return commits.map((commit, i) => ({
    commit,
    lines: slides[i],
    changes: getChanges(slides[i])
  }));
}

export default {
  showLanding,
  getPath,
  getVersions
};
