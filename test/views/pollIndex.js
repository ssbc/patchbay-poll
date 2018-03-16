const { h } = require('mutant')
const pull = require('pull-stream')
const Page = require('../../views/pollIndex')
const { msg } = require('../mock-poll')
require('../insertStyles')()

const style = {
  'max-width': '40rem',
  margin: '0 auto'
}
const container = h('div', { style }, [
  Page({
    createPollStream: () => pull(
      pull.values([msg]),
      pull.through(console.log)
    )
  })
])

document.body.appendChild(container)
