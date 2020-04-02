// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * IntroBall is the Ball model specialization for a Ball in the 'intro' screen.
 *
 * Extends Ball but adds the following functionality:
 *    - Velocity Derived Property to track the LINEAR velocity of the center of mass.
 *    - Acceleration Derived Property to track the LINEAR acceleration of the center of mass, only if
 *      the given spinner is NOT uniform circular motion.
 *    - Implements a Stepper such that the Ball spins around the model origin. Communicates
 *      back to the Spinner the change in radians at each step.
 *    - Drag method and implements a Drag method to move the Ball and communicates with the Spinner.
 *
 * IntroBalls are created at the start of the sim and are never disposed, so no dispose method is necessary.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Ball = require( 'ROTATIONAL_MOTION/common/model/Ball' );
  const DerivedProperty = require( 'SIM_CORE/util/DerivedProperty' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );

  class IntroBall extends Ball {

    /**
     * @param {Vector} initialCenterPosition - starting center position for the Ball
     * @param {Spinner} spinner - the spinner model
     * @param {Object} [options] - key-value pairs that control simple ball properties. Some options are specific
     *                             to this class while others are specific to the super class. See the early portion of
     *                             the constructor for details.
     */
    constructor( initialCenterPosition, spinner, options ) {

      options = {

        isDraggable: true,           // {boolean} - indicates if the user can drag this Ball. If true, sub classes must
                                     //             override the dragTo() abstract method.

        startingRadius: RotationalMotionConstants.INTRO_BALL_RADIUS,


        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( initialCenterPosition, options );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {Spinner} - reference the spinner passed in
      this.spinner = spinner;

      //----------------------------------------------------------------------------------------

      // @public (read-only) velocityProperty - Property of the linear (tangential) velocity of the center of mass of
      //                                        the Ball. Link lasts for the entire sim and is never disposed.
      this.velocityProperty = new DerivedProperty( [
        spinner.angularVelocityProperty,  // in radians per second
        spinner.radiusProperty            // in meters
      ], ( angularVelocity, radius ) => {
          // To calculate the velocity (in meters per second), multiply radius * omega
          // For more details on this calculation, see https://en.wikipedia.org/wiki/Angular_velocity.
          return angularVelocity * radius;
        } );

      // @public (read-only) accelerationProperty - Property of the linear (tangential) acceleration of the center of
      //                                            mass of the Ball. Link lasts for the entire sim and never disposed.
      this.accelerationProperty = new DerivedProperty( [
        spinner.angularAccelerationProperty,  // in radians per second
        spinner.radiusProperty            // in meters
      ], ( angularAcceleration, radius ) => {
          // To calculate the acceleration (in meters per second per second), multiply radius * alpha
          // For more details on this calculation, see https://en.wikipedia.org/wiki/Angular_acceleration
          return angularAcceleration * radius;
      } );
    }

    /**
     * @abstract
     * Steps the Ball by one time step. For this screen, the Ball spins around the origin (circular motion).
     * This method changes the Ball's position such that it matches the correct angular acceleration,
     * angular velocity, and radius.
     *
     * NOTE: this assumes that this is only called when the sim is playing.
     * @public
     *
     * @param {number} dt - time in seconds
     */
    step( dt ) {
      // Calculate the change in angle (in radians) based on the average angular velocity (rad/sec)
      // This is calculated with the equation of kinematic: theta = initial-theta + omega * t + 1/2 * alpha * t^2
      // Rearranging this equation and we get deltaTheta = omega * dt + 0.5 * alpha * t^2.
      // For more info, see https://courses.lumenlearning.com/physics/chapter/10-2-kinematics-of-rotational-motion/
      const deltaTheta = this.spinner.angularVelocity * dt + 0.5 * this.spinner.angularAcceleration * dt * dt;
      this.spinner.angle += deltaTheta;
    }

    /**
     * @abstract
     * @override
     * Called when the Ball is dragged. Passes a new attempted position to the Spinner, which will determine
     * new radii and constrain the dragging bounds.
     * @public
     *
     * @param {Vector} position - the position of the Center of the Ball
     */
    dragTo( position ) {
      this.spinner.dragBallTo( position );
    }

    //----------------------------------------------------------------------------------------
    // Convenience Methods
    //----------------------------------------------------------------------------------------

    /**
     * Gets the Ball's center of mass velocity, in meters per second.
     * @public
     * @returns {number} - in meters per second.
     */
    get velocity() { return this.velocityProperty.value; }

    /**
     * Sets the Ball's velocity, in meters per second.
     * @public
     * @param {number} velocity, in meters per second.
     */
    set velocity( velocity ) {
      assert( typeof velocity === 'number', `invalid velocity: ${ velocity }` );
      this.velocityProperty.value = velocity;
    }

    /**
     * Gets the Ball's center of mass acceleration, in meters per second per second.
     * @public
     * @returns {number} - in meters per second per second.
     */
    get acceleration() { return this.accelerationProperty.value; }

    /**
     * Sets the Ball's acceleration, in meters per second per second.
     * @public
     * @param {number} acceleration, in meters per second per second.
     */
    set acceleration( acceleration ) {
      assert( typeof acceleration === 'number', `invalid acceleration: ${ acceleration }` );
      this.accelerationProperty.value = acceleration;
    }
  }

  return IntroBall;
} );