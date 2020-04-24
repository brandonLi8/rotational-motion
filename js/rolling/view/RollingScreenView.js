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
  const RollingModel = require( 'ROTATIONAL_MOTION/rolling/model/RollingModel' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );
  const RampNode = require( 'ROTATIONAL_MOTION/rolling/view/RampNode' );

  // constants
  const HILL_BOTTOM_LEG_LENGTH = 400;

  class RollingScreenView extends ScreenView {

    /**
     * @param {RollingModel} rollingModel
     */
    constructor( rollingModel ) {
      assert( rollingModel instanceof RollingModel, `invalid rollingModel: ${ rollingModel }` );

      super();

      // @public (read-only) {Bounds} - The Bounds of the entire browser window (excluding the navigation-bar), in
      //                                scenery coordinates, relative to our layout bounds (can include negative Bounds)
      this.windowSceneryBounds = Bounds.ZERO.copy();

      //----------------------------------------------------------------------------------------

      // Compute the bounds of the entire ramp area, in scenery coordinates. The ramp is put to the bottom-right of the
      // ScreenView.
      const rampViewBounds = new Bounds( 0,
        this.layoutBounds.maxY - Math.tan( rollingModel.ramp.angleRange.max ) * HILL_BOTTOM_LEG_LENGTH,
        HILL_BOTTOM_LEG_LENGTH,
        this.layoutBounds.maxY
      );

      // @public (read-only) {ModelViewTransform} - create the model view transform for the screen
      this.modelViewTransform = new ModelViewTransform( rollingModel.ramp.playBounds, rampViewBounds );

      //----------------------------------------------------------------------------------------

      const rampNode = new RampNode( rollingModel.ramp, this.modelViewTransform );
      this.addChild( rampNode );
    }

    /**
     * Layouts the Rolling screen. Called at the start of the simulation and when the browser window is resized.
     * @public
     *
     * @param {number} width - Screen width, in pixels.
     * @param {number} height - Screen height, in pixels.
     */
    layout( width, height ) {
      super.layout( width, height );

      // Recompute our window bounds.
      const xExpand = ( width / this.layoutScale ) / 2;
      const yExpand = ( height / this.layoutScale ) / 2;
      this.windowSceneryBounds.set( this.layoutBounds ).expand( xExpand, yExpand, xExpand, yExpand );
    }
  }

  return RollingScreenView;
} );