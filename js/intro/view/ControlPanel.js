// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * View for the spinning circle.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Node = require( 'SIM_CORE/scenery/Node' );
  const SliderNode = require( 'SIM_CORE/scenery/SliderNode' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const assert = require( 'SIM_CORE/util/assert' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const SVGNode = require( 'SIM_CORE/scenery/SVGNode' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const Checkbox = require( 'SIM_CORE/scenery/buttons/Checkbox' );
  const VectorNode = require( 'SIM_CORE/scenery/VectorNode' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );

  const STYLES = {
    border: 'rgb( 100, 100, 100 )',
    borderRadius: 5,
    stroke: 1
  };

  class ControlPanel extends Node {

    /**
     * @param {Spinner} spinner
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. Subclasses
     *                             may have different options for their API. See the code where the options are set in
     *                             the early portion of the constructor for details.
     */
    constructor( spinner, isPlayingProperty, velocityVisibleProperty, options ) {

      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );

      // Defaults for options.
      const defaults = {
        width: 240,
        height: 340,
        style: {
          background: 'rgb( 240, 240, 240 )',
          boxSizing: 'content-box'
        },
        padding: 10
      };

      // Rewrite options so that it overrides the defaults.
      options = { ...defaults, ...options };

      super( options );
      this.borderRadius = options.borderRadius;


      //----------------------------------------------------------------------------------------
      // Radius Slider
      let wasPlayingWhenDragged = null;
      const startDrag = () => {
        wasPlayingWhenDragged = isPlayingProperty.value;
        isPlayingProperty.value = false;
      };
      const lineDragClose = () => {
        if ( wasPlayingWhenDragged ) isPlayingProperty.value = true;
        wasPlayingWhenDragged = null;
      }
      const radiusSlider = new SliderNode(
        spinner.radiusRange,
        spinner.radiusProperty, {
          minorTickIncrement: ( spinner.radiusRange.y - spinner.radiusRange.x ) / 6,
          center: new Vector( this.width / 2, 86 ),
          startDrag: startDrag,
          endDrag: lineDragClose
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
          startDrag: startDrag,
          endDrag: lineDragClose
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
        border: `${ Math.max( STYLES.stroke * scale, 1 ) }px solid ${ STYLES.border }`,
        borderRadius: `${ STYLES.borderRadius * scale }px`
      } );
    }
  }

  return ControlPanel;
} );