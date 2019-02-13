const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

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

      const panel = vscode.window.createWebviewPanel(
        "gfh",
        "Git History",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: false,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "site"))
          ]
        }
      );

      const indexFile = vscode.Uri.file(
        path.join(context.extensionPath, "site", "index.html")
      );

      const index = fs.readFileSync(indexFile.path, "utf-8");

      const staticSrc = vscode.Uri.file(
        path.join(context.extensionPath, "site", "static")
      ).with({ scheme: "vscode-resource" });

      try {
        panel.webview.html = index.replace(
          "<head>",
          `<head><base href="${vscode.Uri.file(
            path.join(context.extensionPath, "site")
          ).with({
            scheme: "vscode-resource"
          })}/"/>`
        );
      } catch (e) {
        console.error(e);
      }
    }
  );

  context.subscriptions.push(disposable);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
