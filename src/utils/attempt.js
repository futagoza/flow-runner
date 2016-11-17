'use strict'

//
// require('flow-runner').utils.attempt
//
// @type Function(Function, Function(Any, Any)): Void
//
// Attempt to run a function, then call the callback.
//
// This is simply a wrapper around `try ... catch ...` to
// help optimize the methods where it would usually be.
//
// @see https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
//

const noop = require( './noop' )

module.exports = function attempt( executor, callback ) {

  callback = callback || noop

  try {

    callback( void 0, executor() )

  }

  catch ( err ) {

    callback( err )

  }

}
