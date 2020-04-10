// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * LabeledCheckboxNode is a custom Node for this simulation with a label Node to the right-side of a Checkbox.
 *
 * The LabeledCheckboxNode looks visually like:
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

  class LabeledCheckboxNode extends Node {

    /**
     * @param {Node} label - the label Node of the LabeledCheckboxNode
     * @param {Property.<boolean>} toggleProperty - the Property to toggle when the Checkbox is pressed. The initial
     *                                              visibility of the check will be determined by the current value.
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( label, toggleProperty, options ) {
      assert( label instanceof Node, `invalid label: ${ label }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // {Object} - if provided, these options will be passed to the Checkbox instance
        checkboxOptions: null,

        // {number} spacing between the Checkbox an the label
        spacing: 8,

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      super( options );

      //----------------------------------------------------------------------------------------

      // @private {Checkbox} - create the Checkbox with options
      this._checkbox = new Checkbox( toggleProperty, options.checkboxOptions );

      // Set the location of the label relative to the Checkbox.
      label.centerLeft = this._checkbox.background.centerRight.addXY( options.spacing, 0 );

      // Set the children of the LabeledCheckboxNode
      this.children = [ this._checkbox, label ];

      // Apply any additionally Bounds setters
      this.mutate( options );
    }
  }

  return LabeledCheckboxNode;
} );