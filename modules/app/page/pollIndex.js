const { h } = require('mutant')
const nest = require('depnest')
const isPoll = require('scuttle-poll/isPoll')
const pull = require('pull-stream')
const page = require('../../../views/pollIndex')

exports.gives = nest({
  'app.html.menuItem': true,
  'app.page.pollIndex': true
})

exports.needs = nest({
  'feed.pull.type': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest({
    'app.html.menuItem': menuItem,
    'app.page.pollIndex': pollIndex
  })

  function menuItem (handleClick) {
    return h('a', {
      style: { order: 9 },
      'ev-click': () => handleClick({ page: 'polls' })
    }, '/polls')
  }

  function pollIndex (path) {
    return page({
      server: api.sbot.obs.connection,
      createPollStream
    })
  }

  function createPollStream () {
    return (opts) => pull(
      api.feed.pull.type('poll')(opts), // TODO update patchcore
      pull.filter(isPoll)
    )

    // NOTE an attempt at mocking a feed
    return pull.values([{
      key: 'something',
      value: {
        author: 'dave',
        content: {
          type: 'poll',
          version: 'v1',
          title: 'should I host a wellington savings pool meetup?',
          body: 'savings pools involve money, but are really about exploring community dynamics, trust, and dreaming about a better future',
          closesAt: '2018-03-20T03:40:06.222Z',
          details: {
            type: 'chooseOne',
            choices: ['lasagne', 'avos', 'tacos']
          }
        }
      }
    }])
  }
}
