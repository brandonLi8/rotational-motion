// Copyright © 2019-2020 Brandon Li. All rights reserved.

/**
 * SpinnerNode is the corresponding view for the Spinner model, in the 'intro' screen.
 *
 * SpinnerNode is responsible for displaying:
 *  - A pin circle, which is the center of the circular motion (and the origin of the Spinner)
 *  - A string line, which is responsible for the tension of the circular motion.
 *  - The IntroBallNode, which is rotated around the in circle.
 *
 * SpinnerNodes are created at the start of the Sim and are never disposed, so all links are left as is.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Circle = require( 'SIM_CORE/scenery/Circle' );
  const IntroBallNode = require( 'ROTATIONAL_MOTION/intro/view/IntroBallNode' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  // constants
  const PIN_RADIUS = 2; // eye-balled

  class SpinnerNode extends Node {

    /**
     * @param {Spinner} spinner
     * @param {ModelViewTransform} modelViewTransform
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Property.<boolean>} velocityVisibleProperty
     * @param {Property.<boolean>} accelerationVisibleProperty
     */
    constructor(
      spinner,
      modelViewTransform,
      isPlayingProperty,
      velocityVisibleProperty,
      accelerationVisibleProperty
    ) {
      assert( spinner instanceof Spinner, `invalid spinner: ${ modelViewTransform }` );
      assert( modelViewTransform instanceof ModelViewTransform, `invalid modelViewTransform: ${ modelViewTransform }` );
      assert( isPlayingProperty instanceof Property, `invalid isPlayingProperty: ${ isPlayingProperty }` );
      assert( velocityVisibleProperty instanceof Property, `invalid isPlayingProperty: ${ isPlayingProperty }` );
      assert( accelerationVisibleProperty instanceof Property, `invalid isPlayingProperty: ${ isPlayingProperty }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      //----------------------------------------------------------------------------------------

      // Get the origin in terms of view coordinates
      const viewOrigin = modelViewTransform.modelToViewPoint( Vector.ZERO );

      // Create the string Line, to be set later.
      const string = Line.withPoints( viewOrigin, viewOrigin, { ...RotationalMotionColors.SPINNER_STRING_COLORS } );

      // Create the pin at the center of the Spinner. It's location never changes.
      const pin = new Circle( PIN_RADIUS, { center: viewOrigin, ...ROTATIONAL_MOTION.SPINNER_PIN_COLORS } );

      // Create the Ball Node of the Spinner.
      const ballNode = new IntroBallNode( spinner.ball,
        modelViewTransform,
        isPlayingProperty,
        velocityVisibleProperty,
        accelerationVisibleProperty );

      super( { children: [ string, pin, ballNode ] } );

      //----------------------------------------------------------------------------------------

      // Observe when the Ball's center changes and update the string to match. Doesn't need to be unlinked as the
      // Spinner is never disposed.
      spinner.ball.centerPositionProperty.link( centerPosition => {
        string.end = modelViewTransform.modelToViewPoint( centerPosition );
      } );
    }
  }

  return SpinnerNode;
} );