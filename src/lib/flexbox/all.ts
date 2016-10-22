import {NgModule, ModuleWithProviders} from '@angular/core';

import { LayoutDirectivesModule } from './api/_modules';
import { MediaQueriesModule } from './media-query/_modules';


const ALL_MODULES = [
  LayoutDirectivesModule,
  MediaQueriesModule
];

@NgModule({
  imports: ALL_MODULES,
  exports: ALL_MODULES
})
export class LayoutsRootModule { }


@NgModule({
  imports: ALL_MODULES,
  exports: ALL_MODULES
})
export class LayoutsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LayoutsRootModule,
    };
  }
}


