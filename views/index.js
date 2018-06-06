const { h, Value, computed, watch } = require('mutant')
const Scroller = require('mutant-scroll')

const PollCard = require('./com/poll-card')

const OPEN = 'open'
const CLOSED = 'closed'

module.exports = function pollIndex ({ scuttle, createPollStream, mdRenderer, showPoll, showNewPoll }) {
  if (!mdRenderer) mdRenderer = (text) => text

  var viewMode = Value(OPEN)

  const polls = h('div', computed(viewMode, mode => {
    return Scroller({
      classList: ['PollIndex'],

      streamToTop: scuttle.poll.pull[mode]({ old: false, live: true }),
      streamToBottom: scuttle.poll.pull[mode]({ reverse: true, live: false }),

      render: (msg) => {
        const onClick = () => showPoll(msg)
        return PollCard({ scuttle, msg, mdRenderer, onClick })
      }
    })
  }))

  const page = h('Page -polls', [
    h('header', [
      h('h1', ['Polls - ', viewMode]),
      h('button', { 'ev-click': showNewPoll }, 'New Poll'),
      h('div.show', [
        'Show: ',
        h('button', { 'ev-click': () => viewMode.set(OPEN) }, 'Open'),
        h('button', { 'ev-click': () => viewMode.set(CLOSED) }, 'Closed')
      ])
    ]),
    polls
  ])

  page.title = '/polls'
  return page
}
