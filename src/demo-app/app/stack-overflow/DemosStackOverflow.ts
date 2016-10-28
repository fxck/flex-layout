import {Component, NgModule} from '@angular/core';
import { DemoComplexColumnOrder } from "./columnOrder.component";
import {LayoutsModule} from "../../../lib/flexbox/_module";

@Component({
  selector: 'demos-stackoverflow',
  template: `
    <div ng-layout="row"></div>
    <demo-complex-column-ordering class="small-demo" ></demo-complex-column-ordering>
  `
})
export class DemosStackOverflow { }

@NgModule({
  declarations : [
    DemosStackOverflow,     // used by the Router with the root app component
    DemoComplexColumnOrder
  ],
  imports : [
    LayoutsModule
  ]
})
export class DemosStackOverflowModule{  }
