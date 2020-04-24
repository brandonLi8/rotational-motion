// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Top Level model for the 'Rolling' screen.
 *
 * Responsible for:
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const Ramp = require( 'ROTATIONAL_MOTION/rolling/model/Ramp' );

  class RollingModel {

    constructor() {

      // @public (read-only) {Ramp} - create the Ramp of the Rolling screen.
      this.ramp = new Ramp();
    }
  }

  return RollingModel;
} );