var vscode = require('vscode')
var rgPath = require('vscode-ripgrep').rgPath

function activate(context) {
  var disposable = vscode.commands.registerCommand('searchy.search', function () {
    vscode.window.showInputBox({
      value: null,
      prompt: "Uses ripgrep. e.g [foo -g 'README.*']",
      placeHolder: "Search term...",
      password: false
    }).then((output) => {
      console.log(`rgPath: ${rgPath}, output: ${output}`)
    })
  })

  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate
