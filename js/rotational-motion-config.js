// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * RequireJS configuration file for the sim.
 * Paths are relative to the location of this file.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

requirejs.config( {

  deps: [ 'rotational-motion-main' ],

  paths: {

    image: '../node_modules/sim-core/src/core-internal/image-plugin',
    text: '../node_modules/sim-core/src/core-internal/text-plugin',

    SIM_CORE: '../node_modules/sim-core/src',
    ROTATIONAL_MOTION: '.',
    IMAGES: '../images',
    REPOSITORY: '..'
  }
} );
