var vscode = require('vscode')

function activate(context) {
  var disposable = vscode.commands.registerCommand('searchy.search', function () {
    vscode.window.showInformationMessage('Searchy - Search')
  })

  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate
