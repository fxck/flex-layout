import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'sample-flex-row-fill-wrap',
  template: `
    <div>
    <div class="title">Using "layout-wrap" to wrap positioned items within a layout container</div>        
    <div [layout]="direction" layout-wrap class="colored wrapped box" (click)="toggleDirection()">
    
      <div flex="30"> [flex="30"] </div>
      <div flex="45"> [flex="45"] </div>
      <div flex="19"> [flex="19"] </div>
      <div flex="33"> [flex="33"] </div>
      <div flex="67"> [flex="67"] </div>
      <div flex="50"> [flex="50"] </div>
      <div flex>      [flex]      </div>
      
    </div>    
    <div class="hint">layout = "{{ direction }}"</div>
    </div>
    
  `,
  encapsulation: ViewEncapsulation.None,
})
export class FlexRowFillWrapComponent  {
  direction = "row";

    toggleDirection() {
      let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
      this.direction = DIRECTIONS[next];
    }
}
const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
