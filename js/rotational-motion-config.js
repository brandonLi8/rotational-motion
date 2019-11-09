// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * RequireJS configuration file for the sim.
 * Paths are relative to the location of this file.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

requirejs.config( {

  deps: [ 'SIM_CORE/sim-core-main', 'rotational-motion-main' ],

  shim: {
    'Point': {
      //These script dependencies should be loaded before loading
      //backbone.js
      deps: ['SIM_CORE/../preloads/assert'],
      //Once loaded, use the global 'Backbone' as the
      //module value.
      exports: 'assert'
    }
  },
  paths: {
    SIM_CORE: '../node_modules/sim-core/src',
  }
} );
