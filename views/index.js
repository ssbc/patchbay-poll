const { h, Value, computed } = require('mutant')
const Scroller = require('mutant-scroll')

const PollCard = require('./com/poll-card')

const OPEN = 'open'
const CLOSED = 'closed'
const ALL = 'all'
const MINE = 'mine'

module.exports = function pollIndex ({ scuttle, createPollStream, mdRenderer, showPoll, showNewPoll }) {
  if (!mdRenderer) mdRenderer = (text) => text

  var mode = Value(OPEN)

  const prepend = [
    h('button -primary', { 'ev-click': showNewPoll }, 'New Poll'),
    h('div.show', [
      'Show: ',
      FilterButton(OPEN),
      FilterButton(CLOSED),
      FilterButton(ALL),
      FilterButton(MINE)
    ])
  ]

  const polls = computed(mode, mode => {
    return Scroller({
      prepend,
      streamToTop: scuttle.poll.pull[mode]({ old: false, live: true }),
      streamToBottom: scuttle.poll.pull[mode]({ reverse: true, live: false }),

      render: (msg) => {
        const onClick = () => showPoll(msg)
        return PollCard({ scuttle, msg, mdRenderer, onClick })
      }
    })
  })

  const page = h('PollIndex', [
    polls
  ])

  function FilterButton (m) {
    return h('button', {
      'ev-click': () => mode.set(m),
      className: computed(mode, mode => m === mode ? '-active' : '')
    }, m)
  }

  page.title = '/polls'
  return page
}
