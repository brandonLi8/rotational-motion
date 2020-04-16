// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * A utility class for standardizing the creations of Unit Nodes that are used in the NumberDisplays of
 * Rotational Motion.
 *
 * Has static Node creators for:
 *   - Text units (like 'm'),
 *   - Text Fractions (like 'm/s')
 *   - Rich Text Fractions (like 'm/s^2')
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const FractionNode = require( 'ROTATIONAL_MOTION/common/view/FractionNode' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const RichText = require( 'SIM_CORE/scenery/components/RichText' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const Text = require( 'SIM_CORE/scenery/Text' );

  // constants
  const TEXT_OPTIONS = {
    fontSize: 11.5,
    fontWeight: 500
  };

  class UnitNode extends Node {

    /**
     * Creates a text unit, described at the top of the file.
     * @public
     *
     * @param {string} text - the text of the unit, like 'm'
     */
    static text( text ) {
      assert( typeof text === 'string', `invalid text: ${ text }` );
      return new Text( text, TEXT_OPTIONS );
    }

    /**
     * Creates a singular fraction unit, described at the top of the file.
     * @public
     *
     * @param {string} numerator - like 'rad'
     * @param {string} denominator - like 'sec'
     */
    static fraction( numerator, denominator ) {
      assert( typeof numerator === 'string', `invalid numerator: ${ numerator }` );
      assert( typeof denominator === 'string', `invalid denominator: ${ denominator }` );
      return new FractionNode( new Text( numerator, TEXT_OPTIONS ), new Text( denominator, TEXT_OPTIONS ) );
    }

    /**
     * Creates a rich text fraction unit, which uses RichText on the denominator only.
     * @public
     *
     * @param {string} numerator - like 'rad'
     * @param {string} denominator - like 'sec<sup>2</sup>'
     */
    static richFraction( numerator, denominator ) {
      assert( typeof numerator === 'string', `invalid numerator: ${ numerator }` );
      assert( typeof denominator === 'string', `invalid denominator: ${ denominator }` );
      return new FractionNode(
        new Text( numerator, TEXT_OPTIONS ),
        new RichText( denominator, { textOptions: TEXT_OPTIONS } )
      );
    }
  }

  return UnitNode;
} );