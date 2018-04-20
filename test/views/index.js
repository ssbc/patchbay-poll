const { h } = require('mutant')
const pull = require('pull-stream')
const Page = require('../../views/index')
const { msg } = require('../mock-poll')
require('../insert-styles')()

const style = {
  'max-width': '40rem',
  margin: '0 auto'
}
const container = h('div', { style }, [
  Page({
    createPollStream: () => pull(
      pull.values([msg]),
      pull.through(console.log)
    ),
    showNewPoll: () => console.log('Opened new poll thing'),
    openNewPage: () => console.log('Opened new page')

  })
])

document.body.appendChild(container)
