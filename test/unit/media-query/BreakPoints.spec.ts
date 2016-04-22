/// <reference path="../../../typings/main.d.ts" />

import { BreakPointsService } from '../../../src/media-query/BreakPoints';

describe('BreakPointsService', () => {
  describe('#findBreakpointBy', () => {
    let service: BreakPointsService;
    beforeEach(() => service = new BreakPointsService());

    it('returns a known breakpoint', () =>{
      let bp = service.findBreakpointBy('xs');
      expect(bp).toBeTruthy();
      expect(bp.mediaQuery).toEqual('screen and (max-width: 599px)');
    });

    it('returns null for an unknown breakpoint', () => {
      let bp = service.findBreakpointBy('unknown');
      expect(bp).toBeFalsy();
    });
  });
});
