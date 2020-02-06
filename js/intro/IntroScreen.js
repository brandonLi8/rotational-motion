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
  // const IntroModel = require( 'ROTATIONAL_MOTION/intro/model/IntroModel' );
  const Screen = require( 'SIM_CORE/Screen' );

  // constants
  const INTRO_SCREEN_NAME = 'Intro';

  class IntroScreen extends Screen {

    constructor() {

      const options = {
        name: INTRO_SCREEN_NAME,

        style: {
          background: 'rgb( 255, 250, 227 )'
        }
      };

      super( () => new IntroScreenView(), options );
    }
  }

  return IntroScreen;
} );