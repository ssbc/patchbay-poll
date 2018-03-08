const nest = require('depnest')
const Scuttle = require('scuttle-poll')
const isPoll = require('scuttle-poll/isPoll')
const { h, Struct, map } = require('mutant')

exports.gives = nest('message.html.render')

exports.needs = nest({
  // 'about.obs.color': 'first',
  // 'blob.sync.url': 'first',
  'message.html.decorate': 'reduce',
  'message.html.layout': 'first',
  'message.html.markdown': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest('message.html.render', pollRender)

  function pollRender (msg, opts) {
    if (!isPoll(msg)) return

    const poll = getPoll(msg)
    const { title, body, choices, closesAt, positions } = poll

    const content = h('PollCard', { className: 'Markdown' }, [
      h('h1', title),
      h('div.body', api.message.html.markdown(body())),
      h('div.choices', map(choices, choice => {
        return h('button', choice)
      })),
      h('div.closesAt', [ 'closes at: ', closesAt ]),
      h('div.positions', map(positions, position => {
        return h('pre.position', JSON.stringify(position.value.content, null, 2))
      }))
    ])

    const element = api.message.html.layout(msg, Object.assign({}, {
      content,
      layout: 'default'
    }, opts))

    return api.message.html.decorate(element, { msg })
  }

  function getPoll (msg) {
    const { title, body, closesAt, pollDetails: { choices } } = msg.value.content
    const poll = Struct({
      title,
      body,
      closesAt: new Date(closesAt).toString(),
      choices,
      positions: [],
      results: []
    })
    updateDetails(msg, poll)
    return poll
  }

  function updateDetails (msg, poll) {
    Scuttle(api.sbot.obs.connection).poll.async.get(msg.key, (err, _poll) => {
      if (err) throw err

      poll.positions.set(_poll.positions)
      poll.results.set(_poll.results)
    })
  }
}
