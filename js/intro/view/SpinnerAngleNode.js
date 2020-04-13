// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * SpinnerAngleNode is the angle indicator that appears on the Spinner when the angles checkbox is selected.
 *
 * Responsible for displaying:
 *  - a base-line to show the horizontal x-axis
 *  - a curved arrow from the horizontal up to the spinner's string
 *  - a label to indicate the angle's value in degrees
 *
 * SpinnerAngleNodes are created at the start of the sim and are never disposed, so no dispose method is necessary.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const CurvedArrow = require( 'ROTATIONAL_MOTION/intro/view/CurvedArrow' );
  const Line = require( 'SIM_CORE/scenery/Line' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const Multilink = require( 'SIM_CORE/util/Multilink' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Property = require( 'SIM_CORE/util/Property' );
  const RotationalMotionConstants = require( 'ROTATIONAL_MOTION/common/RotationalMotionConstants' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const Symbols = require( 'SIM_CORE/util/Symbols' );
  const Text = require( 'SIM_CORE/scenery/Text' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  class SpinnerAngleNode extends Node {

    /**
     * @param {Spinner} spinner
     * @param {Property.<boolean>} angleVisibleProperty
     * @param {ModelViewTransform} modelViewTransform
     * @param {Object} [options]
     */
    constructor( spinner, angleVisibleProperty, modelViewTransform, options ) {
      assert( spinner instanceof Spinner, `invalid spinner: ${ spinner }` );
      assert( angleVisibleProperty instanceof Property, 'invalid angleVisibleProperty' );
      assert( modelViewTransform instanceof ModelViewTransform, 'invalid modelViewTransform' );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // {number} - max radius of the curved arrow - used to keep the curved arrow smaller than the spinner string.
        maxCurvedArrowRadius: 40,

        // {number} - the scale the Spinner string radius is multiplied by to get the curved arrow radius.
        radiusScale: 0.4,

        // {number} - the maximum percentage of the baseline when compared to the radius of the curved arrow.
        maxBaselineWidth: 65,

        // {number} - the scale the Spinner string radius is multiplied by to get the length of the baseline.
        baseLineScale: 0.6,

        // {number} - the offset of the angle label from the curved arrow
        labelOffset: 3.5,

        // {number} - Angles greater than 35 deg, position the label between the Spinner string and the baseline, and
        //            angles under 35 place the label on the other side of the baseline.
        angleUnderBaselineThreshold: 35,

        ...options
      };
      super();

      //----------------------------------------------------------------------------------------
      const viewOrigin = modelViewTransform.modelToViewPoint( Vector.ZERO );

      // Create the base line that is parallel to the x-axis.
      const baseline = Line.withPoints( viewOrigin, viewOrigin, { stroke: 'black' } );

      // Create the CurvedArrow
      const curvedArrow = new CurvedArrow( viewOrigin, options.maxCurvedArrowRadius, 0, spinner.angle );

      // Create the label, set to an arbitrary string for now.
      const label = new Text( '', { fontSize: 14, fontWeight: 500 } );

      this.setChildren( [ baseline, curvedArrow, label ] );

      //----------------------------------------------------------------------------------------

      // Observe when the Ball of the Spinner moves and update what is displayed (see the comment at the top).
      // Also observe when the Angle Visibility Property changes and update the visibility of this Node.
      // Doesn't have to be disposed since SpinnerAngleNodes are never disposed.
      new Multilink( [ angleVisibleProperty, spinner.ball.centerPositionProperty ], angleVisible => {
        this.visible = angleVisible;
        if ( !this.visible ) return; // don't update when not visible

        const degrees = Util.toDegrees( spinner.angle );
        const radiusView = modelViewTransform.modelToViewDeltaX( spinner.radius );

        // Update the curvedArrow angle/radius, the text of the label, and the length of the baseline.
        curvedArrow.endAngle = spinner.angle;
        curvedArrow.radius = Math.min( options.radiusScale * radiusView, options.maxCurvedArrowRadius );
        label.text = Util.toFixed( degrees, RotationalMotionConstants.NUMBER_DISPLAY_DECIMAL_PLACES ) + Symbols.DEGREES;
        baseline.endX = viewOrigin.x + Math.min( curvedArrow.radius / options.baseLineScale, options.maxBaselineWidth );


        if ( degrees <= options.angleUnderBaselineThreshold ) {
          // Position the label halfway across, but on the other side of the baseline
          label.topCenter = baseline.bottomCenter.addXY( 0, options.labelOffset );
        }
        else {
          const labelPosition = new Vector( 0, curvedArrow.radius + options.labelOffset )
                                .setAngle( -spinner.angle / 2 )
                                .add( viewOrigin );
          if ( spinner.angle <= Math.PI ) label.bottomLeft = labelPosition;
          else label.bottomRight = labelPosition;
        }
      } );
    }
  }

  return SpinnerAngleNode;
} );