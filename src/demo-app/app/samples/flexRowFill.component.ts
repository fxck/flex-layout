import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'sample-flex-row-fill',
  template: `
  <div>
    <div class="title">Simple row using "flex" on 3rd element to fill available main axis.</div> 
    <div [fl-layout]="direction" (click)="toggleDirection()" class="colored box" >
      <div fl-flex="20">
        fl-flex="20"
      </div>
      <div fl-flex="60">
        fl-flex="60"
      </div>
      <div fl-flex >
        fl-flex
      </div>
    </div>
    <div class="hint">layout = "{{ direction }}"</div>
   </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class FlexRowFillComponent  {
  direction = "row";

  toggleDirection() {
    let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }
}
const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
