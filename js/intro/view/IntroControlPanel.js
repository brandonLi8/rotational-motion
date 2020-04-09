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
  const assert = require( 'SIM_CORE/util/assert' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const FractionNode = require( 'ROTATIONAL_MOTION/common/view/FractionNode' );
  const LabeledCheckboxNode = require( 'ROTATIONAL_MOTION/common/view/LabeledCheckboxNode' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const NumberControlSet = require( 'ROTATIONAL_MOTION/common/view/NumberControlSet' );
  const Panel = require( 'ROTATIONAL_MOTION/common/view/Panel' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionIconFactory = require( 'ROTATIONAL_MOTION/common/view/RotationalMotionIconFactory' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );

  // constants
  const RADIUS_TICK_INCREMENT = 0.1;
  const RADIUS_TIC_LABEL_INCREMENT = 3;
  const FRACTION_OPTIONS = {
    textOptions: {
      fontSize: 12,
      fontWeight: 500
    }
  };
  const OMEGA_TICK_INCREMENT = Math.PI / 16;
  const OMEGA_TICK_LABEL_INCREMENT = 2;
  const ALPHA_TICK_INCREMENT = Math.PI / 16;
  const ALPHA_TICK_LABEL_INCREMENT = 2;

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
        spacing: 10,

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

      // IntroControlPanel's always have a NumberControlSet for the radius
      const radiusNumberControlSet = new NumberControlSet( 'Radius', spinner.radiusProperty, spinner.radiusRange, {
        sliderOptions,
        numberDisplayOptions: { decimalPlaces: 2, unit: new Text( 'm' ), yMargin: 0 }
      } ).addSliderMajorTick( spinner.radiusRange.min, fixWidth( new Text( spinner.radiusRange.min ) ) )
         .addSliderMajorTick( spinner.radiusRange.max, fixWidth( new Text( spinner.radiusRange.max ) ) );

      // Add the minor ticks
      for ( let i = 1; i < spinner.radiusRange.max / RADIUS_TICK_INCREMENT - 1; i++ ) {
        const value = Util.toFixed( i * RADIUS_TICK_INCREMENT + spinner.radiusRange.min, 2 );
        radiusNumberControlSet.addSliderMinorTick( value, i % RADIUS_TIC_LABEL_INCREMENT ? null : new Text( value ) );
      }

      // Add the radius NumberControlSet as a child.
      this.content.addChild( radiusNumberControlSet );

      //----------------------------------------------------------------------------------------
      if ( spinner.type === CircularMotionTypes.UNIFORM ) {
        const radPerSecNode = new FractionNode( 'rad', 'sec', FRACTION_OPTIONS );
        const maxNode = fixWidth( fractionalPiNode( spinner.angularVelocityRange.min ) );
        const minNode = fixWidth( fractionalPiNode( spinner.angularVelocityRange.max ) );

        // Add a angular velocity NumberControlSet for uniform spinners.
        const angularVelocityNumberControlSet = new NumberControlSet( `Angular Velocity (${ Symbols.OMEGA })`,
          spinner.angularVelocityProperty,
          spinner.angularVelocityRange, {
            sliderOptions,
            numberDisplayOptions: { decimalPlaces: 2, unit: radPerSecNode, yMargin: -2 }
          } )
        .addSliderMajorTick( spinner.angularVelocityRange.min, maxNode )
        .addSliderMajorTick( spinner.angularVelocityRange.max, minNode );

        // Add the minor ticks
        for ( let i = 1; i <= spinner.angularVelocityRange.max / OMEGA_TICK_INCREMENT - 1; i++ ) {
          const value = i * OMEGA_TICK_INCREMENT + spinner.angularVelocityRange.min;
          const label = i % OMEGA_TICK_LABEL_INCREMENT ? null : fractionalPiNode( value );
          angularVelocityNumberControlSet.addSliderMinorTick( value, label );
        }

        // Add the angular velocity NumberControlSet as a child.
        this.content.addChild( angularVelocityNumberControlSet );
      }
      else {
        const radPerSecSquaredNode = new FractionNode( 'rad', `sec${ Symbols.TIMES }sec`, FRACTION_OPTIONS );

        const maxNode = fixWidth( fractionalPiNode( spinner.angularAccelerationRange.min ) );
        const minNode = fixWidth( fractionalPiNode( spinner.angularAccelerationRange.max ) );

        // Add a angular acceleration NumberControlSet for non-uniform spinners.
        const angularAccelerationNumberControlSet = new NumberControlSet( Symbols.ALPHA,
          spinner.angularAccelerationProperty,
          spinner.angularAccelerationRange, {
            sliderOptions,
            numberDisplayOptions: { decimalPlaces: 2, unit: radPerSecSquaredNode, yMargin: -2 }
          } )
        .addSliderMajorTick( spinner.angularAccelerationRange.min, maxNode )
        .addSliderMajorTick( spinner.angularAccelerationRange.max, minNode );

        // Add the minor ticks
        for ( let i = 1; i <= spinner.angularAccelerationRange.length / ALPHA_TICK_INCREMENT - 1; i++ ) {
          const value = i * ALPHA_TICK_INCREMENT + spinner.angularAccelerationRange.min;
          const label = i % ALPHA_TICK_LABEL_INCREMENT ? null : fractionalPiNode( value );
          if ( value === 0 ) {
            angularAccelerationNumberControlSet.addSliderMajorTick( value, label );
          }
          else {
            angularAccelerationNumberControlSet.addSliderMinorTick( value, label );
          }
        }

        // Add the angular velocity NumberControlSet as a child.
        this.content.addChild( angularAccelerationNumberControlSet );
      }

      // Add a Node that takes up Space for un-even spacing
      this.content.addChild( fixHeight( new Node(), 10 ) );

      //----------------------------------------------------------------------------------------
      // Checkboxes

      const linearVelocityVisibleCheckbox = new LabeledCheckboxNode(
        new FlexBox( 'horizontal', { spacing: 5 } ).setChildren( [
          new Text( 'Velocity Vector', { fontSize: 12 } ),
          RotationalMotionIconFactory.createVectorArrowIcon( RotationalMotionColors.LINEAR_VELOCITY_VECTOR_COLORS )
        ] ),
        linearVelocityVisibleProperty,
        { boxSize: 16 }
      );
      this.content.addChild( linearVelocityVisibleCheckbox );

      if ( spinner.type === CircularMotionTypes.NON_UNIFORM ) {
        const linearAccelerationVisibleCheckbox = new LabeledCheckboxNode(
          new FlexBox( 'horizontal', { spacing: 5 } ).setChildren( [
            new Text( 'Linear Acceleration Vector', { fontSize: 12 } ),
            RotationalMotionIconFactory.createVectorArrowIcon(
              RotationalMotionColors.LINEAR_ACCELERATION_VECTOR_COLORS )
          ] ),
          linearAccelerationVisibleProperty,
          { boxSize: 16 }
        );
        this.content.addChild( linearAccelerationVisibleCheckbox );
      }

      const totalAccelLabel = new Text( spinner.type === CircularMotionTypes.UNIFORM ? 'Acceleration Vector' :
        'Total Acceleration Vector', { fontSize: 12 } );

      const totalAccelerationVisibleCheckbox = new LabeledCheckboxNode(
        new FlexBox( 'horizontal', { spacing: 5 } ).setChildren( [
          totalAccelLabel,
          RotationalMotionIconFactory.createVectorArrowIcon(
            RotationalMotionColors.TOTAL_ACCELERATION_VECTOR_COLORS )
        ] ),
        totalAccelerationVisibleProperty,
        { boxSize: 16 }
      );
      this.content.addChild( totalAccelerationVisibleCheckbox );

      // Add a Node that takes up Space for un-even spacing
      this.content.addChild( fixHeight( new Node(), 15 ) );

      // Apply any additionally Bounds setters
      this.mutate( options );
    }
  }

  //----------------------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------------------

  /**
   * Wraps a Node around another Node so that its a fixed width.
   * @public
   *
   * @param {Node} node
   * @returns {Node} the fixed width Node
   */
  function fixWidth( node ) {
    // reset the location of node
    node.left = 0;
    node.top = 0;

    const fixedWidthNode = new Node();
    fixedWidthNode.width = 20; // eye-balled

    // center the node
    node.centerX = fixedWidthNode.centerX;

    const wrapper = new Node().setChildren( [ fixedWidthNode, node ] );
    wrapper.width = fixedWidthNode.width;
    return wrapper;
  }

  /**
   * Wraps a Node around another Node so that its a fixed height.
   * @public
   *
   * @param {Node} node
   * @returns {Node} the fixed height Node
   */
  function fixHeight( node, height ) {
    // reset the location of node
    node.left = 0;
    node.top = 0;

    const fixedHeightNode = new Node();
    fixedHeightNode.height = height; // eye-balled

    // center the node
    node.centerY = fixedHeightNode.centerY;

    const wrapper = new Node().setChildren( [ fixedHeightNode, node ] );
    wrapper.height = fixedHeightNode.height;
    return wrapper;
  }

  /**
   * Returns a Pi Fraction Node given a decimal. For instance, fractionalPiNode( 1.57 ) => new FractionNode( 'PI', '2' )
   * @public
   *
   * @param {number} fraction
   * @returns {FractionNode}
   */
  function fractionalPiNode( fraction ) {
    fraction = fraction / Math.PI; // divide by PI first.

    const length = fraction.toString().length - 2;
    let denominator = Math.pow( 10, length );
    let numerator = fraction * denominator;

    const divisor = Util.gcd( numerator, denominator );
    numerator = numerator / divisor;
    denominator = denominator / divisor;

    return Util.equalsEpsilon( numerator, 0 ) ?
      new Text( 0, FRACTION_OPTIONS ) :
      new FractionNode( `${ numerator === 1 ? '' : numerator } ${ Symbols.PI }`, denominator, FRACTION_OPTIONS );
  }

  return IntroControlPanel;
} );