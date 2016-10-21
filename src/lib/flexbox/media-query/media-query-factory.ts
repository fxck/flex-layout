import { isDefined } from '../../utils/global';

// ****************************************************************
// Exported Types and Interfaces
// ****************************************************************

export interface MediaQueryListListener {
    // Function with Window's MediaQueryList argument
    (mql: MediaQueryList): void;
}

export interface MediaQueryList {
    readonly matches: boolean;
    readonly media: string;
    addListener(listener: MediaQueryListListener): void;
    removeListener(listener: MediaQueryListListener): void;
}

// ****************************************************************
// ****************************************************************

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

