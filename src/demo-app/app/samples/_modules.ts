import { NgModule } from '@angular/core';

import { SimpleRowColumnComponent } from './simpleRowColumn';
import { FlexRowFillComponent } from './flexRowFill.component';
import { FlexRowFillWrapComponent } from './flexRowFillWrap.component';
import { ComplexColumnOrderComponent } from './columnOrder.component'


const ALL_COMPONENTS = [
  SimpleRowColumnComponent,
  FlexRowFillComponent,
  FlexRowFillWrapComponent,
  ComplexColumnOrderComponent
];


@NgModule({
  declarations: ALL_COMPONENTS,
  exports: ALL_COMPONENTS
})
export class SamplesModule { }


