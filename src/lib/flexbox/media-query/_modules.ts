import { NgModule } from '@angular/core';

import { BreakPoints } from "../../media-query/break-points";
import { MediaQueries } from "../../media-query/media-queries";
import { MediaQueryAdapter } from "./media-query-adapter";

// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';


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
