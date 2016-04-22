/// <reference path="../typings/browser.d.ts" />
/**
 * Angular module for MediaQuery services and features
 */
import { MediaQueryRegistry } from './../src/media-query/MediaQueryRegistry';
import { BreakPoints }  from './../src/media-query/BreakPoints';

export default angular.module('material.mediaQuery', [ ])
  .service('$mdBreakpoints', BreakPoints )
  .service('$mdMediaRegistry', ($window) => {
    return new MediaQueryRegistry( $window.matchMedia );
  });
