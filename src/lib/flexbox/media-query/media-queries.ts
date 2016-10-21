import { NgModule } from '@angular/core';
import {Injectable} from "@angular/core";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/filter';


import { BreakPoint, BreakPoints } from './break-points';
import { MediaQueryList, MediaQueryListFactory} from "./media-query-factory";
import { MediaQueryAdapter } from "./media-query-adapter";

// ****************************************************************
// Exported Types and Interfaces
// ****************************************************************

/**
 * Class instances emitted [to observers] for each mql notification
 */
export class MediaQueryChange {
  constructor(public matches:boolean, public mqAlias:string, public suffix:string = ""){}
}

// ****************************************************************
// ****************************************************************


@Injectable()
export class MediaQueries {

  private _mqls         : any = { };
  private _breakpoints  : BreakPoints;
  private _source       : BehaviorSubject<MediaQueryChange>;
  private _announcer    : Observable<MediaQueryChange>;

  /**
   * Constructor
   */
  constructor(breakpoints : BreakPoints) {
    this._breakpoints = breakpoints;
    this._source = new BehaviorSubject<MediaQueryChange>(new MediaQueryChange(true, ""));
    this._announcer = this._source.asObservable();

    this.prepareWatchers(breakpoints.registry);
  }

  /**
   * Read-only accessor to the list of breakpoints configured in the BreakPoints provider
   */
  get breakpoints() : Array<BreakPoint> {
    return [].concat( this._breakpoints.registry );
  }

  /**
   * External observers can watch for specific mql changes;
   * typically used by the MediaQueryAdaptor
   */
  observe(alias:string) : Observable<MediaQueryChange> {
    return this._announcer.filter(e => e && e.mqAlias === alias );
  }

  /**
   * Based on the BreakPoints provider, register internal listeners for the specified ranges
   */
  private prepareWatchers(ranges:Array<BreakPoint>) {
    ranges.forEach((it:BreakPoint)=> {
      let mql = MediaQueryListFactory.instanceOf((it.mediaQuery));

      // Each listener uses a shared eventHandler: which emits specific data to observers
      mql.addListener(this.onMQLEvent.bind(this,it));

      // Cache this permanent listener
      this._mqls[ it.mediaQuery ] = mql;
    });
  }

  /**
   * On each mlq event, emit a special MediaQueryChange to all subscribers
   */
  private onMQLEvent(breakpoint:BreakPoint,  mql:MediaQueryList) {
    this._source.next( new MediaQueryChange(mql.matches, breakpoint.alias, breakpoint.suffix) );
  }
}


/**
 * *****************************************************************
 * Define module for all Layout API - Layout directives
 * *****************************************************************
 */

@NgModule({
  exports : [
    BreakPoints,
    MediaQueries,
    MediaQueryAdapter
  ],
  providers : [ ]
})
export class MediaQueriesModule {
  static forRoot() {
    return {
      ngModule : MediaQueriesModule,
      providers : [
        BreakPoints,
        MediaQueries,
        MediaQueryAdapter
      ]
    };
  }
 }
