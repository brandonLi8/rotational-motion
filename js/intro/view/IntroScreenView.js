// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Top Level view for the 'Intro' screen.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const SVGNode = require( 'SIM_CORE/scenery/SVGNode' );
  const CircleNode = require( 'SIM_CORE/scenery/CircleNode' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  class IntroScreenView extends ScreenView {

    constructor() {

      super();

      const node = new SVGNode( {
        width: 100,
        height: 100,
        top: 50,
        left: 50,
        style: {
          border: '2px solid green'
        }
      } );

      const circle = new CircleNode( {
        radius: 50,
        fill: 'blue',
        strokeWidth: 4,
        stroke: 'green',
        center: new Vector( 50, 50 )

      } );


      const node2 = new Node( {
        width: 20,
        height: 20,
        style: {
          border: '2px solid black'
        }
      } );
      this.addChild( node.addChild( circle.addChild( node2 ) ) );
    }
  }

  return IntroScreenView;
} );