'use strict'

// used to create an array from the `arguments` object
var __slice = Array.prototype.slice

// creates a new flow instance binded to the given
// tasks, which can be passed as a single argument
// or as separate arguments
function Flow ( tasks ) {

  // ensure arguments
  if ( !Array.isArray(tasks) ) {
    tasks = __slice.call(arguments)
  }

  // total number of serial tasks
  var max = tasks.length

  // internal symbols used for flow-control
  var BREAK_SYMBOL = Symbol('FLOW_BREAK')
  var CONTINUE_SYMBOL = Symbol('FLOW_CONTINUE')

  // the actual flow runner
  function flow ( resolve, reject, initialArgs ) {

    // serial task counter
    var counter = 0

    // async/parallel lock
    var lock = false

    // executes the next task, or ends the flow
    function next ( args ) {
      
      // ensure we don't exec next task until async lock is disabled
      // WARNING: disregards all calls to next if lock is not disabled
      if ( lock )
        return null

      // if the counter is the same as the number of tasks, the
      // flow has finished so call the resolver using the arguments
      if ( counter === max )
        resolve(...args)

      // exec the next task
      else if ( counter < max ) {

        // this new tasks index
        var index = counter

        // the synchronous result returned from the task
        var result = null

        // parallel counter
        var pending = 0

        // parallel results container
        var results = []

        // the task's context object (`this` argument)
        var thisArg = {

          // returns a callback used in async/parallel functions
          get await() {
            ++pending
            var n = 0
            
            if ( results ) {
              lock = true
              n = results.length
            }

            return function cb ( ) {
              --pending

              if ( results )
                results[n] = __slice.call(arguments)

              if ( !pending && results ) {
                lock = false
                next(results)
              }
            }
          },

          // returns a callback used in most Node.js IO functions
          get next() {
            lock = true
            results = null

            return function cb ( err ) {
              if ( err )
                return reject(err)

              // if `thisArg.next` is called, but then
              // `thisArg.continue` is called, the later
              // take priority, and this is just used to
              // handle errors
              if ( lock && index === counter ) {
                lock = false
                next(__slice.call(arguments, 1))
              }
            }
          },

          // attempts to stop the flow, and call the resolver
          get break() {
            throw BREAK_SYMBOL
          },

          // attempts to stops the current task and run the next
          get continue() {
            lock = false
            throw CONTINUE_SYMBOL
          }

        }

        // execute the task with the arguments given to next
        try {
          result = tasks[index].apply(thisArg, args)
        }

        // handle flow control using thrown errors
        catch ( err ) {
          results = null
          
          if ( err === CONTINUE_SYMBOL )
            return next()

          else if ( err === BREAK_SYMBOL )
            return resolve()

          return reject(err)
        }

        // if async lock is not enabled, go to the next task
        // with the synchronous result as the argument
        if ( !lock ) {
          ++counter
          next([result])
        }

      }

    }

    // starts the flow
    next(initialArgs)

  }

  // returns a function that when invoked starts a
  // new instance of this flow wrapped in a Promise
  // to enable the use of after-control using
  // callbacks passed to then/catch
  return function run ( ) {
    return Flow.promise(flow, __slice.call(arguments))
  }

}

// default Promise maker for libFlow, just overwrite
// it to replace it and it should be used unless you
// are using ES6's import feature
Flow.promise = function FlowPromise ( flow, initialArgs ) {
  var promise = new Promise(function(resolve, reject){
    flow.call(promise, resolve, reject, initialArgs)
  })
  return promise
}

// a quick and simple way to create and instantly execute a flow
Flow.flow = function FlowPromise ( ) {
  return Flow(...(__slice.call(arguments)))()
}

module.exports = Flow
