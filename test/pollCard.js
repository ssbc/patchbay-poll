const Card = require('../views/pollCard')
const { h } = require('mutant')

const insertCss = require('insert-css')
const mcss = require('micro-css')

const mcssStyles = require('../modules/styles/mcss').create().styles.mcss()
const css = Object.keys(mcssStyles)
  .map(k => mcss(mcssStyles[k]))
  .join('\n')

insertCss(css)

const { msg } = require('./mock-poll')

const style = {
  'max-width': '40rem',
  margin: '0 auto'
}
const container = h('div', { style }, [
  Card({ msg })
])

document.body.appendChild(container)

