'use strict'

const helpers = require( '../_helpers' )

const expecting = helpers.expect
const noop = helpers.utils.noop

describe( helpers.module( 'utils.noop' ), function tests() {

  it( 'is a empty function', function test( done ) {

    expecting( noop )

      .typeof( 'function', 'Expecting a function' )

      .toString( 'function noop() { }', 'Expecting a empty function' )

    done()

  } )

  it( 'return `undefined`', function test( done ) {

    expecting.equal( noop(), void 0, 'Expecting function to return undefined' )

    done()

  } )

})
