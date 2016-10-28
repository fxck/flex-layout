import {Routes} from '@angular/router';

import {DemosLayoutAPI}     from "./docs-layout/DemosLayoutAPI";
import {DemosGithubIssues}  from "./issues/DemosGithubIssues";
import {DemosStackOverflow} from "./stack-overflow/DemosStackOverflow";

export const DEMO_APP_ROUTES: Routes = [
  // {path: ''             , component: DemosLayoutAPI},
  // {path: 'issues'       , component: DemosGithubIssues},
  {path: '', component: DemosStackOverflow}

];
