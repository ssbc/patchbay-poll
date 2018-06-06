const { isPoll } = require('ssb-poll-schema')
const { h, computed } = require('mutant')

module.exports = function PollCard ({ scuttle, msg, mdRenderer, onClick }) {
  if (!isPoll) return

  const pollDoc = scuttle.poll.obs.get(msg.key)

  const closesAt = computed(pollDoc.closesAt, t => {
    if (!t) return
    const dateTime = new Date(t)
    console.log('beep',msg.key, dateTime)
    const [ _, time, zone ] = dateTime.toTimeString().match(/^(\d+:\d+).*(\(\w+\))$/)
    const date = dateTime.toDateString()
    return `${time},  ${date} ${zone}`
  })

  return h('PollCard', { className: 'Markdown', 'ev-click': onClick }, [
    h('h1', pollDoc.title),
    h('div.body', computed(pollDoc.body, body => mdRenderer(body || ''))),
    h('div.closesAt', [ 'closes at: ', closesAt ])
  ])
}
