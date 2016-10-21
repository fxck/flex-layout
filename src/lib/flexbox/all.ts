import {NgModule, ModuleWithProviders} from '@angular/core';

import { LayoutDirectivesModule } from './api/layout';
import { FlexDirectiveModule } from './api/flex';
import { MediaQueriesModule } from './media-query/media-queries';


const ALL_MODULES = [
  LayoutDirectivesModule,
  FlexDirectiveModule,
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


