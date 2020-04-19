// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Top Level view for the 'Intro' screen.
 *
 * Responsible for:
 *   - Displaying the CircularMotionTypesRadioButtonGroup
 *   - Displaying both Spinner Nodes
 *   - Displaying TimeControlBoxes for both Spinners
 *   - Displaying the Spinner Control Panels for both Spinners
 *   - Displaying the Vector Visibility Panels for both Spinners
 *   - Displaying the Spinner Values Toggle Panels for both Spinners
 *   - Displaying the Reset Omega Button for non-uniform Spinners
 *   - Displaying a common reset-all button
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const CircularMotionTypesRadioButtonGroup = require( 'ROTATIONAL_MOTION/intro/view/CircularMotionTypesRadioButtonGroup' ); // eslint-disable-line max-len
  const IntroModel = require( 'ROTATIONAL_MOTION/intro/model/IntroModel' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const ResetButton = require( 'SIM_CORE/scenery/components/buttons/ResetButton' );
  const ResetOmegaButton = require( 'ROTATIONAL_MOTION/intro/view/ResetOmegaButton' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );
  const SpinnerControlPanel = require( 'ROTATIONAL_MOTION/intro/view/SpinnerControlPanel' );
  const SpinnerNode = require( 'ROTATIONAL_MOTION/intro/view/SpinnerNode' );
  const SpinnerValuesTogglePanel = require( 'ROTATIONAL_MOTION/intro/view/SpinnerValuesTogglePanel' );
  const TimeControlBox = require( 'SIM_CORE/scenery/components/TimeControlBox' );
  const VectorVisibilityPanel = require( 'ROTATIONAL_MOTION/intro/view/VectorVisibilityPanel' );

  // constants
  const SCREEN_VIEW_X_MARGIN = RotationalMotionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = RotationalMotionConstants.SCREEN_VIEW_Y_MARGIN;

  class IntroScreenView extends ScreenView {

    /**
     * @param {IntroModel} introModel
     */
    constructor( introModel ) {
      assert( introModel instanceof IntroModel, `invalid introModel: ${ introModel }` );
      super();

      // @public (read-only) - indicates if the linear velocity Vectors are visible or not for both Spinners.
      this.linearVelocityVisibleProperty = new Property( false, { type: 'boolean' } );

      // @public (read-only) - indicates if the linear acceleration Vectors are visible or not for both Spinners.
      this.linearAccelerationVisibleProperty = new Property( false, { type: 'boolean' } );

      // @public (read-only) - indicates if the total acceleration Vectors are visible or not for both Spinners.
      this.totalAccelerationVisibleProperty = new Property( false, { type: 'boolean' } );

      // @public (read-only) - indicates if the spinner angle is visible.
      this.angleVisibleProperty = new Property( false, { type: 'boolean' } );

      // @public (read-only) - indicates if the spinner values are visible.
      this.spinnerValuesVisibleProperty = new Property( true, { type: 'boolean' } );

      //----------------------------------------------------------------------------------------

      // Add the Reset All Button
      this.addChild( new ResetButton( {
        listener: () => {
          introModel.reset();
          this.reset();
        },
        right: this.layoutBounds.maxX - SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - SCREEN_VIEW_Y_MARGIN
      } ) );

      // Create a scene for each Spinner and render it
      introModel.spinners.forEach( spinner => {

        // Create the Spinner Node
        const spinnerNode = new SpinnerNode( spinner,
          this.linearVelocityVisibleProperty,
          this.linearAccelerationVisibleProperty,
          this.totalAccelerationVisibleProperty,
          this.angleVisibleProperty,
          this.spinnerValuesVisibleProperty );

        // Create the Control Panel
        const controlPanel = new SpinnerControlPanel( spinner,
          this.angleVisibleProperty, {
            right: this.layoutBounds.maxX - SCREEN_VIEW_X_MARGIN,
            top: SCREEN_VIEW_Y_MARGIN
          } );

        // Create the Vector Visible Panel
        const vectorVisiblePanel = new VectorVisibilityPanel(
          spinner.type,
          controlPanel.content.width,
          this.linearVelocityVisibleProperty,
          this.linearAccelerationVisibleProperty,
          this.totalAccelerationVisibleProperty, {
            left: controlPanel.left,
            top: controlPanel.bottom + 10
          } );

        // Create the Time Control Box
        const timeControlBox = new TimeControlBox( spinner.isPlayingProperty, {
          stepBackwardOptions: { listener() { spinner.stepBackwards(); } },
          stepForwardOptions: { listener() { spinner.stepForwards(); } },
          topCenter: spinnerNode.playAreaViewBounds.topCenter.addXY( 0, 10 ) // eye-balled margin
        } );

        // Create the Spinner Values Panel
        const spinnerValuesPanel = new SpinnerValuesTogglePanel( spinner, this.spinnerValuesVisibleProperty, {
          centerX: spinnerNode.playAreaViewBounds.centerX,
          top: SCREEN_VIEW_Y_MARGIN
        } );

        // Create the CircularMotionTypes RadioButtonGroup
        const circularMotionTypesRadioButtonGroup = new CircularMotionTypesRadioButtonGroup(
          introModel.circularMotionTypeProperty, {
            centerY: spinnerValuesPanel.centerY,
            centerX: ( spinnerValuesPanel.right + controlPanel.left ) / 2
          } );

        // Create a wrapper scene Node.
        const scene = new Node( { children: [
          timeControlBox,
          spinnerValuesPanel,
          circularMotionTypesRadioButtonGroup,
          controlPanel,
          vectorVisiblePanel,
          spinnerNode
        ] } );

        // Display the ResetOmegaButton for non-uniform Spinners
        if ( spinner.type === CircularMotionTypes.NON_UNIFORM ) {
          const resetOmegaButton = new ResetOmegaButton( spinner, {
            centerLeft: timeControlBox.centerRight.addXY( 45, 0 ) // eye-balled
          } );
          scene.addChild( resetOmegaButton );
          resetOmegaButton.moveToBack();
        }

        this.addChild( scene ); // Add the scene as a child.

        // Adjust visibility based on the active Spinner. Link lasts for the entire simulation and is never disposed.
        introModel.activeSpinnerProperty.link( activeSpinner => { scene.visible = activeSpinner === spinner; } );
      } );
    }

    /**
     * Resets the View Properties of the 'Intro' screen
     * @public
     */
    reset() {
      this.linearVelocityVisibleProperty.reset();
      this.linearAccelerationVisibleProperty.reset();
      this.totalAccelerationVisibleProperty.reset();
      this.angleVisibleProperty.reset();
      this.spinnerValuesVisibleProperty.reset();
    }
  }

  return IntroScreenView;
} );