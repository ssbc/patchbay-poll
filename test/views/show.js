const { h } = require('mutant')
const { isPosition, getPositionErrors } = require('ssb-poll-schema')
const { msg } = require('../mock-poll')

const scuttlePollMock = {
  position: {
    async: {
      publishChooseOne: (position, cb) => {
        // ({ poll, choice, reason, mentions }, cb) {
        if (!isPosition(position)) {
          console.log(getPositionErrors(position))
          // return cb(isPoll.errors) // TODO fix ssb-position-schema
          console.error('invalid: ', position)
          return cb(new Error('have not created position in database - the input data was not valid:'))
        }
        console.log('publishing position:', position)
        cb(null, position)
      }
    }
  }
}

const style = {
  'max-width': '40rem',
  margin: '0 auto'
}

const container = h('div', { style }, [
  Page({
    msg,
    scuttlePoll: scuttlePollMock,
    onPollPublished: (success) => {
      console.log('poll successfully published', success)
    }
  })
])

document.body.appendChild(container)
