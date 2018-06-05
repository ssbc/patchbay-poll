const { h } = require('mutant')
const pull = require('pull-stream')

const server = require('scuttle-testbot')
  .use(require('ssb-backlinks'))
  .use(require('ssb-query'))
  .call()

const Page = require('../../views/index')
require('../insert-styles')()
const mocks = require('../mock-polls')

pull(
  pull.values(mocks),
  pull.asyncMap(server.publish),
  pull.collect((err, data) => {
    if (err) throw err

    // console.log(data)
    drawPage()
  })
)

function drawPage () {
  const page = Page({
    // TODO move this upstream into scuttle-poll
    createPollStream: server.query.read,
    showNewPoll: () => console.log('Opened new poll thing'),
    openNewPage: () => console.log('Opened new page')

  })

  document.body.appendChild(page)
}
