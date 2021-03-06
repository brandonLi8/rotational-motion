// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * ResetOmegaButton is the button that displays "Reset ${ Symbols.OMEGA }" on a Rectangular Button. It appears on the
 * non-uniform SpinnerNode next to the TimeControlBox. When pressed, it resets the angular velocity Property of the
 * non-uniform spinner.
 *
 * ResetOmegaButton is a sub-type of Button. See sim-core/scenery/components/button/Button for context.
 *
 * ResetOmegaButtons are created at the start of the sim and are never disposed, so no dispose method is necessary and
 * links are left as-is.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Button = require( 'SIM_CORE/scenery/components/buttons/Button' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );

  class ResetOmegaButton extends Button {

    /**
     * @param {Spinner} spinner
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See the code
     *                             where the options are set in the early portion of the constructor for details.
     */
    constructor( spinner, options ) {
      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );
      assert( spinner.type === CircularMotionTypes.NON_UNIFORM, 'reset omega button only applies to non-uniform' );

      options = {

        baseColor: '#ffc800',     // {string} - the base color of the button.
        cornerRadius: 4,          // {number} - the corner radius of the ResetOmegaButton
        buttonStroke: '#CCA000',  // {string|Gradient} - the stroke of the border of the ResetOmega Button
        buttonStrokeWidth: 1.1,   // {number} - the stroke-width of the border of the ResetOmega Button
        xMargin: 35,              // {number} - the x-margin between the background rectangle and the Text
        yMargin: 15,              // {number} - the y-margin between the background rectangle and the Text

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      //----------------------------------------------------------------------------------------

      // Create the content, which is just the Text.
      const content = new Text( `Reset ${ Symbols.OMEGA }`, {
        fontSize: 16.5
      } );

      // Create the background, which is just a rounded rectangle
      const background = new Rectangle( content.width + options.xMargin, content.height + options.yMargin, {
        cornerRadius: options.cornerRadius,
        stroke: options.buttonStroke,
        strokeWidth: options.buttonStrokeWidth
      } );

      super( background, content, options );

      //----------------------------------------------------------------------------------------

      // Custom stops for the ResetOmegaButton. Values determined through experimentation.
      const gradientStops = [ [ 0.75, 0 ], [ 0.5, 20 ], [ 0.3, 40 ], [ 0, 59 ], [ -0.01, 69 ], [ -0.015, 75 ],
                              [ -0.045, 81 ], [ -0.08, 87 ], [ -0.1, 92.5 ], [ -0.13, 95.5 ], [ -0.16, 100 ] ];

      // Apply the 3D Gradient strategy to allow the ResetOmega Button to look 3D
      Button.apply3DGradients( this, options.baseColor, gradientStops );

      // Listen to when the Button is pressed and reset the angular velocity Property of the spinner. The listener
      // is never unlinked since ResetOmegaButtons are never disposed.
      this.interactionStateProperty.link( interactionState => {
        if ( interactionState === Button.interactionStates.PRESSED ) {
          spinner.angularVelocityProperty.reset();
        }
      } );
    }
  }

  return ResetOmegaButton;
} );