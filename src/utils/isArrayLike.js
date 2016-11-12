'use strict'

//
// require('flow-runner').utils.isArrayLike
//
// @type Function(Any): Boolean
// 
// Check if the given `object` is an `Array`-like object.
//

module.exports = function isArrayLike( object ) {

  if ( object != null ) {

    if ( Array.isArray( object ) ) return true

    if ( typeof object === 'function' ) return false

    return Number.isInteger( object.length )

  }

  return false

}
