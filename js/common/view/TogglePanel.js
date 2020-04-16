// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * TogglePanel is a specialized version of Panel that displays two different Nodes. It toggles between 'closed' content
 * and 'open' content, while maintaining a fixed height and width.
 *
 * The TogglePanel displays a ExpandCollapseButton next to the left of the content to allow the user to toggle between
 * the 'open' and 'closed' state.
 *
 * Instances of this class are not meant to be disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SIM_CORE/scenery/AlignBox' );
  const assert = require( 'SIM_CORE/util/assert' );
  const ExpandCollapseButton = require( 'SIM_CORE/scenery/components/buttons/ExpandCollapseButton' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const Node = require( 'SIM_CORE/scenery/Node' );
  const Panel = require( 'SIM_CORE/scenery/components/Panel' );
  const Property = require( 'SIM_CORE/util/Property' );

  class TogglePanel extends Panel {

    /**
     * @param {Property.<boolean>} expandedProperty
     * @param {Node} closedContent - content when the box is closed
     * @param {Node} openContent - content when the box is open
     * @param {Object} [options]
     */
    constructor( expandedProperty, closedContent, openContent, options ) {
      assert( expandedProperty instanceof Property, `invalid expandedProperty: ${ expandedProperty }` );
      assert( closedContent instanceof Node, `invalid closedContent: ${ closedContent }` );
      assert( openContent instanceof Node, `invalid openContent: ${ openContent }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        contentAlign: 'left',      // {string} - 'left', 'center', or 'right'
        contentLeftMargin: 15,     // {number} - margin between the ExpandCollapseButton and the content

        // super-class options
        yMargin: 15,

        // rewrite options such that it overrides the defaults above if provided.
        ...options
      };

      //----------------------------------------------------------------------------------------

      // Create the ExpandCollapseButton first
      const expandCollapseButton = new ExpandCollapseButton( expandedProperty );

      // Observe when the expandedProperty is toggled by the ExpandCollapseButton and adjust the visibility of the
      // content. Link is never disposed as TogglePanels are not meant to be disposed.
      expandedProperty.link( expanded => {
        openContent.visible = expanded;
        closedContent.visible = !expanded;
      } );

      // Determine the content width and height
      const contentWidth = Math.max( closedContent.width, openContent.width );
      const contentHeight = Math.max( closedContent.height, openContent.height );

      // Create the container of the open and close content.
      const openCloseContent = new Node()
        .addChild( new AlignBox( openContent, contentWidth, contentHeight, { xAlign: options.contentAlign } ) )
        .addChild( new AlignBox( closedContent, contentWidth, contentHeight, { xAlign: options.contentAlign } ) );

      //----------------------------------------------------------------------------------------

      // Create the content that is passed to the super class
      const content = FlexBox.horizontal( {
        children: [ expandCollapseButton, openCloseContent ],
        spacing: options.contentLeftMargin
      } );
      super( content, options );
    }
  }

  return TogglePanel;
} );