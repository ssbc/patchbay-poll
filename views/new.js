const { h, Struct, Array: MutantArray, Value, map, resolve } = require('mutant')

module.exports = PollNew

function PollNew ({ scuttlePoll }) {
  const input = Struct({
    title: undefined,
    body: undefined,
    choices: MutantArray([Value(), Value(), Value()])
  })

  return h('PollNew -chooseOne', [
    h('h1', 'New Choose-one Poll'),
    h('div.field -title', [
      h('label', 'Title'),
      h('input', { 'ev-input': ev => input.title.set(ev.target.value) }, input.title)
    ]),
    h('div.field -body', [
      h('label', 'Description'),
      h('textarea', { 'ev-input': ev => input.body.set(ev.target.value) }, input.body)
    ]),

    h('div.field -choices', [
      h('label', 'Choices'),
      h('div.inputs', [
        map(input.choices, (choice) => {
          return h('input', { 'ev-input': ev => choice.set(ev.target.value) }, choice)
        }),
        h('button', { 'ev-click': () => input.choices.push(Value()) }, '+ Add more')
      ])
    ]),

    h('div.field -closesAt', [
      h('label', 'Closes at'),
      h('input', { 'ev-input': ev => input.body.set(ev.target.value) }, input.body)
    ]),

    h('div.publish', [
      h('button', { 'ev-click': publish }, 'Start Poll')
    ])
  ])

  function publish () {
    const content = resolveInput(input)
    scuttlePoll.poll.async.publishChooseOne(content)
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
