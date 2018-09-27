const nest = require('depnest')
const ScuttlePoll = require('scuttle-poll')
const PollShow = require('../../../views/show')

exports.gives = nest({
  'app.page.pollShow': true
})

exports.needs = nest({
  'about.obs.name': 'first',
  'app.html.modal': 'first',
  'app.sync.goTo': 'first',
  'feed.pull.type': 'first',
  'about.html.avatar': 'first',
  'lib.obs.timeAgo': 'first',
  'message.html.markdown': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest({
    'app.page.pollShow': pollShowPage
  })

  function pollShowPage (msg) {
    return PollShow({
      msg,
      className: 'Scroller',
      scuttlePoll: ScuttlePoll(api.sbot.obs.connection),
      onPositionPublished: () => {
        console.log('BOOM')
      },
      mdRenderer: api.message.html.markdown,
      avatar: feedId => api.about.html.avatar(feedId),
      timeago: api.lib.obs.timeAgo,
      name: api.about.obs.name
    })
  }
}
