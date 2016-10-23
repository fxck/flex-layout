import { Directive, Injectable } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { isDefined } from '../../utils/global';

import { MediaQueries, MediaQueryChange } from "./media-queries";
import {BreakPoints} from "./break-points";

const ON_MEDIA_CHANGES = 'ngOnMediaQueryChanges';
const ON_DESTROY = 'ngOnDestroy';

// ****************************************************************
// Exported Types and Interfaces
// ****************************************************************

export interface InputKeys {
  previous : string;
  current : string;
}

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

  /**
   * For the specified @Input property, build input property names for the associated
   * mq changes. These names are used to easily lookup the associated property values.
   */
  public extractInputKeysFor( baseKey:string ): InputKeys {
    let current = this.current, previous = this.previous;
    let previousKey = previous ? baseKey + previous.suffix : undefined;
    let currentKey = baseKey + current.suffix;

    this._logMediaQueryChanges( baseKey );

    return {
      previous : previousKey,
      current : currentKey
    };
  }

  /**
   * Internal Logging mechanism
   */
  private _logMediaQueryChanges( baseKey : string = "" ) {
    let current = this.current, previous = this.previous;

    if ( current && current.mqAlias == "" )  current.mqAlias = "all";
    if ( previous && previous.mqAlias == "" ) previous.mqAlias = "all";

    if ( previous ) {
      let pMessage = `%c mqChange[previous]: ${baseKey}.${previous.mqAlias} = ${previous.matches}`;
      console.log(pMessage, 'background: #cecece; color: #3749A4');
    }
    console.log( `mqChange[current]: ${baseKey}.${current.mqAlias} = ${current.matches};` );
  }
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
   *
   */
  attach(directive : Directive,  property :string ) {
    let handler = directive[ ON_MEDIA_CHANGES ];

    if ( handler ) {
      let keys = this._buildRegistryMap(directive, property);

      this._listenOnDestroy( directive, this._configureChangeObservers(directive, keys, handler.bind(directive)) );
    }
  }

  /**
   *
   */
  private _listenOnDestroy ( directive : Directive, subscribers:SubscriptionList ) {
    let onDestroyFn = directive[ ON_DESTROY ];
    if ( onDestroyFn ){
      onDestroyFn = onDestroyFn.bind(directive);

      directive[ ON_DESTROY ] = function () {
        subscribers.forEach( (s:Subscription) => {
          s.unsubscribe();
        });
        onDestroyFn();

        // release array
        subscribers.length = 0;
      };
    }
  }

  /**
   * For each API property, register a callback to ngOnMediaQueryChanges(e:MediaQueryEvent)
   * Cache 1..n subscriptions for internal auto-unsubscribes during the directive ngOnDestory() notification
   */
  private _configureChangeObservers(directive : Directive, keys : any, subscriber : MediaQuerySubscriber ) : SubscriptionList {
    let subscriptions = [ ];

    keys.forEach(it => {
      // Only subscribe if the directive API is defined (in use)
      if ( isDefined(directive[it.key]) ) {

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
          key   : key + it.suffix,
          alias : it.alias
        }
      }).filter( it => isDefined(directive[ it.key ]) );
  }

  /**
   * Is the current activation event different from the last activation event ?
   */
  private _isDifferentChange(previous:MediaQueryChange, current:MediaQueryChange):boolean {
    return current && current.matches && (current.mqAlias != (previous ? previous.mqAlias : ""));
  }
}
