import {BreakPoint} from './../src/media-query/BreakPoints';
import {MediaQuery, MediaQueryDispatcher} from './../src/media-query/MediaQueryRegistry';

/**
 * SubscriberGroups manages 1..n Subscribers grouped by a media query.
 * Subscribers are external observers requesting notifications of
 * mediaQuery changes; and are
 */
export class SubscriberGroups {
  private _groups: { [query: string]: Subscriber[] } = {};

  constructor(private _browserRegistrar: BrowserMediaQueryRegistrar) {
  }

  add(subscriber: Subscriber): SubscriberGroups {
    this._browserRegistrar.registerMediaQuery(subscriber.query);
    let group = this.findGroup(subscriber.query);
    group.push(subscriber);
    return this;
  }

  remove(subscriber: Subscriber): SubscriberGroups {
    let group = this.findGroup(subscriber.query);

    let index = group.indexOf(subscriber);
    if (index != -1) {
      group.splice(index, 1);
    }

    return this;
  }

  findGroup(query: MediaQuery): Subscriber[] {
    this._groups[query] = this._groups[query] || [];
    return this._groups[query];
  }

  /**
   * MediaQuery listeners are NOT triggered with 'enter' events if breakpoints
   * overlap.
   *
   * Nodes with multiple `-gt-<xxxx>` breakpoints, may not work as expected.
   * Leave events will fire but 'enter' events will not fire for overlapped.
   * Consider:
   *
   *    <div flex-gt-sm="50" flex-gt-md="25" />
   *
   * When the viewport shrinks and flex-gt-md injector 'leaves', then
   * the flex-gt-sm injector should also activate/enter.
   *
   * For overlapping breakpoints, multiple groups may be
   * active. When leaving a mediaQuery, find (if any)
   * other active groups (except the default/global).
   *
   */

  subscribersToActivate(leaveQuery: MediaQuery): Subscriber[] {
    let allGroups = this._groupsByPrecedence();

    for (let group of allGroups) {
      let isGlobal = group[0].query == 'screen';
      let isActive = group[0].isActive;

      if ( isActive && !isGlobal && group[0].query != leaveQuery ) {
        return group;
      }
    }
  }

  private _groupsByPrecedence(): Subscriber[][] {
    return Object.keys(this._groups)
      .map(groupName => this._groups[groupName])
      .sort((a, b) => a[0].queryOrder - b[0].queryOrder); // numeric, ascending sort
  }
}

/**
 * Subscriber is a delegate class used to forward notifications
 * of mediaQuery changes to external observers. Observers register
 * a subscription for a query with MediaQueryWatcher::attach()
 */
export class Subscriber {
  public isActive: boolean = false;
  private _initialized: boolean = false;

  constructor(private _breakpoint: BreakPoint, private _hooks: SubscriberHooks) {
  }

  get active(): boolean {
    return this.isActive;
  }

  get query(): MediaQuery {
    return this._breakpoint.mediaQuery;
  }

  get queryOrder(): number {
    return this._breakpoint.order;
  }

  /**
   * Issue the enter or leave announcements for the current
   * subscriber
   */
  activate(newActive: boolean): void {
    if (newActive != this.isActive) {
      if ( newActive ) this.enter();
      else            this.leave();
    }
  }

  /**
   * Notify listeners to initialize (1st time only)
   * then announce that we are 'entering' a mediaQuery state
   * and activate.
   */
  enter(): void {
    this.isActive = true;
    if (!this._initialized) {
      this._initialized = true;
      if (this._hooks.initialize) {
        this._hooks.initialize(this._breakpoint.mediaQuery);
      }
    }
  }

  /**
   * Notify listeners that we are leaving the current
   * mediaQuery state... and then deactivate.
   */
  leave(): void {
    this.isActive = false;
    if (this._hooks.leave) {
      this._hooks.leave(this._breakpoint.mediaQuery);
    }
  }
}

/**
 * Interface representing the required lifecycle events that a subscriber must respond to
 */
export interface SubscriberHooks {
  initialize?: (query: MediaQuery) => void;
  enter?: (query: MediaQuery) => void;
  leave?: (query: MediaQuery) => void;
}
