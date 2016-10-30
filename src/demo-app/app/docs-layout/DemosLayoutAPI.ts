import { Component } from '@angular/core';

@Component({
    selector: 'demos-docs-layout',
    template: `
      <demo-layout-alignment    class="small-demo">  </demo-layout-alignment>          
      <demo-flex-row-fill       class="small-demo">  </demo-flex-row-fill>
      <demo-flex-row-fill-wrap  class="small-demo">  </demo-flex-row-fill-wrap>
    `
})
export class DemosLayoutAPI { }

import {NgModule}            from '@angular/core';
import {CommonModule}        from "@angular/common";
import {FormsModule}         from "@angular/forms";

import {MaterialModule}      from "@angular/material";
import {LayoutsModule}       from "../../../lib/flexbox/_module";

import {DemoLayoutAlignment} from "./layoutAlignment.demo";
import {DemoFlexRowFill}     from "./flexRowFill.demo";
import {DemoFlexRowFillWrap} from "./flexRowFillWrap.demo";


@NgModule({
  declarations : [
    DemosLayoutAPI,       // used by the Router with the root app component

    DemoFlexRowFill,
    DemoFlexRowFillWrap,
    DemoLayoutAlignment
  ],
  imports : [
    CommonModule,
    FormsModule,
    MaterialModule,
    LayoutsModule
  ]

})
export class DemosLayoutAPIModule { }
