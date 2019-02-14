const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const getCommits = require("./git");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.git-file-history",
    function() {
      // The code you place here will be executed every time your command is executed

      const currentPath = getCurrentPath();
      if (!currentPath) {
        vscode.window.showInformationMessage("No active file");
        return;
      }

      const panel = vscode.window.createWebviewPanel(
        "gfh",
        `${path.basename(currentPath)} (Git History)`,
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "site"))
          ]
        }
      );

      const indexFile = vscode.Uri.file(
        path.join(context.extensionPath, "site", "index.html")
      );

      const index = fs.readFileSync(indexFile.path, "utf-8");

      getCommits(currentPath)
        .then(commits => {
          const newIndex = index
            .replace(
              "<script>window._CLI=null</script>",
              `<script>/*<!--*/window._CLI={commits:${JSON.stringify(
                commits
              )},path:'${currentPath}'}/*-->*/</script>`
            )
            .replace(
              "<head>",
              `<head><base href="${vscode.Uri.file(
                path.join(context.extensionPath, "site")
              ).with({
                scheme: "vscode-resource"
              })}/"/>`
            );

          panel.webview.html = newIndex;
        })
        .catch(console.error);
    }
  );

  context.subscriptions.push(disposable);
}

function getCurrentPath() {
  return (
    vscode.window.activeTextEditor &&
    vscode.window.activeTextEditor.document &&
    vscode.window.activeTextEditor.document.fileName
  );
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
