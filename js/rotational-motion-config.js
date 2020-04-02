// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * RequireJS configuration file for the sim.
 * Paths are relative to the location of this file.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

require.config( {

  deps: [ 'rotational-motion-main' ],

  paths: {

    // Sim Core plugins
    image: '../node_modules/sim-core/src/core-internal/image-plugin',
    text: '../node_modules/sim-core/src/core-internal/text-plugin',

    //----------------------------------------------------------------------------------------
    SIM_CORE: '../node_modules/sim-core/src',
    REPOSITORY: '..',
    ROTATIONAL_MOTION: '.',
    IMAGES: '../images'
  }
} );