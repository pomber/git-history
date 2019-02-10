import { getLanguage } from "./language-detector";
import App from "./napp";
import React from "react";
import ReactDOM from "react-dom";

const root = document.getElementById("root");
ReactDOM.render(<App />, root);

// const [repo, sha, path] = getParams();
// const lang = getLanguage(path);

// ReactDOM.render(<App repo={repo} sha={sha} path={path} lang={lang} />, root);

// function getParams() {
//   const [
//     ,
//     owner,
//     reponame,
//     action,
//     sha,
//     ...paths
//   ] = window.location.pathname.split("/");

//   if (action !== "commits" && action !== "blob") {
//     return [];
//   }

//   return [owner + "/" + reponame, sha, "/" + paths.join("/")];
// }
