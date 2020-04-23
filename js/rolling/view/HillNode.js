// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * HillNode is the corresponding view for the Hill model, in the 'rolling' screen.
 *
 * HillNode is responsible for:
 *
 *
 * HillNodes are created at the start of the Sim and are never disposed, so all links are left as is.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const Hill = require( 'ROTATIONAL_MOTION/rolling/model/Hill' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  class HillNode extends Node {

    /**
     * @param {Hill} hill
     * @param {ModelViewTransform} modelViewTransform
     */
    constructor(
      hill,
      modelViewTransform
    ) {
      assert( hill instanceof Hill, `invalid hill: ${ hill }` );
      assert( modelViewTransform instanceof ModelViewTransform, 'invalid modelViewTransform' );

      super();
    }

    /**
     * @override
     * This method is called when a child's Bounds changes. In Node, this method is responsible for adjusting its
     * Bounds and recursively calling the method for each parent up the ancestor tree.
     * @protected
     *
     * The current implementation of Node shifts the Bounds of children so that they are all positive and offsets it.
     * However, this is overridden to allow for negative Bounds of HillNodes.
     */
    _recomputeAncestorBounds() { /** do nothing **/ }
  }

  return HillNode;
} );