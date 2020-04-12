// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * SpinnerNode is the corresponding view for the Spinner model, in the 'intro' screen.
 *
 * SpinnerNode is responsible for displaying:
 *  - A pin circle, which is the center of the circular motion (and the origin of the Spinner)
 *  - A string line, which is responsible for the tension of the circular motion.
 *  - The IntroBallNode, which is rotated around the circle.
 *  - A TimeControlBox to control the timing of the Spinner.
 *  - Handling drag requests of the Ball and communicating that to the Spinner.
 *
 * SpinnerNodes are created at the start of the Sim and are never disposed, so all links are left as is.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const Circle = require( 'SIM_CORE/scenery/Circle' );
  const DragListener = require( 'SIM_CORE/scenery/events/DragListener' );
  const IntroBallNode = require( 'ROTATIONAL_MOTION/intro/view/IntroBallNode' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const TimeControlBox = require( 'SIM_CORE/scenery/components/TimeControlBox' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  // constants
  const PIN_RADIUS = 2; // eye-balled
  const MODEL_TO_VIEW_SCALE = 230; // meter to view coordinates (1 m = 200 coordinates)
  const SCREEN_VIEW_X_MARGIN = RotationalMotionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = RotationalMotionConstants.SCREEN_VIEW_Y_MARGIN;

  class SpinnerNode extends Node {

    /**
     * @param {Spinner} spinner
     * @param {Property.<boolean>} velocityVisibleProperty
     * @param {Property.<boolean>} linearAccelerationVisibleProperty
     * @param {Property.<boolean>} totalAccelerationVisibleProperty
     */
    constructor(
      spinner,
      velocityVisibleProperty,
      linearAccelerationVisibleProperty,
      totalAccelerationVisibleProperty
    ) {
      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( velocityVisibleProperty instanceof Property, 'invalid velocityVisibleProperty' );
      assert( linearAccelerationVisibleProperty instanceof Property, 'invalid linearAccelerationVisibleProperty' );
      assert( totalAccelerationVisibleProperty instanceof Property, 'invalid totalAccelerationVisibleProperty' );

      //----------------------------------------------------------------------------------------

      // Create the modelViewTransform by building the play area view bounds
      const playAreaViewBounds = Bounds.rect( SCREEN_VIEW_X_MARGIN,
        SCREEN_VIEW_Y_MARGIN,
        MODEL_TO_VIEW_SCALE * spinner.playBounds.width,
        MODEL_TO_VIEW_SCALE * spinner.playBounds.height );

      const modelViewTransform = new ModelViewTransform( spinner.playBounds, playAreaViewBounds );

      // Get the origin in terms of view coordinates
      const viewOrigin = modelViewTransform.modelToViewPoint( Vector.ZERO );

      // Create the string Line, to be set later.
      const string = Line.withPoints( viewOrigin, viewOrigin, {
        stroke: RotationalMotionColors.SPINNER_STRING_COLOR,
        strokeWidth: 2
      } );

      // Create the pin at the center of the Spinner. It's location never changes.
      const pin = new Circle( PIN_RADIUS, { center: viewOrigin, fill: RotationalMotionColors.SPINNER_PIN_FILL } );

      // Create the Ball Node of the Spinner.
      const ballNode = new IntroBallNode( spinner.ball,
        modelViewTransform,
        velocityVisibleProperty,
        linearAccelerationVisibleProperty,
        totalAccelerationVisibleProperty,
        { fill: RotationalMotionColors.INTRO_BALL_FILL } );


      // Create a Time Control Box
      const timeControlBox = new TimeControlBox( spinner.isPlayingProperty, {
        stepBackwardOptions: { listener() { spinner.stepBackwards(); } },
        stepForwardOptions: { listener() { spinner.stepForwards(); } },
        topCenter: playAreaViewBounds.topCenter.addXY( 0, 15 ) // eye-balled margin
      } );

      super( { children: [ timeControlBox, string, pin, ballNode ] } );

      //----------------------------------------------------------------------------------------

      // Observe when the Ball's center changes and update the string to match. Doesn't need to be unlinked as the
      // Spinner is never disposed.
      spinner.ball.centerPositionProperty.link( centerPosition => {
        string.end = modelViewTransform.modelToViewPoint( centerPosition );
      } );

      //----------------------------------------------------------------------------------------

      let playingWhenDragStarted; // Flag that indicates if the dragPauseProperty was playing when a drag starts.
      let ballDragStartPosition;

      // Create a Drag listener to allow the Ball to be dragged. Never disposed as SpinnerNodes are never disposed.
      new DragListener( ballNode, {
        start: () => {
          ballDragStartPosition = spinner.ball.center.copy();
          playingWhenDragStarted = spinner.isPlayingProperty.value; // set the playingWhenDragStarted flag
          spinner.isPlayingProperty.value = false; // pause when dragging
        },
        end: () => {
          playingWhenDragStarted && spinner.isPlayingProperty.set( true ); // play if it was playing before dragging
          playingWhenDragStarted = null; // reset the playingWhenDragStarted flag
        },
        drag: displacement => {
          spinner.dragBallTo( modelViewTransform.viewToModelDelta( displacement ).add( ballDragStartPosition ) );
        }
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
     * important for Spinners, this removes that functionality.
     */
    _recomputeAncestorBounds() { /** do nothing **/ }
  }

  return SpinnerNode;
} );