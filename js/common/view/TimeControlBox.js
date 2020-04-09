// Copyright © 2020 Brandon Li. All rights reserved.

/**
 * A Custom Node for this simulation that displays a step backward button, a play-pause button, and a step forward
 * button in a horizontal FlexBox.
 *
 * @author Brandon Li <brandon.li820@gmail.com>
 */

define( require => {
  'use strict';

  // modules
  const assert = require( 'SIM_CORE/util/assert' );
  const FlexBox = require( 'SIM_CORE/scenery/FlexBox' );
  const PlayPauseButton = require( 'SIM_CORE/scenery/buttons/PlayPauseButton' );
  const Property = require( 'SIM_CORE/util/Property' );
  const StepButton = require( 'SIM_CORE/scenery/buttons/StepButton' );

  class TimeControlBox extends FlexBox {

    /**
     * @param {Property.<boolean>} playProperty - the Property to toggle when the Button is pressed. The initial
     *                                            content of the Button will be determined by the current value.
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. See the code
     *                             where the options are set in the early portion of the constructor for details.
     */
    constructor( playProperty, options ) {
      assert( playProperty instanceof Property, `invalid playProperty: ${ playProperty }` );
      assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `invalid options: ${ options }` );

      options = {

        // {Object} - if provided, these options will be passed to the PlayPauseButton instance.
        playPauseOptions: null,

        // {Object} - if provided, these options will be passed to the backwards StepButton instance.
        stepBackwardOptions: null,

        // {Object} - if provided, these options will be passed to the forwards StepButton instance.
        stepForwardOptions: null,

        // {number} - spacing between each Button.
        spacing: 5,

        // Rewrite options so that it overrides the defaults.
        ...options
      };

      super( 'horizontal', options );

      //----------------------------------------------------------------------------------------

      // Create the step forward and step backwards buttons.
      const stepBackwardButton = StepButton.backwards( options.stepBackwardOptions );
      const stepForwardButton = StepButton.forwards( options.stepForwardOptions );

      // Create the play-pause button.
      const playPauseButton = new PlayPauseButton( playProperty, options.playPauseOptions );

      // Set the children of the FlexBox
      this.children = [ stepBackwardButton, playPauseButton, stepForwardButton ];

      // Apply any additional location setters.
      this.mutate( options );
    }
  }

  return TimeControlBox;
} );