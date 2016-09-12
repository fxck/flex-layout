import {NgModule, ModuleWithProviders} from '@angular/core';

import { LayoutDirectivesModule } from './api/layout';
import { FlexDirectiveModule } from './api/flex';



const LAYOUTS_MODULES = [
  LayoutDirectivesModule,
  FlexDirectiveModule
];

@NgModule({
  imports: LAYOUTS_MODULES,
  exports: LAYOUTS_MODULES
})
export class LayoutsRootModule { }


@NgModule({
  imports: LAYOUTS_MODULES,
  exports: LAYOUTS_MODULES,
})
export class LayoutsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LayoutsRootModule,
      providers : [ ]
    };
  }
}


