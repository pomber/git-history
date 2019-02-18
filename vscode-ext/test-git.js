#!/usr/bin/env node

// node test-git.js extension.js 2 94c91d9

const getCommits = require("./git");

const [, , path, last, before] = process.argv;

getCommits(path, last, before).then(cs =>
  console.log(
    cs
      .map(c => {
        return `${c.hash} ${c.date.toDateString()} ${c.message}`;
      })
      .join("\n")
  )
);
