'use strict'

//
// require('flow-runner').expecting.ArrayLikeArgument
//
// @type Function(String, String, Any): Boolean
// 
// Ensure the given `argumentValue` is an `Array`-like object.
//

const isArrayLike = require( '../utils/isArrayLike' )

const $1 = 'Expecting an `Array`-like for the `'
const $2 = '` argument passed to the `'
const $3 = '` method.'

function ArrayLikeArgument( functionName, argumentName, argumentValue ) {

  if ( isArrayLike( argumentValue ) ) return true

  throw new TypeError( $1 + argumentName + $2 + functionName + $3 )

}

module.exports = ArrayLikeArgument
