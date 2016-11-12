'use strict'

const fs = require( './file-system' )

module.exports = {

  '@inlineArguments': function inlineArguments( var_, prefix, eol ) {

    var_ = var_ || 'arguments_'
    prefix = prefix || this.ws || ''
    eol = eol || fs.EOL

    return prefix + `let ${ var_ } = [], i = arguments.length` + eol +
           prefix + `while ( --i ) ${ var_ }[ i ] = arguments[ i ]`

  }

}
