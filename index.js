// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Initializes an express server, to be deployed as a website.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

module.exports = ( () => {
  'use strict';

  // modules
  const express = require( 'express' );
  const path = require( 'path' );
  const sslRedirect = require( 'heroku-ssl-redirect' ); // eslint-disable-line require-statement-match

  // constants
  const PORT = process.env.PORT || 3000;
  const IS_PRODUCTION = process.env.NODE_ENV === 'production';
  const BUILD_DIRECTORY = '';

  //----------------------------------------------------------------------------------------
  // Create the website with express.
  const website = express();

  // Serve all files of the website with a __dirname reference.
  website.use( express.static( path.join( __dirname, IS_PRODUCTION ? `${ BUILD_DIRECTORY }` : '' ) ) );
  website.use( sslRedirect( [ 'production' ] ) );

  // Listen to the requests and log the results.
  website.listen( PORT, () => {

    print( 'Starting up server, serving', 33 );
    println( IS_PRODUCTION ? ` ./${ BUILD_DIRECTORY }` : ' ./', 34 );
    println( 'Available on:', 33 );
    print( '  http://localhost:' );
    println( `${ PORT }`, 32 );
    println( '\nHit CTRL-C to stop the server' );

  } );


  //----------------------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------------------
  /**
   * Alternative to `console.log` for printing into the terminal. Instead, print will:
   *   - Not assume each message is on a newline. The user must specify if there is a newline via `\n`
   *   - Contain an option to colorize the output of the message and stylize. The user can specify the colors based on
   *     number codes (see below).
   *
   * @param {*} message
   * @param {...number} [colors] - the codes for the colors and styles (can pass multiple).
   *
   *   ## Styles         | ## Foreground     |  ## Background
   *     0 - Reset       |   30 - FgBlack    |   40 - BgBlack
   *     1 - Bright      |   31 - FgRed      |   41 - BgRed
   *     2 - Dim         |   32 - FgGreen    |   42 - BgGreen
   *     3 - Italics     |   33 - FgYellow   |   43 - BgYellow
   *     4 - Underscore  |   34 - FgBlue     |   44 - BgBlue
   *     5 - Blink       |   35 - FgMagenta  |   45 - BgMagenta
   *     7 - Reverse     |   36 - FgCyan     |   46 - BgCyan
   *     8 - Hidden      |   37 - FgWhite    |   47 - BgWhite
   *
   * NOTE: You can pass in multiple color codes via spread notation.
   *       For instance, `print( 'hello world', 1, 31, 41 )` will print the bright and red with a red background.
   *
   * NOTE: If no color codes are passed in, it prints normally with color code 0.
   */
  function print( message, ...colors ) {
    // Format the message via ANSI escape codes.
    let printMessage = '';
    colors.forEach( code => {
      printMessage += `\x1b[${ code }m`;
    } );
    printMessage += `${ message }\x1b[0m`;

    // Use process.stdout.write to allow for same line printing
    process.stdout.write( printMessage );
  }

  /**
   * See print() (above). Prints but but on a new line.
   *
   * @param {*} message
   * @param {...number} [colors] - see print() (above).
   */
  function println( message, ...colors ) {
    print( `${ message }\n`, ...colors );
  }
} )();