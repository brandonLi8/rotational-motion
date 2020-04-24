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

        // {number} - the initial angle of the slope relative to the horizontal, in radians
        initialAngle: 2 * Math.PI / 13,

        // {Range} - the range of the angle of the slope relative to the horizontal, in radians
        angleRange: new Range( 0, Math.PI / 5 ),

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------

      // @public {Property} - Property of the current angle of the slope relative to the horizontal, in radians.
      this.angleProperty = new Property( options.initialAngle, {
        type: 'number',
        isValidValue: value => options.angleRange.contains( value )
      } );

      // @public (read-only) {Range} - range of the angle of the slope relative to the horizontal, in radians.
      this.angleRange = options.angleRange;

      // @public (read-only) {Bounds} - the bounds of the entire ramp bounds, including the lift-bar and stand,
      //                                in meters. See the comment at the top of the file for context.
      //                                ┌─┐
      //                                │  ╲
      //                                │ . ╲__  <- The origin of the Ramp Bounds is the dot inside the Ramp.
      //                                │______│
      this.playBounds = new Bounds(
        -Ramp.LIFT_BAR_WIDTH,
        -Ramp.STAND_HEIGHT,
        -Ramp.LIFT_BAR_WIDTH + Ramp.STAND_WIDTH,
        Math.tan( this.angleRange.max ) * this.slopeWidth + Ramp.LIFT_BAR_Y_EXTENSION
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
     * Gets the height of the slope, in meters.
     * @public
     *
     * @returns {number} - in meters.
     */
    get slopeHeight() { return Math.tan( this.angle ) * this.slopeWidth; }

    /**
     * Gets the width of the slope, in meters.
     * @public
     *
     * @returns {number} - in meters.
     */
    get slopeWidth() { return Ramp.STAND_WIDTH - Ramp.LIFT_BAR_WIDTH - Ramp.STAND_X_EXTENSION; }

    /**
     * Gets the height of the Ramp, in meters.
     * @public
     *
     * @returns {number} - in meters.
     */
    get height() { return this.slopeHeight + Ramp.LIFT_BAR_Y_EXTENSION + Ramp.STAND_HEIGHT; }

    /**
     * Gets the Ramp's slope angle, in radians.
     * @public
     *
     * @returns {number} - in radians.
     */
    get angle() { return this.angleProperty.value; }

    /**
     * Sets the Ramp's slope angle, in radians.
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
  Ramp.STAND_HEIGHT = 0.55;

  // @public {number} - the width of the stand of the slope (see the comment at the top of the file) in meters.
  Ramp.STAND_WIDTH = 5;

  // @public {number} - the width of the lift-bar (see the comment at the top of the file) in meters.
  Ramp.LIFT_BAR_WIDTH = 0.6;

  // @public {number} - the amount the lift bar extrudes upwards past the top of the slope, in meters.
  Ramp.LIFT_BAR_Y_EXTENSION = 0.25;

  // @public {number} - the amount the stand extrudes rightwards past the edge of the slope, in meters.
  Ramp.STAND_X_EXTENSION = 2.1;

  return Ramp;
} );