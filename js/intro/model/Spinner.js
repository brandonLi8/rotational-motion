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
 * Spinners are created at the start of the Sim and are never disposed, so all links are left as is.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const IntroBall = require( 'ROTATIONAL_MOTION/intro/model/IntroBall' );
  const Multilink = require( 'SIM_CORE/util/Multilink' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  // constants
  const ANGULAR_VELOCITY_RANGE = new Vector( 0, Math.PI );

  class Spinner {

    /**
     * @param {Bounds} spinnerAreaBounds - the 'play' bounds of the spinner
     * @param {Object} [options] - key-value pairs that control the spinner's behavior.
     */
    constructor( spinnerAreaBounds, options ) {

      assert( spinnerAreaBounds instanceof Bounds, `invalid spinnerAreaBounds: ${ spinnerAreaBounds }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        initialAngularVelocity: Math.PI / 4,         // {number} - the starting omega value, in rad / sec
        initialAngularAcceleration: 0,               // {number} - the starting alpha value, in rad / sec / sec

        initialRadius: spinnerAreaBounds.width / 4,  // {number} - the initial radius of the circular motion, in meters
        minRadius: 0.1,                              // {number} - the min radius of the circular motion, in meters

        initialAngle: 0,                             // {number} - the starting angle of the ciruclar motion, in radians

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------
      // @public (read-only) spinnerAreaBounds - reference to the spinnerAreaBounds
      this.spinnerAreaBounds = spinnerAreaBounds;

      //----------------------------------------------------------------------------------------

      // @public (read-only) angularVelocityProperty - Property of the angular velocity of the ciruclar motion
      //                                               in rad / sec
      this.angularVelocityProperty = new Property( options.initialAngularVelocity, { type: 'number' } );

      // @public (read-only) vector - the range of the angular velocity
      this.angularVelocityRange = ANGULAR_VELOCITY_RANGE;

      // @public (read-only) angularAccelerationProperty - Property of the angular acceleration of the ciruclar motion
      //                                                   in rad / sec / sec
      this.angularAccelerationProperty = new Property( options.initialAngularAcceleration, { type: 'number' } );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {Vector} radiusRange - the range (x as min, y as max) of the circular motion radius, in m.
      this.radiusRange = new Vector( options.minRadius, spinnerAreaBounds.width / 2 - 0.05 );

      // @public (read-only) radiusProperty - Property of the radius of the ciruclar motion, in meters
      this.radiusProperty = new Property( options.initialRadius, {
        type: 'number',
        isValidValue: value => value >= this.radiusRange.y && this.radiusRange.y
      } );

      //----------------------------------------------------------------------------------------
      // Create a Ball to spin

      // @public {IntroBall} ball - the ball to spin in circular motion, initialized at the origin but to be updated.
      this.ball = new IntroBall( Vector.ZERO, this );

      //----------------------------------------------------------------------------------------
      // Internals and listeners.

      // @private angleProperty - Property of the current angle the Circular motion is in, in radians.
      this.angleProperty = new Property( options.initialAngle, { type: 'number' } );

      // Observe when the internal Properties of the Spinner changes and update the Ball's position.
      // Doesn't need to be disposed because the Spinner is never disposed and lasts for the entirety of the sim.
      const updateBallMultilink = new Multilink( [ this.angleProperty, this.radiusProperty ], ( angle, radius ) => {
        // Update the ball's center location
        this.ball.center = new Vector( Math.cos( angle ) * radius, Math.sin( angle ) * radius );
      } );
    }

    /**
     * Steps the Spinner by one time step. For this screen, the Spinner only steps a Ball and its angular velocity.
     *
     * NOTE: this assumes that this is only called when the sim is playing.
     * @public
     *
     * @param {number} dt - time in seconds
     */
    step( dt ) {
      this.ball.step( dt );
    }

    /**
     * Resets the Spinner.
     * @public
     */
    reset() {
      this.angularVelocityProperty.reset();
      this.angularAccelerationProperty.reset();
      this.radiusProperty.reset();
      this.angleProperty.reset();
      this.ball.reset();
    }

    //----------------------------------------------------------------------------------------
    // Convenience Methods
    //----------------------------------------------------------------------------------------

    /**
     * Gets the Spinner's angularVelocity, in radians per second.
     * @public
     * @returns {number} - in radians per second.
     */
    get angularVelocity() { return this.angularVelocityProperty.value; }

    /**
     * Gets the Spinner's angularAcceleration, in radians per second.
     * @public
     * @returns {number} - in radians per second.
     */
    get angularAcceleration() { return this.angularAccelerationProperty.value; }

    /**
     * Gets the Spinner's radius, in meters.
     * @public
     * @returns {number} - in meters.
     */
    get radius() { return this.radiusProperty.value; }

    /**
     * Gets the Spinner's angle, in radians.
     * @public
     * @returns {number} - in radians.
     */
    get angle() { return this.angleProperty.value; }

    /**
     * Sets the Spinner's angle, in radians.
     * @public
     * @param {number} angle - in radians.
     */
    set angle( angle ) {
      assert( typeof angle === 'number', `invalid angle: ${ angle }` );
      this.angleProperty.value = angle;
    }

    // dragBallTo( point ) {
    //   const degrees = Util.toDegrees( point.angle );
    //   const correctedAngle = degrees > 0 ? degrees : 360 + degrees;
    //   this.stringAngleProperty.value = correctedAngle;
    //   this.stringRadiusProperty.value = Util.clamp( point.magnitude, this.minSpinnerRadius, this.maxSpinnerRadius );
    // }
  }

  return Spinner;
} );