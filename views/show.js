const { h, Struct, Value, resolve, computed, map, when } = require('mutant')
const { parseChooseOnePoll, isPosition } = require('ssb-poll-schema')

module.exports = PollShow

function PollShow (opts = {}) {
  const {
    msg,
    scuttlePoll,
    onPositionPublished,
    mdRenderer = (text) => text,
    avatar = defaultAvatar,
    timeago = defaultTimeago,
    name = defaultName,
    className = ''
    // updateStream
  } = opts

  const { title, body, closesAt: closesAtString, details: { choices } } = parseChooseOnePoll(msg)
  const closesAt = new Date(closesAtString)

  // TODO use parseChooseOnePoll or scuttlePoll
  const pollDoc = Struct({ results: [], positions: [], myPosition: false })
  updatePollDoc()

  // TODO use updateStream to know when to trigger updates
  //   - don't update while NewPosition is active
  function updatePollDoc () {
    scuttlePoll.poll.async.get(msg.key, (err, data) => {
      if (err) console.error(err)

      pollDoc.set(data)
    })
  }

  const page = h('PollShow -chooseOne', { className }, [
    h('section.details', [
      h('h1', title),
      h('div.body', mdRenderer(body || '')),
      h('div.closesAt', [
        h('div.label', 'Closes at'),
        printClosesAt(closesAt)
      ])
    ]),
    NewPosition({
      choices,
      currentPosition: pollDoc.myPosition,
      onPublish: (success) => {
        onPositionPublished(success)
        updatePollDoc()
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

  // TODO rework this to show all messages
  function Positions ({ pollDoc, avatar, timeago, name, mdRenderer }) {
    return h('section.PollPositions', [
      h('h2', ['History']),
      h('div.positions', map(pollDoc.positions, position => {
        if (!isPosition(position)) return
        const { author, timestamp } = position.value
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
            h('div.reason', mdRenderer(position.reason || ''))
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

  // TODO extract this
  function NewPosition ({ choices, currentPosition, onPublish }) {
    const newPosition = Struct({
      choice: Value(),
      reason: Value('')
    })

    const forceShow = Value(false)
    forceShow(console.log)

    const className = computed([pollDoc.myPosition, forceShow], (myPosition, force) => {
      if (force) return '-show'
      if (myPosition === false) return '-hidden'
      return !myPosition ? '-show' : '-hidden'
    })

    return h('section.NewPosition', { className }, [
      h('div.field -choices', [
        h('label', 'Choose One'),
        h('div.inputs', choices.map((choice, index) => {
          var id = `choice-${index}`
          return h('div.choice', { 'ev-click': ev => { newPosition.choice.set(index) } }, [
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
      const position = {
        poll: parseChooseOnePoll(msg),
        choice: resolve(newPosition.choice),
        reason: resolve(newPosition.reason)
      }
      scuttlePoll.position.async.publishChooseOne(position, (err, success) => {
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
  const [ _, time, zone ] = closesAt.toTimeString().match(/^(\d+:\d+).*(\([\w\s]+\))$/)
  return `${time}, ${date} ${zone}`
}
