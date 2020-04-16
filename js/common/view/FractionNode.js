// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * A custom Fraction Node, which displays a numerator, a horizontal line, and a denominator stacked vertically on top
 * of each other.
 *
 * The numerator and denominator can be and Node, to allow for fractional units (like rad/sec). FractionNode
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
     * @param {Node} numerator
     * @param {Node} denominator
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( numerator, denominator, options ) {
      assert( numerator instanceof Node, `invalid numerator: ${ numerator }` );
      assert( denominator instanceof Node, 'invalid denominator' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // fraction-bar
        fractionBarFill: 'black',    // {string} the fill color of the fraction bar
        fractionBarStroke: 'black',  // {string} the stroke color of the fraction bar
        fractionBarStrokeWidth: 0.8, // {number} the stroke width of the fraction bar
        fractionBarExtension: 3.5,   // {number} how far the fraction bar extends past the larger text

        // {number} - spacing between each component of the Fraction
        spacing: 0.9,

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      super( 'vertical', options );

      //----------------------------------------------------------------------------------------

      // Compute the width of the fraction-bar.
      const fractionBarWidth = Math.max( numerator.width, denominator.width ) + options.fractionBarExtension;

      // @public {Line} (read-only) - Create the fraction-bar. Exposed for relative positioning.
      this.bar = new Line( 0, 0, fractionBarWidth, 0, {
        fill: options.fractionBarFill,
        stroke: options.fractionBarStroke,
        strokeWidth: options.fractionBarStrokeWidth
      } );

      // Set the children of the FractionNode
      this.children = [ numerator, this.bar, denominator ];

      // Apply any additionally Bounds setters
      this.mutate( options );
    }

    /**
     * Static FractionNode creator that uses Text Nodes as its numerators and denominators.
     * @public
     *
     * @param {string|number} numerator
     * @param {string|number} denominator
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See the code where
     *                             the options are set in the early portion of the constructor for details.
     * @returns {FractionNode}
     */
    static withText( numerator, denominator, options ) {
      options = {
        // {Object} - if provided, these options will be passed to Text instances
        textOptions: null,

        ...options
      };
      return new FractionNode(
        new Text( numerator, options.textOptions ),
        new Text( denominator, options.textOptions ),
        options
      );
    }
  }

  return FractionNode;
} );