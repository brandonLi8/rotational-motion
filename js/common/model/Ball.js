// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Ball is the root model encapsulation for a Ball in all Screens.
 * It is abstract and intended to be subclassed as its functionality differs for different screens.
 *
 * Primary responsibilities are:
 *  1. position Property to track the position of the Ball's center.
 *  2. radius Property to track the inner radius of the Ball.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  class Ball {

    /**
     * @param {Vector} initialCenterPosition - starting center position for the Ball
     * @param {number} initialRadius - the initial inner radius of the Ball.
     */
    constructor( initialCenterPosition, initialRadius ) {
      assert( initialCenterPosition instanceof Vector, `invalid initialCenterPosition: ${ initialCenterPosition }` );
      assert( typeof initialRadius === 'number', `invalid initialRadius: ${ initialRadius }` );

      // @public (read-only) centerPositionProperty - Property of the position of the Ball's center
      this.centerPositionProperty = new Property( initialCenterPosition, { type: Vector } );

      // @public (read-only) radiusProperty - Property of the radius of the Ball.
      this.radiusProperty = new Property( initialRadius, {
        type: 'number',
        isValidValue: value => value >= 0 // radius must be greater than 0
      } );
    }

    /**
     * Resets the Ball and its Properties.
     * @public
     */
    reset() {
      this.centerPositionProperty.reset();
      this.radiusProperty.reset();
    }

    //----------------------------------------------------------------------------------------

    /**
     * Gets the position of the Ball's center, in meter coordinates.
     * @public
     *
     * @returns {Vector} - in meter coordinates
     */
    get center() { return this.centerPositionProperty.value; }

    /**
     * Sets the position of the Ball's center, in meter coordinates.
     * @public
     *
     * @param {Vector} center - in meter coordinates
     */
    set center( center ) { this.centerPositionProperty.value = center; }

    /**
     * Gets the Ball's radius, in meters.
     * @public
     *
     * @returns {number} - in meters
     */
    get radius() { return this.radiusProperty.value; }

    /**
     * Sets the Ball's radius, in meters.
     * @public
     *
     * @param {number} radius - in meters
     */
    set radius( radius ) { this.radiusProperty.value = radius; }
  }

  return Ball;
} );