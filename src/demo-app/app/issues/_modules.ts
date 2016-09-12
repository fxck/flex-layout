import { NgModule } from '@angular/core';

import { Issue5345Component } from './issue.5345.component';

const ALL_COMPONENTS = [
  Issue5345Component
];

@NgModule({
  declarations: ALL_COMPONENTS,
  exports: ALL_COMPONENTS
})
export class IssuesModule { }
