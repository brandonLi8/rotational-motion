// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * RampNode is the corresponding view for the entire Ramp model, in the 'rolling' screen.
 *
 * The RampNode has the ramp-triangle but also has many additionally components that it renders:
 *                  ┌┐
 *   support-bar -  ││╲╲
 *                  ││ ╲╲  - Ramp
 *                  ││__╲╲_╷
 *                  └──────┘
 *              Ramp - the piece the RollingBall's roll down. Also is draggable to change the elevation.
 *              Support-Bar - allows the user to change the angle (the dotted lines are draggable). Also lifts the Ramp
 *                            up to allow the user to see the ramp when it is completely horizontal
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
  const Ramp = require( 'ROTATIONAL_MOTION/rolling/model/Ramp' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const Shape = require( 'SIM_CORE/util/Shape' );
  const Path = require( 'SIM_CORE/scenery/Path' );

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

      // @private {Path} - the Path of the support-bar. See the comment at the top of the file.
      this._supportBarPath = new Path( null, { fill: 'yellow' } );

      // @private {Path} - the Path of the Ramp. See the comment at the top of the fil.
      this._rampPath = new Path( null, { fill: 'brown' } );

      // Set the children of the RampNode in the correct rendering order.
      this.children = [
        this._supportBarPath,
        this._rampPath,
      ];


      ramp.angleProperty.link( angle => {

        // Create the shape.
        this._rampPath.shape = modelViewTransform.modelToViewShape( new Shape()
          .moveTo( 0, 0 )
          .lineTo( ramp.playBounds.maxX, 0 )
          .lineTo( 0, Math.tan( angle ) * ramp.playBounds.maxX )
          .close()
        );
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

  //----------------------------------------------------------------------------------------
  // Static Constants
  //----------------------------------------------------------------------------------------

  // @public {number} - the width of the ramp support bar
  RampNode.SUPPORT_BAR_WIDTH = 60;

  // @public {number} - the length of the bottom-side of the ramp
  RampNode.RAMP_BOTTOM_LEG_LENGTH = 200;

  return RampNode;
} );