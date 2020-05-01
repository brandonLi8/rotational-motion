// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Top Level view for the 'Rolling' screen.
 *
 * Responsible for:
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RampNode = require( 'ROTATIONAL_MOTION/rolling/view/RampNode' );
  const RollingControlPanel = require( 'ROTATIONAL_MOTION/rolling/view/RollingControlPanel' );
  const RollingModel = require( 'ROTATIONAL_MOTION/rolling/model/RollingModel' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );

  // constants
  const SCREEN_VIEW_X_MARGIN = RotationalMotionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = RotationalMotionConstants.SCREEN_VIEW_Y_MARGIN;
  const MODEL_TO_VIEW_SCALE = 180; // meter to view coordinates (1 m = 180 coordinates)

  class RollingScreenView extends ScreenView {

    /**
     * @param {RollingModel} rollingModel
     */
    constructor( rollingModel ) {
      assert( rollingModel instanceof RollingModel, `invalid rollingModel: ${ rollingModel }` );

      super();

      // @public (read-only) - indicates if the spinner angle is visible.
      this.angleVisibleProperty = new Property( false, { type: 'boolean' } );

      //----------------------------------------------------------------------------------------

      // Compute the bounds of the entire ramp area, in scenery coordinates.
      const rampViewBounds = new Bounds(
        SCREEN_VIEW_X_MARGIN,
        this.layoutBounds.maxY - rollingModel.ramp.playBounds.height * MODEL_TO_VIEW_SCALE,
        SCREEN_VIEW_X_MARGIN + rollingModel.ramp.playBounds.width * MODEL_TO_VIEW_SCALE,
        this.layoutBounds.maxY
      );

      // Create the model view transform for the screen.
      const modelViewTransform = new ModelViewTransform( rollingModel.ramp.playBounds, rampViewBounds );

      //----------------------------------------------------------------------------------------

      const rampNode = new RampNode( rollingModel.ramp, modelViewTransform );

      // Create the Control Panel
      const controlPanel = new RollingControlPanel( rollingModel, this.angleVisibleProperty, {
        right: this.layoutBounds.maxX - SCREEN_VIEW_X_MARGIN,
        top: SCREEN_VIEW_Y_MARGIN
      } );

      // Add the children in the correct rendering order.
      this.children = [
        rampNode,
        controlPanel
      ];
    }
  }

  return RollingScreenView;
} );