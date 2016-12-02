import {OpaqueToken, NgModule, ModuleWithProviders} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {BreakPoint} from './break-point';
import {BreakPoints} from './break-points';
import {BreakPointsDataset} from "./break-points-dataset";


import {MatchMedia} from './match-media';
import {MediaQueries} from './media-queries';
import {MediaQueryObservable} from './media-queries-observable';

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */


@NgModule({
  providers: [
    MatchMedia,                // Low-level service to publish observables around window.matchMedia()
    BreakPoints,               // Registry of known BreakPoint(s)
    MediaQueries,              // MediaQuery service that easily observes all known breakpoints
    BreakPointsDataset,        // Supports developer overrides of list of known breakpoints
    MediaQueryObservable       // Allows easy subscription to injectable `mediaQuery$` observable
  ]
})
export class MediaQueriesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MediaQueriesModule
    };
  }
}
