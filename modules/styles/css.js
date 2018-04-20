const nest = require('depnest')
const requireStyle = require('require-style')
const { assign } = Object

exports.gives = nest('styles.css')

exports.create = function (api) {
  return nest('styles.css', css)

  function css (sofar = {}) {
    const cssObj = {
      // flatpickr: requireStyle('flatpickr/dist/flatpickr.css')
    }
    return assign(sofar, cssObj)
  }
}
