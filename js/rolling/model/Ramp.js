// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Ramp is the model that represents a sloped surface for a Ball to roll down in the presence of gravity. This is
 * specific only to the 'Rolling' screen.
 *
 * The Ramp is a standard right-triangle, with the 90 degree angle in the bottom-left:
 *   *
 *   ***
 *   *****
 *
 * Primary responsibilities are:
 *    - Keep track of the angle of the slopped ramp relative to the horizontal in a Property.
 *    - Create a RollingBall for each
 *    -
 *
 * Ramps are created at the start of the Sim and are never disposed, so all links are left as is.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Range = require( 'SIM_CORE/util/Range' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  class Ramp {

    /**
     * @param {Object} [options] - key-value pairs that control the ramp's behavior.
     */
    constructor( options ) {
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // {number} - the initial angle of the ramp, in radians
        initialAngle: Math.PI / 4,

        // {Range} - the range of angle of the ramp, in radians
        angleRange: new Range( 0, Math.PI * 3 / 8 ),

        // {number} - the length of the bottom left of the ramp-triangle, in meters
        bottomLegLength: 5,

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------

      // @public {Property} - Property of the current angle of the ramp, in radians.
      this.angleProperty = new Property( options.initialAngle, {
        type: 'number',
        isValidValue: value => options.angleRange.contains( value )
      } );

      // @public (read-only) {Range} - range of the angle of the ramp, in radians.
      this.angleRange = options.angleRange;

      // @public (read-only) {Bounds} - the bounds of the entire ramp area. The origin is the bottom-left of the
      //                                ramp, and expands to the right to include the bottom-leg. It expands upwards to
      //                                include the maximum y value.
      this.playBounds = new Bounds( 0, 0,
        options.bottomLegLength,
        Math.tan( this.angleRange.max ) * options.bottomLegLength
      );
    }

    /**
     * Resets the Ramp and its properties to what it was when initialized. Called when the reset button is pressed.
     * @public
     */
    reset() {
      this.angleProperty.reset();
    }

    /**
     * Gets the Ramp's angle, in radians.
     * @public
     *
     * @returns {number} - in radians.
     */
    get angle() { return this.angleProperty.value; }

    /**
     * Sets the Ramp's angle, in radians.
     * @public
     *
     * @param {number} angle - in radians.
     */
    set angle( angle ) { this.angleProperty.value = angle; }
  }

  return Ramp;
} );