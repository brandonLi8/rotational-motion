// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Ramp is the model that represents the entire sloped surface for a Ball to roll down in the presence of gravity. This
 * is specific only to the 'Rolling' screen.
 *
 * The Ramp Looks something like.
 *               ┌─┐
 *   lift-bar -  │↕ ╲ - slope
 *               │   ╲
 *               │    ╲__
 *               │_______│ - stand
 *
 *            Functionality:
 *              slope - the piece the RollingBall's roll down. Is draggable to change the elevation (and angle).
 *              lift bar - allows the user to change the angle (the up-down arrow is draggable).
 *              stand - lifts the Ramp upwards to allow the user to see the ramp when it is completely horizontal.
 *
 * Some responsibilities of Ramps are:
 *    - Keep track of the angle of the slope relative to the horizontal stand, in a Property.
 *    - Keep track of the model Bounds of the entire Ramp, including the lift-bar and stand.
 *    - Keep track of the height of the lift-bar, in meters.
 *    - Reference useful constants, like the width of the lift-bar and the height of the stand.
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

  class Ramp {

    /**
     * @param {Object} [options] - key-value pairs that control the ramp's behavior.
     */
    constructor( options ) {
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // {number} - the initial angle of the ramp, in radians
        initialAngle: Math.PI / 4,

        // {Range} - the range of the angle of the ramp, in radians
        angleRange: new Range( 0, Math.PI * 3 / 8 ),

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------

      // @public {Property} - Property of the current angle of the ramp relative to the horizontal, in radians.
      this.angleProperty = new Property( options.initialAngle, {
        type: 'number',
        isValidValue: value => options.angleRange.contains( value )
      } );

      // @public (read-only) {Range} - range of the angle of the ramp relative to the horizontal, in radians.
      this.angleRange = options.angleRange;

      // @public (read-only) {Bounds} - the tentatively-chosen bounds of the entire ramp bounds, in meters.
      //
      // The Ramp model represents a right triangle shape that looks like:
      //  |╲
      //  | ╲
      //  |__╲
      //
      // The bottom-left corner of the triangle is the origin. The bottom side is the BOTTOM_LEG_LENGTH. The angle is
      // the angle between the bottom leg and the hypotenuse (the slope the ball rolls down).
      this.playBounds = new Bounds( 0, 0,
        Ramp.BOTTOM_LEG_LENGTH,
        Math.tan( this.angleRange.max ) * Ramp.BOTTOM_LEG_LENGTH
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

  //----------------------------------------------------------------------------------------
  // Static Constants
  //----------------------------------------------------------------------------------------

  // @public {number} - the height of the stand of the slope (see the comment at the top of the file) in meters.
  Ramp.STAND_HEIGHT = 10;

  // @public {number} - the width of the stand of the slope (see the comment at the top of the file) in meters.
  Ramp.STAND_WIDTH = 100;

  // @public {number} - the width of the lift-bar (see the comment at the top of the file) in meters.
  Ramp.LIFT_BAR_WIDTH = 30;

  // @public {number} - the amount the lift bar extrudes upwards past the top of the slope, in meters.
  Ramp.LIFT_BAR_Y_EXTENSION = 5;

  // @public {number} - the amount the stand extrudes rightwards past the edge of the slope, in meters.
  Ramp.STAND_X_EXTENSION = 5;

  return Ramp;
} );