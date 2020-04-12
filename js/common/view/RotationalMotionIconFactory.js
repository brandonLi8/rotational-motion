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
  const Text = require( 'SIM_CORE/scenery/Text' );

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
    }
  };

  return RotationalMotionIconFactory;
} );