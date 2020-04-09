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

      // @public (read-only) - indicates if the total acceleration Vectors are visible or not for both Spinners.
      this.totalAccelerationVisibleProperty = new Property( DEFAULT_VECTOR_IS_VISIBLE, { type: 'boolean' } );

      // @public (read-only) - indicates the current circular motion type.
      this.circularMotionTypeProperty = new Property( DEFAULT_CIRCULAR_MOTION_TYPE, {
        validValues: CircularMotionTypes.MEMBERS
      } );

      //----------------------------------------------------------------------------------------

      // Create a container for the scenes.
      const sceneContainer = new Node();
      this.addChild( sceneContainer );
      const scenes = {};

      // Create a 'scene' for each circular motion type and render it in a single Node.
      [ introModel.uniformSpinner, introModel.nonUniformSpinner ].forEach( spinner => {
        const spinnerNode = new SpinnerNode(
          spinner,
          this.linearVelocityVisibleProperty,
          this.linearAccelerationVisibleProperty,
          this.totalAccelerationVisibleProperty
        );
        // Create the Control Panel
        const controlPanel = new IntroControlPanel( spinner,
          this.linearVelocityVisibleProperty,
          this.linearAccelerationVisibleProperty,
          this.totalAccelerationVisibleProperty, {
            right: this.layoutBounds.maxX - SCREEN_VIEW_X_MARGIN,
            top: SCREEN_VIEW_Y_MARGIN
          } );

        // Create a wrapper scene Node.
        const scene = new Node().setChildren( [ controlPanel, spinnerNode ] );
        scene.playingWhenSceneSwitches = null; // Flag that indicates if the spinner was playing when a drag starts.

        // Adjust visibility based on the circularMotionTypeProperty
        this.circularMotionTypeProperty.link( () => {
          if ( !scene.playingWhenSceneSwitches ) scene.playingWhenSceneSwitches = spinner.isPlayingProperty.value;
          spinner.isPlayingProperty.value = false; // pause
          if ( this.circularMotionTypeProperty.value === spinner.type ) {
            sceneContainer.children = [ scene ];
            if ( scene.playingWhenSceneSwitches ) spinner.isPlayingProperty.value = true;
            scene.playingWhenSceneSwitches = null; // reset
          }
        } );
        scenes[ spinner.type ] = scene;
      } );

      // Add the Reset All Button
      const resetAllButton = new ResetButton( {
        listener: () => {
          sceneContainer.children = Object.values( scenes );
          this.reset();
          introModel.reset();
          sceneContainer.children = [ scenes[ this.circularMotionTypeProperty.value ] ];
          Object.values( scenes ).forEach( scene => { scene.playingWhenSceneSwitches = false; } );
        },
        right: this.layoutBounds.maxX - SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( resetAllButton );

      // Add the CircularMotionTypes RadioButtonGroup
      const circularMotionTypesRadioButtonGroup = new CircularMotionTypesRadioButtonGroup(
        this.circularMotionTypeProperty, {
          top: 2 * SCREEN_VIEW_Y_MARGIN,
          right: this.layoutBounds.maxX - 300 // eye-balled
        } );
      this.addChild( circularMotionTypesRadioButtonGroup );
    }

    /**
     * Resets the View Properties of the 'Intro' screen
     * @public
     */
    reset() {
      this.circularMotionTypeProperty.reset();
      this.linearVelocityVisibleProperty.reset();
      this.linearAccelerationVisibleProperty.reset();
      this.totalAccelerationVisibleProperty.reset();
    }
  }

  return IntroScreenView;
} );