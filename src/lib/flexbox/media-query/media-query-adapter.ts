import {Directive, Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { isDefined } from '../../utils/global';

import { MediaQueries, MediaQueryChange } from "./media-queries";
import { BreakPoints } from "./break-points";

const ON_MEDIA_CHANGES = 'ngOnMediaQueryChanges';
const ON_DESTROY = 'ngOnDestroy';

// ****************************************************************
// Exported Types and Interfaces
// ****************************************************************

export type MediaQuerySubscriber = (e:MediaQueryChanges) => { };


/**
 * @whatItDoes Lifecycle hook that is called when any mediaQuery breakpoint changes.
 * @howToUse
 *
 * @description
 * `ngOnMediaQueryChanges` is called right after the a MediaQueryChange has occurred.
 */
export declare abstract class OnMediaQueryChanges {
    abstract ngOnMediaQueryChanges(changes: MediaQueryChanges): void;
}

export declare type SubscriptionList = Array<Subscription>;

// ****************************************************************
// ****************************************************************


/**
 * MQ Notification data emitted to external observers
 *
 * Contains usefule 'extractInputKeysFor()' method to easily map mq changes to input
 * property value lookups.
 *
 */
export class MediaQueryChanges {

  constructor(public previous : MediaQueryChange, public current : MediaQueryChange) { }

}


/**
 *  Adapter between Layout API directives and the MediaQueries mdl service
 *
 *  Using this adapter encapsulates most of the complexity of mql subscriptions
 *  and insures lean integration-code in the Layout directives
 */
@Injectable()
export class MediaQueryAdapter {

  private _breakpoints : BreakPoints;
  private _$mq : MediaQueries;

  /**
   *
   */
  constructor(breakpoints : BreakPoints) {
    this._breakpoints = breakpoints;
    this._$mq = new MediaQueries( breakpoints );
  }

  /**
   * Create a custom MQ Activation instance for each directive instance; the activation object
   * tracks the current mq-activated input and manages the calls to the directive's ngOnMediaQueryChanges
   */
  attach(directive : Directive,  property :string, defaultVal:string ) : MediaQueryActivation {
    let activation : MediaQueryActivation = new MediaQueryActivation(directive, property, defaultVal );
    let list : SubscriptionList = this._linkOnMediaChanges( directive, property );

    this._listenOnDestroy( directive, list );

    return activation;
  }

  /**
   *
   */
  private _linkOnMediaChanges(directive : Directive,  property :string) {
    let list : SubscriptionList,
        handler : MediaQuerySubscriber = directive[ ON_MEDIA_CHANGES ];

    if ( handler  ) {
      let keys = this._buildRegistryMap(directive, property);
      list = this._configureChangeObservers(directive, keys, handler );
    }
    return list;
  }


  /**
   *
   */
  private _listenOnDestroy ( directive : Directive, subscribers:SubscriptionList ) {
    let onDestroyFn = directive[ ON_DESTROY ];
    if ( onDestroyFn ){
      directive[ ON_DESTROY ] = function () {
        subscribers.forEach( (s:Subscription) => {
          s.unsubscribe();
        });
        onDestroyFn();

        // release array
        subscribers.length = 0;
        directive[ ON_DESTROY ] = onDestroyFn
      };
    }

    // Return detach...
    return directive[ ON_DESTROY ];
  }

  /**
   * For each API property, register a callback to ngOnMediaQueryChanges(e:MediaQueryEvent)
   * Cache 1..n subscriptions for internal auto-unsubscribes during the directive ngOnDestory() notification
   */
  private _configureChangeObservers(directive : Directive, keys : any, subscriber : MediaQuerySubscriber ) : SubscriptionList {
    let subscriptions = [ ];

    keys.forEach(it => {
      // Only subscribe if the directive API is defined (in use)
      if (isDefined( directive[it.key] )) {
          let lastEvent : MediaQueryChange,
              mergeWithLastEvent = (current:MediaQueryChange) : MediaQueryChanges => {
                let previous = lastEvent;
                if ( this._isDifferentChange(lastEvent, current) ) lastEvent = current;

                return new MediaQueryChanges(previous, current);
              },
              subscription = this._$mq.observe( it.alias )
                  .map( mergeWithLastEvent )
                  .subscribe( subscriber );

          subscriptions.push( subscription );
      }
    });

    return subscriptions;
  }

  /**
   * Build mediaQuery key-hashmap; only for the directive properties that are actually defined
   */
  private _buildRegistryMap(directive : Directive, key:string) {
    return this._breakpoints.registry
      .map(it => {
        return {
          alias : it.alias,           // e.g.  gt-sm, md, gt-lg
          key   : key + it.suffix     // e.g.  layoutGtSm, layoutMd, layoutGtLg
        }
      }).filter( it => isDefined(directive[ it.key ]) );
  }

  /**
   * Is the current activation event different from the last activation event ?
   */
  private _isDifferentChange(previous:MediaQueryChange, current:MediaQueryChange):boolean {
    return current.matches || (!current.matches && current.mqAlias != (previous ? previous.mqAlias : ""));
  }
}



/**
 *
 */
export class MediaQueryActivation implements OnMediaQueryChanges, OnDestroy {

  private _onDestroy           : Function;
  private _onMediaQueryChanges : Function;
  private _activatedInputKey   : string;

  /**
   * Get the currently activated @Input value or the fallback default @Input value
   */
  get activatedInput():any {
    let key = this._activatedInputKey || this._baseKey;
    return this._directive[ key ] || this._defaultValue;
  }

  /**
   *
   */
  constructor(private _directive:Directive, private _baseKey:string, private _defaultValue:string ){
      this._interceptLifeCyclEvents();
  }

  /**
   * MediaQueryChanges interceptor that tracks the current mq-activated @Input and calculates the
   * mq-activated input value or the default value
   */
  ngOnMediaQueryChanges( changes:MediaQueryChanges ) {
    debugger;

    this._activatedInputKey = changes.current.matches ? (this._baseKey + changes.current.suffix) : undefined;

    let current = changes.current;

    current.value = this.activatedInput;
    changes = new MediaQueryChanges( changes.previous, current );

    this._logMediaQueryChanges( changes );
    this._onMediaQueryChanges( changes );

  }

  /**
   * Remove interceptors, restore original functions, and forward the onDestroy() call
   */
  ngOnDestroy() {
    this._directive[ ON_DESTROY ] = this._onDestroy;
    this._directive[ ON_MEDIA_CHANGES ] = this._onMediaQueryChanges;
    try {

      this._onDestroy();

    } finally {
      this._onDestroy = undefined;
      this._onMediaQueryChanges = undefined;
      this._directive = undefined;
    }
  }

  /**
   * Head-hook onDestroy and onMediaQueryChanges methods on the directive instance
   */
  private _interceptLifeCyclEvents() {
    this._onDestroy           = this._directive[ ON_DESTROY ].bind(this._directive);
    this._onMediaQueryChanges = this._directive[ ON_MEDIA_CHANGES ].bind(this._directive);

    this._directive[ ON_DESTROY ]       = this.ngOnDestroy.bind(this);
    this._directive[ ON_MEDIA_CHANGES ] = this.ngOnMediaQueryChanges.bind(this);
  }

  /**
   * Internal Logging mechanism
   */
  private _logMediaQueryChanges( changes:MediaQueryChanges ) {
    let current = changes.current, previous = changes.previous;

    if ( current && current.mqAlias == "" )  current.mqAlias = "all";
    if ( previous && previous.mqAlias == "" ) previous.mqAlias = "all";

    console.log( `mqChange[ matches = ${current.matches} ]: ${this._baseKey}.${current.mqAlias} = ${changes.current.value};` );
  }
}


