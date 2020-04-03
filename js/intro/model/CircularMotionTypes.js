// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Enumeration of the different 'types' of circular motion in the 'Intro' screen.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Enum = require( 'SIM_CORE/util/Enum' );

  const CircularMotionTypes = new Enum( [

    // The first 'scene' of the 'Intro' screen, where the angular acceleration (alpha) is always 0 and the user can
    // change the angular speed (omega) and radius of the circular motion.
    'UNIFORM',

    // The second 'scene' of the 'Intro' screen, where the user can change the angular acceleration (alpha) of
    // the circular motion.
    'NON_UNIFORM'
  ] );

  return CircularMotionTypes;
} );