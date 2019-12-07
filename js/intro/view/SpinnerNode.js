// Copyright © 2019 Brandon Li. All rights reserved.

/**
 * View for the spinning circle.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Node = require( 'SIM_CORE/scenery/Node' );
  const LineNode = require( 'SIM_CORE/scenery/LineNode' );
  const SVGNode = require( 'SIM_CORE/scenery/SVGNode' );
  const CircleNode = require( 'SIM_CORE/scenery/CircleNode' );
  const Vector = require( 'SIM_CORE/util/Vector' );
  const ModelViewTransform = require( 'SIM_CORE/util/ModelViewTransform' );
  const assert = require( 'SIM_CORE/util/assert' );
  const Spinner = require( 'ROTATIONAL_MOTION/intro/model/Spinner' );
  const Util = require( 'SIM_CORE/util/Util' );
  const Property = require( 'SIM_CORE/util/Property' );

  class SpinnerNode extends Node {

    /**
     * @param {Spinner} spinner
     * @param {ModelViewTransform} modelViewTransform
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. Subclasses
     *                             may have different options for their API. See the code where the options are set in
     *                             the early portion of the constructor for details.
     */
    constructor( spinner, modelViewTransform, isPlayingProperty, options ) {

      assert( spinner instanceof Spinner, `invalid spinner: ${ modelViewTransform }` );
      assert( modelViewTransform instanceof ModelViewTransform, `invalid modelViewTransform: ${ modelViewTransform }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${ options }` );

      // Defaults for options.
      const defaults = {

        center: modelViewTransform.modelToViewPoint( Vector.ZERO ),
        width: modelViewTransform.modelToViewDeltaX( spinner.spinnerAreaBounds.width ),
        height: -modelViewTransform.modelToViewDeltaY( spinner.spinnerAreaBounds.height ),

        style: {
          border: '2px solid red',
          boxSizing: 'content-box'
        }
      };

      // Rewrite options so that it overrides the defaults.
      options = { ...defaults, ...options };

      super( options );

      //----------------------------------------------------------------------------------------
      // Create the Circle in the center that represents a Pin

      const localCenter = new Vector( modelViewTransform.viewBounds.width / 2, modelViewTransform.viewBounds.height / 2 );
      this.line = new LineNode( localCenter, Vector.ZERO, {
        stroke: 'black',
        strokeWidth: 2,
        style: {
          cursor: 'pointer'
        }
      } );

      const pin = new CircleNode( {
        radius: 2, // eye-balled
        fill: 'rgb( 100, 100, 100 )',
        center: localCenter,
      } );

      const ball = new CircleNode( {
        radius: modelViewTransform.modelToViewDeltaX( spinner.ballRadius ),
        center: localCenter,
        fill: 'green'
      } );

      const pinParent = new SVGNode( {
        children: [ this.line, pin, ball ],
        width:  modelViewTransform.modelToViewBounds( spinner.spinnerAreaBounds ).width,
        height: modelViewTransform.modelToViewBounds( spinner.spinnerAreaBounds ).height
      } );


      this.addChild( pinParent );

      //----------------------------------------------------------------------------------------

      spinner.ballPositionProperty.link( ballPosition => {
        this.line.end = localCenter.copy().add( modelViewTransform.modelToViewDelta( ballPosition ) );
        ball._center = this.line.end;
      } );
      //----------------------------------------------------------------------------------------

      const ballCenterLocationProperty = new Property( modelViewTransform.modelToViewPoint( spinner.ballPositionProperty.value.copy() ) );

      let wasPlayingWhenDragged = null;
      const lineDrag = ( displacement ) => {
        if ( wasPlayingWhenDragged === null ) {
          wasPlayingWhenDragged = isPlayingProperty.value;
        }
        if ( wasPlayingWhenDragged ) isPlayingProperty.value = false;

        const cursorPosition = modelViewTransform.viewToModelDelta( displacement );
        const ballPosition = spinner.ballPositionProperty.value.copy().add( cursorPosition  );
        spinner.dragBallTo( ballPosition );

      };
      const lineDragClose = () =>{
        if ( wasPlayingWhenDragged ) isPlayingProperty.value = true;
        wasPlayingWhenDragged = null;
      }
      ball.drag( lineDrag, lineDragClose);

    }
  }

  return SpinnerNode;
} );