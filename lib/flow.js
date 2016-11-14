'use strict'

//
// Required modules.
//

const merge = require( './utils/merge' )
const Sequence = require( './Sequence' )

//
// require('flow-runner')
//
// @type Function(...Array): Promise
//
// By default flow is a `Sequence` that returns a `Promise`.
//

function flow() {

  let jobs = [], i = -1, l = arguments.length
  while ( ++i < l ) jobs[ i ] = arguments[ i ]

  return Sequence.promise( jobs )

}

//
// Export modules.
//

module.exports = merge( flow, {

  utils: require( './utils' ),
  expecting: require( './expecting' ),

  Parallel: require( './Parallel' ),
  Promise: require( './Promise' ),
  Sequence: Sequence

} )

//
// Compatibility with ES2015+ Module loaders.
//

module.exports.default = flow
