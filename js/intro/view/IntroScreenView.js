// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Top Level view for the 'Intro' screen.
 *
 * Responsible for:
 *   - Creating a ModelViewTransform
 *   - Displaying a Spinner Node
 *   - Displaying a Time Control Box
 *   - Displaying the Control Panel
 *
 * TODO: the bottom 2 should be refactored to Scene Node when scenes are implemented.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  // const assert = require( 'SIM_CORE/util/assert' );
  // const Bounds = require( 'SIM_CORE/util/Bounds' );
  // const ControlPanel = require( 'ROTATIONAL_MOTION/intro/view/ControlPanel' );
  // const IntroModel = require( 'ROTATIONAL_MOTION/intro/model/IntroModel' );
  // const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  // const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );
  // const SpinnerNode = require( 'ROTATIONAL_MOTION/intro/view/SpinnerNode' );
  // const TimeControlBox = require( 'SIM_CORE/scenery/buttons/TimeControlBox' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const CircleNode = require( 'SIM_CORE/scenery/CircleNode' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  // // constants
  // const MODEL_TO_VIEW_SCALE = 240; // meter to view coordinates (1 m = 200 coordinates)
  // const SCREEN_VIEW_X_MARGIN = RotationalMotionConstants.SCREEN_VIEW_X_MARGIN;
  // const SCREEN_VIEW_Y_MARGIN = RotationalMotionConstants.SCREEN_VIEW_Y_MARGIN;
  // const TIME_CONTROL_BOX_MARGIN = 10; // margin between the time control box and the play area (view)

  class IntroScreenView extends ScreenView {

    /**
     * @param {IntroModel} introModel
     */
    constructor(  ) {

      // assert( introModel instanceof IntroModel, `invalid introModel: ${ introModel }` );

      super();

      let test = new Node( {
        top: 10,
        left: 0,
        maxWidth: 30
      });
      test.style.outline = '2px solid red';

      const c = new CircleNode( {
        radius: 50,
        center: new Vector( 50, 50 ),

      });

      this.addChild( test );

      test.addChild( c );

        console.log( 'test: ' + test.bounds.toString() );
        console.log( 'c: ' + c.bounds.toString() );

      window.addEventListener("mousedown", () => {
        console.log( 'test: ' + test.bounds.toString() );
        console.log( 'c: ' + c.bounds.toString() );

        test.scale( 2);
      });



      //----------------------------------------------------------------------------------------

      // // Create the modelViewTransform by building the play area view bounds
      // const playAreaViewBounds = new Bounds( SCREEN_VIEW_X_MARGIN,
      //   SCREEN_VIEW_Y_MARGIN,
      //   SCREEN_VIEW_X_MARGIN + MODEL_TO_VIEW_SCALE * introModel.spinnerAreaBounds.width,
      //   SCREEN_VIEW_Y_MARGIN + MODEL_TO_VIEW_SCALE * introModel.spinnerAreaBounds.height );

      // const modelViewTransform = new ModelViewTransform( introModel.spinnerAreaBounds, playAreaViewBounds );

      // //----------------------------------------------------------------------------------------

      // // Create a Spinner Node
      // const spinnerNode = new SpinnerNode(
      //   introModel.spinner,
      //   modelViewTransform,
      //   introModel.isPlayingProperty,
      //   introModel.linearVelocityVisibleProperty,
      //   introModel.linearAccelerationVisibleProperty
      // );

      // // Create a Time Control Box
      // const timeControlBox = new TimeControlBox( {
      //   playProperty: introModel.isPlayingProperty,
      //   backwardsListener: () => {
      //     introModel.stepBackwards();
      //   },
      //   forwardsListener: () => {
      //     introModel.stepForwards();
      //   },
      //   top: playAreaViewBounds.maxY + TIME_CONTROL_BOX_MARGIN
      // } );
      // timeControlBox.left = playAreaViewBounds.centerX - timeControlBox.width / 2;

      // //----------------------------------------------------------------------------------------

      // // Create the Control Panel
      // const controlPanel = new ControlPanel(
      //   introModel.spinner,
      //   introModel.isPlayingProperty,
      //   introModel.linearVelocityVisibleProperty
      // );

      // controlPanel.left = this.viewBounds.maxX - controlPanel.width - SCREEN_VIEW_X_MARGIN;
      // controlPanel.top = SCREEN_VIEW_Y_MARGIN;

      // // Render the contents in the correct z-layering.
      // this.setChildren( [
      //   controlPanel,
      //   timeControlBox,
      //   spinnerNode
      // ] );
    }
  }

  return IntroScreenView;
} );