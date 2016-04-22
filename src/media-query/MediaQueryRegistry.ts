/**
 * QueryWatchers manages 1..n mediaQuery listeners.
 * A mediaQuery listener is shared for all subscribers of a query.
 * Each query has its own shared listener...
 */
const ALL_WATCHERS:{ [query:string]:MediaQueryDispatcher } = {};

let isDefined : Function = (value:any):boolean => (typeof value !== 'undefined');
let noop : Function = ():void => undefined;
/**
 *
 */
export type MediaQuery = string;

/**
 *
 */
export interface MediaQueryDispatcher {
  matches:boolean;
  addListener:Function;
  removeListener:Function;
  sharedListener?:Function;
}

/**
 * BrowserMediaQueryRegistrar inserts CSS selectors into the DOM
 * For Webkit engines that only trigger the MediaQueryListListener
 * when there is at least one CSS selector for the respective media query.
 */
export class MediaQueryRegistry {

  private _canListen:boolean = false;
  private _registeredStyles:{ [query:string]:HTMLElement };

  constructor(private _matchMedia:Function) {
    if (!this._matchMedia) {
      this._matchMedia = window.matchMedia;
      this._canListen = isDefined(this._matchMedia('all').addListener);
    }
  }

  /**
   * Lookup the registered watcher for the specified query
   */
  find(query:MediaQuery):MediaQueryDispatcher {
    return ALL_WATCHERS[query];
  }

  addQuery(query:MediaQuery):MediaQueryDispatcher {
    return ALL_WATCHERS[query] || this.buildDispatcher(query);
  }

  /**
   *
   */
  private buildDispatcher(query:MediaQuery):MediaQueryDispatcher {
    let dispatcher : MediaQueryDispatcher;
    if (this._canListen) {
      dispatcher = ALL_WATCHERS[query] = this._matchMedia(query);
      this.registerQuery(query);
    }
    return dispatcher || this.buildMockDispatch();
  }

  /**
   *
   */
  private registerQuery(query:MediaQuery):void {
    if (this._registeredStyles[query]) return;

    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    document.querySelector('head').appendChild(style);

    let textNode = document.createTextNode(
      `@media ${query} {.md-query-test{}}`
    );
    style.appendChild(textNode);

    this._registeredStyles[query] = style;
  }

  /**
   *
   */
  private buildMockDispatch():MediaQueryDispatcher {
    return {
      matches: false,
      addListener: noop,
      removeListener: noop,
      sharedListener: null
    };
  }
}


