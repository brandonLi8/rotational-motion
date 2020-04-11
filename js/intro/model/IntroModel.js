// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Top Level model for the 'Intro' screen.
 *
 * Responsible for:
 *   - Keeping track of the circular motion type in a Enum Property. See intro/model/CircularMotionTypes for more
 *     documentation. This keeps track of the current scene of the 'Intro' screen.
 *   - Creating a Spinner for each circular motion type.
 *
 * IntroModel are created at the start of the sim and are never disposed of, so links are left as is.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const DerivedProperty = require( 'SIM_CORE/util/DerivedProperty' );
  const NonUniformSpinner = require( 'ROTATIONAL_MOTION/intro/model/NonUniformSpinner' );
  const Property = require( 'SIM_CORE/util/Property' );
  const UniformSpinner = require( 'ROTATIONAL_MOTION/intro/model/UniformSpinner' );

  class IntroModel {

    constructor() {

      // @public (read-only) {Property.<Enum.Member.<CircularMotionTypes>>- indicates the current circular motion type.
      this.circularMotionTypeProperty = new Property( CircularMotionTypes.UNIFORM, {
        validValues: CircularMotionTypes.MEMBERS
      } );

      // @public (read-only) {Spinner[]} - array of the Spinners scenes of the 'Intro' screen
      this.spinners = [ new UniformSpinner(), new NonUniformSpinner() ];

      // @public (read-only) {DerivedProperty.<Spinner>} - indicates the active Spinner scene. Last for the
      //                                                   entire duration of the simulation
      this.activeSpinnerProperty = new DerivedProperty( [ this.circularMotionTypeProperty ], circularMotionType => {
        return this.spinners.find( spinner => spinner.type === circularMotionType );
      } );
    }

    /**
     * Moves the intro screen by one time step.
     * @public
     *
     * @param {number} dt - time in seconds
     */
    step( dt ) {
      // Only step the active Spinner if it is playing.
      this.activeSpinnerProperty.value.isPlayingProperty.value && this.activeSpinnerProperty.value.step( dt );
    }

    /**
     * Resets the intro screen.
     * @public
     */
    reset() {
      this.spinners.forEach( spinner => { spinner.reset(); } );
      this.circularMotionTypeProperty.reset();
    }
  }

  return IntroModel;
} );