/// <reference path="../../../typings/main.d.ts" />

import { MediaQueryRegistry } from "../../../src/media-query/MediaQueryRegistry";
import { BreakPointsService } from "../../../src/media-query/BreakPoints";

describe('mediaQueryServices', () => {
  let $mediaRegistry : MediaQueryRegistry, $breakPoints : BreakPointsService;

  beforeEach(()=>{
    $mediaRegistry = new MediaQueryRegistry( window.matchMedia );
    $breakPoints = new BreakPointsService();
  });

  describe('$breakPoints service', () =>{

    it('has 1 or more breakpoints registered', () => {
        expect($breakPoints.breakpoints.length).toBeGreaterThan(0);
    });

  });

});

