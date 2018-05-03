const { h } = require('mutant')

var Server = require('scuttle-testbot')
Server
  .use(require('ssb-backlinks'))

// const {position: {async: {buildChooseOne}}} = require('scuttle-poll')(Server())
const scuttlePoll = require('scuttle-poll')(Server())
const { isPosition, getPositionErrors } = require('ssb-poll-schema')
const { content: mockContent } = require('../mock-poll')

const Page = require('../../views/show')

const scuttlePollMock = {
  position: {
    async: {
      publishChooseOne: (position, cb) => {
        buildChooseOne(position, function (err, postion) {
          if (err) {
            console.log(getPositionErrors(position))
            // return cb(isPoll.errors) // TODO fix ssb-position-schema
            console.error('invalid: ', position)
            return cb(new Error('have not created position in database - the input data was not valid:'))
          }
          console.log('publishing position:', position)
          cb(null, position)
        })
        // ({ poll, choice, reason, mentions }, cb) {
      }
    }
  }
}

const style = {
  'max-width': '40rem',
  margin: '0 auto'
}

const opts = {
  title: mockContent.title,
  choices: mockContent.details.choices,
  closesAt: mockContent.closesAt
}

scuttlePoll.poll.async.publishChooseOne(opts, function (err, msg) {
  console.log(msg)
  const container = h('div', { style }, [
    Page({
      msg,
      scuttlePoll: scuttlePoll,
      onPollPublished: (success) => {
        console.log('poll successfully published', success)
      }
    })
  ])

  document.body.appendChild(container)
})
