'use strict'

const macros = require( './macros' )

function preprocess( input ) {

  let output = input

  function replace( name ) {

    output = output.replace( new RegExp( name, 'g' ), macros[ name ] )

  }

  function expand( name ) {

    let regexp = new RegExp( '( *)' + name + '\s*\\(((.|\s)*)\\)', 'g' )

    output = output.replace( regexp, function write( m, $1, $2, o, s ) {

      const context = { name: name, match: m, offset: o, string: s, ws: $1 }

      return macros[ name ].apply( context, parseArguments( $2 ) )

    } )

  }

  for ( let name in macros ) {

    if ( !macros.hasOwnProperty( name ) ) continue

    ( typeof macros[ name ] == 'function' ? expand : replace )( name )

  }

  return output

}

function parseArguments( input ) {

  return input.split( ',' ).map( parseArgument )

}

function parseArgument( input ) {

  let argument = input.trim()
  const startsWith = argument.charAt( 0 )

  if ( startsWith == '\'' || startsWith == '"' )

    argument = argument.substring( 1, argument.length - 1 )

  else

    try {

      argument = JSON.parse( argument )

    } catch ( e ) {}

  return argument

}

module.exports = preprocess
