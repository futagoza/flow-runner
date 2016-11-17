'use strict'

const EOL = require( 'os' ).EOL

module.exports = function expect( name ) {

  return 'require(\'flow-runner\').' + name + EOL

}
