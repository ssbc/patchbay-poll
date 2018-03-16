const nest = require('depnest')

exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'app.page.pollIndex': 'first'
})

exports.create = (api) => {
  return nest('router.sync.routes', (sofar = []) => {
    const pages = api.app.page

    // loc = location
    const routes = [
      [ loc => loc.page === 'polls', pages.pollIndex ]
    ]

    return [...routes, ...sofar]
  })
}
