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
  const Hill = require( 'ROTATIONAL_MOTION/rolling/model/Hill' );

  class RollingModel {

    constructor() {

      // @public (read-only) {Hill} - create the Hill of the Rolling screen.
      this.hill = new Hill();
    }
  }

  return RollingModel;
} );