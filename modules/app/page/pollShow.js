const nest = require('depnest')
const ScuttlePoll = require('scuttle-poll')
const PollShow = require('../../../views/show')

exports.gives = nest({
  'app.page.pollShow': true
})

exports.needs = nest({
  'app.html.modal': 'first',
  'app.sync.goTo': 'first',
  'feed.pull.type': 'first',
  'about.html.avatar': 'first',
  'lib.obs.timeAgo': 'first',
  'message.html.markdown': 'first',
  'message.obs.name': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest({
    'app.page.pollShow': pollShowPage
  })

  function pollShowPage (msg) {
    return PollShow({
      msg,
      scuttlePoll: ScuttlePoll(api.sbot.obs.connection),
      onPositionPublished: () => {
        console.log('BOOM')
      },
      mdRenderer: api.message.html.markdown,
      avatar: api.about.html.avatar,
      timeago: api.lib.obs.timeAgo,
      name: api.message.obs.name
    })
  }
}
