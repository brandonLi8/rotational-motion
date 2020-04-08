// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * A Custom Node for this simulation that displays a numerator on top of a denominator with a line in between.
 *
 * Note that the numerator and denominator can be any strings. This is used for other situations like with
 * units (e.g. rad/sec is a FractionNode).
 *
 * FractionNode uses FlexBox to align the numerator, fraction-line, and denominator. See scenery/FlexBox for more
 * documentation.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const Line = require( 'SIM_CORE/scenery/Line' );
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

        // {Object} - if provided, these options will be passed to the Text instances
        textOptions: null,

        fractionBarFill: 'black',   // {string} the fill color of the fraction bar
        fractionBarStroke: 'black', // {string} the stroke color of the fraction bar
        fractionBarStrokeWidth: 1,  // {number} the stroke width of the fraction bar

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      super( 'vertical', options );

      //----------------------------------------------------------------------------------------

      // Create the numerator and denominator Text Nodes.
      const numeratorText = new Text( numerator, options.textOptions );
      const denominatorText = new Text( denominator, options.textOptions );

      // Create the fraction-bar.
      const fractionBar = new Line( 0, 0, Math.max( numeratorText.width, denominatorText.width ) + 2, 0, {
        fill: options.fractionBarFill,
        stroke: options.fractionBarStroke,
        strokeWidth: options.fractionBarStrokeWidth
      } );

      // Set the children of the FractionNode
      this.children = [ numeratorText, fractionBar, denominatorText ];
    }
  }

  return FractionNode;
} );