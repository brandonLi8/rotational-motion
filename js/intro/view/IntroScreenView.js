// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Top Level view for the 'Intro' screen.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const IntroModel = require( 'ROTATIONAL_MOTION/intro/model/IntroModel' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const ScreenView = require( 'SIM_CORE/scenery/ScreenView' );
  const SpinnerNode = require( 'ROTATIONAL_MOTION/intro/view/SpinnerNode' );
  const PlayPauseButton = require( 'SIM_CORE/scenery/buttons/PlayPauseButton' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  // constants
  const MODEL_TO_VIEW_SCALE = 250; // meter to view coordinates (1 m = 200 coordinates)
  const SCREEN_VIEW_X_MARGIN = RotationalMotionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = RotationalMotionConstants.SCREEN_VIEW_Y_MARGIN;

  class IntroScreenView extends ScreenView {

    /**
     * @param {IntroModel} introModel
     */
    constructor( introModel ) {

      assert( introModel instanceof IntroModel, `invalid introModel: ${ introModel }` );

      super();

      //----------------------------------------------------------------------------------------
      // Create the modelViewTransform
      const playAreaViewBounds = new Bounds( 60,
        20,
        60 + MODEL_TO_VIEW_SCALE * introModel.spinnerAreaBounds.width,
        20 + MODEL_TO_VIEW_SCALE * introModel.spinnerAreaBounds.height );

      const modelViewTransform = new ModelViewTransform( introModel.spinnerAreaBounds, playAreaViewBounds );

      //----------------------------------------------------------------------------------------
      const spinnerNode = new SpinnerNode( introModel.spinner, modelViewTransform );

      this.addChild( spinnerNode );

      const playPauseButton = new PlayPauseButton( introModel.playProperty, {
        center: new Vector( playAreaViewBounds.centerX, playAreaViewBounds.maxY + 40 )
      } );
      this.addChild( playPauseButton );

    }
  }

  return IntroScreenView;
} );