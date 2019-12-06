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
  const LineNode = require( 'SIM_CORE/scenery/LineNode' );
  const SVGNode = require( 'SIM_CORE/scenery/SVGNode' );
  const CircleNode = require( 'SIM_CORE/scenery/CircleNode' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const assert = require( 'SIM_CORE/util/assert' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );

  class SpinnerNode extends Node {

    /**
     * @param {Spinner} spinner
     * @param {ModelViewTransform} modelViewTransform
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. Subclasses
     *                             may have different options for their API. See the code where the options are set in
     *                             the early portion of the constructor for details.
     */
    constructor( spinner, modelViewTransform, options ) {

      assert( spinner instanceof Spinner, `invalid spinner: ${ modelViewTransform }` );
      assert( modelViewTransform instanceof ModelViewTransform, `invalid modelViewTransform: ${ modelViewTransform }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${ options }` );

      // Defaults for options.
      const defaults = {

        center: modelViewTransform.modelToViewPoint( Vector.ZERO ),
        width: modelViewTransform.modelToViewDeltaX( spinner.spinnerAreaBounds.width ),
        height: -modelViewTransform.modelToViewDeltaY( spinner.spinnerAreaBounds.height ),

        style: {
          border: '2px solid red'
        }
      };

      // Rewrite options so that it overrides the defaults.
      options = { ...defaults, ...options };

      super( options );

      //----------------------------------------------------------------------------------------
      // Create the Circle in the center that represents a Pin

      const localCenter = new Vector( modelViewTransform.viewBounds.width / 2, modelViewTransform.viewBounds.height / 2 );
      const line = new LineNode( localCenter, Vector.ZERO, {
        stroke: 'black',
        strokeWidth: 2,
        fill: 'black'
      } );

      const pin = new CircleNode( {
        radius: 8,
        fill: 'rgb( 30, 30, 30 )',
        center: localCenter,
      } );

      const pinParent = new SVGNode( {
        children: [ line, pin ],
        width:  modelViewTransform.modelToViewBounds( spinner.spinnerAreaBounds ).width,
        height: modelViewTransform.modelToViewBounds( spinner.spinnerAreaBounds ).height,
        style: {
          border: '2px solid blue'
        }
      } );

      this.addChild( pinParent );
    }
  }

  return SpinnerNode;
} );