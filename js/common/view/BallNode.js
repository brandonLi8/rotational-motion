// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Base class for a Ball view for all types of Balls.
 * It is intended to be subclassed as its functionality differs for different screens.
 *
 * Primary responsibilities are:
 *  1. Create a Circle Node that represents the Ball
 *  2. Update the Circle's center location when the Ball's position changes.
 *  3. Update the Circle's radius when the Ball's radius changes.
 *  4. If the model Ball is draggable, create a Drag listener for the Node.
 *  5. Create an API that allows for all Ball appearances and behaviors.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Ball = require( 'ROTATIONAL_MOTION/common/model/Ball' );
  const CircleNode = require( 'SIM_CORE/scenery/CircleNode' );
  const LineNode = require( 'SIM_CORE/scenery/LineNode' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Multilink = require( 'SIM_CORE/util/Multilink' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const SVGNode = require( 'SIM_CORE/scenery/SVGNode' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const VectorNode = require( 'SIM_CORE/scenery/VectorNode' );

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

      //----------------------------------------------------------------------------------------

      options = {

        fill: 'white',            // {string} - color of the ball. // TODO: In the future, we will need gradients!
        cursor: 'pointer',        // {string} - cursor of the ball.

        dragPauseProperty: null,  // {Property.<boolean>} - if provided AND the ball is draggable, this will set the
                                  //                        Property value to false while the circle is being dragged.
                                  //                        (Set back to true when released if true when first dragged).

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( options );

      //----------------------------------------------------------------------------------------

      // @protected {CircleNode} ballCircle - Circle Node that represents the Ball
      this.ballCircle = new CircleNode( {
        fill: options.fill,
        style: {
          cursor: options.cursor
        }
      } );
      this.addChild( this.ballCircle );

      //----------------------------------------------------------------------------------------
      // Create a multilink to update the Ball's appearance. Observe:
      //  - ball.centerPositionProperty - update the circle's location to match the Ball's position.
      //  - ball.radiusProperty - update the circle's radius to match the Ball's radius
      //
      // This should be disposed when the Ball Node is disposed.
      // @private {Multilink} updateBallNodeMultilink
      this.updateBallNodeMultilink = new Multilink( [ ball.centerPositionProperty, ball.radiusProperty ], () => {
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
      assert( ball instanceof Ball, `invalid ball: ${ ball }` );
      assert( modelViewTransform instanceof ModelViewTransform, `invalid modelViewTransform: ${ modelViewTransform }` );

      // 1. Update the Ball's radius
      this.ballCircle.radius = modelViewTransform.modelToViewDeltaX( ball.radius );

      // 2. Move the Ball Node's center location
      this._center = modelViewTransform.modelToViewPosition( ball.center );
    }
  }

  return BallNode;
} );