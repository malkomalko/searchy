const vscode = require('vscode')
const rootPath = vscode.workspace.rootPath

module.exports = {
  openFile: (params) => {
    let filePath = `${rootPath}/${params.fileName}`
    var document = vscode.workspace.openTextDocument(filePath)
    vscode.window.showTextDocument(document, 1).then(() => {
      if (params.line) {
        let revealType = vscode.TextEditorRevealType.InCenter
        let editor = vscode.window.activeTextEditor
        let range = editor.document.lineAt(params.line - 1).range
        editor.selection = new vscode.Selection(range.start, range.end)
        editor.revealRange(range, revealType)
      }
    })
  }
}
