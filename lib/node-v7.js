'use strict'

//
// Currently Node.js v6 supports everything to make
// a fast and controllable flow runner.
//
// Node.js v7 supports ECMAScript Async, but only
// behind the `--harmony` flag, so creating a
// native async version of libflow will have to
// wait till Node.js v8
//

module.exports = require('./node-v6')
