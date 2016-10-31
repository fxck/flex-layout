# Angular 2 Layouts

This is a TypeScript implementation for Angular 2 *flexbox* Layouts. This module provides Angular 2 developers with component layout features using a custom Layout API & internal flexbox-2016 css stylings. 

> This Angular 2 version is independent of Angular Material (v1 or v2); but is currently only available for Angular 2 applications


### Fast Start

Developers can easily install this `@angular/layouts` library using **npm** (pending feature):

```console
npm install @angular/layouts -save
```

In their application module, developers import the global Layout API directives (as shown below): 

```ts
// demo-app-module.ts

import { AngularLayouts } from '@angular/layouts';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, HttpModule, 
    AngularLayouts.forRoot(),           // import dependency on ng2 Layouts
  ], 
)}
export class DemoAppModule { }
```

In their component templates, developers easily use the Layout API to build
complex, dynamic layouts:

```html
<div ng-layout="row">
  <div [ng-layout]="firstCol" [ng-flex]="firstColWidth" >
    <div ng-flex="27%"> First item in row  </div>
    <div ng-flex      > Second item in row </div>
  </div>
  <div [ng-layout]="secondCol" flex >
    <div ng-flex       > First item in column  </div>
    <div ng-flex="33px"> Second item in column </div>
  </div>
</div>
``` 


### Overview

The Angular Layout features provide smart, syntactic sugar to allow developers to easily and intuitively create 
responsive and adaptive layouts. The public **Layout API** is a simply list of HTML attributes that can be used on HTML containers and elements:

![demos3](https://cloud.githubusercontent.com/assets/210413/11566167/e074446c-99a6-11e5-8b69-4e84ed0a1dde.jpg)

<br/>

| HTML Markup API | Allowed values (raw or interpolated) |
|-----------------|----------------------------------------------------------------------------|
|  layout         | `row | column | row-reverse | column-reverse`                                                          |                  
|  layout-wrap    | `"" | wrap | none | nowrap | reverse`                                     |                   
|  layout-align   | `start|center|end|space-around|space-between` `start|center|end|stretch`|                   
|  flex           | "" , px , %                                                              |              
|  flex-fill      |                                                                            |
|  flex-order     | int                                                                        |                       
|  flex-offset    | %, px                                                                         |     
|  flex-align     | `start|baseline|center|end` |                   

<br/>


And if we use Breakpoints as specified in Material Design:

![](http://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0B8olV15J7abPSGFxemFiQVRtb1k/layout_adaptive_breakpoints_01.png)

<br/>

We can associate breakpoints with mediaQuery definitions using breakpoint **alias(es)**:

| breakpoint | mediaQuery |
|--------|--------|
| ""    | 'screen'                                                |
| xs    | 'screen and (max-width: 599px)'                         |
| gt-xs | 'screen and (min-width: 600px)'                         |
| sm    | 'screen and (min-width: 600px) and (max-width: 959px)'  |
| gt-sm | 'screen and (min-width: 960px)'                         |
| md    | 'screen and (min-width: 960px) and (max-width: 1279px)' |
| gt-md | 'screen and (min-width: 1280px)'                        |
| lg    | 'screen and (min-width: 1280px) and (max-width: 1919px)'|
| gt-lg | 'screen and (min-width: 1920px)'                        |
| xl    | 'screen and (min-width: 1920px)'                        |
<br/>

If we combine the breakpoint `alias` with the Layout API we can easily support Responsive breakpoints with a simple markup convention: the `alias` is used as suffix extensions to the Layout API.:

```html
<api>-<breakpoint alias>=<value>
```

Below is an example usage of the Responsive Layout API:

```html
<div ng-layout='column' class="zero">

  <div ng-flex="33" ng-flex.md="{{ vm.box1Width }}" class="one" ></div>
  <div ng-flex="33" ng-layout="{{ vm.direction }}" layout.md="row" class="two">

    <div ng-flex="22"   ng-flex.md="10" hide-lg                         class="two_one"></div>
    <div ng-flex="30px" ng-show hide.md="{{ vm.hideBox }}" fng-lex.md="25" class="two_two"></div>
    <div ng-flex="20"   ng-flex.md="65"                                 class="two_three"></div>

  </div>
  <div flex class="three"></div>

</div>
```

<br/>

#### 'Ng 2' Implementation

The revised architecture for Layouts eliminates `all` external stylesheets and SCSS files. This is a pure, Angular JS Layout engine that is both independent of Angular Material and easily used within ngMaterial.

Layout directives are used to create Layout injectors; which inject specific flexbox css directly to the DOM element. For example, consider the use of the `ng-layout="row"` and `ng-layout-align="center center"` directives.

Static Markup:

```html
<div ng-layout="{{vm.direction}}" ng-layout-align="center center">
	<div>one</div>
	<div>two</div>
	<div>three</div>
</div>
```

is transformed to Dynamic styles:

```html
<div ng-layout="row" ng-layout-align="center center"
      style="display: flex; flex-direction: row; max-width: 100%; box-sizing: border-box; justify-content: center; align-content: center; align-items: center;">
  <div style="max-width: 100%; box-sizing: border-box;">one</div>
  <div style="max-width: 100%; box-sizing: border-box;">two</div>
  <div style="max-width: 100%; box-sizing: border-box;">three</div>
</div>
```

#### Demos

The **Generation 1** [layout demos](https://material.angularjs.org/latest/layout/grid) are included here to quickly demonstrate matching functionality (and more) when using the Gen2 implementation.

![demos2](https://cloud.githubusercontent.com/assets/210413/11286935/cc5b325c-8edd-11e5-9723-f866ec69fd97.jpg)

<br/>


#### Summary

Not only is the generation-2 codebase easier to maintain and debug, other more important benefits have been realized:

*  No external CSS requirements
*  Override provide to supply custom breakpoints
*  Notifications for breakpoints changes
  *  Includes workaround for MediaQuery issues with **overlapping** breakpoints
*  Support (future) for Handset/Tablet and Orientation breakpoints
*  Support for **ANY** Layout injector value (instead of increments for 5)
*  Change dectection for Layout injector values
*  Support for raw values or interpolated values
*  Support for raw, percentage or px-suffix values

<br/>

---

#### Build


Use Gulp and Rollup to build a UMD `layouts.umd.js`:

```console
gulp build:components
```

To use the bundle and the required, external AngularJS framework:

```html
<script src="/dist/@angular/layouts/layouts.umd.js"></script>


```

<br/>

----

#### Adaptive Layouts (future)

Different from responsive layouts where components change sizes and positions, the concepts of Adaptive layouts provide for UX where  **different components** may be used for different breakpoints. 

The Gen2 engine here uses a MediaQueryWatcher in a Publish/Subcribe architecture. Layout injectors use an adaptor to subscribe to breakpoint change notifications. This subscription pattern can be extended to easily support breakpoint notifications to trigger Adaptive UX changes.

#### More possibilities (future)

With the new MediaQuery Pub/Sub mechanisms and Breakpoints, it would be quite easy to extend these injector-subscriber ideas to support constructs such as:

```html
<div md-class-sm="{'role_admin' : vm.isAdmin()}">
   ... Admin content here
</div>
```
