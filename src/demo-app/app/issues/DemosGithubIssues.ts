import {Component} from '@angular/core';

@Component({
    selector: 'demos-github-issues',
    template: `
        <demo-issue-5345></demo-issue-5345>
    `
})
export class DemosGithubIssues { }

import {NgModule}            from '@angular/core';
import {CommonModule}        from "@angular/common";

import {MaterialModule}      from "@angular/material";
import {LayoutsModule}       from "../../../lib/flexbox/_module";

import { DemoIssue5345 }     from "./issue.5345.demo";

@NgModule({
  declarations : [
    DemosGithubIssues,      // used by the Router with the root app component
    DemoIssue5345
  ],
  imports : [
    CommonModule,
    MaterialModule,
    LayoutsModule
  ]
})
export class DemosGithubIssuesModule{ }
