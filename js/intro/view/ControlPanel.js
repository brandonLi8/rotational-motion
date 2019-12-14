// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * View for the Control Panel at the top right of the screen.
 *
 * TODO: we should probably make a panel class in sim-core.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Checkbox = require( 'SIM_CORE/scenery/buttons/Checkbox' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const RotationalMotionSlider = require( 'ROTATIONAL_MOTION/common/view/RotationalMotionSlider' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const SVGNode = require( 'SIM_CORE/scenery/SVGNode' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const VectorNode = require( 'SIM_CORE/scenery/VectorNode' );


  class ControlPanel extends SVGNode {

    /**
     * @param {Spinner} spinner
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Property.<boolean>} velocityVisibleProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior.
     */
    constructor( spinner, isPlayingProperty, velocityVisibleProperty, options ) {

      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( isPlayingProperty instanceof Property, `invalid isPlayingProperty: ${ isPlayingProperty }` );
      assert( velocityVisibleProperty instanceof Property, `invalid isPlayingProperty: ${ isPlayingProperty }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      //----------------------------------------------------------------------------------------

      options = {

        //----------------------------------------------------------------------------------------
        // passed to the super class
        width: 240,       // eye-balled
        height: 340,      // eye-balled
        cornerRadius: 5,  // eye-balled
        stroke: 'rgb( 100, 100, 100 )',  // eye-balled
        fill: 'rgb( 240, 240, 240 )',    // eye-balled
        strokeWidth: 1,   // eye-balled

        //----------------------------------------------------------------------------------------
        // specific to this class
        padding: 20,      // eye-balled


        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( options );

      //----------------------------------------------------------------------------------------
      // background Rectangle
      const background = new Rectangle( {
        width: options.width,
        height: options.height,
        cornerRadius: options.cornerRadius,
        stroke: options.stroke,
        fill: options.fill,
        strokeWidth: options.strokeWidth
      } );

      //----------------------------------------------------------------------------------------
      // Create a slider to change the Radius of the Spinner
      const radiusSlider = new RotationalMotionSlider( spinner.radiusProperty, spinner.radiusRange, isPlayingProperty, {
        padding: options.padding,
        width: options.width,
        labelText: 'radius',
        numberDisplayUnit: 'm',
        top: options.padding
      } );

      //----------------------------------------------------------------------------------------
      // Create a slider to change the Angular Velocity of the Spinner
      const angularVelocitySlider = new RotationalMotionSlider(
        spinner.angularVelocityProperty,
        spinner.angularVelocityRange,
        isPlayingProperty, {
          padding: options.padding,
          width: options.width,
          labelText: '\u03c9',
          sliderTickIncrement: ( spinner.angularVelocityRange.y - spinner.angularVelocityRange.x ) / 6,
          numberDisplayUnit: 'rad/sec',
          top: 140,
          sliderOptions: {
            rightLabel: RotationalMotionConstants.INTRO_MAX_VELOCITY_SYMBOL
          }
        } );

      //----------------------------------------------------------------------------------------
      // Velocity checkbox
      const velocityCheckbox = new Checkbox( velocityVisibleProperty, { left: options.padding } );
      const velocityLabel = new Text( {
        text: 'Linear Velocity Vector',
        fontSize: 14,
        fontWeight: 100,
        attributes: {
          'text-anchor': 'start',
          'alignment-baseline': 'middle'
        },
        x: options.padding + velocityCheckbox.width + 10,
        y: velocityCheckbox.height / 2
      } );

      const velocityVector = new VectorNode(
        new Vector( options.width - options.padding - 30, velocityCheckbox.height / 2 ),
        new Vector( options.width - options.padding, velocityCheckbox.height / 2 ), {
          fill: 'rgb( 10, 170, 250 )' // TODO color constants file
        } );
      const velocityContent = new SVGNode( {
        top: 265,
        width: options.width,
        children: [ velocityCheckbox, velocityLabel, velocityVector ]
      } );

      //----------------------------------------------------------------------------------------
      // Render the children in the correct z-layering
      this.setChildren( [
        background,
        radiusSlider,
        angularVelocitySlider,
        velocityContent
      ] );
    }
  }

  return ControlPanel;
} );