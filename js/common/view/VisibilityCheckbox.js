// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * VisibilityCheckbox is a FlexBox sub-type that displays content to the right side of a Checkbox that toggles the
 * visibility of a simulation component.
 *
 * The VisibilityCheckbox looks visually like:
 *
 *  □ label icon
 *
 * The Label can be any Node (not just limited to Text), and they can be labeled with icons.
 * See sim-core/scenery/components/buttons/Checkbox for background on Checkboxes.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Checkbox = require( 'SIM_CORE/scenery/components/buttons/Checkbox' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );

  class VisibilityCheckbox extends FlexBox {

    /**
     * @param {Property.<boolean>} visibilityProperty - the Property to toggle when the Checkbox is pressed. The initial
     *                                                  visibility of the check will be determined by the current value.
     * @param {Node} label - the label Node of the VisibilityCheckbox, placed to the right of the Checkbox
     * @param {Node} [icon] - the icon of the VisibilityCheckbox, placed to the right of the label
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( visibilityProperty, label, icon, options ) {
      assert( label instanceof Node, `invalid label: ${ label }` );
      assert( !icon || icon instanceof Node, `invalid icon: ${ icon }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // {Object} - if provided, options that are passed to the Checkbox instance
        checkboxOptions: {
          boxSize: 16,
          boxStrokeWidth: 1.5
        },

        // {number} spacing between each piece of the VisibilityCheckbox
        spacing: 6.5,

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      //----------------------------------------------------------------------------------------

      options.children = [
        new Checkbox( visibilityProperty, options.checkboxOptions ),
        label,
        icon || new Node()
      ];

      super( options );
    }
  }

  return VisibilityCheckbox;
} );