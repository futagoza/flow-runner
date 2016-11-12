'use strict'

//
// require('flow-runner').utils.slice
//
// @type Function(Array, Integer?, Integer?): Array
//
// Slice a portion of the given Array-like object.
//
// Instead of `Array.from` or `Array#slice`, using this
// convenience method should be faster.
//

module.exports = function slice( array, begin, end ) {

  const argc = arguments.length
  const size = array.length

  if ( size == 0 ) return []

  if ( argc < 2 ) begin = 0

  if ( argc < 3 ) {

    let i = begin

    if ( size == 1 )

      return [ array[ i ] ]

    if ( size == 2 )

      return [ array[ i ], array[ ++i ] ]

    if ( size == 3 )

      return [ array[ i ], array[ ++i ], array[ ++i ] ]

    if ( size == 4 )

      return [ array[ i ], array[ ++i ], array[ ++i ], array[ ++i ] ]

    if ( size == 5 )

      return [ array[ i ], array[ ++i ], array[ ++i ], array[ ++i ], array[ ++i ] ]

    end = size

  }

  const target = []
  let index = begin - 1

  while ( ++index < end ) {

    target[ index ] = array[ index ]

  }

  return target

}
