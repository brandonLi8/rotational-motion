// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Ball is the root model encapsulation for a Ball.
 * It is abstract and intended to be subclassed as its functionality differs for different screens.
 *
 * Responsibilities of this class are:
 *  1. position Property to track the position of the Ball's center.
 *  2. velocity Property to track the linear velocity of the center of mass.
 *  3. keep track of other simple ball properties (radius, ranges, ...)
 *  4. Abstract step method. This is done because the step functionality differs
 *     for different screens (rotating about center vs rotating around a spinner).
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
      // Create the Velocity Properties

      // @public (read-only) velocityRange - Range of the linear velocity of the center of mass of the ball.
      this.velocityRange = options.velocityRange;

      // @public (read-only) velocityProperty - Property of the linear velocity of the center of mass of the Ball.
      this.velocityProperty = new Property( options.startingVelocity, { type: 'number' } );


      //----------------------------------------------------------------------------------------
      // Create the Radius Properties

      // @public (read-only) radiusRange - Range of the Ball's radius.
      this.radiusRange = options.radiusRange;

      // @public (read-only) radiusProperty - Property of the radius of the Ball.
      this.radiusProperty = new Property( options.startingRadius, {
        type: 'number',
        isValidValue: value => value >= 0 // radius must be greater than 0
      } );

      //----------------------------------------------------------------------------------------
      // @public (read-only) centerPositionProperty - Property of the position of the Ball's center
      this.centerPositionProperty = new Property( initialCenterPosition, { type: Vector } );
    }

    /**
     * @abstract
     * Steps the Ball by one time step. This functionality differs for different screens.
     * @public
     *
     * @param {number} dt - time in seconds
     */
    step( dt ) { assert( false, `abstract step class must be overriden` ); }

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