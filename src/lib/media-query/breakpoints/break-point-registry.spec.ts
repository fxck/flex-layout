import { BreakPointRegistry } from './break-point-registry';
import {rawData} from "../providers/break-points-provider";

describe('break-points', () => {
  let breakPoints : BreakPointRegistry;
  beforeEach(() => { breakPoints = new BreakPointRegistry(rawData); });

  it('registry has all aliases defined', () =>{
    expect(breakPoints.items.length).toBeGreaterThan(0);

    expect(breakPoints.findByAlias('')).toBeDefined();
    expect(breakPoints.findByAlias('xs')).toBeDefined();
    expect(breakPoints.findByAlias('gt-xs')).toBeDefined();
    expect(breakPoints.findByAlias('sm')).toBeDefined();
    expect(breakPoints.findByAlias('gt-sm')).toBeDefined();
    expect(breakPoints.findByAlias('md')).toBeDefined();
    expect(breakPoints.findByAlias('gt-md')).toBeDefined();
    expect(breakPoints.findByAlias('lg')).toBeDefined();
    expect(breakPoints.findByAlias('gt-lg')).toBeDefined();
    expect(breakPoints.findByAlias('xl')).toBeDefined();

    expect(breakPoints.overlappings.length).toBe(5);
  });

});
