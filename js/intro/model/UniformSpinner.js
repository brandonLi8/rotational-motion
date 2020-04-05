// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * UniformSpinner is a Spinner sup-type that conforms to the uniform circular motion type.
 *
 * Characteristics of a UniformSpinner are:
 *    - the angular acceleration property is always 0
 *    - the angular velocity is set by the user within a range
 *    - the radius is set by the user within a range
 *
 * UniformSpinners are created at the start of the Sim and are never disposed, so all links are left as is.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const Range = require( 'SIM_CORE/util/Range' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );

  class UniformSpinner extends Spinner {

    /**
     * @param {Object} [options] - key-value pairs that control the spinner's behavior.
     */
    constructor( options ) {
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        angularVelocityRange: new Range( 0, Math.PI / 2 ),  // {range} - the range of the angular velocity
        initialAngularVelocity: Math.PI / 4,                // {number} - the starting angular velocity

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( CircularMotionTypes.UNIFORM, options.initialAngularVelocity, 0, options );

      //----------------------------------------------------------------------------------------

      // @public {Range} (read-only) - the range of the angular velocity
      this.angularVelocityRange = options.angularVelocityRange;

      // Ensure that the angular velocity is set correctly
      assert.enabled && this.angularVelocityProperty.link( angularVelocity => {
        assert( this.angularVelocityRange.includes( angularVelocity ) );
      } );
    }
  }

  return UniformSpinner;
} );