'use strict'

const fs = require( 'fs' )
const mkdirp = require( 'mkdirp' )
const os = require( 'os' )
const path = require( 'path' )

exports.EOL = os.EOL
exports.sep = path.sep
exports.join = path.join

exports.mkdir = function mkdir( dirname, callback ) {

  mkdirp( dirname, function cb( err ) {

    if ( err ) throw err

    if ( callback ) callback()

  } )

}

exports.readFile = function readFile( filename, callback ) {

  fs.readFile( filename, 'utf8', function cb( err, data ) {

    if ( err ) throw err

    callback( data )

  } )

}

exports.writeFile = function writeFile( filename, data, callback ) {

  fs.writeFile( filename, data, function cb( err, data ) {

    if ( err ) throw err

    if ( callback ) callback()

  } )

}

exports.walk = function walk( dirname, emitEntry ) {

  function readEntry( entry ) {

    const fullpath = path.join( dirname, entry )
    
    fs.lstat( fullpath, function onStat( err, stat ) {

      if ( err ) throw err

      stat.name = entry
      stat.dir = dirname
      stat.path = fullpath
      stat.ext = path.extname( entry )

      if ( stat.isDirectory() )

        walk( fullpath, emitEntry )

      else

        emitEntry( fullpath, stat )

    } )
  
  }

  fs.readdir( dirname, function onItem( err, entries ) {

    if ( err ) throw err

    let length = entries.length
    let index = -1

    while ( ++index < length ) readEntry( entries[ index ] )

  } )

}
