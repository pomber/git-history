import { getLanguage, loadLanguage } from "./language-detector";
import { getSlides } from "./differ";

import github from "./github-commit-fetcher";
import gitlab from "./gitlab-commit-fetcher";
import bitbucket from "./bitbucket-commit-fetcher";
import cli from "./cli-commit-fetcher";
import { SOURCE } from "./sources";

const fetchers = {
  [SOURCE.GITHUB]: github.getCommits,
  [SOURCE.GITLAB]: gitlab.getCommits,
  [SOURCE.BITBUCKET]: bitbucket.getCommits,
  [SOURCE.CLI]: cli.getCommits
};

export async function getVersions(source, params) {
  const { path } = params;
  const lang = getLanguage(path);
  const langPromise = loadLanguage(lang);

  const getCommits = fetchers[source];
  const commits = await getCommits(params);
  await langPromise;

  const codes = commits.map(commit => commit.content);
  const slides = getSlides(codes, lang);
  return commits.map((commit, i) => ({ commit, lines: slides[i] }));
}
