'use strict'

const flow = require( '../../' )
const assert = require( 'assert' )

function throwError( err ) {

  throw '[error]' + err

}

function noTest( done ) {
  
  done()

}

function assertArgument( value, expected ) {
  
  assert.equal( value, expected, 'wrong argument' )

}

function assertError( value, expected ) {
  
  assert.equal( value, expected, 'wrong error message' )

}

describe( 'flow(), tests from "jayyvis/node-flow"\n', function tests() {

  it( 'runs all steps exactly once', function test( done ) {

    let counter = 0

    flow(

      function one() {
        ++counter
        this.callback()
      },

      function two() {
        ++counter

        const _this = this
        setTimeout( function cb() {
          _this.callback()
        }, 0 )
      },

      function three() {
        ++counter
        this.callback()
      }

    )
    
    .then( function cb() {
        assert.equal( counter, 3 )
        done()
     } )

    .catch( throwError )

  } )

  it( 'passes arguments to subsequent steps', function test( done ) {

    flow(

      function one() {
        this.callback( null, 'cool' )
      },

      function two( msg ) {
        assertArgument( msg, 'cool' )
        this.callback( null, 'it', 'passes', 'all', 'args' )
      },

      function three( arg1, arg2, arg3, arg4 ) {
        assertArgument( arg1, 'it' )
        assertArgument( arg2, 'passes' )
        assertArgument( arg3, 'all' )
        assertArgument( arg4, 'args' )
        this.callback( null, 'wow' )
      }

    )
    
    .then( function callback( result ) {
        assertArgument( result, 'wow' )
        done()
     } )

    .catch( throwError )

  } )

  it( 'stops running further steps on error', function test( done ) {

    flow(

      function one() {
        this.callback()
      },

      function two( msg ) {
        this.callback( 'error in step2' )
      },

      function three() {
        assert.fail( 'reaching step3 when there is an error in step2' )
      }

    )

    .catch( function callback( err ) {
      assertError( err, 'error in step2' )
      done()
    } )

  } )

  it( 'handles thrown out error', function test( done ) {

    flow(

      function one() {
        this.callback()
      },

      function two( msg ) {
        throw 'error in step2'
      },

      function three() {
        assert.fail( 'reaching step3 when there is an error in step2' )
      }

    )

    .catch( function callback( err ) {
      assertError( err, 'error in step2' )
      done()
    } )

  } )

  it( '(flow-runner: n/a) gets out when there are no steps', noTest )

  it( '(flow-runner: n/a) errors when there is no callback given', noTest )

})
