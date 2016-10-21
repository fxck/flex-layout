import {
  NgModule,
  Directive, Renderer, ElementRef, Input,
  SimpleChanges, Optional, OnChanges, OnDestroy, OnInit,
} from '@angular/core';
import {CommonModule} from '@angular/common';

import { BaseStyleDirective } from "./_styleDirective";
import { MediaQueryAdapter, MediaQueryChanges, OnMediaQueryChanges } from "../media-query/media-query-adapter";

import { Subscription } from "rxjs/Subscription";
import { Observable }from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
@Directive({
  selector: '[layout]'
})
export class LayoutDirective extends BaseStyleDirective implements OnInit, OnChanges, OnMediaQueryChanges {
  /**
   * Create Observable for nested/child 'flex' directives. This allows
   * child flex directives to subscribe/listen for flexbox direction changes.
   */
  private _layout: BehaviorSubject<string> = new BehaviorSubject<string>(this.layout);

  /**
   * Publish observer for nested directives to listen to parent "layout" direction changes
   */
  public onLayoutChange: Observable<string> = this._layout.asObservable();

  /**
   * Default layout property with default direction value
   */
  @Input() layout = 'row';

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('layout.xs')     layoutXs;
  @Input('layout.gt-xs')  layoutGtXs;
  @Input('layout.sm')     layoutSm;
  @Input('layout.gt-sm')  layoutGtSm;
  @Input('layout.md')     layoutMd;
  @Input('layout.gt-md')  layoutGtMd;
  @Input('layout.lg')     layoutLg;
  @Input('layout.gt-lg')  layoutGtLg;
  @Input('layout.xl')     layoutXl;

  /**
   *
   */
  constructor(public elRef: ElementRef, public renderer: Renderer, public mqAdaptor: MediaQueryAdapter) {
    super(elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges( changes:SimpleChanges ) {
    this._updateWithDirection( changes['layout'].currentValue || 'row' );
  }

  ngOnInit() {
    this.mqAdaptor.attach(this, "layout");
  }

  /**
   *  Special mql callback used my MediaQueryAdapter when a mql event occurs
   */
  ngOnMediaQueryChanges(changes: MediaQueryChanges) {
    let current = changes.current, previous = changes.previous;
    let direction = this.layout;

    if ( previous ) {
      if ( previous.mqAlias == "" ) previous.mqAlias = "all";

      console.log(`mqChange[previous]: ${previous.mqAlias} = ${previous.matches}`);

      let previousKey = previous ? "layout" + previous.suffix : null;
      direction = this[previousKey] || direction;
    }

    if ( current && current.mqAlias == "" )  current.mqAlias = "all";
    console.log(`mqChange[current]: ${current.mqAlias} = ${current.matches};`);

    if ( changes.current.matches ) {
      let input = "layout" + current.suffix;
      direction = this[ input ] || direction;
    }

    this._updateWithDirection(direction);
  }



  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Validate the direction value and then update the host's inline flexbox styles
   */
  _updateWithDirection(direction) {
    direction = this._validateValue(direction);
    this._updateStyle(this._buildCSS(direction));

    // Announce to subscribers a layout direction change
    this._layout.next(direction);

    // @todo - update all child containers to have "box-sizing: border-box"
    // This way any padding or border specified on the child elements are laid out and drawn inside
    // that element's specified width and height
  }


  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    /**
     *  BUG - min-height on a column flex container won’t apply to its flex item children in IE 10-11.
     *  Use height instead if possible.
     */
    return this._modernizer({
      'display'         : 'flex',
      'box-sizing'      : 'border-box',
      'flex-direction'  : value
    });
  }

  /**
   * Validate the value to be one of the acceptable value options
   * Use default fallback of "row"
   */
  _validateValue(value) {
    value = value.toLowerCase();
    return LAYOUT_VALUES.find(x => x === value) ? value : LAYOUT_VALUES[0];  // "row"
  }

}


/**
 * 'layout-wrap' flexbox styling directive
 * Defines wrapping of child elements in layout container
 * Optional values: reverse, wrap-reverse, none, nowrap, wrap (default)]
 * @see https://css-tricks.com/almanac/properties/f/flex-wrap/
 */
@Directive({
  selector: '[layout-wrap]'
})
export class LayoutWrapDirective extends BaseStyleDirective implements OnChanges{
  @Input('layout-wrap')
  wrap : string = 'wrap';

  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer)
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges( changes:SimpleChanges ) {
    this._updateStyle( this._buildCSS(this.wrap || 'wrap') );
  }

  ngOnDestroy(){
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    return this._modernizer({
      'flex-wrap' : this._validateValue(value)
    });
  }

  /**
   * Convert layout-wrap="<value>" to expected flex-wrap style
   */
  _validateValue( value ) {
    switch(value.toLowerCase()) {

      case "reverse":
      case "wrap-reverse":
        value = "wrap-reverse";
        break;

      case "no":
      case "none":
      case "nowrap":
        value = "nowrap";
        break;

      // All other values fallback to "wrap"
      default :
        value = "wrap";
        break;
    }
    return value;
  }
}


/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 *  @see https://css-tricks.com/almanac/properties/j/justify-content/
 *  @see https://css-tricks.com/almanac/properties/a/align-items/
 *  @see https://css-tricks.com/almanac/properties/a/align-content/
 */
@Directive({
  selector:'[layout-align]',
})
export class LayoutAlignDirective extends BaseStyleDirective implements OnChanges, OnDestroy {
  private _layout = 'row';   // default flex-direction
  private _layoutWatcher : Subscription;

  @Input('layout-align') align : string = "start stretch";

  constructor(@Optional() public container:LayoutDirective, public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);

    if (container) {  // Subscribe to layout direction changes
      this._layoutWatcher = container.onLayoutChange
          .subscribe(this._onLayoutChange.bind(this));
    }
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges( changes?:SimpleChanges ) {
    this._updateStyle(this._buildCSS( this.align ));
  }

  ngOnDestroy(){
    this._layoutWatcher.unsubscribe();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Cache the parent container 'flex-direction' and update the 'flex' styles
   */
  _onLayoutChange(direction) {
    this._layout = (direction || "").toLowerCase().replace('-reverse',"");
    if ( this._layout !== 'column') this._layout = "row";

    this._allowStretching(this.align, this._layout);
  }

  _buildCSS(align) {
    let css = { }, [ main_axis, cross_axis ] = align.split(" ");

    css['justify-content'] = "start";     // default
    css['align-items']     = "stretch";   // default
    css['align-content']   = "stretch";   // default

    // Main axis
    switch( main_axis ){
      case "center"        : css['justify-content'] = "center";        break;
      case "space-around"  : css['justify-content'] = "space-around";  break;
      case "space-between" : css['justify-content'] = "space-between"; break;
      case "end"           : css['justify-content'] = "flex-end";      break;
    }
    // Cross-axis
    switch( cross_axis ){
       case "start"   : css['align-items'] = css['align-content'] = "flex-start";   break;
       case "baseline": css['align-items'] = "baseline";                            break;
       case "center"  : css['align-items'] = css['align-content'] = "center";       break;
       case "end"     : css['align-items'] = css['align-content'] = "flex-end";     break;
    }

    return this._modernizer(css);
  }

   /**
    * Update container element to 'stretch' as needed...
    */
   _allowStretching(align, layout) {
     let [, cross_axis] = align.split(" ");

     if ( cross_axis == "stretch") {
       // Use `null` values to remove style
       this._updateStyle(this._modernizer({
         'box-sizing' : "border-box",
         'max-width'  : (layout === 'column') ? '100%' : null,
         'max-height' : (layout === 'row') ? '100%' : null
       }));
     }
   }
}


/**
 * *****************************************************************
 * Define module for all Layout API - Layout directives
 * *****************************************************************
 */

@NgModule({
  imports: [CommonModule],
  exports: [
    LayoutDirective,
    LayoutWrapDirective,
    LayoutAlignDirective
  ],
  declarations: [
    LayoutDirective,
    LayoutWrapDirective,
    LayoutAlignDirective
  ]
})
export class LayoutDirectivesModule { }

// ************************************************************
// Private static variables
// ************************************************************

const LAYOUT_VALUES = [ "row", "column", "row-reverse", "column-reverse" ];
const [ ROW, COLUMN, ROW_REVERSE, COLUMN_REVERSE ] = LAYOUT_VALUES;

