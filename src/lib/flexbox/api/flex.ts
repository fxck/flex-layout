import { isDefined } from '../../utils/global';

import {
  Directive, Input, ElementRef, Renderer,
  SimpleChanges, Optional, OnChanges, OnDestroy, SkipSelf, OnInit
} from '@angular/core';

import { BaseStyleDirective } from "./abstract";
import { LayoutDirective } from "./layout";
import {
  MediaQueryAdapter, MediaQueryChanges,
  OnMediaQueryChanges, MediaQueryActivation
} from "../media-query/media-query-adapter";

import { Subscription } from "rxjs/Subscription";


/**
 * FlexBox styling directive for 'ng-flex'
 * Configures the width/height sizing of the element within a layout container
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
@Directive({
  selector:'[ng-flex]'
})
export class FlexDirective extends BaseStyleDirective implements OnInit, OnChanges, OnMediaQueryChanges, OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation : MediaQueryActivation;


  private _layout = 'row';   // default flex-direction
  private _layoutWatcher : Subscription;

  @Input('ng-shrink')  shrink :number = 1;
  @Input('ng-grow')    grow   :number = 1;
  @Input('ng-flex')    flex   :string = "";

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('ng-flex.xs')     flexXs;
  @Input('ng-flex.gt-xs')  flexGtXs;
  @Input('ng-flex.sm')     flexSm;
  @Input('ng-flex.gt-sm')  flexGtSm;
  @Input('ng-flex.md')     flexMd;
  @Input('ng-flex.gt-md')  flexGtMd;
  @Input('ng-flex.lg')     flexLg;
  @Input('ng-flex.gt-lg')  flexGtLg;
  @Input('ng-flex.xl')     flexXl;

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
    private _$mq: MediaQueryAdapter,
    @Optional() @SkipSelf() private container:LayoutDirective,
    elRef: ElementRef, renderer: Renderer) {
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
   * For @Input changes on the current mq activation property, delegate to the onLayoutChange()
   */
  ngOnChanges( changes?:SimpleChanges ) {
    let activated = this._mqActivation;
    let activationChange = activated && isDefined(changes[activated.activatedInputKey]);

    if ( isDefined(changes['flex']) || activationChange ) {
     this._onLayoutChange(this._layout);
    }
  }

   /**
    * After the initial onChanges, build an mqActivation object that bridges
    * mql change events to onMediaQueryChange handlers
    */
   ngOnInit() {
     this._mqActivation = this._$mq.attach(this, "flex", "");
   }

   /**
    *  Special mql callback used by MediaQueryActivation when a mql event occurs
    */
   ngOnMediaQueryChanges(changes: MediaQueryChanges) {
     this._updateWithValue( changes.current.value );
   }

  ngOnDestroy(){
    this._layoutWatcher.unsubscribe();
  }

  // *********************************************
  // Protected methods
  // ***************************************s******

  /**
   * Cache the parent container 'flex-direction' and update the 'ng-flex' styles
   */
  _onLayoutChange(direction) {
    this._layout = direction;

    let value = this.flex || "";
    if (isDefined( this._mqActivation )) {
      value = this._mqActivation.activatedInput;
    }

    this._updateWithValue( value );
  }

  _updateWithValue( value:string ) {
    let css = this._validateValue( this.grow, this.shrink, value );
    this._updateStyle(this._buildCSS( css ));
  }

  /**
   * Build the CSS that should be assigned to the element instance
   *
   *  BUG - min-height on a column flex container won’t apply to its flex item children in IE 10-11.
   *  Use height instead if possible.
   */
  _buildCSS(css) {
    return this._modernizer(css);
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
           'max-width'  : null,                                         // ! use `null` to remove styles
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
  selector:'[ng-flex-order]'
})
export class FlexOrderDirective extends BaseStyleDirective implements OnInit, OnChanges, OnMediaQueryChanges, OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation : MediaQueryActivation;

  @Input('ng-flex-order') order;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('ng-flex-order.xs')     orderXs;
  @Input('ng-flex-order.gt-xs')  orderGtXs;
  @Input('ng-flex-order.sm')     orderSm;
  @Input('ng-flex-order.gt-sm')  orderGtSm;
  @Input('ng-flex-order.md')     orderMd;
  @Input('ng-flex-order.gt-md')  orderGtMd;
  @Input('ng-flex-order.lg')     orderLg;
  @Input('ng-flex-order.gt-lg')  orderGtLg;
  @Input('ng-flex-order.xl')     orderXl;

  constructor(private _$mq: MediaQueryAdapter, elRef: ElementRef, renderer: Renderer) {
    super(elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

   /**
    * For @Input changes on the current mq activation property, delegate to the onLayoutChange()
    */
   ngOnChanges( changes?:SimpleChanges ) {
     let activated = this._mqActivation;
     let activationChange = activated && isDefined(changes[activated.activatedInputKey]);

     if ( isDefined(changes['order'])  || activationChange ) {
      this._updateWithValue();
     }
   }

    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit() {
      this._mqActivation = this._$mq.attach(this, "order", "1");
    }

    /**
     *  Special mql callback used by MediaQueryActivation when a mql event occurs
     */
    ngOnMediaQueryChanges(changes: MediaQueryChanges) {
      this._updateWithValue( changes.current.value );
    }

  // *********************************************
  // Protected methods
  // *********************************************

    _updateWithValue( value?:string ) {
    value = this.order || "";
    if (  isDefined(this._mqActivation) ) {
      value = this._mqActivation.activatedInput;
    }

     this._updateStyle(this._buildCSS( value ));
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
  selector:'[ng-flex-offset]'
})
export class FlexOffsetDirective extends BaseStyleDirective implements  OnInit, OnChanges, OnMediaQueryChanges, OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation : MediaQueryActivation;

  @Input('ng-flex-offset')       offset:string|number;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('ng-flex-offset.xs')     offsetXs   :string|number;
  @Input('ng-flex-offset.gt-xs')  offsetGtXs :string|number;
  @Input('ng-flex-offset.sm')     offsetSm   :string|number;
  @Input('ng-flex-offset.gt-sm')  offsetGtSm :string|number;
  @Input('ng-flex-offset.md')     offsetMd   :string|number;
  @Input('ng-flex-offset.gt-md')  offsetGtMd :string|number;
  @Input('ng-flex-offset.lg')     offsetLg   :string|number;
  @Input('ng-flex-offset.gt-lg')  offsetGtLg :string|number;
  @Input('ng-flex-offset.xl')     offsetXl   :string|number;

  constructor(private _$mq: MediaQueryAdapter, elRef: ElementRef, renderer: Renderer) {
    super(elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

   /**
    * For @Input changes on the current mq activation property, delegate to the onLayoutChange()
    */
   ngOnChanges( changes?:SimpleChanges ) {
     let activated = this._mqActivation;
     let activationChange = activated && isDefined(changes[activated.activatedInputKey]);
     if ( isDefined(changes['offset'])  || activationChange ) {
      this._updateWithValue();
     }
   }

    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit() {
      this._mqActivation = this._$mq.attach(this, "offset", 0);
    }

    /**
     *  Special mql callback used by MediaQueryActivation when a mql event occurs
     */
    ngOnMediaQueryChanges(changes: MediaQueryChanges) {
      this._updateWithValue( changes.current.value );
    }


  // *********************************************
  // Protected methods
  // *********************************************


  _updateWithValue( value?:string|number ) {
    value = value || this.offset || 0;
    if (  isDefined(this._mqActivation) ) {
      value = this._mqActivation.activatedInput;
    }

     this._updateStyle(this._buildCSS( value ));
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
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
@Directive({
  selector: '[ng-flex-align]'
})
export class FlexAlignDirective extends BaseStyleDirective implements OnInit, OnChanges, OnMediaQueryChanges, OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation : MediaQueryActivation;

  @Input('ng-flex-align') align : string = "stretch";    // default

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('ng-flex-align.xs')     alignXs;
  @Input('ng-flex-align.gt-xs')  alignGtXs;
  @Input('ng-flex-align.sm')     alignSm;
  @Input('ng-flex-align.gt-sm')  alignGtSm;
  @Input('ng-flex-align.md')     alignMd;
  @Input('ng-flex-align.gt-md')  alignGtMd;
  @Input('ng-flex-align.lg')     alignLg;
  @Input('ng-flex-align.gt-lg')  alignGtLg;
  @Input('ng-flex-align.xl')     alignXl;


  constructor(private _$mq: MediaQueryAdapter, elRef: ElementRef, renderer: Renderer) {
    super(elRef, renderer);
  }


  // *********************************************
  // Lifecycle Methods
  // *********************************************

   /**
    * For @Input changes on the current mq activation property, delegate to the onLayoutChange()
    */
   ngOnChanges( changes?:SimpleChanges ) {
     let activated = this._mqActivation;
     let activationChange = activated && isDefined(changes[activated.activatedInputKey]);
     if ( isDefined(changes['align'])  || activationChange ) {
      this._updateWithValue();
     }
   }

    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit() {
      this._mqActivation = this._$mq.attach(this, "align", "stretch");
    }

    /**
     *  Special mql callback used by MediaQueryActivation when a mql event occurs
     */
    ngOnMediaQueryChanges(changes: MediaQueryChanges) {
      this._updateWithValue( changes.current.value );
    }


  // *********************************************
  // Protected methods
  // *********************************************

  _updateWithValue( value?:string|number ) {
    value = value || this.align || "stretch";
    if (  isDefined(this._mqActivation) ) {
      value = this._mqActivation.activatedInput;
    }

     this._updateStyle(this._buildCSS( value ));
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

/**
 * 'ng-flex-fill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: [ng-flexFill] is NOT responsive ng-flex
 */
@Directive({
  selector: '[ng-flex-fill]'
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



// ************************************************************
// Private static variables
// ************************************************************

const GROW      = "grow";
const INITIAL   = "initial";
const AUTO      = "auto";
const NONE      = "none";
