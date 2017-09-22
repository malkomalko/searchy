module.exports = function TextDocumentContentProvider() {
  this.searchData = null
  this.setData = (data) => this.searchData = data

  this.provideTextDocumentContent = function (uri) {
    if (this.searchData == null) {
      return renderHTML('<b>There was an error during your search!</b>')
    }

    let lines = this.searchData.split('\n')
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
