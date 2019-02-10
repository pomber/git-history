#!/usr/bin/env node

const runServer = require("./server");
const getCommits = require("./git");
const fs = require("fs");

const path = process.argv[2];

if (!path || path === "--help") {
  console.log(`Usage:

  githistory some/file.ext
  `);
  process.exit();
}

if (!fs.existsSync(path)) {
  console.log(`File not found: ${path}`);
  process.exit();
}

const commitsPromise = getCommits(path);

runServer(path, commitsPromise);
