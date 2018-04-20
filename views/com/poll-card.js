// const ScuttlePoll = require('scuttle-poll')
const { parsePoll } = require('ssb-poll-schema')
const { h, Struct, map } = require('mutant')

module.exports = function PollCard ({ msg, mdRenderer }) {
  const { title, body, closesAt } = parsePoll(msg)

  const date = closesAt.toDateString()
  const [ _, time, zone ] = closesAt.toTimeString().match(/^(\d+:\d+).*(\(\w+\))$/)

  return h('PollCard', { className: 'Markdown' }, [
    h('h1', title),
    h('div.body', mdRenderer(body)),
    h('div.closesAt', [
      'closes at: ',
      `${time},  ${date} ${zone}`
    ])
  ])

    // h('div.choices', map(choices, choice => {
    //   return h('button', choice)
    //   // return h('button', { 'ev-click': publishPosition(choice, reason) }, choice)
    // })),
    // h('div.positions', map(positions, position => {
    //   return h('pre.position', JSON.stringify(position.value.content, null, 2))
    //   // name, position, reason
    //   // e.g. mix "YES!", "it's a good idea"
    //   // decorated position
    //   // { key, value, author: @mix, choice: "YES", reason: "it's a good idea" }
    // }))
}


/// // LEFTOVERS vv
// TODO - make the poll.obs.get to collapse all this !
function getPoll ({ msg, server }) {
  const { title, body, closesAt, pollDetails: { choices } } = msg.value.content
  console.log(msg)

    // build an mutant obs
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

  function updateDetails (msg, poll) {
    ScuttlePoll(server).poll.async.get(msg.key, (err, _poll) => {
      if (err) throw err

      poll.positions.set(_poll.positions)
      poll.results.set(_poll.results)
    })
  }
}
