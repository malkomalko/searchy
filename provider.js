const vscode = require('vscode')
const querystring = require('querystring')
const rgPath = require('vscode-ripgrep').rgPath
const {
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

    let resultsArray = searchResults.toString().split('\n')
    let resultsByFile = {}

    resultsArray.forEach((searchResult) => {
      let splitLine = searchResult.split(/:(.+)/)
      if (splitLine[0] == null || !splitLine[0].length) {
        return
      }
      if (resultsByFile[splitLine[0]] == null) {
        resultsByFile[splitLine[0]] = []
      }
      resultsByFile[splitLine[0]].push(formatLine(splitLine))
    })

    let sortedFiles = Object.keys(resultsByFile).sort()

    let lines = sortedFiles.map((fileName) => {
      let resultsForFile = resultsByFile[fileName].map((searchResult) => {
        return `<p> - ${searchResult}</p>`
      }).join('')
      return `
      <h3>=> <a href="${openLink(fileName)}">${fileName}</a></h3>
      ${resultsForFile}
      `
    })
    let header = [`<h1><b>${resultsArray.length}</b> search results found</h1>`]
    let content = header.concat(lines)

    return renderHTML(content.join('<br>'))
  }

  this.scheme = 'searchy'
}

function formatLine(splitLine) {
  return splitLine[1]
}

function openLink(fileName) {
  var params = {
    fileName: fileName
  }
  return encodeURI('command:searchy.openFile?' + JSON.stringify(params))
}

function renderHTML(body) {
  return `
  <head>
  <style>
  body {
    font-family: 'Hack';
  }
  a {
    color: #61afef;
    margin: 0;
    padding: 0;
  }
  h3 {
    color: #98c379;
    margin: 0 0 15px 0;
    padding: 0;
  }
  p {
    margin: 0 0 3px 0;
    padding: 0;
  }
  </style>
  </head>
  <body>
    ${body}
  </body>`
}

function runCommandSync(cmd) {
  return execSync(`${rgPath} ${cmd}`, execOpts)
}
