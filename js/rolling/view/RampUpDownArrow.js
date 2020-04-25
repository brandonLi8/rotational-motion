// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * RampUpDownArrow is a double headed arrow that points up and down. It is placed on the lift-bar of the ramp, bellow
 * the RampDotsGrid to signal to the user that the lift-bar's height can be changed. Like the RampDotsGrid, the arrow
 * is also draggable. However, this is not meant to be the main interaction.
 *
 * RampUpDownArrow will attempt to change the height of the ramp when dragged. RampUpDownArrow is created at the start
 * of the simulation and is never disposed, so this DragListener doesn't need to be disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Arrow = require( 'SIM_CORE/scenery/Arrow' );
  const assert = require( 'SIM_CORE/util/assert' );
  const DragListener = require( 'SIM_CORE/scenery/events/DragListener' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Ramp = require( 'ROTATIONAL_MOTION/rolling/model/Ramp' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );

  class RampUpDownArrow extends Arrow {

    /**
     * @param {Ramp} ramp
     * @param {ModelViewTransform} modelViewTransform
     * @param {Object} [options] - key-value pairs that control the RampUpDownArrow's appearance.
     */
    constructor( ramp, modelViewTransform, options ) {
      assert( ramp instanceof Ramp, `invalid ramp: ${ ramp }` );
      assert( modelViewTransform instanceof ModelViewTransform, 'invalid modelViewTransform' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        length: 69, // {number} - the length of the up-down arrow

        // super-class options
        headHeight: 17,
        headWidth: 22.5,
        tailWidth: 4,
        headStyle: 'open',
        doubleHead: true,
        fill: RotationalMotionColors.RAMP_STROKE,
        stroke: 'white',
        strokeWidth: 0.3,
        cursor: 'scenery-drag',

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      super( 0, 0, 0, options.length, options );

      //----------------------------------------------------------------------------------------

      // Flag that references the height of the ramp when a drag starts.
      let dragStartHeight;

      // Create a Drag listener to allow the dots to be dragged. Never disposed as RampUpDownArrow is never disposed.
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

  return RampUpDownArrow;
} );