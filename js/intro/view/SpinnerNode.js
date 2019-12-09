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
  const VectorNode = require( 'SIM_CORE/scenery/VectorNode' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const Text = require( 'SIM_CORE/scenery/Text' );

  class SpinnerNode extends Node {

    /**
     * @param {Spinner} spinner
     * @param {ModelViewTransform} modelViewTransform
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. Subclasses
     *                             may have different options for their API. See the code where the options are set in
     *                             the early portion of the constructor for details.
     */
    constructor( spinner, modelViewTransform, isPlayingProperty, linearVelocityVisibleProperty, options ) {

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
        strokeWidth: 2
      } );

      const pin = new CircleNode( {
        radius: 2, // eye-balled
        fill: 'rgb( 100, 100, 100 )',
        center: localCenter,
      } );

      const ball = new CircleNode( {
        radius: modelViewTransform.modelToViewDeltaX( spinner.ballRadius ),
        center: localCenter,
        fill: 'green',
        style: {
          cursor: 'pointer'
        }
      } );

      const linearVelocityVector = new VectorNode( Vector.ZERO, Vector.ZERO, {
        fill: 'rgb( 10, 170, 250 )'
      } );

      const pinParent = new SVGNode( {
        children: [ this.line, pin, ball, linearVelocityVector ],
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

      const ballCenterLocationProperty = new Property( modelViewTransform.modelToViewPoint( spinner.ballPositionProperty.value.copy() ), {
        type: Vector
      } );

      let wasPlayingWhenDragged = null;
      const startDrag = () => {
        wasPlayingWhenDragged = isPlayingProperty.value;
        isPlayingProperty.value = false;
      }
      const lineDrag = ( displacement ) => {
        const cursorPosition = modelViewTransform.viewToModelDelta( displacement );
        const ballPosition = spinner.ballPositionProperty.value.copy().add( cursorPosition  );
        spinner.dragBallTo( ballPosition );
      };
      const lineDragClose = () => {
        if ( wasPlayingWhenDragged ) isPlayingProperty.value = true;
        wasPlayingWhenDragged = null;
      }
      ball.drag( startDrag, lineDrag, lineDragClose );

      //----------------------------------------------------------------------------------------
      linearVelocityVisibleProperty.link( isVisible => {
        linearVelocityVector.style.opacity = isVisible ? 1 : 0;
      } );

      const updateLinearVelocity = ( linearVelocity, ballPosition ) => {
        if ( !linearVelocityVisibleProperty.value ) return;

        const modelAngle = ballPosition.angle + Math.PI / 2;
        const vector = new Vector( 1, 0 ).rotate( modelAngle ).multiply( linearVelocity / 2);
        const tail = ballPosition.copy();
        const tip = tail.copy().add( vector );

        const tailView = localCenter.copy().add( modelViewTransform.modelToViewDelta( tail ) );
        const tipView = localCenter.copy().add( modelViewTransform.modelToViewDelta( tip ) );

        linearVelocityVector.set( tailView, tipView );
      };

      spinner.linearVelocityProperty.link( ( linearVelocity ) => {
        updateLinearVelocity( linearVelocity, spinner.ballPositionProperty.value );
      } );
      spinner.ballPositionProperty.link( ( ballPosition ) => {
        updateLinearVelocity( spinner.linearVelocityProperty.value, ballPosition );
      } );
      linearVelocityVisibleProperty.link( () => {
        updateLinearVelocity( spinner.linearVelocityProperty.value, spinner.ballPositionProperty.value );
      } );
    }
  }

  return SpinnerNode;
} );