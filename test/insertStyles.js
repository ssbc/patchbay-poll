const insertCss = require('insert-css')
const mcss = require('micro-css')

module.exports = () => {
  const mcssStyles = require('../modules/styles/mcss').create().styles.mcss()
  const css = Object.keys(mcssStyles)
  .map(k => mcss(mcssStyles[k]))
  .join('\n')

  insertCss(css)
}
