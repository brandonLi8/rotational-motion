// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Base class for a Ball view for all types of Balls.
 * It is intended to be subclassed as its functionality differs for different screens.
 *
 * Primary responsibilities are:
 *  1. Create a Circle that represents the visual aspect of a Ball
 *  2. Update the Circle's center location when the Ball's position changes.
 *  3. Update the Circle's radius when the Ball's radius changes.
 *  4. Create an API that allows for all Ball appearances and behaviors.
 *
 * BallNode subtypes are created at the start of the sim and are never disposed, so no dispose method is necessary
 * and links are left as-is.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Ball = require( 'ROTATIONAL_MOTION/common/model/Ball' );
  const Circle = require( 'SIM_CORE/scenery/Circle' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Node = require( 'SIM_CORE/scenery/Node' );

  class BallNode extends Node {

    /**
     * @param {Ball} ball - the Ball model
     * @param {ModelViewTransform} modelViewTransform - coordinate transform between model and view
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. Subclasses
     *                             may have different options for their API. See the code where the options are set in
     *                             the early portion of the constructor for details.
     */
    constructor( ball, modelViewTransform, options ) {
      assert( ball instanceof Ball, `invalid ball: ${ ball }` );
      assert( modelViewTransform instanceof ModelViewTransform, `invalid modelViewTransform: ${ modelViewTransform }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        fill: 'white',            // {string|Gradient} - fill color of the ball.
        stroke: 'black',          // {string|Gradient} - border color of the ball.
        strokeWidth: 1,           // {string} - stroke width of the ball.
        cursor: 'pointer',        // {string} - cursor of the ball.

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( options );

      //----------------------------------------------------------------------------------------

      // Create the Circle Node that represents the visual aspect of a Ball. Radius to be updated later.
      const ballCircle = new Circle( 0, {
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        cursor: options.cursor
      } );

      // Add the ball-circle as a child of this Node.
      this.addChild( ballCircle );

      // Listen to when the when the Ball's radius changes and update the radius of the ballCircle. Links are left
      // as-is since BallNode subtypes are not meant to be disposed.
      ball.radiusProperty.link( radius => {
        ballCircle.radius = modelViewTransform.modelToViewDeltaX( radius );
      } );

      // Listen to when the when the Ball's position changes and update the position of the ballCircle. Links are left
      // as-is since BallNode subtypes are not meant to be disposed.
      ball.centerPositionProperty.link( center => {
        ballCircle.center = modelViewTransform.modelToViewPoint( center );
      } );
    }
  }

  return BallNode;
} );