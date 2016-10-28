import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule }   from "@angular/router";
import { MaterialModule } from "@angular/material";

import { LayoutsModule }  from "../../lib/flexbox/"; //"@angular/layouts";

import { DemoApp }                  from './demo-app/demo-app.component';
import { DEMO_APP_ROUTES }          from "./demo-app-routes";
import { DemosStackOverflowModule } from "./stack-overflow/DemosStackOverflow";
import { DemosGithubIssuesModule }  from './issues/DemosGithubIssues';
import { DemosLayoutAPIModule }     from './docs-layout/DemosLayoutAPI';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";


@NgModule({
  declarations    : [
    DemoApp
  ],
  imports         : [
    BrowserModule,
    RouterModule.forRoot(DEMO_APP_ROUTES),
    MaterialModule.forRoot(),
    LayoutsModule.forRoot(),

    /* Internal Demo App Modules */
    DemosStackOverflowModule,
    DemosGithubIssuesModule,
    DemosLayoutAPIModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap       : [ DemoApp ]
})
export class DemoAppModule { }
