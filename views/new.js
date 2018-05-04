const { h, Struct, Array: MutantArray, Value, map, resolve } = require('mutant')
// 'flatpickr' is also required, but done further down because it adds itself to the DOM on require D:

module.exports = PollNew

function PollNew ({ scuttlePoll, onPollPublished, onCancel }) {
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

    h('div.actions', [
      h('button', { 'ev-click': cancel }, 'Cancel'),
      h('button', { 'ev-click': publish }, 'Start Poll')
    ])
  ])

  const Pickr = require('flatpickr')
  picker = new Pickr(timeInput, {
    enableTime: true,
    altInput: true,
    altFormat: 'F j, Y h:i K',
    dateFormat: 'Z'
  })

  page.cancel = cancel // made available for manual garbage collection of flatpicker
  return page

  function cancel () {
    picker && picker.destroy && picker.destroy()
    onCancel && onCancel()
  }

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
