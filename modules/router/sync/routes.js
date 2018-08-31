const nest = require('depnest')
const { isPoll } = require('ssb-poll-schema')

exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'app.page.pollIndex': 'first',
  'app.page.pollShow': 'first'
})

exports.create = (api) => {
  return nest('router.sync.routes', (sofar = []) => {
    const pages = api.app.page

    // loc = location
    const routes = [
      [ loc => loc.page === 'polls', pages.pollIndex ],
      [ loc => isPoll.chooseOne(loc), pages.pollShow ]
    ]

    return [...routes, ...sofar]
  })
}
