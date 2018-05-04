const { h, Value } = require('mutant')
const nest = require('depnest')
const ScuttlePoll = require('scuttle-poll')
const { isPoll } = require('ssb-poll-schema')
const pull = require('pull-stream')
const PollIndex = require('../../../views/index')
const PollNew = require('../../../views/new')

exports.gives = nest({
  'app.html.menuItem': true,
  'app.page.pollIndex': true
})

exports.needs = nest({
  'app.html.modal': 'first',
  'app.sync.goTo': 'first',
  'feed.pull.type': 'first',
  'message.html.markdown': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest({
    'app.html.menuItem': menuItem,
    'app.page.pollIndex': pollIndexPage
  })

  function menuItem (handleClick) {
    return h('a', {
      style: { order: 9 },
      'ev-click': () => handleClick({ page: 'polls' })
    }, '/polls')
  }

  function pollIndexPage (path) {
    const newPoll = api.app.html.modal(
      PollNew({
        scuttlePoll: ScuttlePoll(api.sbot.obs.connection),
        onPollPublished: (success) => {
          console.log('onPollPublished', success)
          newPoll.close()
        }
      })
    )

    const indexPage = PollIndex({
      createPollStream: (opts) => pull(
        api.feed.pull.type('poll')(opts), // TODO update patchcore
        pull.filter(isPoll)
      ),
      mdRenderer: api.message.html.markdown,
      showPoll: api.app.sync.goTo,
      showNewPoll: () => newPoll.open()
    })

    indexPage.appendChild(newPoll)

    return indexPage
  }
}
