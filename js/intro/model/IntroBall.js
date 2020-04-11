// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * IntroBall is the Ball model specialization for a Ball in the 'intro' screen. IntroBalls are used inside of a
 * Spinner to simulate circular motion. They work for both types of circular motion. See Spinner.js for more doc.
 *
 * Extends Ball but adds the following functionality:
 *   - Velocity Derived Property to track the tangential velocity vector of the center of mass.
 *   - Linear Acceleration Derived Property to track the tangential acceleration vector of the center of mass.
 *   - Total Acceleration Derived Property to track the total acceleration vector of the center of mass.
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
  const Property = require( 'SIM_CORE/util/Property' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  class IntroBall extends Ball {

    /**
     * @param {Vector} initialCenterPosition - starting center position for the Ball.
     * @param {number} ballRadius - the radius of the Ball (not the circular motion's radius).
     * @param {Property.<number>} angularVelocityProperty - the angular velocity of the circular motion of the Ball.
     * @param {Property.<number>} angularAccelerationProperty - the angular acceleration of the circular motion.
     * @param {Property.<number>} circularMotionRadiusProperty - the radius of the circular motion.
     * @param {Property.<number>} circularMotionAngleProperty - the angle of the circular motion.
     */
    constructor(
      initialCenterPosition,
      ballRadius,
      angularVelocityProperty,
      angularAccelerationProperty,
      circularMotionRadiusProperty,
      circularMotionAngleProperty
    ) {
      assert( angularVelocityProperty instanceof Property, 'invalid angularVelocityProperty' );
      assert( angularAccelerationProperty instanceof Property, 'invalid angularAccelerationProperty' );
      assert( circularMotionRadiusProperty instanceof Property, 'invalid circularMotionRadiusProperty' );
      assert( circularMotionAngleProperty instanceof Property, 'invalid circularMotionAngleProperty' );

      super( initialCenterPosition, ballRadius );

      //----------------------------------------------------------------------------------------

      // @public (read-only) - Property of the linear (tangential) velocity of the center of mass of the Ball. Lasts for
      //                       the entire sim and is never disposed.
      this.tangentialVelocityVectorProperty = new DerivedProperty( [
        angularVelocityProperty,      // in radians per second
        circularMotionRadiusProperty, // in meters
        circularMotionAngleProperty   // in radians
      ], ( angularVelocity, circularMotionRadius, angle ) => {

          // To calculate the velocity (in meters per second), multiply radius * omega.
          // For more details on this calculation, see https://en.wikipedia.org/wiki/Angular_velocity.
          const velocity = angularVelocity * circularMotionRadius;
          return new Vector( velocity, 0 ).rotate( angle + Math.PI / 2 ); // Rotate 90 to make the vector tangential
      } );

      // @public (read-only) - Property of the linear (tangential) acceleration of the center of mass of the Ball. Lasts
      //                       for the entire sim and is never disposed.
      this.tangentialAccelerationVectorProperty = new DerivedProperty( [
        angularAccelerationProperty,  // in radians per second per second
        circularMotionRadiusProperty, // in meters
        circularMotionAngleProperty   // in radians
      ], ( angularAcceleration, circularMotionRadius, angle ) => {

          // To calculate the acceleration (in meters per second per second), multiply radius * alpha.
          // For more details on this calculation, see https://en.wikipedia.org/wiki/Angular_acceleration
          const acceleration = angularAcceleration * circularMotionRadius;
          return new Vector( acceleration, 0 ).rotate( angle + Math.PI / 2 ); // Rotate 90 to make the vector tangential
      } );

      // @public (read-only) - Property of the total acceleration of the center of mass of the Ball. Lasts for the
      //                       entire sim and is never disposed.
      this.totalAccelerationVectorProperty = new DerivedProperty( [
        this.tangentialAccelerationVectorProperty,
        this.tangentialVelocityVectorProperty,
        circularMotionRadiusProperty,
        circularMotionAngleProperty
      ], ( tangentialAccelerationVector, tangentialVelocityVector, radius, angle ) => {

          // Calculate the centripetal acceleration of the Ball due to the Spinner. See
          // https://en.wikipedia.org/wiki/Centripetal_force for the physics background. Calculated as v^2/r
          const centripetalAcceleration = Math.pow( tangentialVelocityVector.magnitude, 2 ) / radius;

          // Create the centripetal acceleration vector, pointing in the negative direction to make it center seeking.
          const centripetalAccelerationVector = new Vector( centripetalAcceleration, 0 ).rotate( angle + Math.PI );

          // Add both Vectors together to get the total acceleration.
          return centripetalAccelerationVector.add( tangentialAccelerationVector );
      } );
    }
  }

  return IntroBall;
} );