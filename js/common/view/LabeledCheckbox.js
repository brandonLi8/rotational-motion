// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * A Custom Checkbox for this simulation with a label Node to the right-side of the box.
 *
 * The LabeledCheckbox looks visually like:
 *
 *  □ label
 *
 * The Label can be any Node (not just limited to Text), as they can be labeled with icons.
 * See sim-core/scenery/buttons/Checkbox for background on Checkboxes.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Checkbox = require( 'SIM_CORE/scenery/buttons/Checkbox' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const NumberDisplay = require( 'ROTATIONAL_MOTION/common/view/NumberDisplay' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Range = require( 'SIM_CORE/util/Range' );
  const Slider = require( 'SIM_CORE/scenery/Slider' );

  class LabeledCheckbox extends Node {

    /**
     * @param {Node} label - the label Node of the LabeledCheckbox
     * @param {Property.<boolean>} toggleProperty - the Property to toggle when the Checkbox is pressed. The initial
     *                                              visibility of the check will be determined by the current value.
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See Checkbox.js
     */
    constructor( label, toggleProperty, options ) {
      assert( label instanceof Node, `invalid label: ${ label }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        spacing: 5, // {number} spacing between the box an the label

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      super( options );

      //----------------------------------------------------------------------------------------

      // @private {Checkbox} - create the checkbox with options
      this._checkbox = new Checkbox( toggleProperty, { ...options, left: 0 } );

      // Set the location of the label relative to the checkbox.
      label.centerLeft = this._checkbox.background.centerRight.addXY( options.spacing, 0 );

      // Set the children of the LabeledCheckbox
      this.children = [ this._checkbox, label ];

      // Apply any additionally Bounds setters
      this.mutate( options );
    }
  }

  return LabeledCheckbox;
} );