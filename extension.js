const {
  commands,
  Disposable,
  languages,
  Uri,
  window,
  workspace
} = require('vscode')
const SearchyProvider = require('./provider')
const searchyCommands = require('./commands')

function activate(context) {
  let provider = new SearchyProvider()

  const providerRegistrations = Disposable.from(
    workspace.registerTextDocumentContentProvider(SearchyProvider.scheme, provider),
    languages.registerDocumentLinkProvider({
      scheme: SearchyProvider.scheme
    }, provider)
  )

  const disposable = commands.registerCommand('searchy.search', function () {
    window.showInputBox({
      value: null,
      prompt: "Uses ripgrep. e.g [foo -g 'README.*']",
      placeHolder: "Search term...",
      password: false
    }).then((cmd) => {
      if (cmd && cmd.length) {
        var uri = Uri.parse(SearchyProvider.scheme +
          `:${fileName(cmd)}.searchy?cmd=${cmd}`)
        return workspace.openTextDocument(uri).then(doc =>
          window.showTextDocument(doc, {
            preview: false,
            viewColumn: 1
          })
        )
      }
    })
  })

  context.subscriptions.push(
    disposable,
    providerRegistrations,
    commands.registerCommand('searchy.openFile', searchyCommands.openFile)
  )
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate

function fileName(cmd) {
  return cmd.replace(/[^a-z0-9]/gi, '_').substring(0, 10)
}
