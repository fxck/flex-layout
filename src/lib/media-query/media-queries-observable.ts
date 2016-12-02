import { OpaqueToken } from '@angular/core';
import {Observable} from "rxjs/Observable";

import {MediaChange} from './media-change';
import {MatchMedia} from './match-media';
import {BreakPoints} from './break-points';
import {MediaQueries} from './media-queries';

/**
 *  Opaque Token unique to the flex-layout library.
 *  Use this token when build a custom provider (see below).
 */
export const MEDIA_QUERY_OBSERVABLE : OpaqueToken = new OpaqueToken('fx-observable-media-query');

/**
 *  Provider to return observable to ALL MediaQuery events
 *  Developers should build custom providers to override this default MediaQuery Observable
 */
export const MediaQueryObservable = {
  provide: MEDIA_QUERY_OBSERVABLE,
  deps: [ MediaQueries ],
  useFactory: (mq:MediaQueries) => mq.observe()
};
