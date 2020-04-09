// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Factory for creating the various icons that appear in the sim.
 *
 * All floating numbers in this file were determined empirically and are tentative.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const Arrow = require( 'SIM_CORE/scenery/Arrow' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Text = require( 'SIM_CORE/scenery/Text' );

  const RotationalMotionIconFactory = {

    /**
     * Creates a arrow icon that points to the right, used with various checkboxes.
     * @public
     * @param {Object} [options]
     * @returns {Node}
     */
    createVectorArrowIcon( options ) {
      options = {
        length: 20,
        headHeight: 9,
        headWidth: 11,
        tailWidth: 3.5,

        ...options
      };
      return new Arrow( 0, 0, options.length, 0, options );
    },

    /**
     * Creates the icon on the CircularMotion types radio buttons in the 'intro' screen.
     * @public
     *
     * @param {Enum.Member.<CircularMotionTypes>} circularMotionType
     * @returns {Node}
     */
    createCircularMotionTypeIcon( circularMotionType ) {
      const text = new Text( circularMotionType === CircularMotionTypes.UNIFORM ? 'Uniform' : 'Non-uniform' );

      const fixedWidthNode = new Node();
      fixedWidthNode.width = 100; // eye-balled
      text.centerY = fixedWidthNode.centerY;
      text.centerX = fixedWidthNode.centerX;

      const icon = new Node().setChildren( [ fixedWidthNode, text ] );
      icon.width = fixedWidthNode.width;
      return icon;
    }
  };

  return RotationalMotionIconFactory;
} );