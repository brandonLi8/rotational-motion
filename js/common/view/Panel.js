// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * A Panel, which displays a content Node with a rectangular background.
 *
 * The background rectangle's width and height will automatically update if the content Node's bounds changes.
 * Panel will have a vast options API to customize the appearance and behavior of the Panel, including padding between
 * the content and the background.
 *
 * Panel is sub-typed and used throughout the Control Panels of Rotational Motion.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Rectangle = require( 'SIM_CORE/scenery/Rectangle' );
  const Vector = require( 'SIM_CORE/util/Vector' );

  class Panel extends Node {

    /**
     * @param {Node} content
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior of the Panel. See
     *                             the code where the options are set in the early portion of the constructor.
     */
    constructor( content, options ) {
      assert( content instanceof Node, `invalid content: ${ content }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );
      assert( !options || !options.attributes, 'Panel sets attributes' );
      assert( !options || !options.width, 'Panel sets width' );
      assert( !options || !options.height, 'Panel sets height' );

      options = {
        fill: 'white',    // {string|Gradient} - the fill of the background rectangle
        stroke: 'black',  // {string|Gradient} - the stroke of the background rectangle
        cornerRadius: 5,  // {number} - the corner radius of the background rectangle
        strokeWidth: 1,   // {number} - the stroke-width of the background rectangle
        xMargin: 14,      // {number} - the x-margin between the background rectangle and the content
        yMargin: 13,      // {number} - the y-margin between the background rectangle and the content

        // Rewrite options so that the passed-in options overrides the defaults.
        ...options
      };
      super( options );

      // @private {*} - see options declaration for documentation.
      this._xMargin = options.xMargin;
      this._yMargin = options.yMargin;

      // @public {Node} (read-only) - reference the passed-in content Node
      this.content = content;

      // @private {Rectangle} - create the background rectangle. Width and height to be updated later.
      this._background = new Rectangle( 0, 0, {
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        cornerRadius: options.cornerRadius
      } );

      // @private {boolean} - Indicates if we are in the process of updating the layout of the Panel. Used
      //                      to reduce the number of _recomputeAncestorBounds calls while layouting.
      this._isUpdatingLayout = false;

      // Set the children of the panel.
      this.children = [ this._background, this.content ];

      // At this point, call mutate to ensure that any location setters provided are correctly mutated and our
      // properties are correctly set. in Node.mutate()
      this.mutate( options );
    }

    /**
     * Called when the layout of the Panel needs to be updated.
     * @private
     *
     * NOTE: Will change the location of its children, and possibly the location of this Node's content.
     */
    _updateLayout() {
      this._isUpdatingLayout = true; // Indicate that we are now updating our layout.

      // Ensure that the content fits inside the background Path
      this._background.topLeft = Vector.ZERO;

      // Update the width and height of the background.
      this._background.width = this.content.width + this._xMargin;
      this._background.height = this.content.height + this._yMargin;

      // Align the content to the center of the background.
      this.content.center = this._background.center;

      this._isUpdatingLayout = false; // Indicate that we are now done updating our layout of our children.
      super._recomputeAncestorBounds();
    }

    /**
     * @override
     * Called when this Node's Bounds changes due to a child's Bounds changing or when a child is added or removed.
     * Also responsible for recursively calling the method for each parent up to either the ScreenView or to the
     * point where a Node doesn't have a parent.
     * @protected
     *
     * This is overridden so that the layout of the Panel updates when a child changes.
     */
    _recomputeAncestorBounds() {
      if ( this._isUpdatingLayout === false ) return this._updateLayout();
    }
  }

  return Panel;
} );