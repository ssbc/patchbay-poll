const { h } = require('mutant')
const { isPoll } = require('ssb-poll-schema')
require('../insert-styles')()

const Page = require('../../views/new')

const scuttlePollMock = {
  poll: {
    async: {
      publishChooseOne: (poll, cb) => {
        poll.version = 'v1'

        if (!isPoll(poll)) {
          // return cb(isPoll.errors) // TODO fix ssb-poll-schema
          console.error('invalid: ', poll)
          return cb(new Error('have not created poll in database - the input data was not valid:'))
        }
        console.log('publishing poll:', poll)
        cb(null, poll)
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
    scuttlePoll: scuttlePollMock,
    onPollPublished: (success) => {
      console.log('poll successfully published', success)
    }
  })
])

document.body.appendChild(container)
