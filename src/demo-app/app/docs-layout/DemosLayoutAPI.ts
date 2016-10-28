import {Component, OnInit } from '@angular/core';

@Component({
    selector: 'demos-docs-layout',
    template: `
      <h2>Demos from ngM1 Layout Docs  
        <span class="title" style="font-size: 0.6em; font-weight:normal; padding-left: 20px;">
        Hint: Click on any of the samples below to toggle the layout direction.
        </span>
      </h2>

      <demo-simple-row-column   class="small-demo">  </demo-simple-row-column>
      <demo-flex-row-fill       class="small-demo">  </demo-flex-row-fill>
      <demo-flex-row-fill-wrap  class="small-demo">  </demo-flex-row-fill-wrap>
      <demo-layout-alignment    class="small-demo">  </demo-layout-alignment>          
    `
})
export class DemosLayoutAPI implements OnInit {
    constructor() { }
    ngOnInit() { }
}



import { NgModule } from '@angular/core';

import {DemoSimpleRowColumn} from "./simpleRowColumn.component";
import {DemoFlexRowFill}     from "./flexRowFill.component";
import {DemoLayoutAlignment} from "./demoLayoutAlignment.component";
import {DemoFlexRowFillWrap} from "./flexRowFillWrap.component";


@NgModule({
  declarations : [
    DemoSimpleRowColumn,
    DemoFlexRowFill,
    DemoFlexRowFillWrap,
    DemoLayoutAlignment
  ]
})
export class DemosLayoutAPIModule{ }
