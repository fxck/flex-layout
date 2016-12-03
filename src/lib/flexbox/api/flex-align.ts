import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  Renderer,
  SimpleChanges,
} from '@angular/core';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
import {MediaQueryActivation} from '../media-query/media-query-activation';

/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
@Directive({selector: '[fx-flex-align]'})
export class FlexAlignDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: MediaQueryActivation;

  @Input('fx-flex-align') align: string = 'stretch';  // default

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-flex-align.xs') alignXs;
  @Input('fx-flex-align.gt-xs') alignGtXs;
  @Input('fx-flex-align.sm') alignSm;
  @Input('fx-flex-align.gt-sm') alignGtSm;
  @Input('fx-flex-align.md') alignMd;
  @Input('fx-flex-align.gt-md') alignGtMd;
  @Input('fx-flex-align.lg') alignLg;
  @Input('fx-flex-align.gt-lg') alignGtLg;
  @Input('fx-flex-align.xl') alignXl;


  constructor(private _monitor : MediaMonitor, elRef: ElementRef, renderer: Renderer) {
    super(elRef, renderer);
  }


  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
  ngOnChanges(changes: SimpleChanges) {
    let activated = this._mqActivation;
    let activationChange = activated && changes[activated.activatedInputKey] != null;
    if (changes['align'] != null || activationChange) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = new MediaQueryActivation(this._monitor, this,  'align', 'stretch');
    this._updateWithValue();
  }

  ngOnDestroy() {
    this._mqActivation.destroy();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  onMediaQueryChanges(changes: MediaChange) {
    this._updateWithValue(changes.value);
  }

  // *********************************************
  // Protected methods
  // *********************************************

  _updateWithValue(value?: string|number) {
    value = value || this.align || 'stretch';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }

  _buildCSS(align) {
    let css = {};

    // Cross-axis
    switch (align) {
      case 'start':
        css['align-self'] = 'flex-start';
        break;
      case 'baseline':
        css['align-self'] = 'baseline';
        break;
      case 'center':
        css['align-self'] = 'center';
        break;
      case 'end':
        css['align-self'] = 'flex-end';
        break;
      default:
        css['align-self'] = 'stretch';
        break;  // default
    }

    return css;
  }
}
