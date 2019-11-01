// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * RequireJS configuration file for the sim.
 * Paths are relative to the location of this file.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

requirejs.config( {

  deps: [ 'rotational-motion-main.js' ],

  paths: {
    SIM_CORE: './node_modules/sim-core/js',
  }
} );