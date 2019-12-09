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
  const Property = require( 'SIM_CORE/util/Property' );

  // constants
  const SPINNER_BOUNDS_SIZE = 2; // in meters
  const STEP_TIME = 0.01;

  class IntroModel {

    constructor() {

      // @public (read-only) - the spinner play area bounds, as a perfect circle
      this.spinnerAreaBounds = new Bounds(
        -SPINNER_BOUNDS_SIZE / 2,
        -SPINNER_BOUNDS_SIZE / 2,
        SPINNER_BOUNDS_SIZE / 2,
        SPINNER_BOUNDS_SIZE / 2 );

      // @public
      this.playProperty = new Property( false );

      this.linearVelocityVisibleProperty = new Property( false );

      // @public (read-only)
      this.spinner = new Spinner( this.spinnerAreaBounds );
    }

    /**
     * Moves this model by one time step.
     * @param {number} dt - time in seconds
     * @public
     */
    step( dt ) {
      this.playProperty.value && this.spinner.step( dt );
    }

    stepBackwards() {
      this.playProperty.value = false;
      this.spinner.step( -STEP_TIME );
    }

    stepForwards() {
      this.playProperty.value = false;
      this.spinner.step( STEP_TIME );
    }

  }

  return IntroModel;
} );