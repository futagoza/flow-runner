'use strict'

var version = parseInt(process.versions.node.split('.')[0])

if ( version < 4 ) {
  throw new Error('Node.js 4+ required')
}

module.exports = require('./node-v' + version)
