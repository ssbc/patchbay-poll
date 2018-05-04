const { h } = require('mutant')
require('../insert-styles')()

var Server = require('scuttle-testbot')
Server
  .use(require('ssb-backlinks'))

const server = Server()

const otherFeed = server.createFeed()
// const {position: {async: {buildChooseOne}}} = require('scuttle-poll')(Server())
const scuttlePoll = require('scuttle-poll')(server)
const { isPosition, getPositionErrors } = require('ssb-poll-schema')
const { content: mockContent } = require('../mock-poll')

const Page = require('../../views/show')

const style = {
  'max-width': '40rem',
  margin: '0 auto'
}

const opts = {
  title: mockContent.title,
  body: `
    I'm **really** keen on coops, and I think if more people had the opportunity to experience
    the power of co-ownership, we'd have more dreamers.
  `,
  choices: mockContent.details.choices,
  closesAt: mockContent.closesAt
}

scuttlePoll.poll.async.publishChooseOne(opts, function (err, msg) {
  const buildChooseOne = scuttlePoll.position.async.buildChooseOne
  buildChooseOne({poll: msg, choice: 0, reason: 'This is the bestest idea you have ever had hermano!!!'}, function (err, newPosition) {
    otherFeed.publish(newPosition, (err, data) => {
      const container = h('div', { style }, [
        Page({
          msg,
          scuttlePoll: scuttlePoll,
          onPositionPublished: (success) => {
            console.log('position successfully published', success)
          }
        })
      ])

      document.body.appendChild(container)
    })
  })
})
