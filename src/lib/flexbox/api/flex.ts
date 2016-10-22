import {
  Directive, Input, ElementRef, Renderer,
  SimpleChanges, Optional, OnChanges, OnDestroy, SkipSelf
} from '@angular/core';

import { BaseStyleDirective } from "./_abstract";
import { LayoutDirective } from "./layout";
import { Subscription } from "rxjs/Subscription";


/**
 * FlexBox styling directive for 'flex'
 * Configures the width/height sizing of the element within a layout container
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
@Directive({
  selector:'[flex]',
})
export class FlexDirective extends BaseStyleDirective implements OnChanges, OnDestroy {
  private _layout = 'row';   // default flex-direction
  private _layoutWatcher : Subscription;

  @Input() shrink:number = 1;
  @Input() grow:number = 1;
  @Input() flex:string;

  /**
   * Note: the optional `layout="column|row"` directive must be PARENT container.
   *
   * <div layout="row">
   *    <div flex="25%" layout="column">
   *      ...
   *    </div>
   * </div>
   */
  constructor(
    @Optional() @SkipSelf() private container:LayoutDirective,
    private elRef: ElementRef, private renderer: Renderer) {
      super(elRef, renderer);

      if (container) {
        this._layoutWatcher = container.onLayoutChange    // Subscribe to layout immediate parent direction changes
            .subscribe(this._onLayoutChange.bind(this));
      }
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For any @Input changes, delegate to the onLayoutChange()
   */
  ngOnChanges( changes?:SimpleChanges ) {
    this._onLayoutChange(this._layout);
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
    this._layout = direction;
    this._updateStyle(this._buildCSS());
  }

  /**
   * Build the CSS that should be assigned to the element instance
   *
   *  BUG - min-height on a column flex container won’t apply to its flex item children in IE 10-11.
   *  Use height instead if possible.
   */
  _buildCSS() {
    return this._modernizer(this._validateValue( this.grow, this.shrink, this.flex));
  }

  /**
   * Validate the value to be one of the acceptable value options
   * Use default fallback of "row"
   */
  _validateValue(grow, shrink, basis) {
    let css, direction = (this._layout === 'column') || (this._layout == "column-reverse") ? 'column': 'row';

    /*
     * flex-basis allows you to specify the initial/starting main-axis size of the element,
     * before anything else is computed. It can either be a percentage or an absolute value.
     * It is, however, not the breaking point for flex-grow/shrink properties
     *
     * flex-grow can be seen as this:
     *   0: Do not stretch. Either size to element's content width, or obey 'flex-basis'.
     *   1: (Default value). Stretch; will be the same size to all other flex items on
     *       the same row since they have a default value of 1.
     *   ≥2 (integer n): Stretch. Will be n times the size of other elements
     *      with 'flex-grow: 1' on the same row.
     *
     */
    switch(basis || "") {
       case ""      : css = { 'flex'  : '1'        }; break;
       case GROW    : css = { 'flex'  : "1 1 100%" }; break;
       case INITIAL : css = { 'flex'  : "0 1 auto" }; break;    // default
       case AUTO    : css = { 'flex'  : "1 1 auto" }; break;
       case NONE    : css = { 'flex'  : "0 0 auto" }; break;

       default      :
         let isPercent = String(basis).indexOf("%")  > -1;
         let isPx      = String(basis).indexOf("px") > -1;

         // Defaults to percentage sizing unless `px` is explicitly set
         if (!isPx && !isPercent && !isNaN(basis))  basis = basis + '%';
         if ( basis === "0px" )                     basis = "0%";

         css = {
           'flex' : `${grow} ${shrink} ${ isPx ? basis : '100%' }`,     // fix issue #5345
           'max-width'  : null,                                         // use `null` to remove styles
           'max-height' : null,
           'min-width'  : null,
           'min-height' : null
         };

         let max = ( direction === 'row' ) ? 'max-width' : 'max-height';
         let min = ( direction === 'row' ) ? 'min-width' : 'min-height';

         css[ min ] = (basis == '0%') ? basis : null;
         css[ max ] = basis;

         break;
     }
     return Object.assign(css, { 'box-sizing' : 'border-box' });
   }
}

/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
@Directive({
  selector:'[flex-order]',
})
export class FlexOrderDirective extends BaseStyleDirective implements OnChanges {
  @Input('flex-order') order:number;

  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);
  }

  ngOnChanges( changes?:SimpleChanges ) {
    this._updateStyle(this._buildCSS(this.order));
  }

  _buildCSS(value) {
    value = parseInt(value, 10);
    return this._modernizer({
      order : isNaN(value) ? 0 : value
    });
  }
}

/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
@Directive({
  selector:'[flex-offset]',
})
export class FlexOffsetDirective extends BaseStyleDirective implements OnChanges {
  @Input('flex-offset') offset:number;

  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);
  }

  ngOnChanges( changes?:SimpleChanges ) {
    this._updateStyle(this._buildCSS( this.offset ));
  }

  _buildCSS(offset) {
    let isPercent = String(offset).indexOf("%")  > -1;
    let isPx      = String(offset).indexOf("px") > -1;
    if (!isPx && !isPercent && !isNaN(offset))  offset = offset + '%';

    return this._modernizer({
      'margin-left' : `${offset}`
    });
  }
}

/**
 * 'flex-fill' flexbox styling directive
 * Maximizes width and height of element in a layout container
 */
@Directive({
  selector: '[flex-fill]'
})
export class FlexFillDirective extends BaseStyleDirective {
  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);
    this._updateStyle( this._buildCSS() );
  }

  _buildCSS() {
    return this._modernizer({
      'margin'    : 0,
      'width'     : '100%',
      'height'    : '100%',
      'min-width' : '100%',
      'min-height': '100%'
    });
  }
}


/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
@Directive({
  selector: '[flex-align]'
})
export class FlexAlignDirective extends BaseStyleDirective implements OnChanges {
  @Input('flex-align') align : string = "stretch";    // default

  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);
  }

  ngOnChanges( changes?:SimpleChanges ) {
    this._updateStyle(this._buildCSS( this.align ));
  }

  _buildCSS(align) {
    let css = { };

    // Cross-axis
    switch( align ){
       case "start"   : css['align-self'] = "flex-start";   break;
       case "baseline": css['align-self'] = "baseline";     break;
       case "center"  : css['align-self'] = "center";       break;
       case "end"     : css['align-self'] = "flex-end";     break;
       default        : css['align-self'] = "stretch";      break;  // default
    }

    return this._modernizer(css);
  }
}




// ************************************************************
// Private static variables
// ************************************************************

const GROW      = "grow";
const INITIAL   = "initial";
const AUTO      = "auto";
const NONE      = "none";
