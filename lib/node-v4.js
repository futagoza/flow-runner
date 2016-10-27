'use strict'

// required modules
const utils = require('./utils')

// creates a new flow instance binded to the given
// tasks, which can be passed as a single argument
// or as separate arguments
function Flow ( tasks ) {

  // ensure the `tasks` argument is an array
  if ( !Array.isArray(tasks) ) {
    tasks = utils.slice(arguments)
  }

  // total number of serial tasks
  const max = tasks.length

  // the actual flow runner
  function flow ( resolve, reject, initialArgs ) {

    // serial task counter
    var counter = -1

    // asynchronous flow lock
    var lock = false

    // internal symbols used for flow-control
    const BREAK_SYMBOL = Symbol('FLOW_BREAK')
    const CONTINUE_SYMBOL = Symbol('FLOW_CONTINUE')

    // executes the next task, or ends the flow
    function next ( args ) {
      
      // ensure we don't exec next task until async lock is disabled
      // WARNING: disregards all calls to next if lock is not disabled
      if ( lock )
        return null

      // increment the serial task counter
      ++counter

      // if the counter is the same as the number of tasks, the
      // flow has finished so call the resolver using the arguments
      if ( counter === max )
        utils.exec(resolve, args)

      // execute the next task
      else if ( counter < max ) {

        // this new tasks index
        const index = counter

        // the synchronous result returned from the task
        var result = null

        // parallel counter
        var pending = 0

        // parallel results container
        var results = []

        // is used after an ECMAScript Async to ensure
        // a parallel or Node.js Async wasn't called
        var _async = true

        //
        // this method handles 2 issues:
        //
        // 1) Node.js Async flow control
        //
        //   if `this.next` is called, but then
        //   `this.continue` is called, the flow
        //   moves on but `this.next` will still
        //   be used to handle Node.js Async errors
        //
        // 2) ECMAScript Async
        //
        //   ensures that the lock is still active and
        //   the flow has not moved to another task
        //
        function asyncNext ( rArgs ) {
          if ( lock && index === counter ) {
            lock = false
            next(rArgs)
          }
        }

        // handle flow control using thrown errors
        function catchError ( err ) {
          results = null
          _async = false

          if ( err === CONTINUE_SYMBOL )
            next()

          else if ( err === BREAK_SYMBOL )
            resolve()

          else
            reject(err)

          return null
        }

        // the task's context object (`this` argument)
        const thisArg = {

          // returns a callback used in asynchronous functions
          get await() {
            ++pending

            if ( !results )
              return function unpend() {
                 --pending
              }

            lock = true
            _async = false
            const n = results.length

            return function cb() {
              --pending

              if ( results )
                results[n] = utils.slice(arguments)

              if ( !pending && results ) {
                lock = false
                next(results)
              }
            }
          },

          // returns a callback used in most Node.js Async functions
          get next() {
            lock = true
            _async = false
            results = null

            return function cb(err) {
              if ( err )
                return reject(err)

              asyncNext(utils.slice(arguments, 1))
            }
          },

          // attempts to stop the flow, and call the resolver
          get break() {
            throw BREAK_SYMBOL
          },

          // attempts to stop the current task and run the next
          get continue() {
            lock = false
            throw CONTINUE_SYMBOL
          }

        }

        // execute the task with the arguments given to next
        try {
          result = utils.exec(tasks[index], args, thisArg)
        }
        catch ( err ) {
          return catchError(err)
        }

        // ECMAScript Async is handled differently from Node.js Async
        if ( result instanceof Promise ) {
          lock = true
          result
            .then(function cb() {
              if ( _async )
                asyncNext(arguments)
            })
            .catch(catchError)
        }

        // if async lock is not enabled, go to the next task
        // with the synchronous result as the only argument
        if ( !lock )
          next([result])

      }

    }

    // starts the flow
    next(initialArgs)

  }

  // returns a function that when invoked starts a
  // new instance of this flow wrapped in a Promise
  // to enable the use of after-control using
  // callbacks passed to then/catch
  return function run() {
    return utils.promise(flow, arguments)
  }

}

// a quick and simple way to create and instantly execute a flow
Flow.flow = function FlowPromise() {
  return utils.exec(Flow, arguments)()
}

// export module, including utils
Flow.utils = utils
module.exports = Flow
