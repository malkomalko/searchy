const vscode = require('vscode')
const querystring = require('querystring')
const rgPath = require('vscode-ripgrep').rgPath
const {
  exec,
  execSync
} = require('child_process')

const execOpts = {
  cwd: vscode.workspace.rootPath,
  maxBuffer: 1024 * 1000
}

module.exports = function TextDocumentContentProvider() {
  this.provideTextDocumentContent = function (uri) {
    const params = querystring.parse(uri.query)
    const cmd = params.cmd

    let searchResults = null
    try {
      searchResults = runCommandSync(cmd)
    } catch (err) {
      return renderHTML(`<h1><b>${err}</b></h1>`)
    }

    if (searchResults == null || !searchResults.length) {
      return renderHTML('<b>There was an error during your search!</b>')
    }

    let lines = searchResults.toString().split('\n')
    let header = [`<h1><b>${lines.length}</b> search results found</h1>`]
    let content = header.concat(lines)

    return renderHTML(content.join('<br>'))
  }

  this.scheme = 'searchy'
}

function renderHTML(body) {
  return `
  <head>
  <style>
  a {
    color: #0072be;
  }
  </style>
  </head>
  <body>
    ${body}
  </body>`
}

function runCommand(cmd, callback) {
  exec(`${rgPath} ${cmd}`, execOpts, (err, stdout, stderr) => {
    const searchResults = stdout
    if (err == null && !stderr.length) {
      callback(null, searchResults)
    } else {
      callback(err)
    }
  })
}

function runCommandSync(cmd) {
  return execSync(`${rgPath} ${cmd}`, execOpts)
}
