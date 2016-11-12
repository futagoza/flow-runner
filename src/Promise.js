'use strict'

//
// require('flow-runner').Promise
//
// @type Function(Function(Function(...Any), Function(Any))): Promise
//
// Try and use Bluebird instead of the built-in Promise provided by
// the V8 JavaScript Engine used by Node.js as it is slower.
//

let Promise = global.Promise

try {

  Promise = require('bluebird')

} catch ( e ) { }

module.exports = Promise
