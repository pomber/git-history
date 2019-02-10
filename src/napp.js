import React from "react";
import History from "./history";
import { Loading, useLanguageLoader } from "./app-helpers";

const cli = window._CLI;

export default function App() {
  if (cli) {
    return <CliApp data={cli} />;
  } else {
    return null;
    // return <GitHubApp />;
  }
}

function CliApp({ data }) {
  let { commits, path } = data;
  commits = commits.map(commit => ({ ...commit, date: new Date(commit.date) }));
  const lang = useLanguageLoader(path);
  if (!lang) {
    return <Loading path={path} />;
  } else {
    return <History commits={commits} language={lang} />;
  }
}
