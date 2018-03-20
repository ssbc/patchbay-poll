const { h } = require('mutant')
require('../insert-styles')()

const Page = require('../../views/new')

const scuttlePollMock = {
  poll: {
    async: {
      publishChooseOne: console.log
    }
  }
}

const style = {
  'max-width': '40rem',
  margin: '0 auto'
}

const container = h('div', { style }, [
  Page({
    scuttlePoll: scuttlePollMock
  })
])

document.body.appendChild(container)
