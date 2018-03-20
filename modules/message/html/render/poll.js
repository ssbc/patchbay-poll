const nest = require('depnest')
const isPoll = require('scuttle-poll/isPoll')
const pollCard = require('../../../../views/poll-card')

exports.gives = nest('message.html.render')

exports.needs = nest({
  // 'about.obs.color': 'first',
  // 'blob.sync.url': 'first',
  'message.html.decorate': 'reduce',
  'message.html.layout': 'first',
  'message.html.markdown': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest('message.html.render', pollRender)

  function pollRender (msg, opts) {
    if (!isPoll(msg)) return

    const card = pollCard({
      msg,
      server: api.sbot.obs.connection,
      mdRenderer: api.message.html.markdown
    })

    const element = api.message.html.layout(msg, Object.assign({}, {
      content: card,
      layout: 'default'
    }, opts))

    return api.message.html.decorate(element, { msg })
  }
}
