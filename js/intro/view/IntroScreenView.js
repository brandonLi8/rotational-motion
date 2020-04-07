// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Top Level view for the 'Intro' screen.
 *
 * Responsible for:
 *   - Creating a common ModelViewTransform
 *   - Displaying both Spinner Nodes
 *   - Displaying TimeControlBoxes for both Spinners
 *   - Displaying the Control Panels for both Spinners
 *   - Displaying a common reset-all button
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const IntroControlPanel = require( 'ROTATIONAL_MOTION/intro/view/IntroControlPanel' );
  const IntroModel = require( 'ROTATIONAL_MOTION/intro/model/IntroModel' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );
  const SpinnerNode = require( 'ROTATIONAL_MOTION/intro/view/SpinnerNode' );

  // constants
  const SCREEN_VIEW_X_MARGIN = RotationalMotionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = RotationalMotionConstants.SCREEN_VIEW_Y_MARGIN;
  const DEFAULT_VECTOR_IS_VISIBLE = false;
  const DEFAULT_CIRCULAR_MOTION_TYPE = CircularMotionTypes.UNIFORM;

  class IntroScreenView extends ScreenView {

    /**
     * @param {IntroModel} introModel
     */
    constructor( introModel ) {
      assert( introModel instanceof IntroModel, `invalid introModel: ${ introModel }` );

      super();

      // @public (read-only) - indicates if the linear velocity Vectors are visible or not for both Spinners.
      this.linearVelocityVisibleProperty = new Property( DEFAULT_VECTOR_IS_VISIBLE, { type: 'boolean' } );

      // @public (read-only) - indicates if the linear acceleration Vectors are visible or not for both Spinners.
      this.linearAccelerationVisibleProperty = new Property( DEFAULT_VECTOR_IS_VISIBLE, { type: 'boolean' } );

      // @public (read-only) - indicates the current circular motion type.
      this.circularMotionTypeProperty = new Property( DEFAULT_CIRCULAR_MOTION_TYPE, {
        validValues: CircularMotionTypes.MEMBERS
      } );

      //----------------------------------------------------------------------------------------

      // Create a 'scene' for each circular motion type and render it in a single Node.
      CircularMotionTypes.MEMBERS.forEach( circularMotionType => {
        const spinnerNode = new SpinnerNode(
          circularMotionType === CircularMotionTypes.UNIFORM ? introModel.uniformSpinner : introModel.nonUniformSpinner,
          this.linearVelocityVisibleProperty,
          this.linearAccelerationVisibleProperty
        );

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

        //----------------------------------------------------------------------------------------

        // Create the Control Panel
        const controlPanel = new IntroControlPanel( CircularMotionTypes.UNIFORM ? introModel.uniformSpinner : introModel.nonUniformSpinner,
          this.linearVelocityVisibleProperty,
          this.linearAccelerationVisibleProperty, {
            right: this.layoutBounds.maxX - SCREEN_VIEW_X_MARGIN,
            top: SCREEN_VIEW_Y_MARGIN
          } );

        // Create a wrapper scene Node.
        const scene = new Node().setChildren( [ spinnerNode, controlPanel ] );

        // Adjust visibility based on the circularMotionTypeProperty
        this.circularMotionTypeProperty.link( () => {
          scene.visible = this.circularMotionTypeProperty.value === circularMotionType;
        } );

        // Add the scene to the screen view.
        this.addChild( scene );
      } );
    }
  }

  return IntroScreenView;
} );