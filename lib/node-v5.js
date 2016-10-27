'use strict'

//
// Currently Node.js v4 supports everything to make
// a fast and controllable flow runner.
//
// Node.js v5 supports ECMAScript Spreads, but if
// you consider the dynamic nature of a controllable
// flow, then spreads are a performance hit, so
// using `exec(fn, args, thisArg)` from './utils.js'
// is a much better alternative, and since that is
// the only difference, there is no need for a separate
// version of libflow just for Node.js v5
//

module.exports = require('./node-v4')
