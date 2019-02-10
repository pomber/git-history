const runServer = require("./server");
const getCommits = require("./git");

const path = process.argv.slice(2);

const commitsPromise = getCommits(path);

runServer(path, commitsPromise);
