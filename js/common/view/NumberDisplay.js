// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * A NumberDisplay, which displays the value of a number Property in a Text Node on top of a background rectangle.
 *
 * The NumberDisplay will update when the number Property updates and will display a em-dash if the value is 'null'.
 * The background is a fixed width and height, determined by the largest-sized text within a numeric range. If the
 * number Property's value is ever outside the range and not null, an error will be thrown.
 *
 * The NumberDisplay has various key-value options to customize the appearance of the NumberDisplay, including
 * the background Rectangle's appearance, the Text Node's appearance, and the alignment of the TextNode. In addition,
 * you have the option to include a unit, like 'm', to append to the end of the text.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Range = require( 'SIM_CORE/util/Range' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );

  class NumberDisplay extends Node {

    /**
     * @param {Property.<number|null>} numberProperty
     * @param {Range} range - this range of the numberProperty, used to determine the display width & height.
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior.See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( numberProperty, range, options ) {
      assert( numberProperty instanceof Property, `invalid numberProperty: ${ numberProperty }` );
      assert( range instanceof Range, `invalid range: ${ range }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        xAlign: 'center',  // {string} - the alignment of the Text: 'left', 'center', or 'right'.
        yAlign: 'center',  // {string} - the alignment of the Text: 'top', 'center', or 'bottom'.
        unit: null,        // {string} - if provided, this will be appended to the end of the Text as a unit.
        decimalPlaces: 0,  // {number|null} the number of decimal places to show. If null, the full value is displayed.
        xMargin: 8,        // {number} - the x-margin between the longest/tallest Text and the background.
        yMargin: 2,        // {number} - the x-margin between the longest/tallest Text and the background.
        cornerRadius: 0,   // {number} - the corner radius of the background

        backgroundFill: 'white',        // {string|Gradient} the fill of the background
        backgroundStroke: 'lightGray',  // {string|Gradient} the stroke of the background
        backgroundStrokeWidth: 1,       // {number} the stroke-width of the background

        // {Object} - if provided, these options will be passed to the Text instance
        textOptions: null,

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      super( options );

      //----------------------------------------------------------------------------------------

      // @private {*} - see options declaration for documentation. Referenced for use in our methods.
      this._numberProperty = numberProperty;
      this._range = range;
      this._xAlign = options.xAlign;
      this._yAlign = options.yAlign;
      this._unit = options.unit;
      this._decminalPlaces = options.decimalPlaces;

      // Determine the widest value first.
      const minValueString = this._formatValue( range.min );
      const maxValueString = this._formatValue( range.max );
      const longestValueString = minValueString.length > maxValueString.length ? minValueString : maxValueString;

      // @private {Text} - create the value Node which displays the Text of the number Property.
      this._valueNode = new Text( longestValueString, options.textOptions );
      this._valueNode.maxWidth = this._valueNode.width;

      // @private {Rectangle} - create the Rectangle background Node
      this._background = new Rectangle( 0, 0,
        this.valueNode.width + 2 * options.xMargin,
        this.valueNode.height + 2 * options.yMargin, {
          cornerRadius: options.cornerRadius,
          fill: options.backgroundFill,
          stroke: options.backgroundStroke,
          strokeWidth: options.backgroundStrokeWidth
        } );

      // Add the content of the Number Display as children
      this.children = [ this._background, this._valueNode ];

      // @private {function} - observer of the numberProperty. To be unlinked in the dispose method.
      this._numberPropertyObserver = this._updateNumberDisplay.bind( this );
      numberProperty.link( this._numberPropertyObserver );
    }

    /**
     * @override
     * Disposes the NumberDisplay and its listeners so that it can be garbage collected.
     * @public
     */
    dispose() {
      this._numberProperty.unlink( this._numberPropertyObserver );
      super.dispose();
    }

    /**
     * Formats a value to the displayed string value, by rounding and appending units if applicable.
     * @public
     *
     * @param {number|null} - the value to format
     * @returns {string} - formats the value
     */
    _formatValue( value ) {
      assert( value === null || this._range.contains( value ), `value outside of range of NumberDisplay: ${ value }` );

      if ( value === null ) return Symbols.NO_VALUE; // return the em-dash string if the value is null
      return `${ this._decminalPlaces ? Util.toFixed( value, this._decminalPlaces ) } ${ this._unit || '' }`;
    }

    /**
     * Called when the slider needs to be updated, usually when the numberProperty of the NumberDisplay changes.
     * @private
     *
     * Updates the Text center location to match the alignments.
     */
    _updateSlider() {
      assert( this._numberProperty.value === null || this._range.contains( this._numberProperty.value ),
        `numberProperty outside of range of NumberDisplay range: ${ this._numberProperty.value }` );

      // Update the text of the value Node.
      this._valueNode.text = this._formatValue( this._numberProperty.value );

      // Ensure that the content fits inside the background
      this._background.topLeft = Vector.ZERO;

      // Strip 'center' to centerX or centerY
      const xAlignKey = this._xAlign === 'center' ? 'centerX' : this._xAlign;
      const yAlignKey = this._yAlign === 'center' ? 'centerY' : this._yAlign;

      this._valueNode[ xAlignKey ] = this._background[ xAlignKey ];
      this._valueNode[ yAlignKey ] = this._background[ yAlignKey ];
    }
  }

  return NumberDisplay;
} );