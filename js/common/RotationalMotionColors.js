// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Colors for the 'Rotational Motion' sim.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const LinearGradient = require( 'SIM_CORE/scenery/gradients/LinearGradient' );

  const RotationalMotionColors = {

    // screen background
    SCREEN_BACKGROUND: 'rgb( 255, 250, 227 )',

    // panels
    PANEL_COLORS: {
      stroke: 'rgb( 150, 150, 150 )',
      fill: 'rgb( 240, 240, 240 )'
    },

    // spinners
    SPINNER_PIN_FILL: 'rgb( 100, 100, 100 )',
    SPINNER_STRING_COLOR: 'black',

    // intro balls
    INTRO_BALL_FILL: 'green',

    // vectors
    VECTOR_STROKE: 'black',
    LINEAR_VELOCITY_VECTOR_FILL: 'rgb( 10, 170, 250 )',
    LINEAR_ACCELERATION_VECTOR_FILL: 'rgb( 255, 0, 215 )',
    TOTAL_ACCELERATION_VECTOR_FILL: 'rgb( 255, 144, 35 )'
  };

  return RotationalMotionColors;
} );