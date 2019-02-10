const fs = require("fs");
const getPort = require("get-port");
const open = require("open");
const handler = require("serve-handler");
const http = require("http");
const pather = require("path");

const sitePath = pather.join(__dirname, "site/");
const indexPath = pather.join(sitePath, "index.html");

function getIndex() {
  return new Promise((resolve, reject) => {
    fs.readFile(indexPath, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

const indexPromise = getIndex();

const portPromise = getPort({ port: 3000 });

module.exports = async function runServer(path, commitsPromise) {
  const server = http.createServer((request, response) => {
    if (request.url === "/") {
      Promise.all([indexPromise, commitsPromise]).then(([index, commits]) => {
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
      return handler(request, response, { public: sitePath });
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
