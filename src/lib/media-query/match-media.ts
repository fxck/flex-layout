import {Injectable, NgZone} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
// RxJS Operators used by the classes...
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {MediaChange} from './media-change';

/**
 * EventHandler callback with the mediaQuery [range] activates or deactivates
 */
export interface MediaQueryListListener {
  // Function with Window's MediaQueryList argument
  (mql: MediaQueryList): void;
}

/**
 * EventDispatcher for a specific mediaQuery [range]
 */
export interface MediaQueryList {
  readonly matches: boolean;
  readonly media: string;
  addListener(listener: MediaQueryListListener): void;
  removeListener(listener: MediaQueryListListener): void;
}


/**
 * MediaQueries configures listeners to mediaQuery changes and publishes an Observable facade to convert
 * mediaQuery change callbacks to subscriber notifications. These notifications will be performed within the
 * ng Zone to trigger change detections and component updates.
 */
@Injectable()
export class MatchMedia {
  private _registry: Map<string, MediaQueryList> = new Map( );
  private _source: BehaviorSubject<MediaChange>;
  private _observable$: Observable<MediaChange>;

  constructor(private _zone: NgZone) {
  }


  /**
   * For the specified mediaQuery?
   */
  isActive(mediaQuery: string): boolean {
    if ( this._registry.has(mediaQuery) ) {
      let mql = this._registry.get(mediaQuery);
      return  mql.matches;
    }
    return false;
  }

  /**
   * External observers can watch for all (or a specific) mql changes.
   * Typically used by the MediaQueryAdaptor; optionally available to components
   * who wish to use the MediaQueries as $mdMedia service.
   *
   * NOTE: if a mediaQuery is not specified, then ALL mediaQuery changes (registered) will
   *       be announced; including activation and deactivation.
   */
  observe(mediaQuery?: string): Observable<MediaChange> {
    this._prepareWatchers(mediaQuery);

    return this._observable$
      .filter((e: MediaChange) => !!mediaQuery ? e.mediaQuery === mediaQuery : false );
  }

  /**
   * Based on the BreakPoints provider, register internal listeners for each unique mediaQuery
   * Each listener emits specific MediaChange data to observers
   */
  private _prepareWatchers(mediaQuery: string) {
    if ( mediaQuery ) {
      let mql = this._registry.get(mediaQuery);
      if (!mql) {
        let onMQLEvent = (mql: MediaQueryList) => {
          this._zone.run(() => {
            let change = new MediaChange(mql.matches, mediaQuery);
            this._source.next(change);
          });
        };

        mql = this._buildMQL(mediaQuery);
        mql.addListener(onMQLEvent);

        this._registry.set(mediaQuery, mql);
        if (mql.matches) {
          onMQLEvent(mql);  // Announce activate range for initial subscribers
        }
      }
    }

  }

  private _buildMQL(query: string): MediaQueryList {
    let canListen = !!(<any>window).matchMedia('all').addListener;

    prepareQueryCSS(query);

    return canListen ? (<any>window).matchMedia(query) : <MediaQueryList>{
      matches: query === 'all' || query === '',
      media: query,
      addListener: () => {
      },
      removeListener: () => {
      }
    };
  }

}

/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES = {};

/**
 * For Webkit engines that only trigger the MediaQueryListListener
 * when there is at least one CSS selector for the respective media query.
 *
 * @param query string The mediaQuery used to create a faux CSS selector
 *
 */
function prepareQueryCSS(query) {
  if (!ALL_STYLES[query]) {
    try {
      let style = document.createElement('style');

      style.setAttribute('type', 'text/css');
      if (!style['styleSheet']) {
        let cssText = `@media ${query} {.fx-query-test{ }}`;
        style.appendChild(document.createTextNode(cssText));
      }

      document.getElementsByTagName('head')[0].appendChild(style);

      // Store in private global registry
      ALL_STYLES[query] = style;

    } catch (e) {
      console.error(e);
    }
  }
}

