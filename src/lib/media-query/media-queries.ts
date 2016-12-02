import {Injectable} from '@angular/core';

import {BreakPoint} from './break-point';
import {BreakPoints} from './break-points';
import {MatchMedia} from './match-media';
import {MediaChange} from './media-change';

import {Observable} from 'rxjs/Observable';

/**
 * MediaQueries uses the MatchMedia service to observe mediaQuery changes; which are published as
 * MediaChange notifications. These notifications will be performed within the
 * ng Zone to trigger change detections and component updates.
 */
@Injectable()
export class MediaQueries {
  constructor(private _breakpoints: BreakPoints, private _matchMedia: MatchMedia) { }

  /**
   * Read-only accessor to the list of breakpoints configured in the BreakPoints provider
   */
  get breakpoints(): BreakPoint[] {
    return [...this._breakpoints.registry];
  }

  get activeOverlaps(): BreakPoint[] {
    let items: BreakPoint[] = this._breakpoints.overlappings.reverse();
    return items.filter((bp: BreakPoint) => {
      return this._matchMedia.isActive(bp.mediaQuery);
    })
  }

  get active(): BreakPoint {
    let found = null, items = this.breakpoints.reverse();
    items.forEach(bp => {
      if (bp.alias !== '') {
        if (!found && this._matchMedia.isActive(bp.mediaQuery)) {
          found = bp;
        }
      }
    });

    let first = this.breakpoints[0];
    return found || (this._matchMedia.isActive(first.mediaQuery) ? first : null);
  }

  /**
   * For the specified mediaQuery alias, is the mediaQuery range active?
   */
  isActive(alias: string): boolean {
    let bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
    return this._matchMedia.isActive(bp ? bp.mediaQuery : alias);
  }

  /**
   * External observers can watch for all (or a specific) mql changes.
   * If specific breakpoint is observed, only return *activated* events
   * otherwise return all events for both activated + deactivated changes.
   */
  observe(alias?: string): Observable<MediaChange> {
    let bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
    let result$ = bp ?  this._matchMedia.observe(bp.mediaQuery).filter( e => e.matches ) : null;

    return  result$ || this._matchMedia.observe( alias );
  }
}
