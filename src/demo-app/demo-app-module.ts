import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LayoutsModule } from "../lib/flexbox/all";

import { DemoAppComponent } from './app/demo-app.component';

import { SimpleRowColumnComponent } from './app/samples/simpleRowColumn';
import { FlexRowFillComponent } from './app/samples/flexRowFill.component';
import { flexRowFillWrapComponent } from './app/samples/flexRowFillWrap.component';

import { Issue5345Component } from './app/issues/issue.5345.component';

@NgModule({

  declarations    : [
    DemoAppComponent,
    SimpleRowColumnComponent,
    FlexRowFillComponent,
    flexRowFillWrapComponent,
    Issue5345Component
  ],
  imports         : [ LayoutsModule, BrowserModule ],
  bootstrap       : [ DemoAppComponent ]
})
export class DemoAppModule { }

