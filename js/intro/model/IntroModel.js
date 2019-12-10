// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Top Level model for the 'Intro' screen.
 *
 * Responsible for:
 *   - Keeping track of the Simulation's state.
 *   - Creating Visibility Properties for:
 *        - Linear Velocity Vectors
 * TODO: this functionality should be split into a scene model, and this class should just make 2 scenes.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );

  // constants
  const SPINNER_BOUNDS_SIZE = 2; // in meters
  const STEP_TIME = 0.03;
  const DEFAULT_IS_PLAYING = false;
  const DEFAULT_VECTOR_IS_VISIBLE = false;

  class IntroModel {

    constructor() {

      // @public (read-only) - the spinner play area bounds
      this.spinnerAreaBounds = new Bounds(
        -SPINNER_BOUNDS_SIZE / 2,
        -SPINNER_BOUNDS_SIZE / 2,
        SPINNER_BOUNDS_SIZE / 2,
        SPINNER_BOUNDS_SIZE / 2 );

      // @public (read-only) - indicates if the sim is playing or paused
      this.isPlayingProperty = new Property( DEFAULT_IS_PLAYING, { type: 'boolean' } );

      // @public (read-only) - indicates if the linear velocity Vector is visible or not.
      this.linearVelocityVisibleProperty = new Property( DEFAULT_VECTOR_IS_VISIBLE, {
        type: 'boolean'
      } );

      // @public (read-only) - indicates if the linear acceleration Vector is visible or not.
      this.linearAccelerationVisibleProperty = new Property( DEFAULT_VECTOR_IS_VISIBLE, {
        type: 'boolean'
      } );

      // @public (read-only)
      this.spinner = new Spinner( this.spinnerAreaBounds );
    }

    /**
     * Moves this model by one time step.
     * @param {number} dt - time in seconds
     * @public
     */
    step( dt ) {
      this.isPlayingProperty.value && this.spinner.step( dt );
    }

    /**
     * Moves this model back one time step.
     * @public
     */
    stepBackwards() {
      this.isPlayingProperty.value = false;
      this.spinner.step( -STEP_TIME );
    }

    /**
     * Moves this model forward one time step.
     * @public
     */
    stepForwards() {
      this.isPlayingProperty.value = false;
      this.spinner.step( STEP_TIME );
    }
  }

  return IntroModel;
} );