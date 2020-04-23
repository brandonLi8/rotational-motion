// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * Enumeration of the different 'types' of rolling balls in the 'Rolling' screen.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Enum = require( 'SIM_CORE/util/Enum' );

  const RollingBallTypes = new Enum( [

    'DISK',

    'WASHER'
  ] );

  return RollingBallTypes;
} );