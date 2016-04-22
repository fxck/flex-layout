export interface BreakPoint {
  mediaQuery: string;
  normalized: string;
  suffix    : string;   // aka alias
  order     : number;
}

export class BreakPointsService {
  public breakpoints: BreakPoint[];

  constructor() {
    let sortByOrder = (a:BreakPoint,b:BreakPoint) => (a.order < b.order) ? -1 : (a.order == b.order) ? 0 : 1;
    
    this.breakpoints = [
      { mediaQuery: 'print'                                                 , suffix: 'print', normalized: 'Print', order: 11 },
      { mediaQuery: 'screen'                                                , suffix: ''     , normalized: ''     , order: 10 },

      { mediaQuery: 'screen and (max-width: 599px)'                         , suffix: 'xs'   , normalized: 'Xs'   , order: 9 },
      { mediaQuery: 'screen and (min-width: 600px)'                         , suffix: 'gt-xs', normalized: 'GtXs' , order: 8 },
      { mediaQuery: 'screen and (min-width: 600px) and (max-width: 959px)'  , suffix: 'sm'   , normalized: 'Sm'   , order: 7 },
      { mediaQuery: 'screen and (min-width: 960px)'                         , suffix: 'gt-sm', normalized: 'GtSm' , order: 6 },
      { mediaQuery: 'screen and (min-width: 960px) and (max-width: 1279px)' , suffix: 'md'   , normalized: 'Md'   , order: 5 },
      { mediaQuery: 'screen and (min-width: 1280px)'                        , suffix: 'gt-md', normalized: 'GtMd' , order: 4 },
      { mediaQuery: 'screen and (min-width: 1280px) and (max-width: 1919px)', suffix: 'lg'   , normalized: 'Lg'   , order: 3 },
      { mediaQuery: 'screen and (min-width: 1920px)'                        , suffix: 'gt-lg', normalized: 'GtLg' , order: 2 },
      { mediaQuery: 'screen and (min-width: 1920px)'                        , suffix: 'xl'   , normalized: 'Xl'   , order: 1 },
    ].sort( sortByOrder )
  }

  findBreakpointBy(suffix: string): BreakPoint {
    for (let bp of this.breakpoints) {
      if (bp.suffix == suffix) {
        return bp;
      }
    }
    return null;
  }
}

