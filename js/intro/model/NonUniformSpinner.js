// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * NonUniformSpinner is a Spinner sup-type that conforms to the non-uniform circular motion type.
 *
 * Characteristics of a NonUniformSpinner are:
 *    - the angular acceleration property is set by the user within a range
 *    - the angular velocity is constantly changing but not directly set by the user
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

  class NonUniformSpinner extends Spinner {

    /**
     * @param {Object} [options] - key-value pairs that control the spinner's behavior.
     */
    constructor( options ) {
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // {range} - the range of the angular acceleration
        angularAccelerationRange: new Range( -Math.PI / 4, Math.PI / 4 ),

        // {number} - the starting angular velocity
        initialAngularVelocity: 0,

        // {number} - the starting angular acceleration
        initialAngularAcceleration: Math.PI / 8,

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( CircularMotionTypes.NON_UNIFORM,
             options.initialAngularVelocity,
             options.initialAngularAcceleration,
             options );

      //----------------------------------------------------------------------------------------

      // @public {Range} (read-only) - the range of the angular acceleration
      this.angularAccelerationRange = options.angularAccelerationRange;

      // Ensure that the angular acceleration is set correctly
      assert.enabled && this.angularAccelerationProperty.link( angularAcceleration => {
        assert( this.angularAccelerationRange.contains( angularAcceleration ) );
      } );
    }
  }

  return NonUniformSpinner;
} );