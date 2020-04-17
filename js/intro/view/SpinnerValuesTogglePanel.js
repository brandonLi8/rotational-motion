// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * SpinnerValuesTogglePanel is the Toggle Panel at the top of each CircularMotionTypes scene in the 'intro' screen that
 * displays the values of a Spinner.
 *
 * Each SpinnerValuesTogglePanel should be initiated with a corresponding CircularMotionType. Its visibility should then
 * be adjusted by the current circular motion type. Its content is fixed and doesn't change after instantiation.
 *
 * A SpinnerValuesTogglePanel displays:
 *  - A Centripetal Acceleration Number Display
 *  - A Linear Velocity Number Display
 *  - A Angular Acceleration (alpha) Number Display for Uniform
 *  - A Angular Velocity (omega) Number Display for Non-uniform
 *
 * This panel exists for the entire sim and is never disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SIM_CORE/scenery/AlignBox' );
  const assert = require( 'SIM_CORE/util/assert' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const FractionNode = require( 'ROTATIONAL_MOTION/common/view/FractionNode' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const NumberDisplay = require( 'SIM_CORE/scenery/components/NumberDisplay' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Range = require( 'SIM_CORE/util/Range' );
  const RichText = require( 'SIM_CORE/scenery/components/RichText' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const RotationalMotionIconFactory = require( 'ROTATIONAL_MOTION/common/view/RotationalMotionIconFactory' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const TogglePanel = require( 'ROTATIONAL_MOTION/common/view/TogglePanel' );
  const UnitNode = require( 'ROTATIONAL_MOTION/common/view/UnitNode' );

  class SpinnerValuesTogglePanel extends TogglePanel {

    /**
     * @param {Spinner} spinner
     * @param {Property.<boolean>} spinnerValuesVisibleProperty
     * @param {Object} [options]
     */
    constructor( spinner, spinnerValuesVisibleProperty, options ) {
      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( spinnerValuesVisibleProperty instanceof Property, 'invalid spinnerValuesVisibleProperty' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // Import the panel colors.
        ...RotationalMotionColors.PANEL_COLORS,

        labelRightMargin: 10,     // {number} margin from the label to the number label (ltr)
        labelLeftMargin: 20,      // {number} margin from then number display to the label (ltr)
        numberDisplayWidth: 75,   // {number} the width of each number display in the Panel
        numberDisplayHeight: 35,  // {number} the height of each number display in the Panel
        decimalPlaces: 1,         // {number} the number of decimal places to display on each NumberDisplay

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      // Content for when the panel is 'closed'
      const closedContent = new Text( 'Values', RotationalMotionConstants.PANEL_TEXT_OPTIONS );

      // Content for when the panel is 'open'
      const openContent = FlexBox.horizontal( { spacing: options.labelLeftMargin } );

      //----------------------------------------------------------------------------------------

      // Centripetal Acceleration
      openContent.addChild( FlexBox.horizontal( {
        spacing: options.labelRightMargin,
        children: [
          new RichText( 'a<sub>c</sub>', { textOptions: RotationalMotionConstants.LABEL_TEXT_OPTIONS } ),
          new NumberDisplay( spinner.ball.centripetalAccelerationProperty,
          options.numberDisplayWidth,
          options.numberDisplayHeight, {
            decimalPlaces: options.decimalPlaces,
            unit: UnitNode.richFraction( 'm', 's<sup>2</sup>' )
          } )
        ]
      } ) );

      // Center of Mass Velocity
      openContent.addChild( FlexBox.horizontal( {
        spacing: options.labelRightMargin,
        children: [
          new RichText( 'v<sub>cm</sub>', { textOptions: RotationalMotionConstants.LABEL_TEXT_OPTIONS } ),
          new NumberDisplay( spinner.ball.tangentialVelocityProperty,
          options.numberDisplayWidth,
          options.numberDisplayHeight, {
            decimalPlaces: options.decimalPlaces,
            unit: UnitNode.fraction( 'm', 's' )
          } )
        ]
      } ) );

      if ( spinner.type === CircularMotionTypes.UNIFORM ) {

        // Alpha
        openContent.addChild( FlexBox.horizontal( {
          spacing: options.labelRightMargin,
          children: [
            new Text( Symbols.ALPHA, { textOptions: RotationalMotionConstants.LABEL_TEXT_OPTIONS } ),
            new NumberDisplay( spinner.angularAccelerationProperty,
            options.numberDisplayWidth,
            options.numberDisplayHeight, {
              decimalPlaces: options.decimalPlaces,
              unit: UnitNode.richFraction( 'rad', 'sec<sup>2</sup>' )
            } )
          ]
        } ) );
      }
      else {

        // Omega
        openContent.addChild( FlexBox.horizontal( {
          spacing: options.labelRightMargin,
          children: [
            new Text( Symbols.OMEGA, { textOptions: RotationalMotionConstants.LABEL_TEXT_OPTIONS } ),
            new NumberDisplay( spinner.angularVelocityProperty,
            options.numberDisplayWidth,
            options.numberDisplayHeight, {
              decimalPlaces: options.decimalPlaces,
              unit: UnitNode.fraction( 'rad', 'sec' )
            } )
          ]
        } ) );
      }

      super( spinnerValuesVisibleProperty, closedContent, openContent, options );
    }
  }

  return SpinnerValuesTogglePanel;
} );