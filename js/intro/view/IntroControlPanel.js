// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Control Panel at the top right of each CircularMotionTypes scene in the 'intro' screen.
 *
 * Each IntroControlPanel should be initiated with a corresponding CircularMotionType. Its visibility should then
 * be adjusted by the current circular motion type. Its content is fixed and doesn't change after instantiation.
 *
 * Displays for Uniform Circular Motion Types:
 *  - A radius Number Control Set
 *  - A angular velocity Number Control Set
 *  - A Velocity Vector Checkbox
 *  - A (total) Acceleration Vector Checkbox
 *
 * Displays for Non Uniform Circular Motion Types:
 *  - A radius Number Control Set
 *  - A angular acceleration Number Control Set
 *  - A Velocity Vector Checkbox
 *  - A Linear Acceleration Vector Checkbox
 *  - A Total Acceleration Vector Checkbox
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const FractionNode = require( 'ROTATIONAL_MOTION/common/view/FractionNode' );
  const LabeledCheckboxNode = require( 'ROTATIONAL_MOTION/common/view/LabeledCheckboxNode' );
  const Panel = require( 'ROTATIONAL_MOTION/common/view/Panel' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const RotationalMotionIconFactory = require( 'ROTATIONAL_MOTION/common/view/RotationalMotionIconFactory' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const SpinnerNumberControlSet = require( 'ROTATIONAL_MOTION/intro/view/SpinnerNumberControlSet' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );

  // constants
  const ARROW_ICON_SPACING = 5;
  const TEXT_OPTIONS = {
    fontSize: 12.5,
    fontWeight: 500
  };

  class IntroControlPanel extends Panel {

    /**
     * @param {Spinner} spinner
     * @param {Property.<boolean>} linearVelocityVisibleProperty
     * @param {Property.<boolean>} linearAccelerationVisibleProperty
     * @param {Property.<boolean>} totalAccelerationVisibleProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior.
     */
    constructor(
      spinner,
      linearVelocityVisibleProperty,
      linearAccelerationVisibleProperty,
      totalAccelerationVisibleProperty,
      options
    ) {
      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( linearVelocityVisibleProperty instanceof Property, 'invalid linearVelocityVisibleProperty' );
      assert( linearAccelerationVisibleProperty instanceof Property, 'invalid linearAccelerationVisibleProperty' );
      assert( totalAccelerationVisibleProperty instanceof Property, 'invalid totalAccelerationVisibleProperty' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {
        // Import the declared panel colors.
        ...RotationalMotionColors.PANEL_COLORS,

        // {number} - spacing between the content of the Panel.
        spacing: 13,

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( new FlexBox( 'vertical', { align: 'left', spacing: options.spacing } ), options );

      //----------------------------------------------------------------------------------------

      // IntroControlPanel's always have a NumberControlSet for the radius.
      const radiusNumberControlSet = new SpinnerNumberControlSet( spinner, new Text( 'Radius' ),
        'radius', new Text( 'm' ), TEXT_OPTIONS,
        { minor: 0.1, minorLabel: 0.3, major: spinner.radiusRange.length, fractionalPi: false } );

      // Add the radius NumberControlSet as a child.
      this.content.addChild( radiusNumberControlSet );

      if ( spinner.type === CircularMotionTypes.UNIFORM ) {

        // Add a angular velocity NumberControlSet for uniform spinners.
        const angularVelocityNumberControlSet = new SpinnerNumberControlSet( spinner,
          new Text( `Angular Velocity (${ Symbols.OMEGA })` ), 'angularVelocity',
          new FractionNode( 'rad', 'sec', { textOptions: TEXT_OPTIONS } ),
          TEXT_OPTIONS,
          { minor: Math.PI / 16, minorLabel: Math.PI / 8, major: spinner.angularVelocityRange.length } );

        // Add the angular velocity NumberControlSet as a child.
        this.content.addChild( angularVelocityNumberControlSet );
      }
      else {

        // Create the Title Node of the Angular Acceleration NumberControlSet
        const title = new FlexBox( 'horizontal', {
          children: [
            new FractionNode( `d${ Symbols.OMEGA }`, 'dt' ),
            new Text( Symbols.EQUAL_TO ),
            new Text( Symbols.ALPHA )
          ],
          spacing: 6 // eye-balled
        } );

        // Add a angular acceleration NumberControlSet for non-uniform spinners.
        const angularAccelerationNumberControlSet = new SpinnerNumberControlSet( spinner,
          title, 'angularAcceleration',
          new FractionNode( 'rad', `sec${ Symbols.DOT }sec`, { textOptions: TEXT_OPTIONS } ),
          TEXT_OPTIONS,
          { minor: Math.PI / 16, minorLabel: Math.PI / 8, major: spinner.angularAccelerationRange.length / 2 } );

        // Add the angular velocity NumberControlSet as a child.
        this.content.addChild( angularAccelerationNumberControlSet );
      }

      //----------------------------------------------------------------------------------------

      // Function that creates and adds a Labeled Checkbox to toggle the visibility of a Property
      const addLabeledCheckbox = ( property, name, fill ) => {
        const label = new FlexBox( 'horizontal', {
          spacing: ARROW_ICON_SPACING,
          children: [ new Text( name, TEXT_OPTIONS ), RotationalMotionIconFactory.createVectorArrowIcon( { fill } ) ]
        } );
        this.content.addChild(
          new LabeledCheckboxNode( label, property, RotationalMotionConstants.LABELED_CHECKBOX_NODE_OPTIONS )
        );
      };

      addLabeledCheckbox( linearVelocityVisibleProperty,
        'Velocity Vector',
        RotationalMotionColors.LINEAR_VELOCITY_VECTOR_FILL );

      if ( spinner.type === CircularMotionTypes.NON_UNIFORM ) {
        addLabeledCheckbox( linearAccelerationVisibleProperty,
          'Linear Acceleration Vector',
          RotationalMotionColors.LINEAR_ACCELERATION_VECTOR_FILL );
      }

      addLabeledCheckbox( totalAccelerationVisibleProperty,
        CircularMotionTypes.UNIFORM ? 'Acceleration Vector' : 'Total Acceleration Vector',
        RotationalMotionColors.TOTAL_ACCELERATION_VECTOR_FILL );

      // Apply any additionally Bounds setters
      this.mutate( options );
    }
  }

  return IntroControlPanel;
} );