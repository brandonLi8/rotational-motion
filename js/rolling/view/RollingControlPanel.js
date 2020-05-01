// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Control Panel at the top right of each 'rolling' screen that allows the user to modify the properties and states of
 * the screen.
 *
 * A RollingControlPanel displays:
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const Panel = require( 'SIM_CORE/scenery/components/Panel' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RollingModel = require( 'ROTATIONAL_MOTION/rolling/model/RollingModel' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const RotationalMotionIconFactory = require( 'ROTATIONAL_MOTION/common/view/RotationalMotionIconFactory' );
  const VisibilityCheckbox = require( 'ROTATIONAL_MOTION/common/view/VisibilityCheckbox' );

  class RollingControlPanel extends Panel {

    /**
     * @param {RollingModel} rollingModel
     * @param {Property.<boolean>} angleVisibleProperty
     * @param {Object} [options]
     */
    constructor( rollingModel, angleVisibleProperty, options ) {
      assert( rollingModel instanceof RollingModel, `invalid rollingModel: ${ rollingModel }` );
      assert( angleVisibleProperty instanceof Property, 'invalid angleVisibleProperty' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // Import the panel colors.
        ...RotationalMotionColors.PANEL_COLORS,

        // {number} - spacing between the content of the Panel.
        spacing: 13,

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( FlexBox.vertical( { align: 'left', spacing: options.spacing } ), options );

      //----------------------------------------------------------------------------------------

      // 'angles' checkbox
      this.content.addChild( new VisibilityCheckbox( angleVisibleProperty,
        new Text( 'Angle', RotationalMotionConstants.PANEL_TEXT_OPTIONS ),
        RotationalMotionIconFactory.createAngleIcon()
      ) );

      // Apply any additional bounds mutators
      this.mutate( options );
    }
  }

  return RollingControlPanel;
} );