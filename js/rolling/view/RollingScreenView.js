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
  const RollingModel = require( 'ROTATIONAL_MOTION/rolling/model/RollingModel' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );

  class RollingScreenView extends ScreenView {

    /**
     * @param {RollingModel} rollingModel
     */
    constructor( rollingModel ) {
      assert( rollingModel instanceof RollingModel, `invalid rollingModel: ${ rollingModel }` );

      super();

      //----------------------------------------------------------------------------------------

      // @public (read-only) {Bounds} - The Bounds of the entire browser window (excluding the navigation-bar), in
      //                                scenery coordinates, relative to our layout bounds (can include negative Bounds)
      this.windowSceneryBounds = Bounds.ZERO.copy();
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