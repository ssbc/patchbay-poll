const { h, Value } = require('mutant')
const { parseChooseOnePoll } = require('ssb-poll-schema')
const Scroller = require('mutant-scroll')
const next = require('pull-next-step')

const PollCard = require('./com/poll-card')

module.exports = function pollIndex ({ createPollStream, mdRenderer, showNewPoll }) {
  if (!mdRenderer) mdRenderer = (text) => text
  // TODO wire up mdRenderer (inject or require?)

  var viewMode = Value('future')
  var page = createPage('future')

  // this doesn't work
  viewMode(updateToMode)
  function updateToMode (mode) {
    console.log(mode)
    const parentEl = page.parentElement
    if (!parentEl) {
      console.log('not there yet!')
      setTimeout(() => updateToMode(mode), 200)
      return
    }
    parentEl.removeChild(page)
    parentEl.appendChild(createPage(mode))
  }

  return page

  function createPage (mode) {
    const base = {
      classList: ['PollIndex'],
      prepend: h('header', [
        h('h1', `Polls ${mode}`),
        h('button', { 'ev-click': showNewPoll }, 'New Poll')
        // h('div.show', [
        //   'Show: ',
        //   h('button', { 'ev-click': () => viewMode.set('future') }, 'Open'),
        //   h('button', { 'ev-click': () => viewMode.set('past') }, 'Closed')
        // ])
      ])
    }

    switch (mode) {
      case 'future':
        return Scroller(Object.assign({}, base, {
          streamToTop: next(createPollStream, { old: false, limit: 100, property: ['value', 'timestamp'] }),
          streamToBottom: next(createPollStream, { reverse: true, limit: 100, live: false, property: ['value', 'timestamp'] }),
          render: (msg) => {
            const { closesAt } = parseChooseOnePoll(msg)

            if (new Date(closesAt) < new Date()) return// TODO figure out nice way to make this update
            return PollCard({ msg, mdRenderer })
          }
        }))

      // TODO get logic right - I just flipped the streamToTop/Bottom && render filter
      // case 'past':
      //   return Scroller(Object.assign({}, {
      //     streamToTop: next(createPollStream, { reverse: true, limit: 100, live: false, property: ['value', 'timestamp'] }),
      //     streamToBottom: next(createPollStream, { old: false, limit: 100, property: ['value', 'timestamp'] }),
      //     render: (msg) => {
      //       const { closesAt } = parsePoll(msg)

      //       if (new Date(closesAt) > new Date()) return// TODO figure out nice way to make this update
      //       return PollCard({ msg, mdRenderer })
      //     }
      //   }))
    }
  }
}
