import {Routes} from '@angular/router';

import {DemosLayoutAPI}     from "./docs-layout/DemosLayoutAPI";
import {DemosGithubIssues}  from "./issues/DemosGithubIssues";
import {DemosStackOverflow} from "./stack-overflow/DemosStackOverflow";

export const DEMO_APP_ROUTES: Routes = [
  {path: ''             , redirectTo: '/docs', pathMatch: 'full'},
  {path: 'docs'         , component: DemosLayoutAPI},
  {path: 'issues'       , component: DemosGithubIssues},
  {path: 'stackoverflow', component: DemosStackOverflow}

];
