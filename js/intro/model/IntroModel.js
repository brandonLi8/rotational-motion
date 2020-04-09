// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Top Level model for the 'Intro' screen.
 *
 * Instantiates a 'uniform' and a 'non-uniform' Spinner. See intro/model/CircularMotionTypes for more documentation.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const NonUniformSpinner = require( 'ROTATIONAL_MOTION/intro/model/NonUniformSpinner' );
  const UniformSpinner = require( 'ROTATIONAL_MOTION/intro/model/UniformSpinner' );

  class IntroModel {

    constructor() {

      // @public (read-only) {Spinner} - the uniform Spinner
      this.uniformSpinner = new UniformSpinner();

      // @public (read-only) {Spinner} - the non-uniform Spinner
      this.nonUniformSpinner = new NonUniformSpinner();
    }

    /**
     * Moves the intro screen by one time step.
     * @public
     *
     * @param {number} dt - time in seconds
     */
    step( dt ) {
      this.uniformSpinner.isPlayingProperty.value && this.uniformSpinner.step( dt );
      this.nonUniformSpinner.isPlayingProperty.value && this.nonUniformSpinner.step( dt );
    }

    /**
     * Resets the intro screen.
     * @public
     */
    reset() {
      this.uniformSpinner.reset();
      this.nonUniformSpinner.reset();
    }
  }

  return IntroModel;
} );