const { h } = require('mutant')
const pull = require('pull-stream')
const ScuttlePoll = require('scuttle-poll')

const server = require('scuttle-testbot')
  .use(require('ssb-backlinks'))
  .use(require('ssb-query'))
  .call()

const scuttle = ScuttlePoll(server)

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
    scuttle,
    createPollStream: server.query.read,
    showNewPoll: () => console.log('Opened new poll thing'),
    openNewPage: () => console.log('Opened new page')

  })

  document.body.appendChild(page)
}
