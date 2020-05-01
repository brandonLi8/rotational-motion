// Copyright © 2020 Brandon Li. All rights reserved.

/**
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const CircularMotionTypes = require( 'ROTATIONAL_MOTION/intro/model/CircularMotionTypes' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const FractionNode = require( 'ROTATIONAL_MOTION/common/view/FractionNode' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const Panel = require( 'SIM_CORE/scenery/components/Panel' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionColors = require( 'ROTATIONAL_MOTION/common/RotationalMotionColors' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const RotationalMotionIconFactory = require( 'ROTATIONAL_MOTION/common/view/RotationalMotionIconFactory' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const SpinnerNumberControlSet = require( 'ROTATIONAL_MOTION/intro/view/SpinnerNumberControlSet' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const UnitNode = require( 'ROTATIONAL_MOTION/common/view/UnitNode' );
  const VisibilityCheckbox = require( 'ROTATIONAL_MOTION/common/view/VisibilityCheckbox' );

  class RollingControlPanel extends Panel {

    /**
     */
    constructor( options ) {

      // Apply any additional bounds mutators
      this.mutate( options );
    }
  }

  return RollingControlPanel;
} );