const pull = require('pull-stream')
const ScuttlePoll = require('scuttle-poll')

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

    setTimeout(
      () => {
        scuttle.poll.async.publishUpdatedClosingTime(
          { poll: data[3], closesAt: '2030-03-20T03:40:06.222Z' },
          console.log
        )
      },
      5000
    )
  })
)

const scuttle = ScuttlePoll(server)

function drawPage () {
  const page = Page({
    // TODO move this upstream into scuttle-poll
    scuttle,
    createPollStream: server.query.read, // TODO pull into scuttle
    showNewPoll: () => console.log('Opened new poll thing'),
    openNewPage: () => console.log('Opened new page')

  })

  document.body.appendChild(page)
}
