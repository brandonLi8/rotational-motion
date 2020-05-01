// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * RampAngleNode is the angle indicator that appears on beneath the slope of the Ramp Node when the angles checkbox is
 * selected. It shows the angle of the ramp relative to the horizontal.
 *
 * Responsible for displaying:
 *  - a base-line to show the horizontal x-axis
 *  - a curved arrow from the horizontal up to the ramp's slope
 *  - a label to indicate the angle's value in degrees
 *
 * RampAngleNodes are created at the start of the sim and are never disposed, so no dispose method is necessary.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const CurvedArrow = require( 'SIM_CORE/scenery/components/CurvedArrow' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Multilink = require( 'SIM_CORE/util/Multilink' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const Ramp = require( 'ROTATIONAL_MOTION/rolling/model/Ramp' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  class RampAngleNode extends Node {

    /**
     * @param {Ramp} ramp
     * @param {Property.<boolean>} angleVisibleProperty
     * @param {ModelViewTransform} modelViewTransform
     * @param {Object} [options]
     */
    constructor( ramp, angleVisibleProperty, modelViewTransform, options ) {
      assert( ramp instanceof Ramp, `invalid ramp: ${ ramp }` );
      assert( angleVisibleProperty instanceof Property, 'invalid angleVisibleProperty' );
      assert( modelViewTransform instanceof ModelViewTransform, 'invalid modelViewTransform' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        curvedArrowRadius: 55, // {number} - radius of the curved arrow
        baselineLength: 75,    // {number} - the length of the baseline
        labelOffset: 6.5,      // {number} - the offset of the angle label from the curved arrow

        // {number} - Angles greater than 35 deg, position the label between the Ramp slope and the baseline, and
        //            angles under 35 place the label on the other side of the baseline.
        angleUnderBaselineThreshold: 25,

        ...options
      };
      super();

      //----------------------------------------------------------------------------------------

      const arcCenter = modelViewTransform.modelToViewPoint( Vector.scratch.setXY( ramp.slopeWidth, 0 ) );

      // Create the base line that is parallel to the x-axis.
      const baseline = Line.withPoints( arcCenter, arcCenter.copy().subtractXY( options.baselineLength, 0 ), {
        stroke: 'black',
        lineDash: [ 2.5, 6 ] // eye-balled
      } );

      // Create the CurvedArrow
      const curvedArrow = new CurvedArrow( arcCenter, options.curvedArrowRadius, Math.PI, Math.PI - ramp.angle, {
        clockwise: true
      } );

      // Create the label, set to an arbitrary string for now.
      const label = new Text( '', { fontSize: 14, fontWeight: 500 } );

      this.setChildren( [ baseline, curvedArrow, label ] );

      //----------------------------------------------------------------------------------------

      // Observe when the Ramp's angle changes and update what is displayed (see the comment at the top).
      // Also observe when the Angle Visibility Property changes and update the visibility of this Node.
      // Doesn't have to be disposed since RampAngleNodes are never disposed.
      new Multilink( [ angleVisibleProperty, ramp.angleProperty ], angleVisible => {
        this.visible = angleVisible;
        if ( !this.visible ) return; // don't update when not visible

        const degrees = Util.toDegrees( ramp.angle );
        const radiusView = modelViewTransform.modelToViewDeltaX( ramp.radius );

        // Update the curvedArrow angle and the text of the label.
        curvedArrow.endAngle = Math.PI - ramp.angle;
        label.text = Util.toFixed( degrees, RotationalMotionConstants.NUMBER_DISPLAY_DECIMAL_PLACES ) + Symbols.DEGREES;


        if ( degrees <= options.angleUnderBaselineThreshold ) {
          // Position the label halfway across, but on the other side of the baseline
          label.topCenter = baseline.bottomCenter.addXY( 0, options.labelOffset );
        }
        else {
          label.centerRight = new Vector( 0, curvedArrow.radius + options.labelOffset )
                                .setAngle( -Math.PI + 0.5 * ramp.angle )
                                .add( arcCenter );
        }
      } );
    }
  }

  return RampAngleNode;
} );