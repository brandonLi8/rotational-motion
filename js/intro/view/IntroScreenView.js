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
  const TimeControlBox = require( 'SIM_CORE/scenery/buttons/TimeControlBox' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const SliderNode = require( 'SIM_CORE/scenery/SliderNode' );
  const Property = require( 'SIM_CORE/util/Property' );
  const ControlPanel = require( 'ROTATIONAL_MOTION/intro/view/ControlPanel' );

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
      const playAreaViewBounds = new Bounds( SCREEN_VIEW_X_MARGIN,
        SCREEN_VIEW_Y_MARGIN,
        SCREEN_VIEW_X_MARGIN + MODEL_TO_VIEW_SCALE * introModel.spinnerAreaBounds.width,
        SCREEN_VIEW_Y_MARGIN + MODEL_TO_VIEW_SCALE * introModel.spinnerAreaBounds.height );

      const modelViewTransform = new ModelViewTransform( introModel.spinnerAreaBounds, playAreaViewBounds );

      //----------------------------------------------------------------------------------------
      const spinnerNode = new SpinnerNode( introModel.spinner, modelViewTransform, introModel.playProperty );

      this.addChild( spinnerNode );

      const timeControlBox = new TimeControlBox( {
        playProperty: introModel.playProperty,
        backwardsListener: () => {
          introModel.stepBackwards();
        },
        forwardsListener: () => {
          introModel.stepForwards();
        },
        center: new Vector( playAreaViewBounds.centerX, playAreaViewBounds.maxY + 40 )
      } );
      this.addChild( timeControlBox );

      //----------------------------------------------------------------------------------------
      const controlPanel = new ControlPanel( introModel.spinner, introModel.playProperty );
      controlPanel._left = this.viewBounds.maxX - controlPanel.width - SCREEN_VIEW_X_MARGIN;
      controlPanel._top = SCREEN_VIEW_Y_MARGIN;

      this.addChild( controlPanel );

    }
  }

  return IntroScreenView;
} );