// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Control Set for changing and displaying the value of a number Property.
 *
 * A NumberControlSet consists of:
 *   - A text label
 *   - A NumberDisplay of the number Property. See NumberDisplay.js for doc.
 *   - A Slider to modify the value of the number Property.
 *
 * The NumberControlSet looks visually like:
 *
 *  title    |number|
 *   ─────▉─────────
 *
 * Used throughout Rotational Motion inside of the control panels.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const NumberDisplay = require( 'ROTATIONAL_MOTION/common/view/NumberDisplay' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Range = require( 'SIM_CORE/util/Range' );
  const Slider = require( 'SIM_CORE/scenery/Slider' );
  const Text = require( 'SIM_CORE/scenery/Text' );

  class NumberControlSet extends Node {

    /**
     * @param {string} title - the text displayed in the label.
     * @param {Property.<number|null>} numberProperty
     * @param {Range} range - this range of the numberProperty.
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( title, numberProperty, range, options ) {
      assert( typeof title === 'string', `invalid title: ${ title }` );
      assert( numberProperty instanceof Property, `invalid numberProperty: ${ numberProperty }` );
      assert( range instanceof Range, `invalid range: ${ range }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {
        sliderTopMargin: 10, // {number} margin between the slider and the content above

        // {Object} - if provided, these options will be passed to the Slider instance
        sliderOptions: null,

        // {Object} - if provided, these options will be passed to the Text instance for the title
        titleTextOptions: null,

        // {Object} - if provided, these options will be passed to the NumberDisplay instance
        numberDisplayOptions: null,

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      super( options );

      //----------------------------------------------------------------------------------------

      // @private {*} - see parameter declaration for documentation. Referenced for use in our methods.
      this._numberProperty = numberProperty;
      this._range = range;
      this._sliderTopMargin = options.sliderTopMargin;

      // @private {Text} - the Text Node for the title label of the NumberControlSet
      this._titleNode = new Text( title, options.titleTextOptions );

      // @private {NumberDisplay} - the number display of the NumberControlSet
      this._numberDisplay = new NumberDisplay( numberProperty, range, options.numberDisplayOptions );

      // @private {Slider} (read-only) - the slider of the NumberControlSet.
      this._slider = new Slider( range, numberProperty, options.sliderOptions );

      // Add the content of the NumberControlSet as children
      this.children = [ this._titleNode, this._numberDisplay, this._slider ];

      // Update the layout of our children.
      this._updateLayout();

      // Apply any additionally Bounds setters
      this.mutate( options );
    }

    /**
     * @override
     * Disposes the NumberControlSet and its listeners so that it can be garbage collected.
     * @public
     */
    dispose() {
      this._slider.dispose();
      this._numberDisplay.dispose();
      this._titleNode.dispose();
      super.dispose();
    }

    /**
     * Adds a major tick mark to the slider.
     * @public
     *
     * @param {number} value - the numeric value the tick represents along the range of the slider.
     * @param {Node} [label] - optional label Node (usually a Text Node), placed above the Node.
     * @returns {NumberControlSet} - 'this' reference, for chaining.
     */
    addSliderMajorTick( value, label ) {
      this._slider.addMajorTick( value, label );
      this._updateLayout();
    }

    /**
     * Adds a minor tick mark to the slider.
     * @public
     *
     * @param {number} value - the numeric value the tick represents along the range of the slider.
     * @param {Node} [label] - optional label Node (usually a Text Node), placed above the Node.
     * @returns {NumberControlSet} - 'this' reference, for chaining.
     */
    addSliderMinorTick( value, label ) {
      this._slider.addMinorTick( value, label );
      this._updateLayout();
    }

    /**
     * Called when the layout of the NumbderControlSet needs to be updated.
     * @private
     *
     * NOTE: Will change the location of its children, and possibly the location of this Node's content.
     */
    _updateLayout() {
      this._titleNode.left = this._slider.left;
      this._numberDisplay.right = this._slider.right;

      if ( this._titleNode.height > this._numberDisplay.height ) {
        this._numberDisplay.centerY = this._titleNode.centerY;
        this._slider.top = this._titleNode.bottom + this._sliderTopMargin;
      }
      else {
        this._titleNode.centerY = this._numberDisplay.centerY;
        this._slider.top = this._numberDisplay.bottom + this._sliderTopMargin;
      }
    }
  }

  return NumberControlSet;
} );