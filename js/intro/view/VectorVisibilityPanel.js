// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Control Panel at the bottom right of each CircularMotionTypes scene in the 'intro' screen that allows the user to
 * change the visibility of IntroScreenView view properties.
 *
 * Each VectorVisibilityPanel should be initiated with a corresponding CircularMotionType. Its visibility should then
 * be adjusted by the current circular motion type. Its content is fixed and doesn't change after instantiation.
 *
 * A VectorVisibilityPanel displays:
 *  - A Velocity Vector Checkbox
 *  - A Linear Acceleration Vector Checkbox for non-uniform CircularMotionTypes ONLY
 *  - A (Total) Acceleration Vector Checkbox (labeled 'Acceleration Vector' for uniform
 *    and 'Total Acceleration Vector' for non-uniform)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Panel = require( 'SIM_CORE/scenery/components/Panel' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const RotationalMotionIconFactory = require( 'ROTATIONAL_MOTION/common/view/RotationalMotionIconFactory' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const VisibilityCheckbox = require( 'ROTATIONAL_MOTION/common/view/VisibilityCheckbox' );

  class VectorVisibilityPanel extends Panel {

    /**
     * @param {Enum.Member.<CircularMotionTypes>} circularMotionType
     * @param {number} controlPanelContentWidth - matches the width
     * @param {Property.<boolean>} linearVelocityVisibleProperty
     * @param {Property.<boolean>} linearAccelerationVisibleProperty
     * @param {Property.<boolean>} totalAccelerationVisibleProperty
     * @param {Object} [options]
     */
    constructor(
      circularMotionType,
      controlPanelContentWidth,
      linearVelocityVisibleProperty,
      linearAccelerationVisibleProperty,
      totalAccelerationVisibleProperty,
      options
    ) {
      assert( CircularMotionTypes.includes( circularMotionType ), 'invalid circularMotionType' );
      assert( linearVelocityVisibleProperty instanceof Property, 'invalid linearVelocityVisibleProperty' );
      assert( linearAccelerationVisibleProperty instanceof Property, 'invalid linearAccelerationVisibleProperty' );
      assert( totalAccelerationVisibleProperty instanceof Property, 'invalid totalAccelerationVisibleProperty' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // Import the panel colors.
        ...RotationalMotionColors.PANEL_COLORS,

        // {number} - spacing between the content of the Panel.
        spacing: 13,

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( new Node(), options );

      //----------------------------------------------------------------------------------------

      // Separate the icons and Checkboxes into two different FlexBoxes for horizontal alignment of Icons
      const checkboxes = FlexBox.vertical( { align: 'left', spacing: options.spacing } );
      const icons = FlexBox.vertical( { align: 'left', spacing: options.spacing } );

      // 'Vectors' Label
      const vectorsText = new Text( 'Vectors', {
        ...RotationalMotionConstants.PANEL_TEXT_OPTIONS,
        fontWeight: 600
      } );
      this.content.addChild( vectorsText );

      // 'Linear Velocity' Checkbox
      checkboxes.addChild( new VisibilityCheckbox( linearVelocityVisibleProperty,
        new Text( 'Linear Velocity', RotationalMotionConstants.PANEL_TEXT_OPTIONS )
      ) );
      icons.addChild( RotationalMotionIconFactory.createVectorArrowIcon( {
        fill: RotationalMotionColors.LINEAR_VELOCITY_VECTOR_FILL
      } ) );

      // 'Linear Acceleration' Checkbox
      if ( circularMotionType === CircularMotionTypes.NON_UNIFORM ) {

        checkboxes.addChild( new VisibilityCheckbox( linearAccelerationVisibleProperty,
          new Text( 'Linear Acceleration', RotationalMotionConstants.PANEL_TEXT_OPTIONS )
        ) );
        icons.addChild( RotationalMotionIconFactory.createVectorArrowIcon( {
          fill: RotationalMotionColors.LINEAR_ACCELERATION_VECTOR_FILL
        } ) );
      }

      // 'Total Acceleration' Checkbox
      checkboxes.addChild( new VisibilityCheckbox( totalAccelerationVisibleProperty,
        new Text( circularMotionType === CircularMotionTypes.UNIFORM ?
                  'Acceleration' :
                  'Total Acceleration', RotationalMotionConstants.PANEL_TEXT_OPTIONS )
      ) );
      icons.addChild( RotationalMotionIconFactory.createVectorArrowIcon( {
        fill: RotationalMotionColors.TOTAL_ACCELERATION_VECTOR_FILL
      } ) );

      // Position the icons to the right of the checkboxes
      checkboxes.top = vectorsText.bottom + 10;
      icons.centerLeft = checkboxes.centerRight.addXY( controlPanelContentWidth - icons.width - checkboxes.width, 0 );
      this.content.addChild( checkboxes ).addChild( icons );

      // Apply any additional bounds mutators
      this.mutate( options );
    }
  }

  return VectorVisibilityPanel;
} );