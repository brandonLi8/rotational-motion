// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Spinner is the model that spins a Ball model object in circular motion. This is specific
 * to only the 'intro' screen.
 *
 * Primary responsibilities are:
 *    - Keep track of a play-pause Property
 *    - Keep track of the Angular Velocity (in rad/sec) in a Property
 *    - Keep track of the Angular Acceleration (in rad/sec/sec) in a Property
 *    - Keep track of the Circular Motion radius in a Property
 *    - Move the circle in a circular motion based on the Properties above and handle a drag request.
 *
 * Generally, there are two types of Spinners:
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
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const IntroBall = require( 'ROTATIONAL_MOTION/intro/model/IntroBall' );
  const Multilink = require( 'SIM_CORE/util/Multilink' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Range = require( 'SIM_CORE/util/Range' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  // constants
  const ANGULAR_VELOCITY_RANGE = new Ragne( 0, RotationalMotionConstants.INTRO_MAX_VELOCITY );
  const ANGULAR_ACCELERATION_RANGE = new Ragne( 0, Math.PI / 4 );
  const DEFAULT_IS_PLAYING = false;
  const STEP_TIME = 0.03; // Time passed when the step forward or backward button is pressed.

  class Spinner {

    /**
     * @param {Enum.Member.<CircularMotionTypes>} circularMotionType - See CircularMotionTypes for more documentation.
     * @param {Bounds} spinnerAreaBounds - the 'play' bounds of the spinner
     * @param {Object} [options] - key-value pairs that control the spinner's behavior.
     */
    constructor( circularMotionType, spinnerAreaBounds, options ) {
      assert( spinnerAreaBounds instanceof Bounds, `invalid spinnerAreaBounds: ${ spinnerAreaBounds }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );
      assert( CircularMotionTypes.includes( circularMotionType ),
        `invalid circularMotionType: ${ circularMotionType }` );

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

      // @public (read-only) - indicates if the spinner is playing or paused
      this.isPlayingProperty = new Property( DEFAULT_IS_PLAYING, { type: 'boolean' } );

      // @public {Enum.Member.<CircularMotionTypes>} (read-only) - reference the type of circular motion passed-in
      this.type = circularMotionType;

      // @public (read-only) spinnerAreaBounds - reference to the spinnerAreaBounds that was passed-in
      this.spinnerAreaBounds = spinnerAreaBounds;

      // @public (read-only) angularVelocityProperty - angular velocity of the ciruclar motion in rad / sec
      this.angularVelocityProperty = new Property( options.initialAngularVelocity, { type: 'number' } );

      // @public (read-only) {Range} - the range of the angular velocity.
      this.angularVelocityRange = ANGULAR_VELOCITY_RANGE;

      // @public (read-only) angularAccelerationProperty - angular acceleration of the ciruclar motion in rad / sec^2
      this.angularAccelerationProperty = new Property( options.initialAngularAcceleration, { type: 'number' } );

      // @public (read-only) {Range} - the range of the angular acceleration.
      this.angularAccelerationRange = ANGULAR_ACCELERATION_RANGE;

      // @public {IntroBall} ball - the ball to spin in circular motion, initialized at the origin but to be updated.
      this.ball = new IntroBall( this, Vector.ZERO );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {Range} radiusRange - the range of the circular motion radius, in meters.
      this.radiusRange = new Range( options.minRadius, spinnerAreaBounds.width / 2 - ball.radius );

      // @public (read-only) radiusProperty - Property of the radius of the ciruclar motion, in meters.
      this.radiusProperty = new Property( options.initialRadius, {
        type: 'number',
        isValidValue: value => this.radiusRange.contains( value )
      } );

      //----------------------------------------------------------------------------------------

      // @private {Property} - Property of the current angle the Circular motion is in, in radians.
      this._angleProperty = new Property( options.initialAngle, { type: 'number' } );

      // Observe when the internal Properties of the Spinner changes and update the Ball's position.
      // Doesn't need to be disposed because the Spinner is never disposed and lasts for the entirety of the sim.
      new Multilink( [ this._angleProperty, this.radiusProperty ], ( angle, radius ) => {
        this.ball.center = new Vector( radius, 0 ).setAngle( angle );
      } );
    }

    /**
     * Steps the Spinner by one time step. For this screen, the Ball spins around the origin (circular motion).
     * This method changes the Ball's position such that it matches the correct angular acceleration,
     * angular velocity, and radius.
     *
     * @public
     *
     * @param {number} dt - time in seconds
     */
    step( dt ) {
      if ( !this.isPlayingProperty.value ) return; // if paused, do nothing.

      // Calculate the change in angle (in radians) based on the average angular velocity (rad/sec)
      // This is calculated with the equation of kinematic: theta = initial-theta + omega * t + 1/2 * alpha * t^2
      // Rearranging this equation and we get deltaTheta = omega * dt + 0.5 * alpha * t^2.
      // For more info, see https://courses.lumenlearning.com/physics/chapter/10-2-kinematics-of-rotational-motion/
      this.angle += this.angularVelocity * dt + 0.5 * this.angularAcceleration * dt * dt;
    }

    /**
     * Moves this Spinner back one time step.
     * @public
     */
    stepBackwards() {
      this.isPlayingProperty.value = false;
      this.spinner.step( -STEP_TIME );
    }

    /**
     * Moves this Spinner forward one time step.
     * @public
     */
    stepForwards() {
      this.isPlayingProperty.value = false;
      this.spinner.step( STEP_TIME );
    }

    /**
     * Resets the Spinner and its properties to what it was when initialized. Called when the reset button of the
     * scene is pressed.
     * @public
     */
    reset() {
      this.angularVelocityProperty.reset();
      this.angularAccelerationProperty.reset();
      this.radiusProperty.reset();
      this._angleProperty.reset();
      this.ball.reset();
    }

    /**
     * Called when the Ball is dragged. Attempts to position the Ball at the new Radius but constrains its bounds to
     * remain in the radius range. Angles and radii are updated.
     * @public
     *
     * @param {Vector} position - the position of the Center of the Ball
     */
    dragBallTo( position ) {
      // First shift the angle of the position vector. Correct the angle such that it outputs angles from [0, 2PI)
      const positionAngle = position.angle; // [-PI, PI] => [0, 2PI)
      this.angle = positionAngle > 0 ? positionAngle : Math.PI * 2 + positionAngle;

      // Update the radius, restraining it in the radius range.
      this.radius = Util.clamp( position.magnitude, this.radiusRange.x, this.radiusRange.y );
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
     * Sets the Spinner's radius, in meters.
     * @public
     * @param {number} radius - in meters.
     */
    set radius( radius ) { this.radiusProperty.value = radius; }

    /**
     * Gets the Spinner's angle, in radians.
     * @public
     * @returns {number} - in radians.
     */
    get angle() { return this._angleProperty.value; }

    /**
     * Sets the Spinner's angle, in radians.
     * @public
     * @param {number} angle - in radians.
     */
    set angle( angle ) { this._angleProperty.value = angle; }
  }

  return Spinner;
} );