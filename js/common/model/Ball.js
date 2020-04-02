// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Ball is the root model encapsulation for a Ball in all Screens.
 * It is abstract and intended to be subclassed as its functionality differs for different screens.
 *
 * Primary responsibilities are:
 *  1. position Property to track the position of the Ball's center.
 *  2. radius Property to track the inner radius of the Ball.
 *  3. Abstract step method. This is done because the step functionality differs for different screens (rotates about
 *     its center in the Rolling screen but rotates around a point outside the ball in the Intro screen).
 *  4. Abstract dragTo method (called when the Ball is dragged). This is done because
 *     dragging and its bounds differs for different screens. See sub-classes for more documentation.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  // @abstract
  class Ball {

    /**
     * @param {Vector} initialCenterPosition - starting center position for the Ball
     * @param {number} initialRadius - the initial inner radius of the Ball.
     * @param {Object} [options] - key-value pairs that control simple ball properties.
     */
    constructor( initialCenterPosition, initialRadius, options ) {
      assert( initialCenterPosition instanceof Vector, `invalid initialCenterPosition: ${ initialCenterPosition }` );
      assert( typeof initialRadius === 'number', `invalid initialRadius: ${ initialRadius }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        isDraggable: false, // {boolean} - indicates if the user can drag this Ball. If true, sub classes must
                            //             override the dragTo() abstract method.

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------

      // @public (read-only) isDraggable - indicates if the user can drag this Ball. See `dragTo()` abstract method.
      this.isDraggable = options.isDraggable;

      // @public (read-only) centerPositionProperty - Property of the position of the Ball's center
      this.centerPositionProperty = new Property( initialCenterPosition, { type: Vector } );

      // @public (read-only) radiusProperty - Property of the radius of the Ball.
      this.radiusProperty = new Property( options.startingRadius, {
        type: 'number',
        isValidValue: value => value >= 0 // radius must be greater than 0
      } );
    }

    /**
     * @abstract
     * Steps the Ball by one time step. This functionality differs for different screens and is, thus, abstract.
     * See sub-classes for specific documentation..
     * @public
     *
     * @param {number} dt - time in seconds
     */
    step( dt ) { assert( false, 'abstract step class must be overridden' ); }

    /**
     * @abstract
     * Called when the Ball is dragged ONLY if this.isDraggable is true. This is done because
     * dragging bounds differs for different screens.
     * @public
     *
     * @param {Vector} position - the position of the Center of the Ball to move the Ball to.
     */
    dragTo( position ) { assert( false, 'abstract dragTo class must be overridden' ); }

    /**
     * Resets the Ball and its Properties.
     * @public
     */
    reset() {
      this.centerPositionProperty.reset();
      this.radiusProperty.reset();
    }

    //----------------------------------------------------------------------------------------
    // Convenience Methods
    //----------------------------------------------------------------------------------------

    /**
     * Gets the position of the Ball's center, in meter coordinates.
     * @public
     * @returns {Vector} - in meter coordinates
     */
    get center() { return this.centerPositionProperty.value; }

    /**
     * Sets the position of the Ball's center, in meter coordinates.
     * @public
     * @param {Vector} center - in meter coordinates
     */
    set center( center ) { this.centerPositionProperty.value = center; }

    /**
     * Gets the Ball's radius, in meters.
     * @public
     * @returns {number} - in meters
     */
    get radius() { return this.radiusProperty.value; }

    /**
     * Sets the Ball's radius, in meters.
     * @public
     * @param {number} radius - in meters
     */
    set radius( radius ) { this.radiusProperty.value = radius; }
  }

  return Ball;
} );