'use strict'

const helpers = require( '../_helpers' )

const assert = helpers.assert
const attempt = helpers.utils.attempt

describe( helpers.module( 'utils.attempt' ), function tests() {

  it( 'handles a result', function test( done ) {

    attempt(

      function executor() {
        return true
      },

      function callback( err, result ) {
        assert( !err )
        assert( result === true, 'Expected value: `true` boolean' )
        done()
      }

    )

  } )

  it( 'handles thrown out error', function test( done ) {

    attempt(

      function executor() {
        throw true
      },

      function callback( err, result ) {
        assert( !result )
        assert( err === true, 'Expected error: `true` boolean' )
        done()
      }

    )

  } )

  it( 'passing executor, no callback', function test( done ) {

    attempt( function executor() {

      assert( 1 === 1 )

    } )

    done()

  } )

  it( 'failing executor, no callback', function test( done ) {

    attempt( function executor() {

      throw new Error( 'This error should never be displayed.' )

    } )

    done()

  } )

})
