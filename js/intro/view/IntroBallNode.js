// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * View for a Ball for the 'intro' screen.
 *
 * Extends BallNode but adds the following functionality:
 *  1. Add a Linear Velocity Vector Node
 *  2. Add a Linear Acceleration Vector Node
 *
 * IntroBalls are created at the start of the sim and are never disposed, so no dispose method is necessary.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const BallNode = require( 'ROTATIONAL_MOTION/common/view/BallNode' );
  const IntroBall = require( 'ROTATIONAL_MOTION/intro/model/IntroBall' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Multilink = require( 'SIM_CORE/util/Multilink' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const VectorNode = require( 'SIM_CORE/scenery/VectorNode' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );

  // constants
  const VELOCITY_SCALAR = RotationalMotionConstants.VELOCITY_SCALAR; // scalar of velocity Vectors
  const ACCELERATION_SCALAR = RotationalMotionConstants.ACCELERATION_SCALAR; // scalar of acceleration Vectors

  class IntroBallNode extends BallNode {

    /**
     * @param {IntroBall} ball - the Ball model
     * @param {ModelViewTransform} modelViewTransform - coordinate transform between model and view
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Property.<boolean>} velocityVisibleProperty
     * @param {Property.<boolean>} accelerationVisibleProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior.
     */
    constructor(
      ball,
      modelViewTransform,
      isPlayingProperty,
      velocityVisibleProperty,
      accelerationVisibleProperty,
      options
    ) {

      assert( ball instanceof IntroBall, `invalid ball: ${ ball }` );
      assert( modelViewTransform instanceof ModelViewTransform, `invalid modelViewTransform: ${ modelViewTransform }` );
      assert( isPlayingProperty instanceof Property, `invalid isPlayingProperty: ${isPlayingProperty}` );
      assert( velocityVisibleProperty instanceof Property, `invalid isPlayingProperty: ${isPlayingProperty}` );
      assert( accelerationVisibleProperty instanceof Property, `invalid isPlayingProperty: ${isPlayingProperty}` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      //----------------------------------------------------------------------------------------

      options = {
        // TODO colors should be moved to a color constants file
        fill: 'green', // {string} - color of the ball. // TODO: In the future, we will need gradients!

        dragPauseProperty: isPlayingProperty, // See the super class for documentation.

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( ball, modelViewTransform, options );

      //----------------------------------------------------------------------------------------
      // Create the Vectors

      // @private {VectorNode} - represents the Ball's linear velocity, initialized at 0 for now.
      this._linearVelocityVector = new VectorNode( Vector.ZERO, Vector.ZERO, {
        fill: 'rgb( 10, 170, 250 )' // TODO colors should be moved to a color constants file
      } );

      // @private {VectorNode} - represents the Ball's linear acceleration, initialized at 0 for now.
      this._linearAccelerationVector = new VectorNode( Vector.ZERO, Vector.ZERO, {
        fill: 'red' // TODO colors should be moved to a color constants file
      } );

      this.addChild( this._linearVelocityVector );
      this.addChild( this._linearAccelerationVector );

      //----------------------------------------------------------------------------------------
      // Observe when the Vector Visibility Properties change and update the opacity of the Vectors.
      // Links don't have to be unlinked since Intro Ball's are never disposed.
      velocityVisibleProperty.linkAttribute( this._linearVelocityVector, 'visible' );
      accelerationVisibleProperty.linkAttribute( this._linearAccelerationVector, 'visible' );

      //----------------------------------------------------------------------------------------
      // Create a multilink to update the Vectors appearance. Observe:
      //  - ball.velocityProperty - update the velocity vector's location to match the Ball's velocity
      //  - ball.accelerationProperty- update the acceleration vector's location to match the Ball's acceleration
      //
      // This is not needed to dispose as the Ball is never disposed and lasts for the entire sim.
      const updateVectorMultilink = new Multilink( [ ball.velocityProperty, ball.accelerationProperty ], () => {
        this.updateBallNode( ball, modelViewTransform );
      } );
    }

    /**
     * Updates the Ball node:
     *  - Moves the Ball nodes center location to the correct location.
     *  - Updates the circle's radius to match the Ball's radius
     * @protected
     *
     * @param {Ball} ball - the Ball model
     * @param {ModelViewTransform} modelViewTransform - coordinate transform between model and view
     */
    updateBallNode( ball, modelViewTransform ) {
      assert( ball instanceof IntroBall, `invalid ball: ${ ball }` );
      assert( modelViewTransform instanceof ModelViewTransform, `invalid modelViewTransform: ${ modelViewTransform }` );

      // First update as defined in the super class.
      super.updateBallNode( ball, modelViewTransform );

      // Don't do anything if its the first call in the super class.
      if ( !this._linearVelocityVector ) return;

      //----------------------------------------------------------------------------------------
      // Update the Vectors, which are linear relative to the ball's motion.
      // In other words, it shifted by 90 degrees.
      const vectorAngle = ball.spinner.angle + Math.PI / 2;

      // Get the components of the Velocity Vector, which is scaled down to fit.
      const velocityVector = new Vector( 1, 0 ).rotate( vectorAngle ).multiply( ball.velocity * VELOCITY_SCALAR );

      // Get the components of the Acceleration Vector, which is scaled down to fit.
      const accelerationVector = new Vector( 1, 0 )
        .rotate( vectorAngle )
        .multiply( ball.acceleration * ACCELERATION_SCALAR );

      // Same Tail Location at the center of the Ball Node
      const tail = this.center;

      this._linearVelocityVector.set( tail, tail.copy().add( modelViewTransform.modelToViewDelta( velocityVector ) ) );
      this._linearAccelerationVector.set(
        tail,
        tail.copy().add( modelViewTransform.modelToViewDelta( accelerationVector ) )
      );
    }
  }

  return IntroBallNode;
} );