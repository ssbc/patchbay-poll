const { h, Struct, Value, resolve, computed, map, when } = require('mutant')
const { parseChooseOnePoll } = require('ssb-poll-schema')

module.exports = PollShow

function PollShow ({ poll, scuttle, onPositionPublished, mdRenderer, avatar, timeago, name }) {
  if (!mdRenderer) mdRenderer = (text) => text
  if (!avatar) avatar = defaultAvatar
  if (!timeago) timeago = defaultTimeago
  if (!name) name = defaultName

  const pollDoc = scuttle.poll.obs.get(poll.key)
  const closesAt = computed(pollDoc.closesAt, t => {
    if (!t) return
    const dateTime = new Date(t)
    const [ _, time, zone ] = dateTime.toTimeString().match(/^(\d+:\d+).*(\(\w+\))$/)
    const date = dateTime.toDateString()
    return `${time},  ${date} ${zone}`
  })

  const page = h('PollShow -chooseOne', [
    h('section.details', [
      h('h1', pollDoc.title),
      h('div.body', computed(pollDoc.body, body => mdRenderer(body || ''))),
      h('div.closesAt', [
        h('div.label', [ 'Closes at: ', closesAt ])
      ])
    ]),
    NewPosition({
      choices: computed(pollDoc, doc => doc.value.content.details.choices || []),
      currentPosition: pollDoc.myPosition,
      onPublish: (success) => {
        onPositionPublished(success)
      }
    }),
    Progress({ pollDoc, avatar, timeago, name, mdRenderer })
  ])

  return page

  function Progress ({ pollDoc, avatar, timeago, name, mdRenderer }) {
    const forceShow = Value(false)
    const showProgress = computed([pollDoc.myPosition, forceShow], (myPosition, force) => {
      if (force) return true
      return Boolean(myPosition)
    })

    return when(showProgress,
      [
        Results({ pollDoc, avatar }),
        Positions({ pollDoc, avatar, timeago, name, mdRenderer })
      ],
      h('div.sneakpeak', { 'ev-click': ev => forceShow.set(true) },
        'see results'
      )
    )
  }

  function Positions ({ pollDoc, avatar, timeago, name, mdRenderer }) {
    return h('section.PollPositions', [
      h('h2', ['History']),
      h('div.positions', map(pollDoc.positions, position => {
        const {author, timestamp} = position.value
        // postion, reason, time, avatar, name
        return h('PollPosition', [
          h('div.left', [
            h('div.avatar', avatar(author)),
            h('div.timestamp', timeago(timestamp))
          ]),
          h('div.right', [
            h('div.summary', [
              h('div.name', name(author)),
              '-',
              h('div.choice', position.choice)
            ]),
            h('div.reason', mdRenderer(position.reason))
          ])
        ])
      }))
    ])
  }

  function Results ({ pollDoc, avatar }) {
    return h('section.PollResults', [
      h('h2', 'Current Results'),
      h('div.choices', map(pollDoc.results, result => {
        const count = computed(result.voters, vs => Object.keys(vs).length)
        return when(count, h('div.choice', [
          h('div.header', [
            result.choice,
            h('span.count', ['(', count, ')'])
          ]),
          h('div.positions', Object.keys(result.voters).map(avatar))
        ]))
      }))
    ])
  }

  function NewPosition ({ choices, currentPosition, onPublish }) {
    const newPosition = Struct({
      choice: Value(),
      reason: Value('')
    })

    const forceShow = Value(false)

    const className = computed([pollDoc.myPosition, forceShow], (myPosition, force) => {
      if (force) return '-show'
      if (myPosition === false) return '-hidden'
      return !myPosition ? '-show' : '-hidden'
    })

    return h('section.NewPosition', { className }, [
      h('div.field -choices', [
        h('label', 'Choose One'),
        h('div.inputs', map(choices, (choice, index) => {
          var id = `choice-${index}`
          return h('div.choice', {'ev-click': ev => { newPosition.choice.set(index) }}, [
            h('input', { type: 'radio', checked: computed(newPosition.choice, c => c === index), id, name: 'choices' }),
            h('label', { for: id }, choice)
          ])
        })
        )
      ]),
      h('div.field -reason', [
        h('label', 'Reason'),
        h('textarea', { 'ev-input': ev => newPosition.reason.set(ev.target.value) }, newPosition.reason)
      ]),
      h('div.actions', [
        h('button.publish.-primary', { 'ev-click': publish }, 'Publish position')
      ]),
      h('div.changePosition', { 'ev-click': ev => forceShow.set(true) },
        'Change your position'
      )
    ])

    function publish () {
      const content = {
        poll: parseChooseOnePoll(poll),
        choice: resolve(newPosition.choice),
        reason: resolve(newPosition.reason)
      }
      scuttle.position.async.publishChooseOne(content, (err, success) => {
        if (err) return console.log(err) // put warnings on form

        onPublish(success)
        forceShow.set(false)
      })
    }
  }
}

function defaultAvatar (feedId) {
  return h('DefaultPollAvatar', { style: { 'background-color': `hsl(${Math.random() * 360}, 40%, 40%)` } }, [
    feedId.substr(0, 5),
    '..'
  ])
}

function defaultTimeago (time) {
  return new Date(time).toISOString().substr(0, 10)
}

function defaultName (feedId) {
  return h('DefaultPollName', [
    feedId.substr(0, 5),
    '..'
  ])
}

function printClosesAt (dateTime) {
  const date = dateTime.toDateString()
  const [ _, time, zone ] = dateTime.toTimeString().match(/^(\d+:\d+).*(\(\w+\))$/)
  return `${time}, ${date} ${zone}`
}
