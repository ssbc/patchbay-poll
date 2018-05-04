const nest = require('depnest')
const { assign } = Object
const fs = require('fs')

exports.gives = nest('styles.css')

exports.create = function (api) {
  return nest('styles.css', css)

  function css (sofar = {}) {
    const FPLoc = require.resolve('flatpickr/dist/flatpickr.css')
    const FPCss = fs.readFileSync(FPLoc, 'UTF8')

    const cssObj = {
      flatpickr: FPCss
    }
    return assign(sofar, cssObj)
  }
}
