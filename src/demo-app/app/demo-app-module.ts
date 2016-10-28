import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { RouterModule }   from "@angular/router";
import { MaterialModule } from "@angular/material";

import { LayoutsModule }  from "../../lib/flexbox/"; //"@angular/layouts";

import { DemoApp }                                     from './demo-app/demo-app.component';
import { DEMO_APP_ROUTES }                             from "./demo-app-routes";
// import { DemosLayoutAPI, DemosLayoutAPIModule}         from "./docs-layout/DemosLayoutAPI";
// import { DemosGithubIssues, DemosGithubIssuesModule}   from "./issues/DemosGithubIssues";
import {DemosStackOverflow, DemosStackOverflowModule} from "./stack-overflow/DemosStackOverflow";
import {DemoComplexColumnOrder} from "./stack-overflow/columnOrder.component";


@NgModule({
  declarations    : [
    // DemosLayoutAPI,
    // DemosGithubIssues,
    DemoApp
  ],
  imports         : [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(DEMO_APP_ROUTES),
    MaterialModule.forRoot(),
    LayoutsModule.forRoot(),
    DemosStackOverflowModule
    // DemosGithubIssuesModule,
    // DemosLayoutAPIModule
  ],
  bootstrap       : [ DemoApp ],
})
export class DemoAppModule { }
