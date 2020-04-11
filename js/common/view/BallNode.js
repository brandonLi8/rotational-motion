// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * BallNode is the root view-class for a Ball in all Screens.
 * It is intended to be subclassed as its functionality differs for different screens.
 *
 * Primary responsibilities are:
 *  - Create a Circle that represents the visual Ball object
 *  - Update the Circle's center location when the Ball's position changes
 *  - Update the Circle's radius when the Ball's radius changes
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

        fill: 'white',      // {string|Gradient} - fill color of the ball-circle.
        stroke: 'black',    // {string|Gradient} - border color of the ball-circle.
        strokeWidth: 0.8,   // {string} - stroke width of the ball-circle.
        cursor: 'pointer',  // {string} - cursor of the entire Ball Node.

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( options );

      //----------------------------------------------------------------------------------------

      // Create the Circle Node that represents the visual aspect of a Ball. Radius to be updated later.
      const ballCircle = new Circle( 0, {
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth
      } );

      // Add the ball-circle as a child of this Node.
      this.addChild( ballCircle );

      // Listen to when the when the Ball's position changes and update the position of the ballCircle. Links are left
      // as-is since BallNode subtypes are never disposed.
      ball.centerPositionProperty.link( center => {
        ballCircle.center = modelViewTransform.modelToViewPoint( center );
      } );

      // Listen to when the when the Ball's radius changes and update the radius of the ballCircle. Links are left
      // as-is since BallNode subtypes are never disposed.
      ball.radiusProperty.link( radius => {
        ballCircle.radius = modelViewTransform.modelToViewDeltaX( radius );
      } );
    }

    /**
     * @override
     * This method is called when a child's Bounds changes. In Node, this method is responsible for adjusting its
     * Bounds and recursively calling the method for each parent up the ancestor tree.
     * @protected
     *
     * This is overridden to allow for negative Bounds of its children. The current implementation of Node shifts the
     * Bounds of children so that they are all positive and offsets it. However, since the accuracy of Bounds is not
     * important for BallNodes, this removes that functionality.
     */
    _recomputeAncestorBounds() { /** do nothing **/ }
  }

  return BallNode;
} );