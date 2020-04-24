// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * RampDotsGrid is a grid of dots displayed on the ramp. See https://ux.stackexchange.com/a/129551 for the inspiration
 * behind theses dots.
 *
 * RampDotsGrid is a 2 by 3 grid of small dots. It is used to signal that something is draggable. In the case of the
 * 'rolling' screen, it is displayed inside near the top of the lift-bar on the ramp, to signal to the user that the
 * height of the lift-bar can be changed by dragging the dots.
 *
 * RampDotsGrid will attempt to change the height of the ramp when dragged. RampDotsGrids are created at the start
 * of the simulation and are never disposed, so this DragListener doesn't need to be disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SIM_CORE/scenery/AlignBox' );
  const assert = require( 'SIM_CORE/util/assert' );
  const Circle = require( 'SIM_CORE/scenery/Circle' );
  const DragListener = require( 'SIM_CORE/scenery/events/DragListener' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Ramp = require( 'ROTATIONAL_MOTION/rolling/model/Ramp' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );

  class RampDotsGrid extends AlignBox {

    /**
     * @param {Ramp} ramp
     * @param {ModelViewTransform} modelViewTransform
     * @param {Object} [options] - key-value pairs that control the RampDotsGrid's appearance.
     */
    constructor( ramp, modelViewTransform, options ) {
      assert( ramp instanceof Ramp, `invalid ramp: ${ ramp }` );
      assert( modelViewTransform instanceof ModelViewTransform, 'invalid modelViewTransform' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // dots
        radius: 2.2,    // {number} - the radius of the dots of the RampDotsGrid

        // grid
        rows: 2,      // {number} the numbers rows in the grid
        cols: 3,      // {number} the numbers rows in the grid
        spacing: 2.9, // {number} the spacing (both vertical and horizontal) between the Dots

        // touch
        xTouchDilation: 6, // {number} the amount to increase the pointer-area on both sides in the x direction
        yTouchDilation: 9, // {number} the amount to increase the pointer-area on both sides in the y direction
        cursor: 'scenery-drag',

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------

      // The Grid is built as a vertical FlexBox of horizontal FlexBoxes
      const grid = FlexBox.vertical( { spacing: options.spacing } );

      for ( let row = 0; row < options.rows; row++ ) {

        // Create a row of dots for each row
        const dots = FlexBox.horizontal( { spacing: options.spacing } );
        for ( let col = 0; col < options.cols; col++ ) {
          dots.addChild( new Circle( options.radius, { fill: RotationalMotionColors.RAMP_STROKE } ) );
        }

        // Add the row of dots
        grid.addChild( dots );
      }

      // Dilate the pointer-area fo the grid to allow for easier grabbing on mobile.
      const spacer = new Rectangle( grid.width + 2 * options.xTouchDilation, grid.height + 2 * options.yTouchDilation, {
        fill: RotationalMotionColors.RAMP_FILL
      } );
      grid.center = spacer.center;

      super( new Node().setChildren( [ spacer, grid ] ), spacer.width, spacer.height, options );

      //----------------------------------------------------------------------------------------

      // Flag that references the height of the ramp when a drag starts.
      let dragStartHeight;

      // Create a Drag listener to allow the dots to be dragged. Never disposed as RampDotsGrids are never disposed.
      new DragListener( this, {
        start: () => {
          dragStartHeight = ramp.height;
        },
        drag: displacement => {
          ramp.dragHeightTo( dragStartHeight + modelViewTransform.viewToModelDeltaY( displacement.y ) );
        }
      } );

      //----------------------------------------------------------------------------------------

      // Apply any additional bounds mutators.
      this.mutate( options );
    }
  }

  return RampDotsGrid;
} );