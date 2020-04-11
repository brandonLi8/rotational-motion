// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * IntroBallNode is the Ball view specialization for a Ball in the 'intro' screen.
 *
 * Extends BallNode but adds the following functionality:
 *  1. Add a Linear tangential Velocity Arrow Node to represent the Vector.
 *  2. Add a Linear tangential Acceleration Arrow Node to represent the Vector.
 *  2. Add a total Acceleration Arrow Node to represent the total acceleration Vector.
 *
 * IntroBallNodes are created at the start of the sim and are never disposed, so no dispose method is necessary.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const Arrow = require( 'SIM_CORE/scenery/Arrow' );
  const assert = require( 'SIM_CORE/util/assert' );
  const BallNode = require( 'ROTATIONAL_MOTION/common/view/BallNode' );
  const IntroBall = require( 'ROTATIONAL_MOTION/intro/model/IntroBall' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Multilink = require( 'SIM_CORE/util/Multilink' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  // constants
  const VELOCITY_SCALAR = 0.5; // scalar of velocity Vectors to fit reasonable on the screen.
  const ACCELERATION_SCALAR = 0.36; // scalar of acceleration Vectors to fit reasonable on the screen.

  class IntroBallNode extends BallNode {

    /**
     * @param {IntroBall} ball - the Ball model
     * @param {ModelViewTransform} modelViewTransform - coordinate transform between model and view
     * @param {Property.<boolean>} velocityVisibleProperty
     * @param {Property.<boolean>} linearAccelerationVisibleProperty
     * @param {Property.<boolean>} totalAccelerationVisibleProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior.
     */
    constructor(
      ball,
      modelViewTransform,
      velocityVisibleProperty,
      linearAccelerationVisibleProperty,
      totalAccelerationVisibleProperty,
      options
    ) {
      assert( ball instanceof IntroBall, `invalid ball: ${ ball }` );
      assert( modelViewTransform instanceof ModelViewTransform, `invalid modelViewTransform: ${ modelViewTransform }` );
      assert( velocityVisibleProperty instanceof Property, 'invalid velocityVisibleProperty' );
      assert( linearAccelerationVisibleProperty instanceof Property, 'invalid linearAccelerationVisibleProperty' );
      assert( totalAccelerationVisibleProperty instanceof Property, 'invalid totalAccelerationVisibleProperty' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      super( ball, modelViewTransform, options );

      //----------------------------------------------------------------------------------------

      // @private {Arrow} - represents the Ball's tangential velocity, initialized at 0 for now.
      this._velocityArrow = new Arrow( 0, 0, 0, 0, {
        ...RotationalMotionConstants.VECTOR_ARROW_OPTIONS,
        fill: RotationalMotionColors.LINEAR_VELOCITY_VECTOR_FILL
      } );

      // @private {Arrow} - represents the Ball's tangential acceleration, initialized at 0 for now.
      this._linearAccelerationArrow = new Arrow( 0, 0, 0, 0, {
        ...RotationalMotionConstants.VECTOR_ARROW_OPTIONS,
        fill: RotationalMotionColors.LINEAR_ACCELERATION_VECTOR_FILL
      } );

      // @private {Arrow} - represents the Ball's total acceleration, initialized at 0 for now.
      this._totalAccelerationArrow = new Arrow( 0, 0, 0, 0, {
        ...RotationalMotionConstants.VECTOR_ARROW_OPTIONS,
        fill: RotationalMotionColors.TOTAL_ACCELERATION_VECTOR_FILL
      } );

      // Add the Arrows as children, which will allow it to be displayed above the Ball circle.
      this.addChild( this._velocityArrow );
      this.addChild( this._linearAccelerationArrow );
      this.addChild( this._totalAccelerationArrow );

      //----------------------------------------------------------------------------------------

      // Updates the velocity arrow when the Ball's velocity changes or when the Ball's center position changes.
      // Doesn't need to be disposed since IntroBalls are never disposed.
      new Multilink( [ ball.tangentialVelocityVectorProperty, velocityVisibleProperty, ball.centerPositionProperty ],
        ( velocityVector, velocityVisible ) => {
          if ( !velocityVisible ) return; // for performance, don't update the velocity arrow when it isn't visible.
          Vector.scratch.set( velocityVector ).multiply( VELOCITY_SCALAR ); // scale the velocity vector
          this._velocityArrow.tail = modelViewTransform.modelToViewPoint( ball.center );
          this._velocityArrow.tip = modelViewTransform.modelToViewPoint( Vector.scratch.add( ball.center ) );
        } );

      // Updates the linear acceleration arrow when the Ball's acceleration changes or when the Ball's center position
      // changes. Doesn't need to be disposed since IntroBalls are never disposed.
      new Multilink( [ ball.tangentialAccelerationVectorProperty,
        linearAccelerationVisibleProperty,
        ball.centerPositionProperty ], ( accelerationVector, linearAccelerationVisible ) => {
          if ( !linearAccelerationVisible ) return; // for performance, don't update the arrow when it isn't visible.
          Vector.scratch.set( accelerationVector ).multiply( ACCELERATION_SCALAR ); // scale the acceleration vector
          this._linearAccelerationArrow.tail = modelViewTransform.modelToViewPoint( ball.center );
          this._linearAccelerationArrow.tip = modelViewTransform.modelToViewPoint( Vector.scratch.add( ball.center ) );
        } );

      // Updates the total acceleration arrow when the Ball's acceleration changes or when the Ball's center position
      // changes. Doesn't need to be disposed since IntroBalls are never disposed.
      new Multilink( [ ball.totalAccelerationVectorProperty,
        totalAccelerationVisibleProperty,
        ball.centerPositionProperty ], ( accelerationVector, totalAccelerationVisible ) => {
          if ( !totalAccelerationVisible ) return; // for performance, don't update the arrow when it isn't visible.
          Vector.scratch.set( accelerationVector ).multiply( ACCELERATION_SCALAR ); // scale the acceleration vector
          this._totalAccelerationArrow.tail = modelViewTransform.modelToViewPoint( ball.center );
          this._totalAccelerationArrow.tip = modelViewTransform.modelToViewPoint( Vector.scratch.add( ball.center ) );
        } );

      // Observe when the Vector Visibility Properties change and update the visibility of the Arrows.
      // Links don't have to be unlinked since Intro Ball's are never disposed.
      velocityVisibleProperty.linkAttribute( this._velocityArrow, 'visible' );
      linearAccelerationVisibleProperty.linkAttribute( this._linearAccelerationArrow, 'visible' );
      totalAccelerationVisibleProperty.linkAttribute( this._totalAccelerationArrow, 'visible' );
    }
  }

  return IntroBallNode;
} );