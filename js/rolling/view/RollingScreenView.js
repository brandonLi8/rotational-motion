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
  const HillNode = require( 'ROTATIONAL_MOTION/rolling/view/HillNode' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const RollingModel = require( 'ROTATIONAL_MOTION/rolling/model/RollingModel' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );

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

      // Compute the bounds of the entire hill area, in scenery coordinates. The hill is put to the bottom-right of the
      // ScreenView.
      const hillViewBounds = new Bounds( 0,
        this.layoutBounds.maxY - Math.tan( rollingModel.hill.angleRange.max ) * HILL_BOTTOM_LEG_LENGTH,
        HILL_BOTTOM_LEG_LENGTH,
        this.layoutBounds.maxY
      );

      // @public (read-only) {ModelViewTransform} - create the model view transform for the screen
      this.modelViewTransform = new ModelViewTransform( rollingModel.hill.playBounds, hillViewBounds );

      //----------------------------------------------------------------------------------------

      this.backgroundNode = new Rectangle( 0, 0, { fill: RotationalMotionColors.ROLLING_SCREEN_BACKGROUND } );
      this.backgroundNode._computeGlobalBounds = () => {};
      this.addChild( this.backgroundNode );

      const hillNode = new HillNode( rollingModel.hill, this.modelViewTransform );
      this.addChild( hillNode );
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

      this.backgroundNode.width = this.windowSceneryBounds.width;
      this.backgroundNode.height = this.windowSceneryBounds.height;
      this.backgroundNode.topLeft = this.windowSceneryBounds.bottomLeft;
    }
  }

  return RollingScreenView;
} );