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

  // constants
  const PLAY_AREA_BOUNDS = new Bounds( -1.6, -0.8, 1.6, 0.8 ); // in meters
  const MODEL_TO_VIEW_SCALE = 200; // meter to view coordinates (1 m = 200 coordinates)
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
      const playAreaViewBounds = new Bounds( SCREEN_VIEW_X_MARGIN,
        SCREEN_VIEW_Y_MARGIN,
        SCREEN_VIEW_X_MARGIN + MODEL_TO_VIEW_SCALE * PLAY_AREA_BOUNDS.width,
        SCREEN_VIEW_Y_MARGIN + MODEL_TO_VIEW_SCALE * PLAY_AREA_BOUNDS.height );

      const modelViewTransform = new ModelViewTransform( PLAY_AREA_BOUNDS, playAreaViewBounds );

      //----------------------------------------------------------------------------------------
      const spinnerNode = new SpinnerNode( modelViewTransform );

      this.addChild( spinnerNode );
    }
  }

  return IntroScreenView;
} );