const { h, Value, computed } = require('mutant')
const Scroller = require('mutant-scroll')
const next = require('pull-next-query')

const PollCard = require('./com/poll-card')

const FUTURE = 'future'
const PAST = 'past'

// TODO extract createPollStream to scuttle-poll
module.exports = function pollIndex ({ scuttle, createPollStream, mdRenderer, showPoll, showNewPoll }) {
  if (!mdRenderer) mdRenderer = (text) => text

  var viewMode = Value(FUTURE)

  const polls = h('div', computed(viewMode, mode => {
    return Scroller({
      classList: ['PollIndex'],
      streamToTop: StepperStream({ old: false, live: true }, mode),
      streamToBottom: StepperStream({ reverse: true }, mode),
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
        h('button', { 'ev-click': () => viewMode.set(FUTURE) }, 'Open'),
        h('button', { 'ev-click': () => viewMode.set(PAST) }, 'Closed')
      ])
    ]),
    polls
  ])

  page.title = '/polls'
  return page

  function StepperStream (opts, mode = FUTURE) {
    console.log('mode', mode)
    const defaultOpts = {
      limit: 100,
      query: [{
        $filter: {
          value: {
            timestamp: { $gt: 0 },
            content: { type: 'poll' }
          }
        }
      }]
    }
    if (mode === FUTURE) defaultOpts.query[0].$filter.value.content.closesAt = { $gt: new Date().toISOString() }
    if (mode === PAST) defaultOpts.query[0].$filter.value.content.closesAt = { $lt: new Date().toISOString() }
    const _opts = Object.assign({}, defaultOpts, opts)

    return next(createPollStream, _opts)
  }
}
