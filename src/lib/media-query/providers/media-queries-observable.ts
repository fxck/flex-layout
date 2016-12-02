import {OpaqueToken} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import {BreakPoint} from '../breakpoints/break-point';
import {BreakPoints} from '../breakpoints/break-points';

import {MediaChange} from '../media-change';
import {MediaQueries} from '../media-queries';
import {mergeAlias} from '../../utils/add-alias';

/**
 *  Opaque Token unique to the flex-layout library.
 *  Note: Developers must use this token when building their own custom `MediaQueryObservable`
 *  provider (see below).
 */
export const MediaQuery$: OpaqueToken = new OpaqueToken('fx-observable-media-query');

/**
 *  Provider to return observable to ALL MediaQuery events
 *  Developers should build custom providers to override this default MediaQuery Observable
 */
export const MediaQueryObservable = {
  provide: MediaQuery$,
  deps: [MediaQueries, BreakPoints],
  useFactory: (mq: MediaQueries, breakpoints: BreakPoints) => {
    // If available add breakpoint alias information associated with the mediaQuery
    let onlyActivates = (change : MediaChange) => change.matches;
    return mq.observe().filter(onlyActivates).map((change: MediaChange) => {
      let bp: BreakPoint = breakpoints.findByQuery(change.mediaQuery);
      return mergeAlias(change, bp);
    });
  }
};
