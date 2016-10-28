import {Component, NgModule} from '@angular/core';
import { DemoComplexColumnOrder } from "./columnOrder.component";

@Component({
  selector: 'demos-stackoverflow',
  template: `
    <h2>Demos from StackOverflow Samples</h2>
    
    <div ng-layout="row"></div>
    <!--<demo-complex-column-ordering class="small-demo" ></demo-complex-column-ordering>-->
  `
})
export class DemosStackOverflow { }

@NgModule({
  declarations : [
    // DemoComplexColumnOrder,
    DemosStackOverflow
  ]

})
export class DemosStackOverflowModule{ }
