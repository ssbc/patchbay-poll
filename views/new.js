const { h, Struct, Array: MutantArray, Value, map, resolve } = require('mutant')
const Pickr = require('flatpickr')

module.exports = PollNew

function PollNew ({ scuttlePoll, onPollPublished }) {
  const poll = Struct({
    title: undefined,
    body: undefined,
    choices: MutantArray([Value(), Value(), Value()]),
    closesAt: undefined
  })

  var picker
  const timeInput = h('input', {
    'ev-change': () => {
      poll.closesAt.set(picker.input.value)
    }
  })

  const page = h('PollNew -chooseOne', [
    h('h1', 'New Choose-one Poll'),
    h('div.field -title', [
      h('label', 'Title'),
      h('input', { 'ev-input': ev => poll.title.set(ev.target.value) }, poll.title)
    ]),
    h('div.field -body', [
      h('label', 'Description'),
      h('textarea', { 'ev-input': ev => poll.body.set(ev.target.value) }, poll.body)
    ]),

    h('div.field -choices', [
      h('label', 'Choices'),
      h('div.inputs', [
        map(poll.choices, (choice) => {
          return h('input', { 'ev-input': ev => choice.set(ev.target.value) }, choice)
        }),
        h('button', { 'ev-click': () => poll.choices.push(Value()) }, '+ Add more')
      ])
    ]),

    h('div.field -closesAt', [
      h('label', 'Closes at'),
      timeInput
    ]),

    h('div.publish', [
      h('button', { 'ev-click': publish }, 'Start Poll')
    ])
  ])

  picker = new Pickr(timeInput, {
    enableTime: true,
    altInput: true,
    altFormat: 'F j, Y h:i K',
    dateFormat: 'Z'
  })

  return page

  function publish () {
    const content = resolveInput(poll)
    scuttlePoll.poll.async.publishChooseOne(content, (err, success) => {
      if (err) return console.log(err) // put warnings on form
      onPollPublished(success)
    })
  }
}

function resolveInput (struct) {
  // prunes all empty fields
  // returns plain object
  var result = resolve(struct)

  Object.keys(result)
    .forEach(k => {
      const val = result[k]
      if (!val) delete result[k]

      if (Array.isArray(val)) result[k] = val.filter(Boolean)
    })
  return result
}
