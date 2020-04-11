// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * View for the radio button group near the top of the 'Intro' Screen that allows the user to select between a uniform
 * and a non-uniform Spinner.
 *
 * See CircularMotionTypes.js for more documentation on Spinners and circular motion types.
 *
 * CircularMotionTypesRadioButtonGroup is never disposed and exists for the entire simulation.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RadioButton = require( 'SIM_CORE/scenery/buttons/RadioButton' );
  const RadioButtonGroup = require( 'SIM_CORE/scenery/RadioButtonGroup' );
  const RotationalMotionIconFactory = require( 'ROTATIONAL_MOTION/common/view/RotationalMotionIconFactory' );

  class CircularMotionTypesRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {Property.<Enum.Member.<CircularMotionTypes>>} circularMotionTypeProperty
     * @param {Object} [options]
     */
    constructor( circularMotionTypeProperty, options ) {
      assert( circularMotionTypeProperty instanceof Property, 'invalid circularMotionTypeProperty' );
      assert( Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // {number} - spacing between the radio buttons.
        spacing: 8,

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------

      // Create a RadioButton that corresponds to each CircularMotionType
      const radioButtons = [];

      CircularMotionTypes.MEMBERS.forEach( circularMotionType => {
        const radioButton = new RadioButton( circularMotionType,
          RotationalMotionIconFactory.createCircularMotionTypeIcon( circularMotionType ) );

        radioButtons.push( radioButton );
      } );

      //----------------------------------------------------------------------------------------

      super( 'horizontal', circularMotionTypeProperty, radioButtons, options );
    }
  }

  return CircularMotionTypesRadioButtonGroup;
} );