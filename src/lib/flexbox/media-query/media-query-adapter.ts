import { Directive, Injectable } from "@angular/core";
import { MediaQueries, MediaQueryChange } from "./media-queries";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/map';

import { isDefined } from '../../utils/global';

const ON_MEDIA_CHANGES = 'ngOnMediaQueryChanges';
const ON_DESTROY = 'ngOnDestroy';

// ****************************************************************
// Exported Types and Interfaces
// ****************************************************************

export interface MediaQueryChanges {
  previous : MediaQueryChange;
  current : MediaQueryChange;
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

@Injectable()
export class MediaQueryAdapter {

  /**
   *
   */
  constructor(public $mq : MediaQueries) { }

  /**
   *
   */
  attach(directive : Directive,  property :string ) {
    let handler = directive[ ON_MEDIA_CHANGES ];

    if ( handler ) {
      let keys = this._buildMediaQueryKeysFor(directive, property);

      this._listenOnDestroy( directive, this._listenMediaChanges(directive, keys, handler.bind(directive)) );
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
      };
    }
  }

  /**
   * For each API property, register a callback to ngOnMediaQueryChanges(e:MediaQueryEvent)
   * Cache 1..n subscriptions for internal auto-unsubscribes during the directive ngOnDestory() notification
   */
  private _listenMediaChanges( directive : Directive, keys : any, subscriber : MediaQuerySubscriber ) : SubscriptionList {
    let subscriptions = [ ];

    keys.forEach(it => {
      // Only subscribe if the directive API is defined (in use)
      if ( isDefined(directive[it.key]) ) {

          let lastEvent : MediaQueryChange,
              mergeWithLastEvent = function (e:MediaQueryChange) : MediaQueryChanges {
                let previous = lastEvent;
                    lastEvent = e;
                return {  previous : previous, current : e };
              },
              subscription = this.$mq.observe( it.alias )
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
  private _buildMediaQueryKeysFor(directive : Directive, key:string) {
    return this.$mq.breakpoints
      .map(it => {
        return {
          key   : key + it.suffix,
          alias : it.alias
        }
      }).filter( it => isDefined(directive[ it.key ]) );
  }
}
