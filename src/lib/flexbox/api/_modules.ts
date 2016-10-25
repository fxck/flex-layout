import { NgModule } from '@angular/core';

import {
  LayoutDirective,
  LayoutWrapDirective,
  LayoutAlignDirective
} from "./layout";

import {
  FlexDirective,
  FlexOrderDirective,
  FlexOffsetDirective,
  FlexFillDirective,
  FlexAlignDirective
} from "./flex";

import {
  ShowDirective,
  HideDirective
} from "./show-hide";

/**
 * *****************************************************************
 * Define module for the Layout API
 * *****************************************************************
 */



@NgModule({
  exports: [
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
  ],
  declarations: [
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
  ]
})
export class LayoutDirectivesModule { }

