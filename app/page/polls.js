const nest = require('depnest')
const { h } = require('mutant')
const Scuttle = require('scuttle-poll')

exports.gives = nest({
  'app.html.menuItem': true,
  'app.page.polls': true
})

exports.needs = nest({
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest({
    'app.html.menuItem': menuItem,
    'app.page.polls': pollsPage
  })

  function menuItem (handleClick) {
    return h('a', {
      style: { order: 9 },
      'ev-click': () => handleClick({ page: 'polls' })
    }, '/polls')
  }

  function pollsPage (path) {
    const publishPoll = () => {
      const closesAt = new Date()
      closesAt.setDate(closesAt.getDate() + 7)

      const opts = {
        title: 'Do you want to join my savings pool?',
        body: 'I reckon savings pools are a good way to bootstrap into some awesome future',
        choices: [
          'yes!',
          'no',
          'tell me more'
        ],
        closesAt: closesAt.toISOString()
      }

      Scuttle(api.sbot.obs.connection).poll.async.chooseOne(opts, console.log)
    }

    return h('Scroller -polls', [
      h('div.wrapper', [
        h('section.content', [
          h('h1', 'Polls'),
          h('button', { 'ev-click': publishPoll }, 'Publish pre-filled poll')
        ])
      ])

    ])
  }
}
