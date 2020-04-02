// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * View for the spinning circle that Spins the Ball view in a ciruclar motion path.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const CircleNode = require( 'SIM_CORE/scenery/CircleNode' );
  const IntroBallNode = require( 'ROTATIONAL_MOTION/intro/view/IntroBallNode' );
  const LineNode = require( 'SIM_CORE/scenery/LineNode' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const SVGNode = require( 'SIM_CORE/scenery/SVGNode' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  // constants
  const SCREEN_VIEW_X_MARGIN = RotationalMotionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = RotationalMotionConstants.SCREEN_VIEW_Y_MARGIN;

  class SpinnerNode extends Node {

    /**
     * @param {Spinner} spinner
     * @param {ModelViewTransform} modelViewTransform
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Property.<boolean>} velocityVisibleProperty
     * @param {Property.<boolean>} accelerationVisibleProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior.
     */
    constructor(
      spinner,
      modelViewTransform,
      isPlayingProperty,
      velocityVisibleProperty,
      accelerationVisibleProperty,
      options
    ) {

      assert( spinner instanceof Spinner, `invalid spinner: ${ modelViewTransform }` );
      assert( modelViewTransform instanceof ModelViewTransform, `invalid modelViewTransform: ${ modelViewTransform }` );
      assert( isPlayingProperty instanceof Property, `invalid isPlayingProperty: ${ isPlayingProperty }` );
      assert( velocityVisibleProperty instanceof Property, `invalid isPlayingProperty: ${ isPlayingProperty }` );
      assert( accelerationVisibleProperty instanceof Property, `invalid isPlayingProperty: ${ isPlayingProperty }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      // Defaults for options.
      const defaults = {

        center: modelViewTransform.modelToViewPoint( Vector.ZERO ),
        width: modelViewTransform.modelToViewDeltaX( spinner.spinnerAreaBounds.width ),
        height: -modelViewTransform.modelToViewDeltaY( spinner.spinnerAreaBounds.height )
      };

      // Rewrite options so that it overrides the defaults.
      options = { ...defaults, ...options };

      super( options );

      //----------------------------------------------------------------------------------------
      // Create a Node that represents the SVG content of the Spinner Node.
      const svgContent = new SVGNode( {
        width: this.width,
        height: this.height,
        left: -SCREEN_VIEW_X_MARGIN,
        top: -SCREEN_VIEW_Y_MARGIN
      } );

      this.addChild( svgContent );

      //----------------------------------------------------------------------------------------
      // Create the Ball Node for the Intro screen
      const ballNode = new IntroBallNode( spinner.ball,
        modelViewTransform,
        isPlayingProperty,
        velocityVisibleProperty,
        accelerationVisibleProperty );

      //----------------------------------------------------------------------------------------
      // Create the Line and the Dot at the Center of the Play Area

      // Get the origin in terms of view coordinates
      const viewCenter = modelViewTransform.modelToViewPoint( Vector.ZERO );

      // The string Line, to be set later.
      const string = new LineNode( viewCenter, Vector.ZERO, {
        stroke: 'black',
        strokeWidth: 2
      } );

      // The pin at the center
      const pin = new CircleNode( {
        radius: 2, // eye-balled
        fill: 'rgb( 100, 100, 100 )',
        center: viewCenter
      } );

      // Set the content of the svgContent node in the correct z-layering.
      svgContent.setChildren( [ string, pin, ballNode ] );

      //----------------------------------------------------------------------------------------
      // Observe when the Ball's center changes and update the string to match.
      // Doesn't need to be unlinked as the Spinner is never disposed.
      spinner.ball.centerPositionProperty.link( centerPosition => {
        string.end = modelViewTransform.modelToViewPoint( centerPosition );
      } );
    }
  }

  return SpinnerNode;
} );