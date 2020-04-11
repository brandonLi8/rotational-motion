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
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const CircularMotionTypesRadioButtonGroup = require( 'ROTATIONAL_MOTION/intro/view/CircularMotionTypesRadioButtonGroup' ); // eslint-disable-line max-len
  const IntroControlPanel = require( 'ROTATIONAL_MOTION/intro/view/IntroControlPanel' );
  const IntroModel = require( 'ROTATIONAL_MOTION/intro/model/IntroModel' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const ResetButton = require( 'SIM_CORE/scenery/buttons/ResetButton' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );
  const SpinnerNode = require( 'ROTATIONAL_MOTION/intro/view/SpinnerNode' );

  // constants
  const SCREEN_VIEW_X_MARGIN = RotationalMotionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = RotationalMotionConstants.SCREEN_VIEW_Y_MARGIN;
  const DEFAULT_VECTOR_IS_VISIBLE = false;

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

      // @public (read-only) - indicates if the total acceleration Vectors are visible or not for both Spinners.
      this.totalAccelerationVisibleProperty = new Property( DEFAULT_VECTOR_IS_VISIBLE, { type: 'boolean' } );

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

      // Add the CircularMotionTypes RadioButtonGroup
      this.addChild( new CircularMotionTypesRadioButtonGroup( introModel.circularMotionTypeProperty, {
        top: 2 * SCREEN_VIEW_Y_MARGIN,
        right: this.layoutBounds.maxX - 300 // eye-balled
      } ) );

      // Create a scene for each Spinner and render it
      introModel.spinners.forEach( spinner => {

        // Create the Spinner Node
        const spinnerNode = new SpinnerNode( spinner,
          this.linearVelocityVisibleProperty,
          this.linearAccelerationVisibleProperty,
          this.totalAccelerationVisibleProperty );

        // Create the Control Panel
        const controlPanel = new IntroControlPanel( spinner,
          this.linearVelocityVisibleProperty,
          this.linearAccelerationVisibleProperty,
          this.totalAccelerationVisibleProperty, {
            right: this.layoutBounds.maxX - SCREEN_VIEW_X_MARGIN,
            top: SCREEN_VIEW_Y_MARGIN
          } );

        // Create a wrapper scene Node.
        const scene = new Node( { children: [ controlPanel, spinnerNode ] } );
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
    }
  }

  return IntroScreenView;
} );