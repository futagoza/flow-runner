'use strict'

const fs = require( './file-system' )
const preprocess = require( './preprocess' )

const __libname = fs.join(__dirname, '..', 'lib')
const __srcname = fs.join(__dirname, '..', 'src')

fs.walk( __srcname, function onFile( source, stat ) {

  fs.readFile( source, function onData( data ) {

    fs.mkdir( stat.dir.replace( __srcname, __libname ), function ready() {

      if ( stat.ext == '.js' ) data = preprocess( data )

      fs.writeFile( source.replace( __srcname, __libname ), data )

    } )

  } )

} )
