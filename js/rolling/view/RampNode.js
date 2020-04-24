// Copyright © 2019-2020 Brandon Li. All rights reserved.

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
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Path = require( 'SIM_CORE/scenery/Path' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Ramp = require( 'ROTATIONAL_MOTION/rolling/model/Ramp' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const Shape = require( 'SIM_CORE/util/Shape' );
  const Vector = require( 'SIM_CORE/util/Vector' );

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

      // Set the children of the RampNode in the correct rendering order.
      this.children = [
        this._rampPath,
      ];

      //----------------------------------------------------------------------------------------

      ramp.angleProperty.link( angle => {

        // Create the support-bar shape, in model coordinates.
        const rampShape = new Shape()
          .moveTo( -Ramp.LIFT_BAR_WIDTH, -Ramp.STAND_HEIGHT )
          .verticalLineToRelative( ramp.height )
          .horizontalLineTo( 0 )
          .verticalLineToRelative( -Ramp.LIFT_BAR_Y_EXTENSION )
          .lineToRelative( ramp.slopeWidth, -ramp.slopeHeight )
          .horizontalLineToRelative( Ramp.STAND_X_EXTENSION )
          .verticalLineToRelative( -Ramp.STAND_HEIGHT )
          .horizontalLineToRelative( -Ramp.STAND_WIDTH )
          .close();

        this._rampPath.shape = modelViewTransform.modelToViewShape( rampShape );
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