// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Top Level view for the 'Rolling' screen.
 *
 * Responsible for:
 *   - Keeping track of the window scenery Bounds
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const RampNode = require( 'ROTATIONAL_MOTION/rolling/view/RampNode' );
  const RollingModel = require( 'ROTATIONAL_MOTION/rolling/model/RollingModel' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );

  // constants
  const SCREEN_VIEW_X_MARGIN = RotationalMotionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = RotationalMotionConstants.SCREEN_VIEW_Y_MARGIN;
  const MODEL_TO_VIEW_SCALE = 53; // meter to view coordinates (1 m = 53 coordinates)

  class RollingScreenView extends ScreenView {

    /**
     * @param {RollingModel} rollingModel
     */
    constructor( rollingModel ) {
      assert( rollingModel instanceof RollingModel, `invalid rollingModel: ${ rollingModel }` );

      super();

      // Compute the bounds of the entire ramp area, in scenery coordinates.
      const rampHeight = Math.tan( rollingModel.ramp.angleRange.max ) * RampNode.RAMP_BOTTOM_LEG_LENGTH;
      const rampViewBounds = new Bounds(
        SCREEN_VIEW_X_MARGIN + RampNode.SUPPORT_BAR_WIDTH,
        this.layoutBounds.maxY - RampNode.SUPPORT_BAR_WIDTH - rampHeight,
        SCREEN_VIEW_X_MARGIN + RampNode.SUPPORT_BAR_WIDTH + RampNode.RAMP_BOTTOM_LEG_LENGTH,
        this.layoutBounds.maxY - RampNode.SUPPORT_BAR_WIDTH
      );

      // Create the model view transform for the screen.
      const modelViewTransform = new ModelViewTransform( rollingModel.ramp.playBounds, rampViewBounds );

      //----------------------------------------------------------------------------------------

      const rampNode = new RampNode( rollingModel.ramp, modelViewTransform );
      this.addChild( rampNode );
    }
  }

  return RollingScreenView;
} );