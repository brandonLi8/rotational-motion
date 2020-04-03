// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Base class for a Ball view for all types of Balls.
 * It is intended to be subclassed as its functionality differs for different screens.
 *
 * Primary responsibilities are:
 *  1. Create a Circle that represents the visual aspect of a Ball
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
  const Circle = require( 'SIM_CORE/scenery/Circle' );
  const DragListener = require( 'SIM_CORE/scenery/events/DragListener' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Multilink = require( 'SIM_CORE/util/Multilink' );
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
        stroke: 'black',          // {string} - border color of the ball.
        strokeWidth: 1,           // {string} - stroke width of the ball.
        cursor: 'pointer',        // {string} - cursor of the ball.

        dragPauseProperty: null,  // {Property.<boolean>} - if provided AND the ball is draggable, this will set the
                                  //                        Property value to false while the circle is being dragged.
                                  //                        (Set back to true when released if true when first dragged).

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( options );

      //----------------------------------------------------------------------------------------

      // @protected {Circle} Circle Node that represents the visual aspect of a Ball
      this._ballCircle = new Circle( {
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        cursor: options.cursor
      } );

      // @private {function} Listener that updates the radius of the Ball Circle when the Ball's radius changes.
      this._updateRadiusListener = radius => {
        this._ballCircle.radius = modelViewTransform.modelToViewDeltaX( radius );
      };

      // @private {function} Listener that updates the location of the Ball when the Ball's position changes.
      this._updateCenterListener = center => {
        this._ballCircle.center = modelViewTransform.modelToViewPoint( center );
      };

      // Link the listeners of the BallNode to the BallModel. Unlinked in the dispose method.
      this._ballCircle.radiusProperty.link( this._updateRadiusListener );
      this._ballCircle.centerPositionProperty.link( this._updateCenterListener );

      //----------------------------------------------------------------------------------------
      let playingWhenDragStarted; // Flag that indicates if the dragPauseProperty was playing when a drag starts.

      // @private {DragListener|null} - if the ball is draggable, create a Drag listener to allow the Ball
      //                                to be dragged. The Ball's dragTo method will be invoked, passing the
      //                                position to where the Ball would be dragged.
      //                                Disposed in the dispose method.
      this._ballDragListener = !ball.isDraggable ? null : new DragListener( this, {
        start: () => {
          if ( options.dragPauseProperty ) {
            playingWhenDragStarted = options.dragPauseProperty.value; // set the playingWhenDragStarted flag
            options.dragPauseProperty.value = false; // pause when dragging
          }
        },
        end: () => {
          if ( options.dragPauseProperty ) {
            playingWhenDragStarted && options.dragPauseProperty.set( true ); // play if it was playing before dragging
            playingWhenDragStarted = null; // reset the playingWhenDragStarted flag
          }
        },
        drag: displacement => {
          ball.dragTo( ball.center.add( modelViewTransform.viewToModelDelta( displacement ) ) );
        }
      } );
    }

    /**
     * Disposes the BallNode and its internal links.
     * @public
     */
    dispose() {
      this._ballCircle.radiusProperty.unlink( this._updateRadiusListener );
      this._ballCircle.centerPositionProperty.unlink( this._updateCenterListener );
      this._ballDragListener && this._ballDragListener.dispose();
    }
  }

  return BallNode;
} );