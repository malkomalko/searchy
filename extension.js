const vscode = require('vscode')
const SearchyProvider = require('./provider')
const commands = require('./commands')

function activate(context) {
  let provider = new SearchyProvider()
  let registration = vscode.workspace.registerTextDocumentContentProvider(
    provider.scheme, provider
  )

  const disposable = vscode.commands.registerCommand('searchy.search', function () {
    vscode.window.showInputBox({
      value: null,
      prompt: "Uses ripgrep. e.g [foo -g 'README.*']",
      placeHolder: "Search term...",
      password: false
    }).then((cmd) => {
      if (cmd && cmd.length) {
        var previewUri = vscode.Uri.parse(provider.scheme +
          `://results?cmd=${cmd}`)
        vscode.commands.executeCommand('vscode.previewHtml',
          previewUri,
          vscode.ViewColumn.One,
          `Searchy - ${cmd.substring(0, 8)}`
        ).then(() => {}, (error) => {
          vscode.window.showErrorMessage(error)
        })
      }
    })
  })

  context.subscriptions.push(
    disposable,
    registration,
    vscode.commands.registerCommand('searchy.openFile', commands.openFile)
  )
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate
