import {Component, OnInit, NgModule} from '@angular/core';
import { DemoIssue5345 } from "./issue.5345.component";

@Component({
    selector: 'demos-github-issues',
    template: `
        <h2>Demos from GitHub Issues</h2>
        
        <demo-issue-5345></demo-issue-5345>
    `
})
export class DemosGithubIssues implements OnInit {
    constructor() { }
    ngOnInit() { }
}

@NgModule({
  declarations : [ DemoIssue5345 ]
})
export class DemosGithubIssuesModule{ }
