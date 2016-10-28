import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-flex-row-fill',
  template: `
  <div>
    <div class="title">Simple row using "flex" on 3rd element to fill available main axis.</div> 
    <div [ng-layout]="direction" (click)="toggleDirection()" class="colored box" >
      <div ng-flex="20">
        ng-flex="20"
      </div>
      <div ng-flex="60">
        ng-flex="60"
      </div>
      <div ng-flex >
        ng-flex
      </div>
    </div>
    <div class="hint">layout = "{{ direction }}"</div>
   </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class DemoFlexRowFill {
  direction = "row";

  toggleDirection() {
    let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }
}
const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
