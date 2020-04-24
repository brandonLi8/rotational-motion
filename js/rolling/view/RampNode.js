// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * RampNode is the corresponding view for the Ramp model, in the 'rolling' screen.
 *
 * RampNode is responsible for:
 *
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
    constructor(
      ramp,
      modelViewTransform
    ) {
      assert( ramp instanceof Ramp, `invalid ramp: ${ ramp }` );
      assert( modelViewTransform instanceof ModelViewTransform, 'invalid modelViewTransform' );

      super();

      //----------------------------------------------------------------------------------------

      // @private {Path} - the Path of the triangle that represents the Ramp.
      this.trianglePath = new Path( null, {
        fill: 'green'
      } );

      this.addChild( this.trianglePath );

      ramp.angleProperty.link( angle => {

        // Create the shape.
        this.trianglePath.shape = modelViewTransform.modelToViewShape( new Shape()
          .moveTo( 0, 0 )
          .lineTo( ramp.playBounds.maxX, 0 )
          .lineTo( 0, Math.tan( angle ) * ramp.playBounds.maxX )
          .close()
        );
        console.log( angle, Math.tan( angle ) * ramp.playBounds.maxX )
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