const { h, Struct, Value, resolve, computed, map } = require('mutant')
const { parseChooseOnePoll } = require('ssb-poll-schema')

module.exports = PollShow

function PollShow ({ msg, scuttlePoll, onPollPublished, mdRenderer }) {
  if (!mdRenderer) mdRenderer = (text) => text

  const { title, body, closesAt: closesAtString, details: {choices} } = parseChooseOnePoll(msg)
  const closesAt = new Date(closesAtString)

  // TODO use parseChooseOnePoll or scuttlePoll
  const pollDoc = Struct({ results: [], positions: [] })
  updatePollDoc()

  function updatePollDoc () {
    scuttlePoll.poll.async.get(msg.key, (err, data) => {
      if (err) console.error(err)

      pollDoc.set(data)
    })
  }

  const date = closesAt.toDateString()
  const [ _, time, zone ] = closesAt.toTimeString().match(/^(\d+:\d+).*(\(\w+\))$/)

  const page = h('PollShow -chooseOne', [
    h('section.details', [
      h('h1', title),
      h('div.body', mdRenderer(body)),
      h('div.closesAt', [
        h('div.label', 'Closes at'),
        `${time},  ${date} ${zone}`
      ])
    ]),
    NewPosition({ choices }),
    Results({ pollDoc })
  ])

  return page

  function Results ({ pollDoc }) {
    return h('section.PollResults', map(pollDoc.results, result => {
      console.log('r', result)
      return h('div.choice', [
        h('div.header', result.choice),
        h('div.positions', Object.keys(result.voters).map(id => {
          console.log(result.voters[id])
          return id
        }))
      ])
    }))
  }

  function NewPosition ({ choices }) {
    const newPosition = Struct({
      choice: Value(0),
      reason: Value('')
    })

    return h('section.NewPosition', [
      h('div.field -choices', [
        h('label', 'Choices'),
        h('div.inputs', [
          choices.map((choice, index) => {
            var id = `choice-${index}`
            return h('div.choice', {'ev-click': ev => { newPosition.choice.set(index) }}, [
              h('input', { type: 'radio', checked: computed(newPosition.choice, c => c === index), id, name: 'choices' }),
              h('label', { for: id }, choice)
            ])
          })
        ])
      ]),
      h('div.field -reason', [
        h('label', 'Reason'),
        h('textarea', { 'ev-input': ev => newPosition.reason.set(ev.target.value) }, newPosition.reason)
      ]),

      h('div.publish', [
        h('button', { 'ev-click': publish }, 'Go!')
      ])
    ])

    function publish () {
      const content = {
        poll: parseChooseOnePoll(msg),
        choice: resolve(newPosition.choice),
        reason: resolve(newPosition.reason)
      }
      scuttlePoll.position.async.publishChooseOne(content, (err, success) => {
        if (err) return console.log(err) // put warnings on form
        onPollPublished(success)
        // TODO - check if this should be here...
        updatePollDoc()
      })
    }
  }
}
