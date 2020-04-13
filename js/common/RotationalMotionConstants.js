// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Shared constants used in multiple locations within the 'Rotational Motion' simulation.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );

  const RotationalMotionConstants = {

    // screen-view
    SCREEN_VIEW_X_MARGIN: 60,
    SCREEN_VIEW_Y_MARGIN: 25,

    // arrow vectors
    VECTOR_ARROW_OPTIONS: {
      strokeWidth: 0.8,
      stroke: RotationalMotionColors.VECTOR_STROKE,
      headHeight: 12,
      headWidth: 12,
      tailWidth: 3
    },

    // panel labels
    PANEL_TEXT_OPTIONS: {
      fontSize: 13,
      fontWeight: 500
    },

    // slider ticks
    SLIDER_TICK_TEXT_OPTIONS: {
      fontSize: 12.5,
      fontWeight: 500
    },

    // number display units
    NUMBER_DISPLAY_UNIT_TEXT_OPTIONS: {
      fontSize: 11.5,
      fontWeight: 500
    },

    // miscellaneous
    NUMBER_DISPLAY_DECIMAL_PLACES: 2,
    MATH_TEXT_OPTIONS: { fontFamily: '"Times New Roman", Times, serif', fontWeight: 500, fontStyle: 'italic' }
  };

  return RotationalMotionConstants;
} );