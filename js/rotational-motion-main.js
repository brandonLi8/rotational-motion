// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Main Entry point for the 'Rotational Motion' sim.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const IntroScreen = require( 'ROTATIONAL_MOTION/intro/IntroScreen' );
  const Sim = require( 'SIM_CORE/Sim' );

  //----------------------------------------------------------------------------------------
  // Start the Rotational Motion Sim.
  new Sim( new IntroScreen() );
} );