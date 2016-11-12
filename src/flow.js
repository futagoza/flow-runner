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

  @inlineArguments( jobs )

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
