import { Component } from '@angular/core';

@Component({
    selector: 'demos-docs-layout',
    template: `
        <span class="title" style="font-size: 0.6em; font-weight:normal; padding-left: 20px;">
        Hint: Click on any of the samples below to toggle the layout direction.
        </span>

      <demo-simple-row-column   class="small-demo">  </demo-simple-row-column>
      <demo-flex-row-fill       class="small-demo">  </demo-flex-row-fill>
      <demo-flex-row-fill-wrap  class="small-demo">  </demo-flex-row-fill-wrap>
      <demo-layout-alignment    class="small-demo">  </demo-layout-alignment>          
    `
})
export class DemosLayoutAPI { }

import {NgModule}            from '@angular/core';
import {CommonModule}        from "@angular/common";
import {FormsModule}         from "@angular/forms";

import {LayoutsModule}       from "../../../lib/flexbox/_module";

import {DemoSimpleRowColumn} from "./simpleRowColumn.component";
import {DemoFlexRowFill}     from "./flexRowFill.component";
import {DemoLayoutAlignment} from "./demoLayoutAlignment.component";
import {DemoFlexRowFillWrap} from "./flexRowFillWrap.component";
import {MaterialModule} from "@angular/material";


@NgModule({
  declarations : [
    DemosLayoutAPI,       // used by the Router with the root app component

    DemoSimpleRowColumn,
    DemoFlexRowFill,
    DemoFlexRowFillWrap,
    DemoLayoutAlignment
  ],
  imports : [
    LayoutsModule,
    CommonModule,
    FormsModule,
    MaterialModule
  ]

})
export class DemosLayoutAPIModule { }
