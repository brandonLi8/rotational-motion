// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * A custom Fraction Node, which displays a numerator, a horizontal line, and a denominator stacked vertically on top
 * of each other.
 *
 * The numerator and denominator can be numbers or strings, to allow for fractional units (like rad/sec). FractionNode
 * can be sub-typed to allow for multiple denominators (like 4/5/5) if desired.
 *
 * FractionNode is a subtype of FlexBox, mainly to align the centerX of the numerator, fraction-line, and denominator.
 * See sim-core/scenery/FlexBox for more documentation.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Text = require( 'SIM_CORE/scenery/Text' );

  class FractionNode extends FlexBox {

    /**
     * @param {string|number} numerator
     * @param {string|number} denominator
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( numerator, denominator, options ) {
      assert( typeof numerator === 'number' || typeof numerator === 'string', `invalid numerator: ${ numerator }` );
      assert( typeof denominator === 'number' || typeof denominator === 'string', 'invalid denominator' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // fraction-bar
        fractionBarFill: 'black',    // {string} the fill color of the fraction bar
        fractionBarStroke: 'black',  // {string} the stroke color of the fraction bar
        fractionBarStrokeWidth: 0.5, // {number} the stroke width of the fraction bar
        fractionBarExtension: 3.5,   // {number} how far the fraction bar extends past the larger text

        // {Object} - if provided, these options will be passed to the Text instances
        textOptions: null,

        // {number} - spacing between each component of the Fraction
        spacing: 0.5,

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      super( 'vertical', options );

      //----------------------------------------------------------------------------------------

      // Create the numerator and denominator Text Nodes.
      const numeratorNode = new Text( numerator, options.textOptions );
      const denominatorNode = new Text( denominator, options.textOptions );

      // Compute the width of the fraction-bar.
      const fractionBarWidth = Math.max( numeratorNode.width, denominatorNode.width ) + options.fractionBarExtension;

      // Create the fraction-bar.
      const fractionBar = new Line( 0, 0, fractionBarWidth, 0, {
        fill: options.fractionBarFill,
        stroke: options.fractionBarStroke,
        strokeWidth: options.fractionBarStrokeWidth
      } );

      // Set the children of the FractionNode
      this.children = [ numeratorNode, fractionBar, denominatorNode ];
    }
  }

  return FractionNode;
} );