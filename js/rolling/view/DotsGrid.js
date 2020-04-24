// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * DotsGrid is a grid of dots. See https://ux.stackexchange.com/a/129551 for the inspiration.
 *
 * DotsGrid is a 2 by 3 grid of small dots. It is used to signal that something is draggable. In the case of the
 * 'rolling' screen, it is displayed inside near the top of the lift-bar on the ramp, to signal to the user that the
 * height of the lift-bar can be changed by dragging the dots.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Circle = require( 'SIM_CORE/scenery/Circle' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );

  class DotsGrid extends FlexBox {

    /**
     * @param {Object} [options] - key-value pairs that control the DotsGrid's appearance.
     */
    constructor( options ) {
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // dots
        radius: 2.2,    // {number} - the radius of the dots of the DotsGrid
        fill: 'white', // {string} - the fill of the dots of the DotsGrid

        // grid
        rows: 2,      // {number} the numbers rows in the grid
        cols: 3,      // {number} the numbers rows in the grid
        spacing: 2.9, // {number} the spacing (both vertical and horizontal) between the Dots

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      // The Grid is built as a vertical FlexBox of horizontal FlexBoxes
      super( 'vertical', { spacing: options.spacing } );

      //----------------------------------------------------------------------------------------

      for ( let row = 0; row < options.rows; row++ ) {

        // Create a row of dots for each row
        const dots = FlexBox.horizontal( { spacing: options.spacing } );
        for ( let col = 0; col < options.cols; col++ ) {
          dots.addChild( new Circle( options.radius, { fill: options.fill } ) );
        }

        // Add the row of dots
        this.addChild( dots );
      }

      // Apply any additional bounds mutators.
      this.mutate( options );
    }
  }

  return DotsGrid;
} );