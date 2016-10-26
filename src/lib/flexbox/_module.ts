import { NgModule } from '@angular/core';

import {
  LayoutDirective,
  LayoutWrapDirective,
  LayoutAlignDirective
} from "./api/layout";

import {
  FlexDirective,
  FlexOrderDirective,
  FlexOffsetDirective,
  FlexFillDirective,
  FlexAlignDirective
} from "./api/flex";

import {
  ShowDirective,
  HideDirective
} from "./api/show-hide";

import {
  MediaQueryAdapter
} from "./media-query/media-query-adapter";

import {MediaQueriesModule} from '../media-query/_modules';

// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

const ALL_DIRECTIVES = [
  LayoutDirective,
      LayoutWrapDirective,
      LayoutAlignDirective,
      FlexDirective,
      FlexOrderDirective,
      FlexOffsetDirective,
      FlexFillDirective,
      FlexAlignDirective,
      ShowDirective,
      HideDirective
];

const ALL_MODULES = [
  MediaQueriesModule
];

@NgModule({
  declarations : ALL_DIRECTIVES,
  imports: ALL_MODULES,
  exports: [...ALL_DIRECTIVES, ALL_MODULES],
  providers : [
    MediaQueryAdapter
  ]
})
export class LayoutsModule {
}

