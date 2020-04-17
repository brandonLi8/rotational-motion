// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Spinner is the super-type model that spins a IntroBall model object in circular motion. This is specific to only the
 * 'intro' screen.
 *
 * Primary responsibilities are:
 *    - Keep track of a play-pause Property
 *    - Keep track of the Angular Velocity (in rad/sec) in a Property
 *    - Keep track of the Angular Acceleration (in rad/sec/sec) in a Property
 *    - Keep track of the Circular Motion radius in a Property
 *    - Move the circle in a circular motion based on the Properties above and handle a drag request of Balls.
 *
 * Generally, there are two sub-types of Spinners:
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
  const DerivedProperty = require( 'SIM_CORE/util/DerivedProperty' );
  const IntroBall = require( 'ROTATIONAL_MOTION/intro/model/IntroBall' );
  const Multilink = require( 'SIM_CORE/util/Multilink' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Range = require( 'SIM_CORE/util/Range' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  class Spinner {

    /**
     * @param {Enum.Member.<CircularMotionTypes>} circularMotionType - See CircularMotionTypes for more documentation.
     * @param {number} initialAngularVelocity - the starting omega value, in rad / sec
     * @param {number} initialAngularAcceleration - the starting alpha value, in rad / sec / sec
     * @param {Object} [options] - key-value pairs that control the spinner's behavior.
     */
    constructor( circularMotionType, initialAngularVelocity, initialAngularAcceleration, options ) {
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );
      assert( CircularMotionTypes.includes( circularMotionType ),
        `invalid circularMotionType: ${ circularMotionType }` );

      options = {

        isPlayingInitially: false,          // {boolean} - if the Spinner is initially spinning the Ball
        stepTime: 0.03,                     // {number} - the time elapsed on each forward or backward step
        initialAngle: 0,                    // {number} - the initial angle of the circular motion, in radians
        initialRadius: 0.5,                 // {number} - the initial radius of the circular motion, in meters
        ballRadius: 0.051,                  // {number} - the radius of the ball, in meters
        radiusRange: new Range( 0.1, 1 ),   // {Range} - the range of the radius of the circular motion, in meters

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------

      // @public {Enum.Member.<CircularMotionTypes>} (read-only) - reference the type of circular motion passed-in
      this.type = circularMotionType;

      // @public (read-only) angularVelocityProperty - angular velocity of the circular motion in rad / sec
      this.angularVelocityProperty = new Property( initialAngularVelocity, { type: 'number' } );

      // @public (read-only) angularAccelerationProperty - angular acceleration of the circular motion in rad / sec^2
      this.angularAccelerationProperty = new Property( initialAngularAcceleration, { type: 'number' } );

      //----------------------------------------------------------------------------------------

      // @public (read-only) - indicates if the spinner is playing or paused
      this.isPlayingProperty = new Property( options.isPlayingInitially, { type: 'boolean' } );

      // @public (read-only) radiusProperty - Property of the radius of the circular motion, in meters.
      this.radiusProperty = new Property( options.initialRadius, {
        type: 'number',
        isValidValue: value => options.radiusRange.contains( value )
      } );

      // @public {Property} - Property of the current angle the circular motion is in, in radians.
      this.angleProperty = new Property( options.initialAngle, {
        type: 'number',
        isValidValue: value => value >= 0 && value < Math.PI * 2 // between 0 and 2PI
      } );

      // @public (read-only) {*} - reference options that were passed-in. See options declaration for type documentation
      this.radiusRange = options.radiusRange;
      this.stepTime = options.stepTime;

      // @public (read-only) {Bounds} - the bounds of the entire spinner-play area.
      this.playBounds = new Bounds( -this.radiusRange.max - options.ballRadius,
        -this.radiusRange.max - options.ballRadius,
        this.radiusRange.max + options.ballRadius,
        this.radiusRange.max + options.ballRadius );

      //----------------------------------------------------------------------------------------

      // @public {IntroBall} ball - the ball to spin in circular motion.
      this.ball = new IntroBall( new Vector( options.initialRadius, 0 ).setAngle( options.initialAngle ),
                                 options.ballRadius, this.angularVelocityProperty, this.angularAccelerationProperty,
                                 this.radiusProperty, this.angleProperty );

      // Observe when the internal Properties of the Spinner changes and update the Ball's position.
      // Doesn't need to be disposed because the Spinner is never disposed and lasts for the entirety of the sim.
      Multilink.lazy( [ this.angleProperty, this.radiusProperty ], ( angle, radius ) => {
        this.ball.center = new Vector( radius, 0 ).setAngle( angle );
      } );
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
      this.angleProperty.reset();
      this.isPlayingProperty.reset();
      this.ball.reset();
    }

    /**
     * Pauses the Spinner if not already paused.
     * @public
     */
    pause() { this.isPlayingProperty.value = false; }

    /**
     * Un-pauses the Spinner if not already playing.
     * @public
     */
    play() { this.isPlayingProperty.value = true; }

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
      // Calculate the change in angle (in radians) based on the average angular velocity (rad/sec)
      // This is calculated with the equation of kinematic: deltaTheta = omega * t + 1/2 * alpha * t^2
      // Rearranging this equation and we get deltaTheta = omega * dt + 0.5 * alpha * t^2.
      // For more info, see https://courses.lumenlearning.com/physics/chapter/10-2-kinematics-of-rotational-motion/
      this.angle += this.angularVelocityProperty.value * dt + 0.5 * this.angularAccelerationProperty.value * dt * dt;

      // Calculate the change in angular velocity (in radians per second) based on the angular acceleration.
      // This is calculated with dimensional analysis.
      if ( this.angularAcceleration ) this.angularVelocity += this.angularAcceleration * dt;
    }

    /**
     * Moves this Spinner back one time step.
     * @public
     */
    stepBackwards() {
      this.pause();
      this.step( -this.stepTime );
    }

    /**
     * Moves this Spinner forward one time step.
     * @public
     */
    stepForwards() {
      this.pause();
      this.step( this.stepTime );
    }

    /**
     * Called when the Ball is dragged. Attempts to position the Ball at the position but constrains its bounds to
     * remain in the radius range. Angles and radii are updated.
     * @public
     *
     * @param {Vector} position - the position of the Center of the Ball to drag to
     */
    dragBallTo( position ) {
      // First shift the angle of the position vector. Correct the angle such that it outputs angles from [0, 2PI)
      const positionAngle = position.angle; // [-PI, PI] => [0, 2PI)
      this.angle = positionAngle > 0 ? positionAngle : Math.PI * 2 + positionAngle;

      // Update the radius, restraining it in the radius range.
      this.radius = Util.clamp( position.magnitude, this.radiusRange.min, this.radiusRange.max );
    }

    /**
     * Gets the Spinner's radius, in meters.
     * @public
     *
     * @returns {number} - in meters.
     */
    get radius() { return this.radiusProperty.value; }

    /**
     * Sets the Spinner's radius, in meters.
     * @public
     *
     * @param {number} radius - in meters.
     */
    set radius( radius ) { this.radiusProperty.value = radius; }

    /**
     * Gets the Spinner's angle, in radians.
     * @public
     *
     * @returns {number} - in radians.
     */
    get angle() { return this.angleProperty.value; }

    /**
     * Sets the Spinner's angle, in radians. Ensures the angle is in the range [0, Math.PI * 2)
     * @public
     *
     * @param {number} angle - in radians.
     */
    set angle( angle ) {
      while ( angle < 0 ) angle += 2 * Math.PI;
      while ( angle >= 2 * Math.PI ) angle -= 2 * Math.PI;
      this.angleProperty.value = angle;
    }

    /**
     * Gets the Spinner's angularVelocity, in radians per second.
     * @public
     *
     * @returns {number} - in radians per second.
     */
    get angularVelocity() { return this.angularVelocityProperty.value; }

    /**
     * Sets the Spinner's angularVelocity, in radians per second.
     * @public
     *
     * @param {number} angularVelocity - in radians per second.
     */
    set angularVelocity( angularVelocity ) { this.angularVelocityProperty.value = angularVelocity; }

    /**
     * Gets the Spinner's angularAcceleration, in radians per second squared.
     * @public
     *
     * @returns {number} - in radians per second squared.
     */
    get angularAcceleration() { return this.angularAccelerationProperty.value; }

    /**
     * Sets the Spinner's angularAcceleration, in radians per second squared.
     * @public
     *
     * @param {number} angularAcceleration - in radians per second squared.
     */
    set angularAcceleration( angularAcceleration ) { this.angularAccelerationProperty.value = angularAcceleration; }
  }

  return Spinner;
} );