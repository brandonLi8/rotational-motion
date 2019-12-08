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
    constructor( spinner, isPlayingProperty, options ) {

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
        new Vector( spinner.minSpinnerRadius, spinner.maxSpinnerRadius ),
        spinner.stringRadiusProperty, {
          minorTickIncrement: ( spinner.maxSpinnerRadius - spinner.minSpinnerRadius ) / 6,
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
      spinner.stringRadiusProperty.link( radius => {
        radiusNumberDisplayText.setText( `${ Util.toFixed( radius, 2 ) } m` );
      } );
      const radiusSVGContent = new SVGNode( {
        children: [ radiusLabel, radiusNumberDisplay, radiusNumberDisplayText ],
        left: options.padding,
        top: radiusSlider._center.y - radiusSlider._height - 30,
        width: options.width,
        height: 13
      } );


      //----------------------------------------------------------------------------------------
      // Angular Velocity

      const angularVelocitySlider = new SliderNode(
        spinner.ballVelocityRange,
        spinner.ballVelocityProperty, {
          minorTickIncrement: 10,
          center: new Vector( this.width / 2, 195 ),
          startDrag: startDrag,
          endDrag: lineDragClose
      } );

      const angularVelocityLabel = new Text( {
        text: '\u03c9',
        fontSize: 15,
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
      spinner.ballVelocityProperty.link( angularVelocity => {
        angularVelocityNumberDisplayText.setText( `${ Util.toFixed( angularVelocity, 2 ) } deg/sec` );
      } );
      const angularVelocitySVGContent = new SVGNode( {
        children: [ angularVelocityLabel, angularVelocityNumberDisplay, angularVelocityNumberDisplayText ],
        left: options.padding,
        top: angularVelocitySlider._center.y - angularVelocitySlider._height - 20,
        width: options.width,
        height: 13
      } );

      this.setChildren( [ radiusSlider, radiusSVGContent, angularVelocitySlider, angularVelocitySVGContent ] );
    }


    layout( scale ) {
      super.layout( scale );
      this.addStyle( {
        border: `${ STYLES.stroke * scale }px solid ${ STYLES.border }`,
        borderRadius: `${ STYLES.borderRadius * scale }px`
      } );
    }
  }

  return ControlPanel;
} );