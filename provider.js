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
      return `${err}`
    }

    if (searchResults == null || !searchResults.length) {
      return 'There was an error during your search!'
    }

    let resultsArray = searchResults.toString().split('\n')
    resultsArray = resultsArray.filter((item) => {
      return item != null && item.length > 0
    })
    let resultsByFile = {}

    resultsArray.forEach((searchResult) => {
      let splitLine = searchResult.split(/([^:]+):([^:]+):(.+)/)
      let fileName = splitLine[1]
      if (fileName == null || !fileName.length) {
        return
      }
      if (resultsByFile[fileName] == null) {
        resultsByFile[fileName] = []
      }
      resultsByFile[fileName].push(formatLine(splitLine))
    })

    let sortedFiles = Object.keys(resultsByFile).sort()

    let lines = sortedFiles.map((fileName) => {
      let resultsForFile = resultsByFile[fileName].map((searchResult) => {
        return `${searchResult.result}`
      }).join('\n')
      return `
${fileName}
${resultsForFile}`
    })
    let header = [`${resultsArray.length} search results found`]
    let content = header.concat(lines)

    return content.join('\n')
  }

  this.scheme = 'searchy'
}

function formatLine(splitLine) {
  return {
    line: splitLine[2],
    result: splitLine[3]
  }
}

function openLink(fileName, line) {
  var params = {
    fileName: fileName,
    line: line
  }
  return encodeURI('command:searchy.openFile?' + JSON.stringify(params))
}

function runCommandSync(cmd) {
  return execSync(`${rgPath} -n ${cmd}`, execOpts)
}
