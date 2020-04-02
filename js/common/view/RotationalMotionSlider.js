// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * A rotational-motion specific slider.
 *
 * Includes:
 *   - A label above the slider.
 *   - A Rectangle and Text that shows the slider value. TODO: should this be generalized in sim-core?
 *   - A Slider Below
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const SliderNode = require( 'SIM_CORE/scenery/SliderNode' );
  const SVGNode = require( 'SIM_CORE/scenery/SVGNode' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  class RotationalMotionSlider extends SVGNode {

    /**
     * @param {Property.<number>} sliderProperty
     * @param {Vector} sliderRange
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior.
     */
    constructor( sliderProperty, sliderRange, isPlayingProperty, options ) {

      assert( sliderProperty instanceof Property, `invalid sliderProperty: ${ sliderProperty }` );
      assert( sliderRange instanceof Vector, `invalid sliderRange: ${ sliderRange }` );
      assert( isPlayingProperty instanceof Property, `invalid isPlayingProperty: ${ isPlayingProperty }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      //----------------------------------------------------------------------------------------

      options = {

        width: 240, // required

        //----------------------------------------------------------------------------------------
        // specific to this class

        padding: 10, // eye-balled
        sliderLabelMargin: 40, // margin between the slider and the content above

        sliderOptions: null, // passed to the slider
        sliderTickIncrement: 0.1,

        // label
        labelFontSize: 15,
        labelText: '',

        fontWeight: '100',

        // number display
        numberDisplaySize: new Vector( 90, 27 ),
        numberDisplayFontSize: 13,
        numberDisplayDecimalPlaces: 2,
        numberDisplayUnit: null,

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( options );

      //----------------------------------------------------------------------------------------
      // Create The Drag listeners for when sliders are dragged to correctly pause and play the sim.

      let playAtDragStart;
      const startDrag = () => {
        playAtDragStart = isPlayingProperty.value;
        isPlayingProperty.value = false;
      };
      const endDrag = () => {
        playAtDragStart && isPlayingProperty.toggle();
        playAtDragStart = null;
      };

      //----------------------------------------------------------------------------------------
      // Create the Number Display
      const numberDisplay = new Rectangle( {
        width: options.numberDisplaySize.x,
        height: options.numberDisplaySize.y,
        fill: 'white',
        stroke: 'rgb( 150, 150, 150 )',
        strokeWidth: 0.5,
        x: options.width - options.padding - options.numberDisplaySize.x
      } );
      const numberDisplayText = new Text( {
        fontSize: options.numberDisplayFontSize,
        fontWeight: options.fontWeight,
        x: numberDisplay.x + numberDisplay.width / 2,
        y: numberDisplay.height / 2,
        attributes: {
          'text-anchor': 'middle',
          'alignment-baseline': 'middle'
        }
      } );

      //----------------------------------------------------------------------------------------
      // Create the label that labels the slider on the left
      const label = new Text( {
        text: options.labelText,
        fontSize: options.labelFontSize,
        fontWeight: options.fontWeight,
        attributes: {
          'text-anchor': 'start',
          'alignment-baseline': 'baseline'
        },
        x: options.padding,
        y: numberDisplay.height // align baseline with number display
      } );

      //----------------------------------------------------------------------------------------
      // Create the slider to change the Number Property
      const slider = new SliderNode(
        sliderRange,
        sliderProperty, {
          minorTickIncrement: options.sliderTickIncrement,
          startDrag,
          endDrag,
          ...options.sliderOptions
      } );
      slider.x = options.width / 2 - slider.width / 2;
      slider.y = numberDisplay.height + options.sliderLabelMargin;

      //----------------------------------------------------------------------------------------
      // Update the number display text when the Slider value changes
      sliderProperty.link( value => {
        numberDisplayText.setText(
          `${ Util.toFixed( value, options.numberDisplayDecimalPlaces ) } ${ options.numberDisplayUnit }` );
      } );

      this.setChildren( [
        numberDisplay,
        numberDisplayText,
        label,
        slider
        ] );
    }
  }

  return RotationalMotionSlider;
} );