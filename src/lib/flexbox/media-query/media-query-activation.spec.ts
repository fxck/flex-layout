
// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { Directive, Input, OnChanges, OnDestroy } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';

import { MediaQueryActivation } from "./media-query-activation";
import {MockMediaQueryActivator} from "../../media-query/testing/mock-media-query-activator";

import {OnMediaQueryChanges, MediaQueryChanges} from '../media-query/media-query-changes';
import {MediaChange} from "../../media-query/media-change";
import {MediaMonitor} from "../../media-query/media-monitor";
import {BreakPoints} from '../../media-query/breakpoints/break-points';

export class TestDirective implements Directive, OnChanges, OnDestroy, OnMediaQueryChanges {
  @Input() responsive : boolean = false;
  ngOnChanges() { ; }
  ngOnDestroy() { ; }
  onMediaQueryChanges(changes: MediaQueryChanges) { ; };
}

describe('media-query-activation', () => {
  let mockMQ : MockMediaQueryActivator;
  let directive : TestDirective;
  let mqService : MediaMonitor;
  let mqActivation : MediaQueryActivation;

  beforeEach(()=> {
    mockMQ = new MockMediaQueryActivator();

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [BreakPoints, MediaMonitor]
    });
  });
  afterEach(() => { mockMQ.destroy(); });

  beforeEach( async(inject([MediaMonitor], (_mqService_) => {
    // Single async inject to save references; which are used in all tests below
    mqService = _mqService_;
  })));

  // it ("can be used with any directive", () =>{
  //   let count = 0;
  //
  //   directive = new TestDirective();
  //   directive.onMediaQueryChanges = (changes: MediaQueryChanges) => { count += 1; };
  //
  //   mqActivation = new MediaQueryActivation(mqService, directive, "responsive", false);
  //
  //   mockMQ.activate('md');
  //   expect( count ).toEqual(2);
  // });



});
