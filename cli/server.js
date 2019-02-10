const fs = require("fs");
const getPort = require("get-port");
const open = require("open");
const handler = require("serve-handler");
const http = require("http");

function getIndex() {
  return new Promise((resolve, reject) => {
    fs.readFile("site/index.html", "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

const indexPromise = getIndex();

const portPromise = getPort({ port: 3000 });

module.exports = async function runServer(path, commitsPromise) {
  const server = http.createServer((request, response) => {
    console.log(request.url);
    if (request.url === "/") {
      Promise.all([indexPromise, commitsPromise]).then(([index, commits]) => {
        console.log(commits);
        const newIndex = index.replace(
          "<script>window._CLI=null</script>",
          `<script>window._CLI={commits:${JSON.stringify(
            commits
          )},path:'${path}'}</script>`
        );
        var headers = { "Content-Type": "text/html" };
        response.writeHead(200, headers);
        response.write(newIndex);
        response.end();
      });
    } else {
      return handler(request, response, { public: "site" });
    }
  });

  const port = await portPromise;

  return new Promise(resolve => {
    server.listen(port, () => {
      console.log("Running at http://localhost:" + port);
      open("http://localhost:" + port);
    });
  });
};
