// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * RampNode is the corresponding view for the entire Ramp model, in the 'rolling' screen.
 *
 * RampNode is responsible for:
 *  - Rendering the entire outline shape of the Ramp, including the lift bar and stand. See Ramp.js for context.
 *  -
 *
 * RampNodes are created at the start of the Sim and are never disposed, so all links are left as is.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Path = require( 'SIM_CORE/scenery/Path' );
  const Ramp = require( 'ROTATIONAL_MOTION/rolling/model/Ramp' );
  const RampDotsGrid = require( 'ROTATIONAL_MOTION/rolling/view/RampDotsGrid' );
  const RampUpDownArrow = require( 'ROTATIONAL_MOTION/rolling/view/RampUpDownArrow' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const Shape = require( 'SIM_CORE/util/Shape' );

  class RampNode extends Node {

    /**
     * @param {Ramp} ramp
     * @param {ModelViewTransform} modelViewTransform
     */
    constructor( ramp, modelViewTransform ) {
      assert( ramp instanceof Ramp, `invalid ramp: ${ ramp }` );
      assert( modelViewTransform instanceof ModelViewTransform, 'invalid modelViewTransform' );

      super();

      //----------------------------------------------------------------------------------------

      // @private {Path} - the Path of the entire Ramp, including the slope, lift bar, and stand.
      this._rampPath = new Path( null, {
        fill: RotationalMotionColors.RAMP_FILL,
        stroke: RotationalMotionColors.RAMP_STROKE,
        strokeWidth: 1.2
      } );

      // @private {Line} - dashed line that separates the slope and the lift-bar. For aesthetic purposes.
      this._dashedSeparator = new Line( 0, 0, 0, 0, {
        stroke: RotationalMotionColors.RAMP_DASHED_SEPARATOR_STROKE,
        lineDash: [ 2.5, 6 ] // eye-balled
      } );

      // @private {RampDotsGrid} - the grid of small dots, used to indicate the lift-bar of the Ramp is draggable.
      this._dotsGrid = new RampDotsGrid( ramp, modelViewTransform, {
        centerX: modelViewTransform.modelToViewX( -Ramp.LIFT_BAR_WIDTH / 2 )
      } );

      // @private {RampUpDownArrow} - the up-down arrow, used to indicate the lift-bar of the Ramp is draggable.
      this._upDownArrow = new RampUpDownArrow( ramp, modelViewTransform, { centerX: this._dotsGrid.centerX } );

      // @private {Path} - the extra lines that map out the border of the ramp, for cosmetic purposes.
      this._outlinePath = new Path( null, {
        fill: 'none',
        stroke: RotationalMotionColors.RAMP_STROKE,
        strokeWidth: 0.5
      } );

      // Set the children of the RampNode in the correct rendering order.
      this.children = [
        this._rampPath,
        this._dotsGrid,
        this._upDownArrow,
        this._dashedSeparator,
        this._outlinePath
      ];

      //----------------------------------------------------------------------------------------

      ramp.angleProperty.link( angle => {

        // Create the support-bar shape, in model coordinates.
        this._rampPath.shape = modelViewTransform.modelToViewShape( new Shape()
          .moveTo( -Ramp.LIFT_BAR_WIDTH, -Ramp.STAND_HEIGHT )
          .verticalLineToRelative( ramp.height )
          .horizontalLineTo( 0 )
          .verticalLineToRelative( -Ramp.LIFT_BAR_Y_EXTENSION )
          .lineToRelative( ramp.slopeWidth, -ramp.slopeHeight )
          .horizontalLineToRelative( Ramp.STAND_X_EXTENSION )
          .verticalLineToRelative( -Ramp.STAND_HEIGHT )
          .horizontalLineToRelative( -Ramp.STAND_WIDTH )
          .close() );

        // Create the outline-path shape.
        this._outlinePath.shape = modelViewTransform.modelToViewShape( new Shape()
          .moveTo( -Ramp.LIFT_BAR_WIDTH, ramp.slopeHeight + Ramp.LIFT_BAR_Y_EXTENSION - 0.009 )
          .horizontalLineTo( -0.009 )
          .verticalLineToRelative( -Ramp.LIFT_BAR_Y_EXTENSION )
          .lineToRelative( ramp.slopeWidth, -ramp.slopeHeight )
          .horizontalLineToRelative( Ramp.STAND_X_EXTENSION )
          .verticalLineToRelative( -Ramp.STAND_HEIGHT - 0.009 ) );

        // Reposition the other Nodes. Margins are eye-balled
        this._dotsGrid.top = this._rampPath.top + 5;
        this._dashedSeparator.start = modelViewTransform.modelToViewXY( 0, -Ramp.STAND_HEIGHT + 0.1 );
        this._dashedSeparator.end = modelViewTransform.modelToViewXY( 0, Math.max( ramp.slopeHeight - 0.1, -0.1 ) );
        this._upDownArrow.centerY = modelViewTransform.modelToViewY( ( ramp.slopeHeight - Ramp.STAND_HEIGHT ) / 2 );
      } );
    }

    /**
     * @override
     * This method is called when a child's Bounds changes. In Node, this method is responsible for adjusting its
     * Bounds and recursively calling the method for each parent up the ancestor tree.
     * @protected
     *
     * The current implementation of Node shifts the Bounds of children so that they are all positive and offsets it.
     * However, this is overridden to allow for negative Bounds of RampNodes.
     */
    _recomputeAncestorBounds() { /** do nothing **/ }
  }

  return RampNode;
} );