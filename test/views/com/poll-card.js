const { h } = require('mutant')
const Card = require('../../../views/com/poll-card')
const mdRenderer = require('../../simple-md')
const { msg } = require('../../mock-poll')
require('../../insert-styles')()

const style = {
  'max-width': '40rem',
  margin: '0 auto'
}

// NOTE this test will needs to use a db to work
const container = h('div', { style }, [
  Card({ scuttle, msg, mdRenderer })
])

document.body.appendChild(container)
