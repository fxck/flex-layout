import 'rxjs/add/operator/map';

import {Directive, Injectable, NgZone} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {BreakPoint} from '../../media-query/breakpoints/break-point';
import {MediaChange} from '../../media-query/media-change';
import {MediaQueries} from '../../media-query/media-queries';

import {MediaQueryActivation} from './media-query-activation';
import {MediaQueryChanges, MediaQuerySubscriber} from './media-query-changes';
import {extendObject} from '../../utils/object-extend';

export declare type SubscriptionList = Subscription[];

const ON_DESTROY = 'ngOnDestroy';
const ON_MEDIA_CHANGES = 'onMediaQueryChanges';

export interface BreakPointX extends BreakPoint{
  key : string;
  baseKey : string;
}
/**
 *  Adapter between Layout API directives and the MediaQueries mdl service
 *
 *  Using this adapter encapsulates most of the complexity of mql subscriptions
 *  and insures lean integration-code in the Layout directives
 *
 */
@Injectable()
export class MediaQueryAdapter {
  private _breakpoints: BreakPoint[ ];

  /**
   *
   */
  constructor(private _mq: MediaQueries) {
    this._breakpoints = this._mq.breakpoints;
  }

  /**
   * Create a custom MQ Activation instance for each directive instance; the activation object
   * tracks the current mq-activated input and manages the calls to the directive's
   * `onMediaChanges( )`
   */
  attach(directive: Directive, property: string, defaultVal: string|number|boolean): MediaQueryActivation {
    let activation: MediaQueryActivation = new MediaQueryActivation(this._mq, directive, property, defaultVal);
    let list: SubscriptionList = this._linkOnMediaChanges(directive, property);

    this._listenOnDestroy(directive, list);

    return activation;
  }

  /**
   *
   */
  private _linkOnMediaChanges(directive: Directive, property: string) {
    let list: SubscriptionList = [], handler: MediaQuerySubscriber = directive[ON_MEDIA_CHANGES];

    if (handler) {
      let keys = this._buildRegistryMap(directive, property);
      list = this._configureChangeObservers(directive, property, keys, handler);
    }
    return list;
  }


  /**
   *
   */
  private _listenOnDestroy(directive: Directive, subscribers: SubscriptionList) {
    let onDestroyFn = directive[ON_DESTROY];
    if (onDestroyFn) {
      directive[ON_DESTROY] = function () {
        // Unsubscribe all for this directive
        subscribers.forEach((s: Subscription) => {
          s.unsubscribe();
        });
        onDestroyFn();

        // release array and restore original fn
        subscribers.length = 0;
        directive[ON_DESTROY] = onDestroyFn
      };
    }
  }


  /**
   * Build mediaQuery key-hashmap; only for the directive properties that are actually defined/used
   * in the HTML markup
   */
  private _buildRegistryMap(directive: Directive, key: string) {
    return this._breakpoints
        .map(bp => {
          return <BreakPointX> extendObject({}, bp, {
            baseKey : key,              // e.g.  layout, hide, self-align, flex-wrap
            key     : key + bp.suffix   // e.g.  layoutGtSm, layoutMd, layoutGtLg
          });
        })
        .filter( bp => (directive[  bp.key ] !== undefined));

  }

  /**
   * For each API property, register a callback to `onMediaChanges( )`(e:MediaQueryEvent)
   * Cache 1..n subscriptions for internal auto-unsubscribes during the directive ngOnDestory()
   * notification
   */
  private _configureChangeObservers(directive: Directive, property: string, breakpoints: any, callback: MediaQuerySubscriber): SubscriptionList {
    let subscriptions = [];

    breakpoints.forEach((bp:BreakPointX)=> {
      // Only subscribe if the directive API is defined (in use)
      if (directive[bp.key] != null) {
        let buildChanges = (change: MediaChange) => {
              // Inject directive default property key name: to let onMediaChange() calls
              // know which property is being triggered...
              change.property = property;
              return new MediaQueryChanges(null,  change);
            };
        let subscription = this._mq.observe(bp.alias).map(buildChanges).subscribe(change => {
          callback(change);
        });

        subscriptions.push(subscription);
      }
    });

    return subscriptions;
  }


}
