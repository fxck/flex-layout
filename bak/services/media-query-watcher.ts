/// <reference path="../../../typings/browser.d.ts" />

import { BreakPoint } from './break-points';

type MediaQueryChangeHandler = (watcher: MediaQueryDispatcher) => void;

export class MediaQueryWatcherService {
  private _subscriptions: SubscriberGroups = new SubscriberGroups(new BrowserMediaQueryRegistrar());
  private _watchers: QueryWatchers = new QueryWatchers(this._subscriptions);

  /**
   * For the specified mediaQuery, attach a set of
   * callbacks (initialize, enter, leave).
   *
   * @param mediaQuery string
   * @param callbacks object { initialize:fn(), enter:fn(), leave:fn() }
   *
   * @return Subcriber instance
   */
  attach(breakpoint: BreakPoint, hooks: SubscriberHooks): Subscriber {
    let subscriber = new Subscriber(breakpoint, hooks);

    this._connect(subscriber);
    this._announce(breakpoint.mediaQuery);

    return subscriber;
  }

  detach(subscriber: Subscriber) {
    if (subscriber.active) return;
    this._disconnect(subscriber);
  }

  /**
   * Prepare a shared watcher (if needed) for the
   * subscriber, then add the subscriber to the
   * known subscriptions registry...
   */
  private _connect(subscriber: Subscriber) {
    let dispatcher = this._watchers;
    let query    = subscriber.query;
    let onChange: MediaQueryChangeHandler = (dispatcher: MediaQueryDispatcher) => {
      let isEntering = dispatcher.matches;
      this._notifySubscribers(query, isEntering);

      if ( !isEntering ) {
        // If we are 'leaving'... simulate enter
        // for the next active/overlapped breakpoint
        this._simulateEnter(query);
      }
    };

    this._subscriptions.add(subscriber);
    if ( !watchers.has(query) ) {
      dispatcher.add(query, onChange);
    }
  }

  /**
   * Remove subscriber from the subscriptions registry
   * and clear the shared mediaQuery change listener (if appropriate)
   */
  private _disconnect(subscriber: Subscriber) {
    let query = subscriber.query;
    this._subscriptions.remove(subscriber);
    this._watchers.remove(query);
  }

  /**
   * Only if the current mediaQuery is active,
   * then process all known subscribers
   */
  private _announce(query: MediaQuery) {
    if ( this._watchers.isActive(query) ) {
      this._notifySubscribers(query, true);
    }
  }

  /**
   * For overlapping breakpoints, a leave will be generated but NOT an enter (since it is still active)
   * So we simulate an 'enter' notification to allow the injectors to fire properly.
   * Consider:
   *
   *   <div flex flex-gt-sm="xx" flex-gt-lg="xx" />
   *
   * When we 'leave' flex-gt-lg, then the flex-gt-sm should fire.
   */
  private _simulateEnter(query: MediaQuery) {
    let group = this._subscriptions.subscribersToActivate(query);

    for (let subscriber of group) {
      if ( subscriber.active ) {
        // Simulate 'fresh' enter
        subscriber.enter();
      }
    }
  }

  /**
   *  Notify all subscribers in the mediaQuery group
   *  to either activate or deactivate.
   *
   *  NOTE: This is called from the mediaQuery change listener!
   */
  private _notifySubscribers(query: MediaQuery, isActive: boolean) {
    let group = this._subscriptions.findGroup(query);

    for (let subscriber of group) {
      subscriber.activate(isActive);
    }
  }

}

// **************************
// Helper Classes
// **************************





export class QueryWatchers {
  constructor(private _subscriptions: SubscriberGroups) {
  }

  /**
   * Does the specified mediaQuery already have a registered
   * watcher ?
   */
  has(query: MediaQuery): boolean {
    return angular.isDefined(ALL_WATCHERS[query]);
  }

  /**
   * Lookup the registered watcher for the specified query
   */
  find(query: MediaQuery): MediaQueryObservable {
    return ALL_WATCHERS[query];
  }

  /**
   * Cache the shared listener; since each query has a
   * listener for 1...n subscribers.
   *
   * NOTE: Remove the shared listener when the
   * all subscribers (for the query) are detached..
   *
   */
  add(query: MediaQuery, onMediaChange: MediaQueryChangeHandler) {
    if (!this.has(query)) {
      let watcher = this._build(query);
      watcher.addListener(onMediaChange);
      watcher.sharedListener = onMediaChange;
    }
  }

  /**
   * Is the specified mediaQuery currently active?
   */
  isActive(query: MediaQuery): boolean {
    return this.find(query).matches;
  }

  /**
   * If all subscribers [for the associated mediaQuery] are detached,
   * then clear the shared listener.
   */
  remove(query: MediaQuery) {
    if (this.has(query)) {
      let watcher = this.find(query);
      let group = this._subscriptions.findGroup(query);

      if ( !group.length ) {
        watcher.removeListener( watcher.sharedListener );
      }
    }
  }


}
