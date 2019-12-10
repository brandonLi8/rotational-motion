// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Spinner is the model that spins a Ball model object in circular motion. This is specific
 * to only the 'intro' screen.
 *
 * Primary responsibilities are:
 *    - Keep track of the Angular Velocity (in rad/sec) in a Property
 *    - Keep track of the Angular Acceleration (in rad/sec/sec) in a Property
 *    - Keep track of the Circular Motion radius in a Property
 *    - Move the circle in a circular motion based on the Properties above and handle a drag request.
 *
 * Generally, there are two types of 'Spinners'

 *   (1) Uniform: Uniform Circular Motion is defined such that the angular acceleration (alpha)
 *                is always 0. The Angular Velocity and the ball's linear velocity can change, however.
 *
 *   (2) Non-uniform: All variables can change. For this scene, we only allow the user to change
 *                    the angular acceleration.
 *
 *   For the 'intro' screen, there are two scenes. Each scene represents the types stated above.
 *   For more background, visit https://en.wikipedia.org/wiki/Circular_motion.
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

  // constants
  const DEFAULT_STRING_RADIUS = 0.7; // in meters

  class Spinner {

    /**
     * @param {Bounds} spinnerAreaBounds
     * @param {Object} [options]
     */
    constructor( spinnerAreaBounds, options ) {

      assert( spinnerAreaBounds instanceof Bounds, `invalid spinnerAreaBounds: ${ spinnerAreaBounds }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      //----------------------------------------------------------------------------------------

      // @public (read-only) spinnerAreaBounds - the bounds for the spinner area
      this.spinnerAreaBounds = spinnerAreaBounds;

      this.stringAngleProperty = new Property( 0, {
        type: 'number'
      } ); // in degrees
      this.stringRadiusProperty = new Property( DEFAULT_STRING_RADIUS, {
        type: 'number'
      } );

      this.ballVelocityProperty = new Property( 90, {
        type: 'number'
      } ); // in degrees per second
      this.ballVelocityRange = new Vector( 0, 90 );
      this.ballRadius = 0.05;
      this.ballPositionProperty = new Property( new Vector( 0, 0 ), {
        type: Vector
      } ); // temp

      this.maxSpinnerRadius = spinnerAreaBounds.width / 2 - this.ballRadius;
      this.minSpinnerRadius = 0.1;

      const stringAngleListener = angle => {
        const radians = Util.toRadians( angle );
        this.ballPositionProperty.value = new Vector(
          Math.cos( radians ) * this.stringRadiusProperty.value,
          Math.sin( radians ) * this.stringRadiusProperty.value,
        );
      }
      this.stringAngleProperty.link( stringAngleListener );

      const radiusListener = radius => {
        const radians = Util.toRadians( this.stringAngleProperty.value );
        this.ballPositionProperty.value = new Vector(
          Math.cos( radians ) * radius,
          Math.sin( radians ) * radius,
        );
      }
      this.stringRadiusProperty.link( radiusListener );

      //----------------------------------------------------------------------------------------
      // linear velocity
      this.linearVelocityProperty = new Property( 0, {
        type: 'number'
      } );
      this.ballVelocityProperty.link( ballVelocity => {
        this.linearVelocityProperty.value = Util.toRadians( ballVelocity ) * this.stringRadiusProperty.value;
      } );
      this.stringRadiusProperty.lazyLink( stringRadius => {
        this.linearVelocityProperty.value = Util.toRadians( this.ballVelocityProperty.value ) * stringRadius;
      } );

    }

    /**
     * Moves this spinner by one time step.
     * @param {number} dt - time in seconds
     * @public
     */
    step( dt ) {
      this.stringAngleProperty.value = this.stringAngleProperty.value + dt * this.ballVelocityProperty.value;
    }

    dragBallTo( point ) {
      const degrees = Util.toDegrees( point.angle );
      const correctedAngle = degrees > 0 ? degrees : 360 + degrees;
      this.stringAngleProperty.value = correctedAngle;
      this.stringRadiusProperty.value = Util.clamp( point.magnitude, this.minSpinnerRadius, this.maxSpinnerRadius );
    }
  }

  return Spinner;
} );