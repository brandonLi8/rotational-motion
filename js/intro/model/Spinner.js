// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * Model for the Spinner.
 *
 * Responsible for:
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const Bounds = require( 'SIM_CORE/util/Bounds' );
  const assert = require( 'SIM_CORE/util/assert' );

  // constants
  const MIN_SPINNER_RADIUS = 0.1; // in meters
  const BALL_RADIUS = 0.3;

  class Spinner {

    /**
     * @param {Bounds} spinnerAreaBounds
     * @param {Object} [options]
     */
    constructor( spinnerAreaBounds, options ) {

      assert( spinnerAreaBounds instanceof Bounds, `invalid spinnerAreaBounds: ${ spinnerAreaBounds }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      //----------------------------------------------------------------------------------------

      // @public (read-only) spinnerAreaBounds - the bounds for the spinner area
      this.spinnerAreaBounds = spinnerAreaBounds;

      // @public (read-only) minSpinnerRadius
      this.minSpinnerRadius = MIN_SPINNER_RADIUS;

      this.ballRadius = BALL_RADIUS;

      this.maxSpinnerRadius = spinnerAreaBounds.width / 2 - BALL_RADIUS / 2;
    }
  }

  return Spinner;
} );