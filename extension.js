const {
  commands,
  Uri,
  window,
  workspace
} = require('vscode')
const SearchyProvider = require('./provider')
const searchyCommands = require('./commands')

function activate(context) {
  let provider = new SearchyProvider()
  let registration = workspace.registerTextDocumentContentProvider(
    provider.scheme, provider
  )

  const disposable = commands.registerCommand('searchy.search', function () {
    window.showInputBox({
      value: null,
      prompt: "Uses ripgrep. e.g [foo -g 'README.*']",
      placeHolder: "Search term...",
      password: false
    }).then((cmd) => {
      if (cmd && cmd.length) {
        var uri = Uri.parse(provider.scheme +
          `:results.searchy?cmd=${cmd}`)
        return workspace.openTextDocument(uri).then(doc =>
          window.showTextDocument(doc, 1)
        )
      }
    })
  })

  context.subscriptions.push(
    disposable,
    registration,
    commands.registerCommand('searchy.openFile', searchyCommands.openFile)
  )
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate
