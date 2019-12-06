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
  const Property = require( 'SIM_CORE/util/Property' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const Util = require( 'SIM_CORE/util/Util' );

  // constants
  const MIN_SPINNER_RADIUS = 0.1; // in meters
  const DEFAULT_STRING_RADIUS = 1; // in meters

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

      this.stringAngleProperty = new Property( 0 ); // in degrees
      this.stringRadiusProperty = new Property( DEFAULT_STRING_RADIUS );

      this.ballVelocityProperty = new Property( 90 ); // in degrees per second
      this.ballRadius = 10;
      this.ballPositionProperty = new Property( new Vector( 0, 0 ) ); // temp


      const stringAngleListener = angle => {
        const radians = Util.toRadians( angle );
        this.ballPositionProperty.value = new Vector(
          Math.cos( radians ) * this.stringRadiusProperty.value,
          Math.sin( radians ) * this.stringRadiusProperty.value,
        );
      }
      this.stringAngleProperty.link( stringAngleListener );
      // this.maxSpinnerRadius = spinnerAreaBounds.width / 2 - this.ballRadiusProperty.value / 2;
    }

    /**
     * Moves this spinner by one time step.
     * @param {number} dt - time in seconds
     * @public
     */
    step( dt ) {
      this.stringAngleProperty.value = this.stringAngleProperty.value + dt * this.ballVelocityProperty.value;
    }
  }

  return Spinner;
} );