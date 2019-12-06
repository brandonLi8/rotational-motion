// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Top Level model for the 'Intro' screen.
 *
 * Responsible for:
 *
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );

  // constants
  const SPINNER_BOUNDS_SIZE = 2; // in meters

  class IntroModel {

    constructor() {

      // @public (read-only) - the spinner play area bounds, as a perfect circle
      this.spinnerAreaBounds = new Bounds(
        -SPINNER_BOUNDS_SIZE / 2,
        -SPINNER_BOUNDS_SIZE / 2,
        SPINNER_BOUNDS_SIZE / 2,
        SPINNER_BOUNDS_SIZE / 2 );


      // @public (read-only)
      this.spinner = new Spinner( this.spinnerAreaBounds );
    }

    /**
     * Moves this model by one time step.
     * @param {number} dt - time in seconds
     * @public
     */
    step( dt ) {
      this.spinner.step( dt );
    }
  }

  return IntroModel;
} );