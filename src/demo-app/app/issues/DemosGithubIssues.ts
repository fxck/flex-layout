import {Component, NgModule} from '@angular/core';
import { DemoIssue5345 } from "./issue.5345.component";
import {LayoutsModule} from "../../../lib/flexbox/_module";

@Component({
    selector: 'demos-github-issues',
    template: `
        <demo-issue-5345></demo-issue-5345>
    `
})
export class DemosGithubIssues { }

@NgModule({
  declarations : [
    DemosGithubIssues,      // used by the Router with the root app component
    DemoIssue5345
  ],
  imports : [
    LayoutsModule
  ]
})
export class DemosGithubIssuesModule{ }
