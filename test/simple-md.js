const renderer = require('ssb-markdown')
const { h } = require('mutant')

module.exports = function simpleMd (text) {
  return h('Markdown', {
    innerHTML: renderer.block(text)
  })
}
