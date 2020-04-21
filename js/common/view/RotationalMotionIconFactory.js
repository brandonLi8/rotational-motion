// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Factory for creating the various icons that appear in the 'Rotational Motion' simulation.
 *
 * ## Creates the following icons:
 *  1. Screen icons (TODO)
 *  2. Checkbox icons (i.e. arrow icons, etc.)
 *  3. CircularMotionTypes icons (on the 'Intro' screen)
 *
 * IMPORTANT: All floating numbers in this file were determined empirically and are tentative.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SIM_CORE/scenery/AlignBox' );
  const Arrow = require( 'SIM_CORE/scenery/Arrow' );
  const assert = require( 'SIM_CORE/util/assert' );
  const Circle = require( 'SIM_CORE/scenery/Circle' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const CurvedArrow = require( 'SIM_CORE/scenery/components/CurvedArrow' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Path = require( 'SIM_CORE/scenery/Path' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const ScreenIcon = require( 'SIM_CORE/scenery/components/ScreenIcon' );
  const Shape = require( 'SIM_CORE/util/Shape' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  const RotationalMotionIconFactory = {

    /**
     * Creates the 'Intro' screen Icon, displayed on the navigation-bar.
     * @public
     * @returns {Node}
     */
    createIntroScreenIcon() {
      const angle = Util.toRadians( 40 );
      const radius = 30;
      const icon = new Node();

      const string = new Line( 0, 0, Math.cos( angle ) * radius, -Math.sin( angle ) * radius, {
        stroke: RotationalMotionColors.SPINNER_STRING_COLOR,
        strokeWidth: 2
      } );
      icon.addChild( string );

      const pin = new Circle( 2.5, { fill: RotationalMotionColors.SPINNER_PIN_FILL, center: string.bottomLeft } );
      icon.addChild( pin );

      const ball = new Circle( 10, { fill: RotationalMotionColors.INTRO_BALL_FILL, center: string.topRight } );
      icon.addChild( ball );

      const vector = Arrow.withPoints(
        ball.center,
        ball.center.add( new Vector( 0, 25 ).setAngle( -angle - Math.PI / 2 ) ), {
          ...RotationalMotionConstants.VECTOR_ARROW_OPTIONS,
          fill: RotationalMotionColors.LINEAR_VELOCITY_VECTOR_FILL
        } );
      icon.addChild( vector );

      return new ScreenIcon( icon );
    },

    /**
     * Creates a arrow icon that points to the right, used with various checkboxes.
     * @public
     * @param {Object} [options]
     * @returns {Node}
     */
    createVectorArrowIcon( options ) {
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {
        length: 20,
        headHeight: 8.5,
        headWidth: 10.5,
        tailWidth: 3.5,
        strokeWidth: 0.7,
        stroke: 'black',
        ...options
      };
      return new Arrow( 0, 0, options.length, 0, options );
    },

    /**
     * Creates the icon that appears next to the checkbox that toggles the 'Angle' visibility
     * @public
     * @returns {Node}
     */
    createAngleIcon() {
      const wedgeLength = 20;
      const angle = Util.toRadians( 50 );
      const curvedArrowRadius = 14;

      const wedgeShape = new Shape()
        .moveTo( wedgeLength, 0 )
        .horizontalLineTo( 0 )
        .lineTo( Math.cos( angle ) * wedgeLength, -Math.sin( angle ) * wedgeLength );
      const wedgeNode = new Path( wedgeShape, { stroke: 'black', fill: 'none', strokeWidth: 0.9 } );

      const icon = new Node().addChild( wedgeNode );

      const curvedArrow = new CurvedArrow( wedgeNode.bottomLeft, curvedArrowRadius, 0, angle, {
        headHeight: 6,
        headWidth: 8,
        tailWidth: 1.2
      } );

      const thetaNode = new Text( Symbols.THETA, {
        left: curvedArrow.right + 4,
        centerY: wedgeNode.centerY,
        ...RotationalMotionConstants.MATH_TEXT_OPTIONS,
        fontSize: 13.5
      } );
      return icon.addChild( curvedArrow ).addChild( thetaNode );
    },

    /**
     * Creates the icon on the CircularMotion types radio buttons in the 'Intro' screen.
     * @public
     *
     * @param {Enum.Member.<CircularMotionTypes>} circularMotionType
     * @returns {Node}
     */
    createCircularMotionTypeIcon( circularMotionType ) {
      assert( CircularMotionTypes.includes( circularMotionType ), 'invalid circularMotionType' );

      const label = new Text( circularMotionType === CircularMotionTypes.UNIFORM ? 'Uniform' : 'Non-uniform', {
        ...RotationalMotionConstants.PANEL_TEXT_OPTIONS,
        fontSize: 14
      } );
      return new AlignBox( label, 97, 19 );
    }
  };

  return RotationalMotionIconFactory;
} );