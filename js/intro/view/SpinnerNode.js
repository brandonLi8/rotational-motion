// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * SpinnerNode is the corresponding view for the Spinner model, in the 'intro' screen.
 *
 * SpinnerNode is responsible for displaying:
 *  - A pin circle, which is the center of the circular motion (and the origin of the Spinner)
 *  - A string line, which is responsible for the tension of the circular motion.
 *  - The IntroBallNode, which is rotated around the circle.
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
  const Vector = require( 'SIM_CORE/util/Vector' );

  // constants
  const PIN_RADIUS = 2; // eye-balled
  const MODEL_TO_VIEW_SCALE = 240; // meter to view coordinates (1 m = 200 coordinates)
  const SCREEN_VIEW_X_MARGIN = RotationalMotionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = RotationalMotionConstants.SCREEN_VIEW_Y_MARGIN;

  class SpinnerNode extends Node {

    /**
     * @param {Spinner} spinner
     * @param {Property.<boolean>} velocityVisibleProperty
     * @param {Property.<boolean>} accelerationVisibleProperty
     */
    constructor(
      spinner,
      velocityVisibleProperty,
      accelerationVisibleProperty
    ) {
      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( velocityVisibleProperty instanceof Property, 'invalid velocityVisibleProperty' );
      assert( accelerationVisibleProperty instanceof Property, 'invalid accelerationVisibleProperty' );

      //----------------------------------------------------------------------------------------

      // Create the modelViewTransform by building the play area view bounds
      const playAreaViewBounds = new Bounds( SCREEN_VIEW_X_MARGIN,
        SCREEN_VIEW_Y_MARGIN,
        SCREEN_VIEW_X_MARGIN + MODEL_TO_VIEW_SCALE * spinner.playBounds.width,
        SCREEN_VIEW_Y_MARGIN + MODEL_TO_VIEW_SCALE * spinner.playBounds.height );

      const modelViewTransform = new ModelViewTransform( spinner.playBounds, playAreaViewBounds );

      // Get the origin in terms of view coordinates
      const viewOrigin = modelViewTransform.modelToViewPoint( Vector.ZERO );

      // Create the string Line, to be set later.
      const string = Line.withPoints( viewOrigin, viewOrigin, { ...RotationalMotionColors.SPINNER_STRING_COLORS } );

      // Create the pin at the center of the Spinner. It's location never changes.
      const pin = new Circle( PIN_RADIUS, { center: viewOrigin, ...RotationalMotionColors.SPINNER_PIN_COLORS } );

      // Create the Ball Node of the Spinner.
      const ballNode = new IntroBallNode( spinner.ball,
        modelViewTransform,
        velocityVisibleProperty,
        accelerationVisibleProperty,
        { ...RotationalMotionColors.SPINNER_BALL_COLORS } );

      super( { children: [ string, pin, ballNode ] } );

      //----------------------------------------------------------------------------------------

      // Observe when the Ball's center changes and update the string to match. Doesn't need to be unlinked as the
      // Spinner is never disposed.
      spinner.ball.centerPositionProperty.link( centerPosition => {
        string.start = pin.center;
        string.end = modelViewTransform.modelToViewPoint( centerPosition );
      } );

      //----------------------------------------------------------------------------------------

      let playingWhenDragStarted; // Flag that indicates if the dragPauseProperty was playing when a drag starts.

      // Create a Drag listener to allow the Ball to be dragged. Never disposed as SpinnerNodes are never disposed.
      new DragListener( this, {
        start: () => {
          playingWhenDragStarted = spinner.isPlayingProperty.value; // set the playingWhenDragStarted flag
          spinner.isPlayingProperty.value = false; // pause when dragging
        },
        end: () => {
          playingWhenDragStarted && spinner.isPlayingProperty.set( true ); // play if it was playing before dragging
          playingWhenDragStarted = null; // reset the playingWhenDragStarted flag
        },
        drag: displacement => {
          spinner.dragBallTo( spinner.ball.center.add( modelViewTransform.viewToModelDelta( displacement ) ) );
        }
      } );
    }
  }

  return SpinnerNode;
} );