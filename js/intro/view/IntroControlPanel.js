// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Control Panel at the top right of each CircularMotionTypes scene in the 'intro' screen.
 *
 * Each IntroControlPanel should be initiated with a corresponding CircularMotionType. Its visibility should then
 * be adjusted by the current circular motion type. Its content is fixed and doesn't change after instantiation.
 *
 * The IntroControlPanel will contain a varied number of NumberControlSets. When the sliders are being dragged, the
 * Spinner object is paused.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Arrow = require( 'SIM_CORE/scenery/Arrow' );
  const assert = require( 'SIM_CORE/util/assert' );
  const Checkbox = require( 'SIM_CORE/scenery/buttons/Checkbox' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const LabeledCheckbox = require( 'ROTATIONAL_MOTION/common/view/LabeledCheckbox' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const NumberControlSet = require( 'ROTATIONAL_MOTION/common/view/NumberControlSet' );
  const Panel = require( 'ROTATIONAL_MOTION/common/view/Panel' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );

  // constants
  const RADIUS_TICK_INCREMENT = 0.1;
  const RADIUS_TIC_LABEL_INCREMENT = 3;

  class IntroControlPanel extends Panel {

    /**
     * @param {Spinner} spinner
     * @param {Property.<boolean>} linearVelocityVisibleProperty
     * @param {Property.<boolean>} linearAccelerationVisibleProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior.
     */
    constructor( spinner, linearVelocityVisibleProperty, linearAccelerationVisibleProperty, options ) {
      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( linearVelocityVisibleProperty instanceof Property, 'invalid linearVelocityVisibleProperty' );
      assert( linearAccelerationVisibleProperty instanceof Property, 'invalid linearAccelerationVisibleProperty' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {
        // Import the declared panel colors.
        ...RotationalMotionColors.PANEL_COLORS,

        // {number} - spacing between the content of the Panel.
        spacing: 6,

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( new FlexBox( 'vertical', { align: 'left', spacing: options.spacing } ), options );

      //----------------------------------------------------------------------------------------

      let playingWhenDragStarted; // Flag that indicates if the spinner was playing when a slider-drag starts.

      // Create the options that are commonly used in all NumberControlSet instances. When the sliders are being
      // dragged, the Spinner object is paused.
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

      //----------------------------------------------------------------------------------------

      const numberControls = new FlexBox( 'vertical', { align: 'right', spacing: options.spacing } );
      this.content.addChild( numberControls );

      // IntroControlPanel's always have a NumberControlSet for the radius
      const radiusNumberControlSet = new NumberControlSet( 'Radius', spinner.radiusProperty, spinner.radiusRange, {
        sliderOptions: sliderOptions,
        numberDisplayOptions: { decimalPlaces: 2, unit: 'm' },
      } ).addSliderMajorTick( spinner.radiusRange.min, new Text( spinner.radiusRange.min + ' m' ) )
         .addSliderMajorTick( spinner.radiusRange.max, new Text( spinner.radiusRange.max + ' m' ) );

      // Add the minor ticks
      for ( let i = 1; i < spinner.radiusRange.max / RADIUS_TICK_INCREMENT - 1; i++ ) {
        const value = Util.toFixed( i * RADIUS_TICK_INCREMENT + spinner.radiusRange.min, 2 );
        radiusNumberControlSet.addSliderMinorTick( value, i % RADIUS_TIC_LABEL_INCREMENT ? null : new Text( value ) );
      }

      // Add the radius NumberControlSet as a child.
      numberControls.addChild( radiusNumberControlSet );

      //----------------------------------------------------------------------------------------

      if ( spinner.type === CircularMotionTypes.UNIFORM ) {

        // Add a angular velocity NumberControlSet for uniform spinners.
        const angularVelocityNumberControlSet = new NumberControlSet( Symbols.OMEGA,
          spinner.angularVelocityProperty,
          spinner.angularVelocityRange, {
            sliderOptions: sliderOptions,
            numberDisplayOptions: { decimalPlaces: 2, unit: 'rad/sec' },
          } ).addSliderMajorTick( spinner.angularVelocityRange.min, new Text( spinner.angularVelocityRange.min ) )
             .addSliderMajorTick( spinner.angularVelocityRange.max, new Text( spinner.angularVelocityRange.max.toFixed( 1 ) ) );

        // Add the angular velocity NumberControlSet as a child.
        numberControls.addChild( angularVelocityNumberControlSet );


      }


      // Apply any additionally Bounds setters
      this.mutate( options );





      // //----------------------------------------------------------------------------------------
      // // Velocity checkbox
      // const velocityCheckbox = new Checkbox( linearVelocityVisibleProperty
      //   , { left: options.padding } );
      // const velocityLabel = new Text( {
      //   text: 'Linear Velocity Vector',
      //   fontSize: 14,
      //   fontWeight: 100,
      //   attributes: {
      //     'text-anchor': 'start',
      //     'alignment-baseline': 'middle'
      //   },
      //   x: options.padding + velocityCheckbox.width + 10,
      //   y: velocityCheckbox.height / 2
      // } );

      // const velocityVector = new VectorNode(
      //   new Vector( options.width - options.padding - 30, velocityCheckbox.height / 2 ),
      //   new Vector( options.width - options.padding, velocityCheckbox.height / 2 ), {
      //     fill: 'rgb( 10, 170, 250 )' // TODO color constants file
      //   } );
      // const velocityContent = new SVGNode( {
      //   top: 265,
      //   width: options.width,
      //   children: [ velocityCheckbox, velocityLabel, velocityVector ]
      // } );

      // //----------------------------------------------------------------------------------------
      // // Render the children in the correct z-layering
      // this.setChildren( [
      //   background,
      //   radiusSlider,
      //   angularVelocitySlider,
      //   velocityContent
      // ] );
    }
  }

  return IntroControlPanel;
} );