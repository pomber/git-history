import netlify from "netlify-auth-providers";
import React from "react";

import versioner from "./versioner";
import { SOURCE } from "./sources";

const TOKEN_KEY = "bitbucket-token";

function isLoggedIn() {
  return !!window.localStorage.getItem(TOKEN_KEY);
}

function getUrlParams() {
  const [, owner, reponame, , sha, ...paths] = window.location.pathname.split(
    "/"
  );

  if (!sha) {
    return [];
  }

  return [owner + "/" + reponame, sha, paths.join("/")];
}

function getPath() {
  const [, , path] = getUrlParams();
  return path;
}

function showLanding() {
  const [repo, ,] = getUrlParams();
  return !repo;
}

function logIn() {
  // return new Promise((resolve, reject) => {
  var authenticator = new netlify({
    site_id: "ccf3a0e2-ac06-4f37-9b17-df1dd41fb1a6"
  });
  authenticator.authenticate({ provider: "bitbucket" }, function(err, data) {
    if (err) {
      console.error(err);
      return;
    }
    window.localStorage.setItem(TOKEN_KEY, data.token);
    window.location.reload(false);
  });
  // });
}

function LogInButton() {
  return (
    <button
      onClick={logIn}
      style={{ fontWeight: 600, padding: "0.5em 0.7em", cursor: "pointer" }}
    >
      <div>Sign in with Bitbucket</div>
    </button>
  );
}

function getParams() {
  const [repo, sha, path] = getUrlParams();
  const token = window.localStorage.getItem(TOKEN_KEY);
  return { repo, sha, path, token };
}

async function getVersions(last) {
  const params = { ...getParams(), last };
  return await versioner.getVersions(SOURCE.BITBUCKET, params);
}

export default {
  showLanding,
  getPath,
  getVersions,
  logIn,
  isLoggedIn,
  LogInButton
};
