import { isDefined } from '../../utils/global';

// ****************************************************************
// Exported Types and Interfaces
// ****************************************************************

/**
 * EventDispatcher for a specific mediaQuery [range]
 */
export interface MediaQueryList {
    readonly matches: boolean;
    readonly media: string;
    addListener(listener: MediaQueryListListener): void;
    removeListener(listener: MediaQueryListListener): void;
}

/**
 * EventHandler callback with the mediaQuery [range] activates or deactivates
 */
export interface MediaQueryListListener {
    // Function with Window's MediaQueryList argument
    (mql: MediaQueryList): void;
}



// ****************************************************************
// ****************************************************************

/**
 * Factory class used to quickly create a mq listener for a specified mediaQuery range
 */
export class MediaQueryListFactory {

  /**
   * Return a MediaQueryList for the specified media query
   * Publish a mockMQL if needed
   */
  static instanceOf(query:string) : MediaQueryList {
    let canListen = isDefined(window.matchMedia('all').addListener);

    return canListen ? window.matchMedia(query) : <MediaQueryList> {
      matches       : query === 'all' || query === '',
      media         : query,
      addListener   : () => { },
      removeListener: () => { }
    };
  }
}

