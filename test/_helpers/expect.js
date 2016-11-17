'use strict'

//
// Required modules and native functions.
//

const util = require( 'util' )

const __hasOwnProperty = Object.prototype.hasOwnProperty
const __toString = Object.prototype.toString

//
// Builds default Expectation error message.
//

function buildMessage( actual, expected ) {

  return `Expecting '${ expected }', returned '${ actual }'`

}

//
// Expectation error.
//

function ExpectationError( actual, expected, message ) {

  this.name = 'ExpectationError'

  if ( arguments.length === 1 ) {

    this.message = actual

  } else {

    this.actual = actual
    this.expected = expected
    this.message = message || buildMessage( actual, expected )

  }

  Error.captureStackTrace( this, equal )

}
util.inherits( ExpectationError, Error )

//
// Strict equality ensurer, throws on fail.
//

function equal( actual, expected, message ) {

  message = message || buildMessage( actual, expected )

  if ( actual !== expected )

    throw new ExpectationError( message )

}

//
// Expecter, a chain-able asserter.
//

function Expecter( value ) {

  if ( !( this instanceof Expecter ) )

    return new Expecter( value )

  Object.defineProperty( this, 'value', {

    value: value

  } )

}

Expecter.prototype = {

  constructor: Expecter,

  //
  // Builds a Expectation error message.
  //

  message: function message( expected ) {

    return buildMessage( this.value, expected )

  },

  //
  // Simple check if `this.value` contains a property called `key`.
  //

  property: function property( key, message ) {

    message = message || `Expecting to have own property '${ key }'`

    equal( key in this.value, true, message )

    return this

  },

  //
  // Check if `this.value` contains it's own property called `key`.
  //

  own: function own( key, message ) {

    message = message || `Expecting to have own property '${ key }'`

    equal( __hasOwnProperty.call( this.value, key ), true, message )

    return this

  },

  //
  // Ensure the property called `key` has the given `value`.
  //
  // If `value` is a function, execute it by passing `message` as the
  // context and the property `key` as a new Expecter.
  //

  at: function at( key, value, message ) {

    if ( typeof value === 'function' ) {

      this.property( key )

      value.call( message, new Expecter( this.value[ key ] ) )

    } else {

      message = message || `Expecting { '${ key }': '${ value }' }`

      equal( this.value[ key ], value, message )

    }

    return this

  },

  //
  // Assert if `this.value` strictly equals `expected`.
  //

  toEqual: function toEqual( expected, message ) {

    equal( this.value, expected, message )

    return this

  },

  //
  // Ensure the type is as expected.
  //

  typeof: function _typeof( target, message ) {

    const actual = __toString.call(this.value).toLowerCase()
    const expected = `[object ${ target.toLowerCase() }]`

    equal( actual, expected, message )

    return this

  },

  //
  // Ensure the source equals `expected`.
  //

  toString: function _toString( expected, message ) {

    equal( this.value.toString(), expected, message )

    return this

  }

}

//
// Exports.
//

Expecter.buildMessage = buildMessage
Expecter.ExpectationError = ExpectationError
Expecter.equal = equal

module.exports = Expecter
