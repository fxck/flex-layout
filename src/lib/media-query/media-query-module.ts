import {OpaqueToken, NgModule, ModuleWithProviders} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {BreakPoint} from './breakpoints/break-point';
import {BreakPoints} from './breakpoints/break-points';
import {BreakPointsDataset} from "./providers/break-points-dataset";


import {MatchMedia} from './match-media';
import {MediaMonitor} from './media-monitor';
import {MatchMediaObservableProvider} from './providers/match-media-provider';

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */


@NgModule({
  providers: [
    BreakPoints,               // Registry of known BreakPoint(s)
    MatchMedia,                // Low-level service to publish observables around window.matchMedia()
    MediaMonitor,              // MediaQuery service that easily observes all known breakpoints
    BreakPointsDataset,        // Supports developer overrides of list of known breakpoints
    MatchMediaObservableProvider       // Allows easy subscription to injectable `mediaQuery$` observable
  ]
})
export class MediaQueriesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MediaQueriesModule
    };
  }
}
