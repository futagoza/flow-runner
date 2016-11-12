'use strict'

//
// require('flow-runner').utils.extend
//
// @type Function(Array, Array): Array
//
// Shallow-copy elements from `source` to `target`.
//
// Instead of `Array#concat`, `Array#push` or `[ ...target, ...source ]`, using
// this convenience method should be faster.
//

module.exports = function extend( target, source ) {

  if ( source.length == 0 ) return target

  const length = source.length
  let index = target.length

  target[ index ] = source[ 0 ]

  if ( length == 1 ) return target

  if ( length == 2 ) {

    target[ ++index ] = source[ 1 ]

  } else if ( length == 3 ) {

    target[ ++index ] = source[ 1 ]
    target[ ++index ] = source[ 2 ]

  } else if ( length == 4 ) {

    target[ ++index ] = source[ 1 ]
    target[ ++index ] = source[ 2 ]
    target[ ++index ] = source[ 3 ]

  } else if ( length == 5 ) {

    target[ ++index ] = source[ 1 ]
    target[ ++index ] = source[ 2 ]
    target[ ++index ] = source[ 3 ]
    target[ ++index ] = source[ 4 ]

  } else {

    let key = 0
    --index

    while ( ++key < length ) {

      target[ ++index ] = source[ key ]

    }

  }

  return target

}
