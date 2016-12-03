import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer,
  SimpleChanges,
  Self,
  Optional,
  Inject,
  forwardRef
} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {MediaQueryActivation} from '../media-query/media-query-activation';
import {MediaQueryAdapter} from '../media-query/media-query-adapter';
import {MediaQueryChanges, OnMediaQueryChanges} from '../media-query/media-query-changes';
import {BaseFxDirective} from './base';
import {HideDirective} from "./hide";
import {LayoutDirective} from './layout';


const FALSY = ['false', false, 0];

/**
 * 'show' Layout API directive
 *
 */
@Directive({selector: '[fx-show]'})
export class ShowDirective extends BaseFxDirective implements OnInit, OnChanges,
                                                                 OnMediaQueryChanges {
  /**
   * Original dom Elements CSS display style
   */
  private _display = 'flex';

  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: MediaQueryActivation;

  /**
    * Subscription to the parent flex container's layout changes.
    * Stored so we can unsubscribe when this directive is destroyed.
    */
  private _layoutWatcher : Subscription;

  /**
   * Default layout property with default visible === true
   */
  @Input('fx-show') show = true;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-show.xs') showXs;
  @Input('fx-show.gt-xs') showGtXs;
  @Input('fx-show.sm') showSm;
  @Input('fx-show.gt-sm') showGtSm;
  @Input('fx-show.md') showMd;
  @Input('fx-show.gt-md') showGtMd;
  @Input('fx-show.lg') showLg;
  @Input('fx-show.gt-lg') showGtLg;
  @Input('fx-show.xl') showXl;

  /**
   *
   */
  constructor(
      private _mqa: MediaQueryAdapter,
      @Optional() @Self() private _layout: LayoutDirective,
      @Inject(forwardRef(() => HideDirective)) @Optional() @Self() private _hideDirective,
      protected elRef: ElementRef,
      protected renderer: Renderer) {
    super(elRef, renderer);

    if (_layout) {
      /**
       * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
       * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
       */
      this._layoutWatcher = _layout.layout$.subscribe(() => this._updateWithValue());
    }
  }

  /**
    * Does the current element also use the fx-show API ?
    */
   protected get usesHideAPI() {
     return !!this._hideDirective;
   }


  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fx-show')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges(changes: SimpleChanges) {
    let activated = this._mqActivation;
    let activationChange = activated && changes[activated.activatedInputKey] != null;
    if (changes['show'] != null || activationChange) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mqa.attach(this, 'show', true);
    this._updateWithValue();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    this._updateWithValue(changes.current.value);
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /** Validate the visibility value and then update the host's inline display style */
  _updateWithValue(value?: string|number|boolean) {
    value = value || this.show || true;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    let shouldShow = this._validateTruthy(value);
    if ( shouldShow || !this.usesHideAPI ) {
      this._applyStyleToElement(this._buildCSS(shouldShow));
    }
  }


  /** Build the CSS that should be assigned to the element instance */
  _buildCSS(show) {
    return {'display': show ? this._display : 'none'};
  }

  /**  Validate the to be not FALSY */
  _validateTruthy(show) {
    return (FALSY.indexOf(show) == -1)
  }
}
