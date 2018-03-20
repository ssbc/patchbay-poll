const { h } = require('mutant')
const Card = require('../../../views/com/poll-card')
const mdRenderer = require('../../simple-md')
const { msg } = require('../../mock-poll')
require('../../insert-styles')()

const style = {
  'max-width': '40rem',
  margin: '0 auto'
}
const container = h('div', { style }, [
  Card({ msg, mdRenderer })
])

document.body.appendChild(container)
