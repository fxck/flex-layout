/// <reference path="../../typings/browser.d.ts" />

import { MediaQueryWatcherService, BrowserMediaQueryRegistrar } from './services/media-query-watcher';
import { BreakPoints }  from './services/BreakPoints';

angular.module('material.mediaQuery', [])
  .service('$mdBreakpoints', BreakPoints )
  .service('$mdMediaQueryRegistrar', BrowserMediaQueryRegistrar )
  .service('$mdMediaWatcher', MediaQueryWatcherService );
