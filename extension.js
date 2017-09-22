const vscode = require('vscode')
const rgPath = require('vscode-ripgrep').rgPath
const {
  exec
} = require('child_process')

function activate(context) {
  const disposable = vscode.commands.registerCommand('searchy.search', function () {
    vscode.window.showInputBox({
      value: null,
      prompt: "Uses ripgrep. e.g [foo -g 'README.*']",
      placeHolder: "Search term...",
      password: false
    }).then((output) => {
      if (output && output.length) {
        runCommand(output)
      }
    })
  })

  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate

function runCommand(cmd) {
  exec(`${rgPath} ${cmd}`, {
    cwd: vscode.workspace.rootPath
  }, (err, stdout, stderr) => {
    const searchResults = stdout
    if (err == null && !stderr.length) {
      console.log(`got back search results: ${searchResults.split('\n').length}`)
    }
  })
}
