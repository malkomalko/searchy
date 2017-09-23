const vscode = require('vscode')
const rootPath = vscode.workspace.rootPath

module.exports = {
  openFile: (params) => {
    const filePath = `${rootPath}/${params.fileName}`
    var document = vscode.workspace.openTextDocument(filePath)
    vscode.window.showTextDocument(document, 1)
  }
}
