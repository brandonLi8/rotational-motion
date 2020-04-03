// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * IntroBall is the Ball model specialization for a Ball in the 'intro' screen.
 *
 * Extends Ball but adds the following functionality:
 *    - Velocity Derived Property to track the LINEAR velocity of the center of mass.
 *    - Acceleration Derived Property to track the LINEAR acceleration of the center of mass.
 *    - Implements a Stepper such that the Ball spins around the model origin. Communicates
 *      back to the Spinner the change in radians at each step.
 *    - Drag method to move the Ball in any position in the Spinner's range and communicates with the Spinner.
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
  const Vector = require( 'SIM_CORE/util/Vector' );

  class IntroBall extends Ball {

    /**
     * @param {Spinner} spinner - the spinner model
     * @param {Vector} initialCenterPosition - starting center position for the Ball
     * @param {Object} [options] - key-value pairs that control simple ball properties. Some options are specific
     *                             to this class while others are specific to the super class. See the early portion of
     *                             the constructor for details.
     */
    constructor( spinner, initialCenterPosition, options ) {

      options = {

        isDraggable: true,  // {boolean} - indicates if the user can drag this Ball. If true, sub classes must
                            //             override the dragTo() abstract method.


        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( initialCenterPosition, RotationalMotionConstants.INTRO_BALL_RADIUS, options );

      //----------------------------------------------------------------------------------------

      // @private {Spinner} - reference the spinner that was passed-in.
      this._spinner = spinner;

      // @public (read-only) velocityProperty - Property of the linear (tangential) velocity of the center of mass of
      //                                        the Ball. Link lasts for the entire sim and is never disposed.
      this.velocityVectorProperty = new DerivedProperty( [
        spinner.angularVelocityProperty,  // in radians per second
        spinner.radiusProperty            // in meters
      ], ( angularVelocity, radius ) => {
          // To calculate the velocity (in meters per second), multiply radius * omega.
          // For more details on this calculation, see https://en.wikipedia.org/wiki/Angular_velocity.
          const velocity = angularVelocity * radius;
          return new Vector( velocity, 0 ).rotate( spinner.angle + Math.PI / 2 ); // Rotate 90 for tangential.
      } );

      // @public (read-only) accelerationProperty - Property of the linear (tangential) acceleration of the center of
      //                                            mass of the Ball. Link lasts for the entire sim and never disposed.
      this.accelerationVectorProperty = new DerivedProperty( [
        spinner.angularAccelerationProperty,  // in radians per second per second
        spinner.radiusProperty                // in meters
      ], ( angularAcceleration, radius ) => {
          // To calculate the acceleration (in meters per second per second), multiply radius * alpha.
          // For more details on this calculation, see https://en.wikipedia.org/wiki/Angular_acceleration
          const acceleration = angularAcceleration * radius;
          return new Vector( acceleration, 0 ).rotate( spinner.angle + Math.PI / 2 ); // Rotate 90 for tangential.
      } );
    }

    /**
     * @override
     * Called when the Ball is dragged. Passes a new attempted position to the Spinner, which will determine
     * new radii and constrain the dragging bounds.
     *
     * This is done for performance reasons, as setting the location and the having the Spinner set the location again
     * to account for bounds restraints becomes slow.
     * @public
     *
     * @param {Vector} position - the position of the Center of the Ball
     */
    dragTo( position ) { this._spinner.dragBallTo( position ); }
  }

  return IntroBall;
} );