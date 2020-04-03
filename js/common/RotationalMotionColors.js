// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * Colors for the 'Rotational Motion' sim.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  const RotationalMotionColors = {


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
    }
  };

  return RotationalMotionColors;
} );