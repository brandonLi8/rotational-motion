// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Factory for creating the various icons that appear in the 'Rotational Motion' simulation.
 *
 * ## Creates the following icons:
 *  1. Screen icons (TODO)
 *  2. Checkbox icons (i.e. arrow icons, etc.)
 *  3. CircularMotionTypesIcon (on the 'Intro' screen)
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
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const CurvedArrow = require( 'ROTATIONAL_MOTION/intro/view/CurvedArrow' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Path = require( 'SIM_CORE/scenery/Path' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const Shape = require( 'SIM_CORE/util/Shape' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );

  const RotationalMotionIconFactory = {

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
     * Creates the icon on the CircularMotion types radio buttons in the 'Intro' screen.
     * @public
     *
     * @param {Enum.Member.<CircularMotionTypes>} circularMotionType
     * @returns {Node}
     */
    createCircularMotionTypeIcon( circularMotionType ) {
      assert( CircularMotionTypes.includes( circularMotionType ), 'invalid circularMotionType' );

      const label = new Text( circularMotionType === CircularMotionTypes.UNIFORM ? 'Uniform' : 'Non-uniform' );
      return new AlignBox( label, 100, 17 );
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
        ...RotationalMotionConstants.MATH_TEXT_OPTIONS
      } );
      return icon.addChild( curvedArrow ).addChild( thetaNode );
    }
  };

  return RotationalMotionIconFactory;
} );