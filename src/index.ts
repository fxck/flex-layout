import { MediaQueryRegistry } from 'src/media-query/MediaQueryRegistry';
import { BreakPointsService }  from 'src/media-query/BreakPoints';

let $mediaRegistry = new MediaQueryRegistry( window.matchMedia );
let $breakPoints = new BreakPointsService();

export { $mediaRegistry, $breakPoints };
