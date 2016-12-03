import {MediaChange} from '../../media-query/media-change';

// ****************************************************************
// Exported Types and Interfaces
// ****************************************************************

/**
 * MQ Notification data emitted to external observers
 *
 */
export class MediaQueryChanges {
  constructor(public previous: MediaChange, public current: MediaChange) {}
}



/**
 * @whatItDoes Lifecycle hook that is called when any mediaQuery breakpoint changes.
 * @howToUse
 *
 * @description
 * ``onMediaQueryChanges( )`` is called right after the a MediaQueryChange has occurred.
 */
export declare abstract class OnMediaQueryChanges {
  abstract onMediaQueryChanges(changes: MediaChange): void;
}


export type MediaQuerySubscriber = (changes: MediaChange) => void;
