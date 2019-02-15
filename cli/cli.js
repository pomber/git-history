#!/usr/bin/env node

const runServer = require("./server");
const getCommits = require("./git");
const fs = require("fs");

const argvs = process.argv.slice(2);

const options = {
  follow: false,
};

if (argvs.length === 0 || argvs.indexOf('--help') !== -1) {
  console.log(`Usage:
  Options:
    --follow    Work as git log --follow.

  githistory some/file.ext
  `);
  process.exit();
}

if (argvs.indexOf('--follow') !== -1) {
  options.follow = true;
} 

const path = argvs[argvs.length - 1];

if (!path || !fs.existsSync(path)) {
  console.log(`File not found: ${path}`);
  process.exit();
}

const commitsPromise = getCommits(path, options);

runServer(path, commitsPromise);
