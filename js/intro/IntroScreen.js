// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * The 'Intro' screen.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const IntroModel = require( 'ROTATIONAL_MOTION/intro/model/IntroModel' );
  const IntroScreenView = require( 'ROTATIONAL_MOTION/intro/view/IntroScreenView' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionIconFactory = require( 'ROTATIONAL_MOTION/common/view/RotationalMotionIconFactory' );
  const Screen = require( 'SIM_CORE/Screen' );

  class IntroScreen extends Screen {

    constructor() {

      super( {
        name: 'Intro',
        background: RotationalMotionColors.INTRO_SCREEN_BACKGROUND,
        icon: RotationalMotionIconFactory.createIntroScreenIcon(),
        model: IntroModel,
        view: IntroScreenView
      } );

    }
  }

  return IntroScreen;
} );