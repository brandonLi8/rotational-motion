// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Ball is the root model encapsulation for a Ball.
 * It is abstract and intended to be subclassed as its functionality differs for different screens.
 *
 * Primary responsibilities are:
 *  1. position Property to track the position of the Ball's center.
 *  2. velocity Property to track the linear velocity of the center of mass.
 *  3. keep track of other simple ball properties (radius, ranges, etc.)
 *  4. Abstract step method. This is done because the step functionality differs
 *     for different screens (rotating about center vs rotating around a spinner).
 *  5. Abstract drag method (called when the Ball is dragged). This is done because
 *     dragging and its bounds differs for different screens.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const assert = require( 'SIM_CORE/util/assert' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const Util = require( 'SIM_CORE/util/Util' );

  class Ball {

    /**
     * @param {Vector} initialCenterPosition - starting center position for the Ball
     * @param {Object} [options] - key-value pairs that control simple ball properties.
     */
    constructor( initialCenterPosition options ) {

      assert( initialCenterPosition instanceof Vector, `invalid initialCenterPosition: ${ initialCenterPosition }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      //----------------------------------------------------------------------------------------
      options = {

        isDraggable: true,           // {boolean} - indicates if the user can drag this Ball. If true, sub classes must
                                     //             override the dragTo() abstract method.

        startingVelocity: 0,         // {number} - the default velocity of the center of mass, in meters per second
        velocityRange: Vector.ZERO,  // {Vector} - the range of the velocity of the center of mass, in meters per second

        startingRadius: 0.05,        // {number} - the default radius of Ball, in meters

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------
      // Responsibility 1: create the position Property to track the position of the Ball's center

      // @public (read-only) centerPositionProperty - Property of the position of the Ball's center
      this.centerPositionProperty = new Property( initialCenterPosition, { type: Vector } );

      //----------------------------------------------------------------------------------------
      // Responsibility 2: create a velocity Property to track the linear velocity of the center of mass (m/s).

      // @public (read-only) velocityRange - Range of the linear velocity of the center of mass of the ball.
      this.velocityRange = options.velocityRange;

      // @public (read-only) velocityProperty - Property of the linear velocity of the center of mass of the Ball.
      this.velocityProperty = new Property( options.startingVelocity, {
        type: 'number',
        isValidValue: value => value >= this.velocityRange.x && value <= this.velocityRange.y
      } );

      //----------------------------------------------------------------------------------------
      // Responsibility 3: keep track of other simple ball properties (radius, ranges, etc.)

      // @public (read-only) isDraggable - indicates if the user can drag this Ball. See `dragTo()` abstract method.
      this.isDraggable = options.isDraggable;

      // @public (read-only) radiusProperty - Property of the radius of the Ball.
      this.radiusProperty = new Property( options.startingRadius, {
        type: 'number',
        isValidValue: value => value >= 0 // radius must be greater than 0
      } );
    }

    /**
     * @abstract
     * Steps the Ball by one time step. This functionality differs for different screens.
     * @public
     *
     * @param {number} dt - time in seconds
     */
    step( dt ) { assert( false, `abstract step class must be overriden` ); }

    /**
     * @abstract
     * Called when the Ball is dragged ONLY if this.isDraggable is true. This is done because
     * dragging bounds differs for different screens.
     * @public
     *
     * @param {Vector} position - the position of the Center of the Ball
     */
    dragTo( position ) { assert( false, `abstract dragTo class must be overriden` ); }

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
    set center( center ) {
      assert( center instanceof Vector, `invalid center: ${ center }` );
      this.centerPositionProperty.value = center;
    }

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
    set radius( radius ) {
      assert( typeof radius === 'number' && radius >= 0, `invalid radius: ${ radius }` );
      this.radiusProperty.value = radus;
    }

    /**
     * Gets the Ball's center of mass velocity, in meters per second.
     * @public
     * @returns {number} - in meters per second
     */
    get velocity() { return this.velocityProperty.value; }

    /**
     * Sets the Ball's velocity, in meters per second.
     * @public
     * @param {number} velocity, in meters per second.
     */
    set velocity( velocity ) {
      assert( velocity instanceof Vector, `invalid velocity: ${ velocity }` );
      this.velocityProperty.value = center;
    }
  }

  return Ball;
} );