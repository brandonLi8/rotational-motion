// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * View for the spinning circle.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Node = require( 'SIM_CORE/scenery/Node' );
  const SVGNode = require( 'SIM_CORE/scenery/SVGNode' );
  const CircleNode = require( 'SIM_CORE/scenery/CircleNode' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const assert = require( 'SIM_CORE/util/assert' );

  class SpinnerNode extends Node {

    /**
     * @param {ModelViewTransform} modelViewTransform
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. Subclasses
     *                             may have different options for their API. See the code where the options are set in
     *                             the early portion of the constructor for details.
     */
    constructor( modelViewTransform, options ) {

      assert( modelViewTransform instanceof ModelViewTransform, `invalid modelViewTransform: ${ modelViewTransform }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${ options }` );

      // Defaults for options.
      const defaults = {

        center: modelViewTransform.modelToViewPoint( Vector.ZERO ),
        width: modelViewTransform.modelToViewDeltaX( 2 ),
        height: -modelViewTransform.modelToViewDeltaY( 2 ),

        style: {
          border: '2px solid red'
        }
      };

      // Rewrite options so that it overrides the defaults.
      options = { ...defaults, ...options };

      super( options );
    }
  }

  return SpinnerNode;
} );