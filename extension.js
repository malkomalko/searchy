const vscode = require('vscode')
const rgPath = require('vscode-ripgrep').rgPath
const SearchyProvider = require('./provider')
const {
  exec
} = require('child_process')

function activate(context) {
  let provider = new SearchyProvider()
  let registration = vscode.workspace.registerTextDocumentContentProvider(provider.scheme, provider)

  const disposable = vscode.commands.registerCommand('searchy.search', function () {
    vscode.window.showInputBox({
      value: null,
      prompt: "Uses ripgrep. e.g [foo -g 'README.*']",
      placeHolder: "Search term...",
      password: false
    }).then((cmd) => {
      if (cmd && cmd.length) {
        runCommand(cmd, (err, searchResults) => {
          if (err) {
            return vscode.window.showErrorMessage(err.message)
          }
          provider.setData(searchResults)
          var previewUri = vscode.Uri.parse(provider.scheme +
            '://results?d=' + new Date().getTime().toString())
          vscode.commands.executeCommand('vscode.previewHtml',
            previewUri,
            vscode.ViewColumn.One,
            `Searchy - ${cmd.substring(0, 8)}`
          ).then(() => {}, (error) => {
            vscode.window.showErrorMessage(error)
          })
        })
      }
    })
  })

  context.subscriptions.push(disposable, registration)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate

function runCommand(cmd, callback) {
  exec(`${rgPath} ${cmd}`, {
    cwd: vscode.workspace.rootPath,
    maxBuffer: 1024 * 1000
  }, (err, stdout, stderr) => {
    const searchResults = stdout
    if (err == null && !stderr.length) {
      callback(null, searchResults)
    } else {
      callback(err)
    }
  })
}
