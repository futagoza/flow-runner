'use strict'

//
// require('flow-runner').utils.merge
//
// @type Function(Object, Object): Object
//
// Simply shallow-copy properties from  `source` to `target`.
//

const __hasOwnProperty = Object.prototype.hasOwnProperty

module.exports = function merge( target, source ) {

  for ( let key in source ) {

    if ( __hasOwnProperty.call( source, key ) )

      target[ key ] = source[ key ]

  }

  return target

}
