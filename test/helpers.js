'use strict'

const os = require( 'os' )

exports.flow = require( '../' )

exports.utils = exports.flow.utils

exports.assert = require( 'assert' )

exports.module = function testingModule( name ) {

  return 'require(\'flow-runner\').' + name + os.EOL

}
