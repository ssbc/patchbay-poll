// const ScuttlePoll = require('scuttle-poll')
const { parseChooseOnePoll, isPoll } = require('ssb-poll-schema')
const { h, Struct, map } = require('mutant')

module.exports = function PollCard ({ scuttle, msg, mdRenderer, onClick }) {
  if (!isPoll) return
  // const pollDoc = getPoll({ scuttle, msg })
  const { title, body, closesAt: closesAtString } = parseChooseOnePoll(msg)

  const closesAt = new Date(closesAtString)
  const date = closesAt.toDateString()
  const [ _, time, zone ] = closesAt.toTimeString().match(/^(\d+:\d+).*(\(\w+\))$/)

  return h('PollCard', { className: 'Markdown', 'ev-click': onClick }, [
    h('h1', title),
    h('div.body', mdRenderer(body || '')),
    h('div.closesAt', [
      'closes at: ',
      `${time},  ${date} ${zone}`
    ])
  ])
}

// NOTE - this is one way to handle getting the details into a card aynchronosly
// this is going to be needed for updating the closesAt
//
// function getPoll ({ msg, scuttle }) {
//   const { title, body, closesAt, pollDetails: { choices } } = msg.value.content

//   // build a mutant obs
//   const pollDoc = Struct({
//     title,
//     body,
//     closesAt: new Date(closesAt).toString(),
//     choices,
//     positions: [],
//     results: []
//   })
//   updateDetails(msg, pollDoc)
//   return pollDoc

//   function updateDetails (msg, poll) {
//     scuttle.poll.async.get(msg.key, (err, _poll) => {
//       if (err) throw err

//       poll.positions.set(_poll.positions)
//       poll.results.set(_poll.results)
//     })
//   }
// }
