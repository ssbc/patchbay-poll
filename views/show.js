const { h, Struct, Array: MutantArray, Value, map, resolve } = require('mutant')
const { parseChooseOnePoll } = require('ssb-poll-schema')

module.exports = PollShow

function PollShow ({ msg, scuttlePoll, onPollPublished, mdRenderer }) {
  if (!mdRenderer) mdRenderer = (text) => text

  const { title, body, closesAt: closesAtString, details: {choices} } = parseChooseOnePoll(msg)
  const closesAt = new Date(closesAtString)
  const poll = Struct({
    title,
    body,
    choices: MutantArray(choices.map((choice, index) => Struct({choice, index}))),
    closesAt: closesAt,
    choice: Value(0),
    reason: Value('')
  })

  const date = closesAt.toDateString()
  const [ _, time, zone ] = closesAt.toTimeString().match(/^(\d+:\d+).*(\(\w+\))$/)

  const page = h('PollShow -chooseOne', [
    h('h1', poll.title),
    h('div.closesAt', [
      'closes at: ',
      `${time},  ${date} ${zone}`
    ]),

    h('div.body', mdRenderer(msg.body)),
    h('div.field -choices', [
      h('label', 'Choices'),
      h('div.inputs', [
        map(poll.choices, ({choice, index}) => {
          var id = `choice-${index()}`
          return h('div.choice', [
            h('input', { type: 'radio', 'ev-change': ev => { poll.choice.set(index()) }, id, name: 'choices' }),
            h('label', { for: id }, choice)
          ])
        })
      ])
    ]),
    h('div.field -reason', [
      h('label', 'Reason'),
      h('textarea', { 'ev-input': ev => poll.reason.set(ev.target.value) }, poll.reason)
    ]),

    h('div.publish', [
      h('button', { 'ev-click': publish }, 'Go!')
    ])
  ])

  return page

  function publish () {
    const content = {
      choice: poll.choice(),
      poll: Object.assign({key: msg.key}, parseChooseOnePoll(msg)),
      reason: resolve(poll.reason)
    }
    scuttlePoll.position.async.publishChooseOne(content, (err, success) => {
      if (err) return console.log(err) // put warnings on form
      onPollPublished(success)
    })
  }
}
