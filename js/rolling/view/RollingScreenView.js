// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Top Level view for the 'Rolling' screen.
 *
 * Responsible for:
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const RollingModel = require( 'ROTATIONAL_MOTION/rolling/model/RollingModel' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );

  class RollingScreenView extends ScreenView {

    /**
     * @param {RollingModel} rollingModel
     */
    constructor( rollingModel ) {
      assert( rollingModel instanceof RollingModel, `invalid rollingModel: ${ rollingModel }` );

      super();
    }
  }

  return RollingScreenView;
} );