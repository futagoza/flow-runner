'use strict'

//
// require('flow-runner').expecting.FunctionArgument
//
// @type Function(String, String, Any): Boolean
// 
// Ensure the given `argumentValue` is a `Function`.
//

const $1 = 'Expecting a `Function` for the `'
const $2 = '` argument passed to the `'
const $3 = '` method.'

function FunctionArgument( functionName, argumentName, argumentValue ) {

  if ( typeof argumentValue == 'function' ) return true

  throw new TypeError( $1 + argumentName + $2 + functionName + $3 )

}

module.exports = FunctionArgument
