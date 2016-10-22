import { NgModule } from '@angular/core';

import { BreakPoints } from "./break-points";
import { MediaQueries } from "./media-queries";
import { MediaQueryAdapter } from "./media-query-adapter";


const ALL_COMPONENTS = [
  BreakPoints,
  MediaQueries,
  MediaQueryAdapter
];

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */


@NgModule({
  declarations : [ ],
  providers : [
    BreakPoints,
    MediaQueryAdapter
  ]
})
export class MediaQueriesModule {
  static forRoot() {
    return {
      ngModule : MediaQueriesModule,
      providers : [
        BreakPoints     // Default Breakpoints for application
      ]
    };
  }
}
