import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LayoutsModule } from "../../lib/flexbox/all";
import { DemoAppComponent } from './demo-app.component';

// import { IssuesModule} from './issues/_modules';
// import { SamplesModule } from './samples/_modules';
//
// @NgModule({
//   declarations    : [
//     DemoAppComponent
//   ],
//   imports         : [ LayoutsModule, BrowserModule, IssuesModule, SamplesModule],
//   bootstrap       : [ DemoAppComponent ]
// })
// export class DemoAppModule { }



import { SimpleRowColumnComponent } from './samples/simpleRowColumn';
import { FlexRowFillComponent } from './samples/flexRowFill.component';
import { FlexRowFillWrapComponent } from './samples/flexRowFillWrap.component';
import { ComplexColumnOrderComponent } from './samples/columnOrder.component'
import { Issue5345Component } from './issues/issue.5345.component';

@NgModule({

  declarations    : [
    DemoAppComponent,

    SimpleRowColumnComponent,
    FlexRowFillComponent,
    FlexRowFillWrapComponent,
    ComplexColumnOrderComponent,

    Issue5345Component
  ],
  imports         : [ LayoutsModule, BrowserModule ],
  bootstrap       : [ DemoAppComponent ]
})
export class DemoAppModule { }
