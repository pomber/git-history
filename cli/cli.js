#!/usr/bin/env node

const runServer = require("./server");
const fs = require("fs");

let path = process.argv[2] || "./.";

if (path === "--help") {
  console.log(`Usage:

  githistory some/file.ext
  `);
  process.exit();
}

if (!fs.existsSync(path)) {
  console.log(`File not found: ${path}`);
  process.exit();
}

runServer(path);
