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
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const SliderNode = require( 'SIM_CORE/scenery/SliderNode' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const SVGNode = require( 'SIM_CORE/scenery/SVGNode' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const VectorNode = require( 'SIM_CORE/scenery/VectorNode' );

  class ControlPanel extends Rectangle {

    /**
     * @param {Spinner} spinner
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Property.<boolean>} velocityVisibleProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior.
     */
    constructor( spinner, isPlayingProperty, velocityVisibleProperty, options ) {

      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( isPlayingProperty instanceof Property, `invalid isPlayingProperty: ${isPlayingProperty}` );
      assert( velocityVisibleProperty instanceof Property, `invalid isPlayingProperty: ${isPlayingProperty}` );
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
        strokeWidht: 1.   // eye-balled

        //----------------------------------------------------------------------------------------
        // specific to this class
        padding: 10,      // eye-balled


        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( options );
      this.borderRadius = options.borderRadius;

      //----------------------------------------------------------------------------------------
      // Create The Drag listeners for when sliders are dragged to correctly pause and play the sim.

      let playAtDragStart;
      const startDrag = () => {
        playAtDragStart = options.dragPauseProperty.value;
        options.dragPauseProperty.value = false;
      };
      const endDrag = () => {
        playAtDragStart && isPlayingProperty.toggle();
        playAtDragStart = null;
      }

      //----------------------------------------------------------------------------------------
      // Create a slider to change the Radius of the Spinner

      const radiusSlider = new SliderNode(
        spinner.radiusRange,
        spinner.radiusProperty, {
          minorTickIncrement: 0.1,
          center: new Vector( this.width / 2, 86 ),
          startDrag,
          endDrag
      } );

      const radiusLabel = new Text( {
        text: 'Radius',
        fontSize: 15,
        fontWeight: 100,
        attributes: {
          'text-anchor': 'start',
          'alignment-baseline': 'hanging'
        }
      } );
      const radiusNumberDisplay = new Rectangle( {
        fill: 'white',
        width: 90,
        stroke: 'rgb( 150, 150, 150 )',
        strokeWidth: 0.5,
        height: 26,
        x: options.width - 90 - 2 * options.padding,
        y: -26 / 4
      } );
      const radiusNumberDisplayText = new Text( {
        fontSize: 13.8,
        fontWeight: 1,
        x: radiusNumberDisplay.x + radiusNumberDisplay.width / 2,
        y: radiusNumberDisplay.y + radiusNumberDisplay.height / 2,
        attributes: {
          'text-anchor': 'middle',
          'alignment-baseline': 'middle'
        }
      } );
      spinner.radiusProperty.link( radius => {
        radiusNumberDisplayText.setText( `${ Util.toFixed( radius, 2 ) } m` );
      } );
      const radiusSVGContent = new SVGNode( {
        children: [ radiusLabel, radiusNumberDisplay, radiusNumberDisplayText ],
        left: options.padding,
        top: radiusSlider.center.y - radiusSlider.height - 30,
        width: options.width,
        height: 13
      } );


      //----------------------------------------------------------------------------------------
      // Angular Velocity

      const angularVelocitySlider = new SliderNode(
        spinner.angularVelocityRange,
        spinner.angularVelocityProperty, {
          minorTickIncrement: ( spinner.angularVelocityRange.y - spinner.angularVelocityRange.x ) / 10,
          center: new Vector( this.width / 2, 195 ),
          rightLabel: RotationalMotionConstants.INTRO_MAX_VELOCITY_SYMBOL,
          startDrag,
          endDrag
      } );

      const angularVelocityLabel = new Text( {
        text: '\u03c9 (Angular velocity)',
        fontSize: 14,
        fontWeight: 100,
        attributes: {
          'text-anchor': 'start',
          'alignment-baseline': 'hanging'
        }
      } );
      const angularVelocityNumberDisplay = new Rectangle( {
        fill: 'white',
        width: 90,
        stroke: 'rgb( 150, 150, 150 )',
        strokeWidth: 0.5,
        height: 26,
        x: options.width - 90 - 2 * options.padding,
        y: -26 / 2
      } );
      const angularVelocityNumberDisplayText = new Text( {
        fontSize: 13.8,
        fontWeight: 1,
        x: angularVelocityNumberDisplay.x + angularVelocityNumberDisplay.width / 2,
        y: angularVelocityNumberDisplay.y + angularVelocityNumberDisplay.height / 2,
        attributes: {
          'text-anchor': 'middle',
          'alignment-baseline': 'middle'
        }
      } );
      spinner.angularVelocityProperty.link( angularVelocity => {
        angularVelocityNumberDisplayText.setText( `${ Util.toFixed( angularVelocity, 2 ) } rad/sec` );
      } );
      const angularVelocitySVGContent = new SVGNode( {
        children: [ angularVelocityLabel, angularVelocityNumberDisplay, angularVelocityNumberDisplayText ],
        left: options.padding,
        top: angularVelocitySlider.center.y - angularVelocitySlider.height - 20,
        width: options.width,
        height: 13
      } );


      //----------------------------------------------------------------------------------------
      // Velocity checkbox
      const velocityCheckbox = new Checkbox( velocityVisibleProperty );
      const velocityLabel = new Text( {
        text: 'Linear Velocity Vector',
        fontSize: 12,
        fontWeight: 100,
        attributes: {
          'text-anchor': 'start',
          'alignment-baseline': 'middle'
        },
        x: velocityCheckbox.width + 10,
        y: velocityCheckbox.height / 2,
        width: 90,
        height: 20
      } );

      const velocityVector = new VectorNode(
        new Vector( options.width - 2 * options.padding - 30 ,velocityCheckbox.height / 2 ),
        new Vector( options.width - 2 * options.padding  , velocityCheckbox.height / 2 ), {
          fill: 'rgb( 10, 170, 250 )'
        } );
      const velocitySVGContent = new SVGNode( {
        left: options.padding,
        top: 240,
        width: options.width,
        height: 13,
        children: [ velocityCheckbox, velocityLabel, velocityVector ]
      } );
      this.setChildren( [
        radiusSlider,
        radiusSVGContent,
        angularVelocitySlider,
        angularVelocitySVGContent,
        velocitySVGContent
      ] );
    }


    layout( scale ) {
      super.layout( scale );
      this.addStyle( {
        border: `${ Math.max( PANEL_STYLES.stroke * scale, 1 ) }px solid ${ PANEL_STYLES.border }`,
        borderRadius: `${ PANEL_STYLES.borderRadius * scale }px`
      } );
    }
  }

  return ControlPanel;
} );