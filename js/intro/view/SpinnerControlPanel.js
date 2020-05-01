// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Control Panel at the top right of each CircularMotionTypes scene in the 'intro' screen that allows the user to modify
 * the properties of the Spinner.
 *
 * Each SpinnerControlPanel should be initiated with a corresponding CircularMotionType. Its visibility should then
 * be adjusted by the current circular motion type. Its content is fixed and doesn't change after instantiation.
 *
 * A SpinnerControlPanel displays:
 *  - A radius Number Control Set
 *  - A angular velocity Number Control Set for uniform and a angular acceleration Number Control Set for non-uniform
 *  - A horizontal separator line
 *  - An angle visibility checkbox
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
  const Line = require( 'SIM_CORE/scenery/Line' );
  const Panel = require( 'SIM_CORE/scenery/components/Panel' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const RotationalMotionIconFactory = require( 'ROTATIONAL_MOTION/common/view/RotationalMotionIconFactory' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const SpinnerNumberControlSet = require( 'ROTATIONAL_MOTION/intro/view/SpinnerNumberControlSet' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const UnitNode = require( 'ROTATIONAL_MOTION/common/view/UnitNode' );
  const VisibilityCheckbox = require( 'ROTATIONAL_MOTION/common/view/VisibilityCheckbox' );

  class SpinnerControlPanel extends Panel {

    /**
     * @param {Spinner} spinner
     * @param {Property.<boolean>} angleVisibleProperty
     * @param {Object} [options]
     */
    constructor( spinner, angleVisibleProperty, options ) {
      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( angleVisibleProperty instanceof Property, 'invalid angleVisibleProperty' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // Import the panel colors.
        ...RotationalMotionColors.PANEL_COLORS,

        // {number} - spacing between the content of the Panel.
        spacing: 13,

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------

      super( FlexBox.vertical( { align: 'left', spacing: options.spacing } ), options );

      // 'Radius' NumberControlSet
      this.content.addChild( new SpinnerNumberControlSet( spinner,
        spinner.radiusProperty,
        spinner.radiusRange,
        new Text( 'Radius', RotationalMotionConstants.PANEL_TEXT_OPTIONS ),
        UnitNode.text( 'm' ),
        { minor: 0.1, minorLabel: 0.3, major: spinner.radiusRange.length, fractionalPi: false },
        { numberDisplayOptions: { unitAlign: 'bottom' } }
      ) );

      if ( spinner.type === CircularMotionTypes.UNIFORM ) {

        // 'Angular Velocity' NumberControlSet
        this.content.addChild( new SpinnerNumberControlSet( spinner,
          spinner.angularVelocityProperty,
          spinner.angularVelocityRange,
          new Text( `Angular Velocity (${ Symbols.OMEGA })`, RotationalMotionConstants.PANEL_TEXT_OPTIONS ),
          UnitNode.fraction( 'rad', 'sec' ),
          { minor: Math.PI / 16, minorLabel: Math.PI / 8, major: spinner.angularVelocityRange.length }
        ) );
      }
      else {

        const title = FlexBox.horizontal( { spacing: 6 } ).setChildren( [
          new Text( Symbols.ALPHA, RotationalMotionConstants.PANEL_TEXT_OPTIONS ),
          new Text( Symbols.EQUAL_TO, RotationalMotionConstants.PANEL_TEXT_OPTIONS ),
          FractionNode.withText( `d${ Symbols.OMEGA }`, 'dt', {
            textOptions: RotationalMotionConstants.PANEL_TEXT_OPTIONS
          } )
        ] );

        // 'Angular Acceleration' NumberControlSet
        this.content.addChild( new SpinnerNumberControlSet( spinner,
          spinner.angularAccelerationProperty,
          spinner.angularAccelerationRange,
          title,
          UnitNode.richFraction( 'rad', 'sec<sup>2</sup>' ),
          { minor: Math.PI / 16, minorLabel: Math.PI / 8, major: spinner.angularAccelerationRange.length / 2 }
        ) );
      }

      // horizontal line separator
      this.content.addChild( new Line( 0, 0, this.content.width, 0, { stroke: 'black', strokeWidth: 0.5 } ) );

      // 'angles' checkbox
      this.content.addChild( new VisibilityCheckbox( angleVisibleProperty,
        new Text( 'Angle', RotationalMotionConstants.PANEL_TEXT_OPTIONS ),
        RotationalMotionIconFactory.createAngleIcon( 'forward' )
      ) );

      // Apply any additional bounds mutators
      this.mutate( options );
    }
  }

  return SpinnerControlPanel;
} );