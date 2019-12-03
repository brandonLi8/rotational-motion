// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * The 'Intro' screen. Conforms to the contract specified in sim-core/Screen.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const IntroScreenView = require( 'ROTATIONAL_MOTION/intro/view/IntroScreenView' );
  const Screen = require( 'SIM_CORE/Screen' );

  // constants
  const INTRO_SCREEN_NAME = 'Intro';

  class IntroScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: INTRO_SCREEN_NAME
      };

      super( () => 5, () => new IntroScreenView(), options );
    }
  }

  return IntroScreen
} );