// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Colors for the 'Rotational Motion' sim.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  const RotationalMotionColors = {

    // Colors for the pin circle in the center of the Spinner in the intro screen.
    SPINNER_PIN_COLORS: {
      fill: 'rgb( 100, 100, 100 )',
      stroke: 'black',
      strokeWidth: 0.2
    },

    // Colors for the string that provides the tension of the Spinner in the intro screen.
    SPINNER_STRING_COLORS: {
      stroke: 'black',
      strokeWidth: 2
    },

    // Colors for the ball of the Spinner in the intro screen.
    SPINNER_BALL_COLORS: {
      fill: 'green',
      stroke: 'black',
      strokeWidth: 0.5
    },

    // Colors for tangential velocity vectors of Ball's in the intro screen.
    LINEAR_VELOCITY_VECTOR_COLORS: {
      fill: 'rgb( 10, 170, 250 )',
      stroke: 'black',
      strokeWidth: 0.5
    },

    // Colors for tangential velocity vectors of Ball's in the intro screen.
    LINEAR_ACCELERATION_VECTOR_COLORS: {
      fill: 'red',
      stroke: 'black',
      strokeWidth: 0.5
    },

    // Colors for all Panel instances
    PANEL_COLORS: {
      stroke: 'rgb( 100, 100, 100 )',
      fill: 'rgb( 240, 240, 240 )',
      strokeWidth: 1
    }
  };

  return RotationalMotionColors;
} );