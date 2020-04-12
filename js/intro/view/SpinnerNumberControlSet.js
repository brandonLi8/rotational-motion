// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * A NumberControlSet designed specifically to control a number Property of a Spinner in the 'Intro' Screen. Used
 * inside of SpinnerPanel.
 *
 * Extends NumberControlSet but adds the following functionality:
 *   - Pauses the Spinner when the slider is dragged. When the drag is finished, will play the Spinner again only if it
 *     was playing before the drag started.
 *   - Automatically inserts all of the Major and Minor ticks based on a configuration object.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SIM_CORE/scenery/AlignBox' );
  const assert = require( 'SIM_CORE/util/assert' );
  const FractionalPiNode = require( 'ROTATIONAL_MOTION/intro/view/FractionalPiNode' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const NumberControlSet = require( 'SIM_CORE/scenery/components/NumberControlSet' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );

  class SpinnerNumberControlSet extends NumberControlSet {

    /**
     * @param {Spinner} spinner
     * @param {Node} title - the title displayed (see the comment at the top of the file for context).
     * @param {string} property - the property name that the Spinner modifies (e.g 'radius')
     * @param {Node} unit - the unit displayed in the Number Control.
     * @param {Object} textOptions - passed to all Text instances.
     * @param {Object} increments - required object literal that provides configuration information on ticks
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( spinner, title, property, unit, textOptions, increments, options ) {
      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( title instanceof Node, `invalid title: ${ title }` );
      assert( unit instanceof Node, `invalid unit: ${ unit }` );
      assert( Object.getPrototypeOf( increments ) === Object.prototype, `invalid increments: ${ increments }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // {number} - the fixed width of each Tick Label Node. Used to ensure Sliders are lined up.
        tickWidth: 20,

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      increments = {

        minor: null,         // {number} - increment for each minor tick that doesn't have a label
        major: null,         // {number} - increment for each major tick, which always has a label
        minorLabel: null,    // {number} - increment for each minor tick that does have a label
        fractionalPi: true,  // {boolean} (optional) - indicates if tick labels are FractionalPiNodes or Text

        ...increments
      };

      //----------------------------------------------------------------------------------------

      // Flag that indicates if the spinner was playing when a slider-drag starts.
      let playingWhenDragStarted;

      // Pauses the Spinner when the slider is dragged. When the drag is finished, will play the Spinner again only if
      // it was playing before the drag started.
      const sliderOptions = {
        startDrag: () => {
          playingWhenDragStarted = spinner.isPlayingProperty.value; // set the playingWhenDragStarted flag
          spinner.isPlayingProperty.value = false; // pause when dragging
        },
        endDrag: () => {
          playingWhenDragStarted && spinner.isPlayingProperty.set( true ); // play if it was playing before dragging
          playingWhenDragStarted = null; // reset the playingWhenDragStarted flag
        }
      };

      super( title,
        spinner[ property + 'Property' ],
        spinner[ property + 'Range' ], {
          ...options,
          numberDisplayOptions: { decimalPlaces: RotationalMotionConstants.NUMBER_DISPLAY_DECIMAL_PLACES, unit },
          sliderOptions
        } );

      //----------------------------------------------------------------------------------------

      const labelClass = increments.fractionalPi ? FractionalPiNode : Text;

      // Add the Major Ticks
      for ( let i = this._range.min; i <= this._range.max; i += increments.major ) {
        this.addSliderMajorTick( i,
          AlignBox.withWidth( new labelClass( i, { textOptions } ), options.tickWidth ) );
      }

      // Add the Minor Ticks
      for ( let i = this._range.min; i <= this._range.max; i += increments.minor ) {
        if ( Util.equalsEpsilon( ( i - this._range.min ) % increments.major, 0 ) ) continue;
        if ( Util.equalsEpsilon( ( i - this._range.min ) % increments.minorLabel, 0 ) ) {
          this.addSliderMinorTick( i,
            AlignBox.withWidth( new labelClass( i, { textOptions } ), options.tickWidth ) );
        }
        else {
          this.addSliderMinorTick( i );
        }
      }
    }
  }

  return SpinnerNumberControlSet;
} );