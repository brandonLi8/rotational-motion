// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Transforms a decimal into FractionNode, with PI as a multiplier. For instance, 1.57 is transformed into PI / 2.
 *
 * FractionPiNode will automatically remove numerators that are 1. E.g. instead of 1PI / 2, the displayed fraction
 * would be PI / 2. It also puts the negative bar to the left of the fraction (outside the FractionNode).
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const FractionNode = require( 'ROTATIONAL_MOTION/common/view/FractionNode' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );

  class FractionalPiNode extends FlexBox {

    /**
     * @param {number} decimal - the decimal to display as a fraction of PI
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See the code
     *                             where the options are set in the early portion of the constructor for details.
     */
    constructor( decimal, options ) {
      assert( isFinite( decimal ), `invalid decimal: ${ decimal }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // {Object} - if provided, these options will be passed to all Text instances
        textOptions: null,

        // {Object} - if provided, these options will be passed to the FractionNode instance
        fractionOptions: null,

        // {number} - spacing between each the negative bar and the Fraction
        spacing: 2.5,

        // {number} - negative bar width, if needed
        negativeBarWidth: 4.5,

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      super( 'horizontal', options );

      //----------------------------------------------------------------------------------------

      // Divide the decimal by the PI multiplier first.
      decimal = decimal / Math.PI;

      // Transform the decimal into a integer numerator and a denominator
      const length = decimal.toString().length - 2;
      let denominator = Math.pow( 10, length );
      let numerator = decimal * denominator;

      const divisor = Util.gcd( numerator, denominator );
      numerator = Math.abs( numerator / divisor );
      denominator = Math.abs( denominator / divisor );

      //----------------------------------------------------------------------------------------

      if ( decimal === 0 ) this.addChild( new Text( '0', options.textOptions ) );
      else {
        // Create the FractionNode that represents the absolute value of the PI fraction
        const fractionNode = new FractionNode( `${ numerator === 1 ? '' : numerator } ${ Symbols.PI }`, denominator, {
          ...options.fractionOptions,
          textOptions: options.textOptions
        } );

        // Add a negative bar if the decimal is negative.
        if ( decimal < 0 ) {
          this.addChild( new Line( 0, 0, options.negativeBarWidth, 0, {
            centerRight: fractionNode.topLeft.add( fractionNode.bar.centerLeft ),
            stroke: fractionNode.bar.stroke,
            fill: fractionNode.bar.fill,
            strokeWidth: fractionNode.bar.strokeWidth
          } ) );
        }

        // Add the Fraction Node
        this.addChild( fractionNode );
      }

      // Apply any additional bounds mutators
      this.mutate( options );
    }
  }

  return FractionalPiNode;
} );