'use strict'

module.exports = {

  '@inlineArguments': function inlineArguments( var_, prefix ) {

    var_ = var_ || 'arguments_'
    prefix = prefix || ''

    return `let ${ var_ } = [], i = arguments.length\n` +
           prefix + `while ( --i ) ${ var_ }[ i ] = arguments[ i ]`

  }

}
