'use strict'

// 
// NOTE: This file must be compatible with Node.js v4.x
//

// try and use Bluebird instead of the built-in Promise
var Bluebird = Promise
try {
  Bluebird = require('bluebird')
}
catch ( e ) { }

// promise maker for libFlow
exports.promise = function FlowPromise ( flow, initialArgs ) {
  var promise = new Bluebird(function(resolve, reject){
    flow.call(promise, resolve, reject, initialArgs)
  })
  return promise
}

// a wrapper around native `Array#slice` to use it with array like objects
var __slice = Array.prototype.slice
exports.slice = function slice ( object, begin, end ) {
  var size = object.length

  if ( !size )
    return []

  if ( !begin && !end ) {

    if ( size == 1 )
      return [object[0]]

    if ( size == 2 )
      return [object[0], object[1]]

    if ( size == 3 )
      return [object[0], object[1], object[2]]

    if ( size == 4 )
      return [object[0], object[1], object[2], object[3]]

    if ( size == 5 )
      return [object[0], object[1], object[2], object[3], object[4]]

  }

  return __slice.call(object, begin, end)
}

// instead of `fn.apply(fn, args)` or `fn(...args)`, using
// this convenience method should be faster
exports.exec = function exec ( fn, args, thisArg ) {
  var argc = args.length
  thisArg = thisArg || fn
  
  if ( !argc )
    return fn.call(thisArg)
  
  if ( argc == 1 )
    return fn.call(thisArg, args[0])
  
  if ( argc == 2 )
    return fn.call(thisArg, args[0], args[1])
  
  if ( argc == 3 )
    return fn.call(thisArg, args[0], args[1], args[2])
  
  if ( argc == 4 )
    return fn.call(thisArg, args[0], args[1], args[2], args[3])
  
  if ( argc == 5 )
    return fn.call(thisArg, args[0], args[1], args[2], args[3], args[4])

  return fn.apply(thisArg, args)
}
