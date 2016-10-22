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
    FlexAlignDirective
  ],
  declarations: [
    LayoutDirective,
    LayoutWrapDirective,
    LayoutAlignDirective,
    FlexDirective,
    FlexOrderDirective,
    FlexOffsetDirective,
    FlexFillDirective,
    FlexAlignDirective
  ]
})
export class LayoutDirectivesModule { }

