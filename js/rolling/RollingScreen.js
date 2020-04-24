// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * The 'Rolling' screen.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const RollingModel = require( 'ROTATIONAL_MOTION/rolling/model/RollingModel' );
  const RollingScreenView = require( 'ROTATIONAL_MOTION/rolling/view/RollingScreenView' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const Screen = require( 'SIM_CORE/Screen' );

  class RollingScreen extends Screen {

    constructor() {

      super( {
        name: 'Rolling',
        model: RollingModel,
        background: RotationalMotionColors.SCREEN_BACKGROUND,
        view: RollingScreenView
      } );

    }
  }

  return RollingScreen;
} );