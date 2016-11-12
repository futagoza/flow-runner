'use strict'

//
// Required modules.
//

const attempt = require( './utils/attempt' )
const execute = require( './utils/execute' )
const expecting = require( './expecting' )
const extend = require( './utils/extend' )
const Promise = require( './Promise' )
const slice = require( './utils/slice' )

//
// Currently only used by `job#await` to return a empty
// empty function if the flow is already continuing.
//

function emptyFunction() { }

//
// require('flow-runner').Sequence
//
// @type Function(Array<Function(...Any)>): Function(...Any)
// @type Function(...Function(...Any)): Function(...Any)
//
// Creates a new Flow that executes the given jobs in a
// sequence, no matter what type of function the job is.
//

function Sequence( jobs ) {

  //
  // Ensure the `jobs` argument is an array.
  //

  expecting.ArrayLikeArgument( 'Sequence', 'jobs', jobs )

  //
  // Total number of serial jobs.
  //

  const max = jobs.length

  //
  // @type Function(...Any)
  //
  // @context Function(...Any)|Object?
  //
  // Returns the actual flow runner
  //

  return function flow() {

    //
    // Initial arguments passed to the first job.
    //

    let _initialArgs = []

    if ( arguments.length ) {

      @inlineArguments( _arguments )

      _initialArgs = _arguments

    }

    //
    // Main callbacks:
    //
    //   resolve - called when complete or flow is broken
    //   reject - called when an error is thrown
    //
    // These can be changed by calling:
    //
    //   flow.call( callbacks, ...arguments )
    //   flow.apply( callbacks, arguments )
    //
    // The `callbacks` parameter can be either a function or
    // a object with `resolve` and/or `reject` as properties.
    //

    const _this = this

    let resolve = function resolve() { }

    let reject = function reject( err ) { throw err }
    
    if ( typeof _this === 'function' ) {

      resolve = function resolve() {

        const parameters = [ void 0 ]

        if ( arguments.length ) {

          @inlineArguments( _arguments )

          extend( parameters, _arguments )

        }

        execute( _this, parameters )

      }

      reject = _this

    } else if ( _this ) {

      if ( typeof _this.resolve === 'function' ) resolve = _this.resolve

      if ( typeof _this.reject === 'function' ) reject = _this.reject

    }

    //
    // Sequence counter
    //
    
    let counter = -1

    //
    // Sequence lock, helps to ensure the next job isn't
    // called by accident.
    //

    let lock = false

    //
    // Internal symbols used for flow-control.
    //
    // Defined here to ensure the correct symbols are caught.
    //

    const BREAK_SYMBOL = Symbol('FLOW_BREAK')
    const CONTINUE_SYMBOL = Symbol('FLOW_CONTINUE')

    //
    // Executes the next job, or ends the flow.
    //
    
    function next( parameters ) {
      
      //
      // Ensure we don't proceed until the sequence lock is disabled.
      //
      // WARNING: Disregards all calls to `next` if lock is not disabled.
      //

      if ( lock === true ) @return

      //
      // Increment the sequence counter.
      //

      ++counter

      //
      // The counter can never be equal or greater then the number
      // of jobs. If it is, we end the flow assuming every job is
      // complete, otherwise we shouldn't have reached this point.
      //

      if ( !( counter < max ) )

        return execute( resolve, parameters )

      //
      // This new jobs index.
      //
      
      const index = counter

      //
      // Parallel counter.
      //
      
      let pending = 0

      //
      // Parallel results container.
      //
      
      let results = []

      //
      // Is used after an ECMAScript Async to ensure
      // a parallel or Node.js Async weren't called.
      //
      
      let _async = true

      //
      // This method handles 2 case's:
      //
      // 1) Node.js Async flow control
      //
      //   If `this.callback` is called, but then `this.continue`
      //   is called, the flow moves on but `this.callback` will
      //   still be used to handle Node.js Async errors
      //
      // 2) ECMAScript Async
      //
      //   Ensures that the lock is still active and the
      //   flow has not moved to another job.
      //
      
      function asyncNext( rArgs ) {

        if ( lock === false ) @return

        if ( index !== counter ) @return

        lock = false
        next( rArgs )

      }

      //
      // Handle flow control using thrown errors.
      //
      
      function catchError( err ) {

        pending = false
        _async = false

        if ( err === CONTINUE_SYMBOL )

          next( [] )

        else if ( err === BREAK_SYMBOL )

          resolve()

        else

          reject( err )

      }

      //
      // The job's context object (`this` argument).
      //
      
      const thisArg = {

        //
        // Returns a callback used in asynchronous functions.
        //
        
        get await() {

          if ( pending === false ) return emptyFunction

          ++pending

          lock = true
          _async = false
          
          const n = results.length
          results[ n ] = []

          return function cb() {

            if ( pending === false ) @return

            --pending

            if ( arguments.length ) {

              @inlineArguments( _arguments )

              results[ n ] = _arguments

            }

            if ( pending !== 0 ) @return

            lock = false
            next( results )

          }

        },

        //
        // Returns a callback usable in most return-style Async functions
        //
        
        get next() {

          if ( pending === false ) return emptyFunction

          lock = true
          _async = false
          pending = false

          return function cb() {

            let rArgs = []

            if ( arguments.length ) {

              @inlineArguments( _arguments )

              rArgs = _arguments

            }

            asyncNext( rArgs )

          }

        },

        //
        // Returns a callback usable in most Node.js Async functions
        //
        
        get callback() {

          if ( pending === false ) return emptyFunction

          lock = true
          _async = false
          pending = false

          return function cb( err ) {

            if ( err ) return reject( err )

            let rArgs = []

            if ( arguments.length > 1 ) {

              @inlineArguments( _arguments )

              rArgs = slice( _arguments, 1 )

            }

            asyncNext( rArgs )

          }

        },

        //
        // Attempts to stop the flow, and call the resolver.
        //
        
        get break() {

          throw BREAK_SYMBOL

        },

        //
        // Attempts to stop the current job and run the next.
        //
        
        get continue() {

          lock = false
          throw CONTINUE_SYMBOL

        }

      }

      //
      //  try { ... }
      //  catch ( err ) { ... }
      //  finally { ... }
      //
      
      attempt(
        
        function _try() {

          //
          // Execute the job with the argument given to next.
          //

          return execute( jobs[ index ], parameters, thisArg )

        },
        
        function _finally( err, result ) {

          if ( err ) return catchError( err )

          //
          // ECMAScript Async is handled differently from Node.js Async
          //
          
          if ( result instanceof Promise ) {

            lock = true

            result

              .then( function cb() {

                if ( _async === false ) @return

                let rArgs = []

                if ( arguments.length ) {

                  @inlineArguments( _arguments )

                  rArgs = _arguments

                }

                asyncNext( rArgs )

              } )

              .catch( catchError )

          }

          //
          // If sequence lock is not enabled, go to the next job
          // with the synchronous result as the only argument.
          //
          
          if ( lock === false ) next( [ result ] )

        }

      )

    }

    //
    // Start the flow.
    //
    
    next( _initialArgs )

  }

}

//
// require('flow-runner').Sequence.run
//
// @type Function(Array<Function(...Any)>, Function(...Any)): Promise
// @type Function(...Function(...Any)): Promise
//
// Creates a new sequence and runs it straight away. You can
// set a callback by passing the jobs in a single array to the
// first parameter, and setting the second as the callback.
//

Sequence.run = function run( jobs, callback ) {

  if ( typeof jobs == 'function' ) {

    @inlineArguments( _arguments )

    jobs = _arguments
    callback = void 0

  } else {

    expecting.ArrayLikeArgument( 'Sequence.run', 'jobs', jobs )

  }

  return Sequence( jobs ).call( callback )

}

//
// require('flow-runner').Sequence.promise
//
// @type Function(Array<Function(...Any)>): Promise
// @type Function(...Function(...Any)): Promise
//
// Creates a promised sequence and runs it straight away. You
// can set callbacks via `#then()` or `#catch()`.
//

Sequence.promise = function promise( jobs ) {

  if ( typeof jobs == 'function' ) {

    @inlineArguments( _arguments )

    jobs = _arguments

  } else {

    expecting.ArrayLikeArgument( 'Sequence.promise', 'jobs', jobs )

  }

  return new Promise( function executer( resolve, reject ) {

    Sequence( jobs ).call( { resolve: resolve, reject: reject } )

  } )

}

//
// require('flow-runner').Sequence.forEach
//
// @type Function(Array<...Any>, Function(Any, Integer, Array)): Void
//
// Generates jobs for each element in `items`, creates a promised
// sequence and finally runs each element's job that call `job`.
//

Sequence.forEach = function forEach( items, job ) {

  expecting.ArrayLikeArgument( 'Sequence.forEach', 'items', items )
  expecting.FunctionArgument( 'Sequence.forEach', 'job', job )

  return Sequence.promise( items.map(

    ( item, i ) => function job() {

      return job.call( this, item, i, items )

    }

  ) )

}

module.exports = Sequence