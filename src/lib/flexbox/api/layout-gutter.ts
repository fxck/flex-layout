/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer,
  SimpleChanges,
  Self,
  AfterContentInit,
  Optional,
  OnDestroy,
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
import {LayoutDirective, LAYOUT_VALUES} from './layout';

/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
@Directive({
  selector: `
  [fxLayoutGutter],
  [fxLayoutGutter.xs],
  [fxLayoutGutter.gt-xs],
  [fxLayoutGutter.sm],
  [fxLayoutGutter.gt-sm]
  [fxLayoutGutter.md],
  [fxLayoutGutter.gt-md]
  [fxLayoutGutter.lg],
  [fxLayoutGutter.gt-lg],
  [fxLayoutGutter.xl]
`
})
export class LayoutGutterDirective extends BaseFxDirective implements AfterContentInit, OnChanges,
    OnDestroy {
  private _layout = 'row';  // default flex-direction
  private _layoutWatcher: Subscription;
  private _observer: MutationObserver;

  @Input('fxLayoutGutter')       set gutter(val) {
    this._cacheInput('gutter', val);
  }

  @Input('fxLayoutGutter.xs')    set gutterXs(val) {
    this._cacheInput('gutterXs', val);
  }

  @Input('fxLayoutGutter.gt-xs') set gutterGtXs(val) {
    this._cacheInput('gutterGtXs', val);
  };

  @Input('fxLayoutGutter.sm')    set gutterSm(val) {
    this._cacheInput('gutterSm', val);
  };

  @Input('fxLayoutGutter.gt-sm') set gutterGtSm(val) {
    this._cacheInput('gutterGtSm', val);
  };

  @Input('fxLayoutGutter.md')    set gutterMd(val) {
    this._cacheInput('gutterMd', val);
  };

  @Input('fxLayoutGutter.gt-md') set gutterGtMd(val) {
    this._cacheInput('gutterGtMd', val);
  };

  @Input('fxLayoutGutter.lg')    set gutterLg(val) {
    this._cacheInput('gutterLg', val);
  };

  @Input('fxLayoutGutter.gt-lg') set gutterGtLg(val) {
    this._cacheInput('gutterGtLg', val);
  };

  @Input('fxLayoutGutter.xl')    set gutterXl(val) {
    this._cacheInput('gutterXl', val);
  };

  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              renderer: Renderer,
              @Optional() @Self() container: LayoutDirective) {
    super(monitor, elRef, renderer);

    if (container) {  // Subscribe to layout direction changes
      this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
    }
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gutter'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngAfterContentInit() {
    this._watchContentChanges();
    this._listenForMediaQueryChanges('gutter', '0', (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._layoutWatcher) {
      this._layoutWatcher.unsubscribe();
    }
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Watch for child nodes to be added... and apply the layout gap styles to each.
   * NOTE: this does NOT! differentiate between viewChildren and contentChildren
   */
  private _watchContentChanges() {
    let onMutationCallback = (mutations) => {
      // update gap styles only for 'addedNodes' events
      mutations
          .filter((it: MutationRecord) => it.addedNodes && it.addedNodes.length)
          .map(() => this._updateWithValue());
    };

    this._observer = new MutationObserver(onMutationCallback);
    this._observer.observe(this._elementRef.nativeElement, {childList: true});
  }

  /**
   * Cache the parent container 'flex-direction' and update the styles
   */
  private _onLayoutChange(direction) {
    this._layout = (direction || '').toLowerCase();
    if (!LAYOUT_VALUES.find(x => x === this._layout)) {
      this._layout = 'row';
    }
    this._updateWithValue();
  }

  /**
   *
   */
  private _updateWithValue(value?: string) {
    value = value || this._queryInput("gutter") || '0';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    // For parent element, set the margin styles...
    this._applyStyleToElement(this._buildCSSForContainer(value), this._elementRef.nativeElement);

    // For each `element` child, set the padding styles...
    let items = this.childrenNodes
        .filter(el => (el.nodeType === 1))   // only Element types
    this._applyStyleToElements(this._buildCSSForItems(value), items);

  }

  /**
   * Prepare margin CSS, remove any previous explicitly
   * assigned margin assignments
   */
  private _buildCSSForItems(value) {
    let key, margins = {
      'padding-left': null,
      'padding-right': null
    };

    switch (this._layout) {
      case 'row-reverse':
        key = 'padding-right';
        break;
      case "row" :
        key = 'padding-left';
        break;
    }
    margins[key] = value;

    return margins;
  }

  /**
   * Prepare margin CSS, remove any previous explicitly
   * assigned margin assignments
   */
  private _buildCSSForContainer(value) {
    let key, margins = {
      'margin-left': null,
      'margin-right': null
    };

    switch (this._layout) {
      case 'row-reverse':
        key = 'margin-right';
        break;
      case "row" :
        key = 'margin-left';
        break;
    }
    margins[key] = '-' + value;

    return margins;
  }


}
