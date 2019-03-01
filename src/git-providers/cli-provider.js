import versioner from "./versioner";
import { SOURCE } from "./sources";

function getPath() {
  return new URLSearchParams(window.location.search).get("path");
}

function showLanding() {
  return false;
}

async function getVersions(last) {
  const params = { path: getPath(), last };
  return await versioner.getVersions(SOURCE.CLI, params);
}

export default {
  showLanding,
  getVersions,
  getPath
};
