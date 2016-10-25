import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'sample-flex-row-fill-wrap',
  template: `
    <div>
    <div class="title">Using "layout-wrap" to wrap positioned items within a layout container</div>        
    <div [fl-layout]="direction" fl-layout-wrap class="colored wrapped box" (click)="toggleDirection()">
    
      <div fl-flex="30"> [fl-flex="30"] </div>
      <div fl-flex="45"> [fl-flex="45"] </div>
      <div fl-flex="19"> [fl-flex="19"] </div>
      <div fl-flex="33"> [fl-flex="33"] </div>
      <div fl-flex="67"> [fl-flex="67"] </div>
      <div fl-flex="50"> [fl-flex="50"] </div>
      <div fl-flex>      [fl-flex]      </div>
      
    </div>    
    <div class="hint">fl-layout = "{{ direction }}"</div>
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
