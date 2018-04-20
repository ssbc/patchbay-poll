const insertCss = require('insert-css')
const mcss = require('micro-css')

const fs = require('fs')
const stylePath = require.resolve('flatpickr/dist/flatpickr.css')

module.exports = () => {
  const mcssStyles = require('../modules/styles/mcss').create().styles.mcss()
  const cssA = Object.keys(mcssStyles)
  .map(k => mcss(mcssStyles[k]))
  .join('\n')

  // const cssStyles = require('../modules/styles/css').create().styles.css()
  // const cssB = Object.keys(cssStyles)
  // .map(k => mcss(cssStyles[k]))
  // .join('\n')
  //
  // insertCss([cssA, cssB].join('\n'))

  insertCss(cssA)

  const styleCss = fs.readFileSync(stylePath, 'UTF8')
  insertCss(styleCss)
}
