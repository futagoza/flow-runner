'use strict'

//
// require('flow-runner').utils.execute
//
// @type Function(Function(...Any), Array, Any): Any
//
// Execute `fn` with the given `args`, allowing to call a
// function that can take an unknown number of arguments.
//
// Instead of `Function#apply`, `Function#call` or `( ...spread )`, using
// this convenience method should be faster.
//

module.exports = function execute( fn, args, thisArg ) {

  const argc = args.length
  thisArg = thisArg || fn
  
  if ( argc == 0 )

    return fn.call( thisArg )
  
  if ( argc == 1 )

    return fn.call( thisArg, args[ 0 ] )
  
  if ( argc == 2 )

    return fn.call( thisArg, args[ 0 ], args[ 1 ] )
  
  if ( argc == 3 )

    return fn.call( thisArg, args[ 0 ], args[ 1 ], args[ 2 ] )
  
  if ( argc == 4 )

    return fn.call( thisArg, args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ] )
  
  if ( argc == 5 )

    return fn.call( thisArg, args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ] )

  return fn.apply( thisArg, args )

}
