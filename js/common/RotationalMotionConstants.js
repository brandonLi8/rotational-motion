// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Constants used in multiple locations within the 'Collision Lab' simulation.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const Symbols = require( 'SIM_CORE/util/Symbols' );

  const RotationalMotionConstants = {

    SCREEN_VIEW_X_MARGIN: 60,
    SCREEN_VIEW_Y_MARGIN: 25,

    // intro-screen
    INTRO_BALL_RADIUS: 0.05, // in meters
    VELOCITY_SCALAR: 0.5, // eye-balled
    ACCELERATION_SCALAR: 0.5, // eye-balled
    INTRO_MAX_VELOCITY: Math.PI / 2,
    INTRO_MAX_VELOCITY_SYMBOL: `${ Symbols.PI } / 2`


  };

  return RotationalMotionConstants;
} );