const { h } = require('mutant')
const Card = require('../../../views/com/pollCard')
const mdRenderer = require('../../simple-md')
const { msg } = require('../../mock-poll')
require('../../insertStyles')()

const style = {
  'max-width': '40rem',
  margin: '0 auto'
}
const container = h('div', { style }, [
  Card({ msg, mdRenderer })
])

document.body.appendChild(container)
