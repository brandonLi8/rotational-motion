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
  const assert = require( 'SIM_CORE/util/assert' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );

  const RotationalMotionIconFactory = {

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
      text.center = fixedWidthNode.center;

      const icon = new Node().setChildren( [ fixedWidthNode, text ] );
      icon.width = fixedWidthNode.width;
      return icon;
    }
  };

  return RotationalMotionIconFactory;
} );