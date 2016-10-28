import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-flex-row-fill-wrap',
  template: `
    <div>
    <div class="title">Using "layout-wrap" to wrap positioned items within a layout container</div>        
    <div [ng-layout]="direction" ng-layout-wrap class="colored wrapped box" (click)="toggleDirection()">
    
      <div ng-flex="30"> [ng-flex="30"] </div>
      <div ng-flex="45"> [ng-flex="45"] </div>
      <div ng-flex="19"> [ng-flex="19"] </div>
      <div ng-flex="33"> [ng-flex="33"] </div>
      <div ng-flex="67"> [ng-flex="67"] </div>
      <div ng-flex="50"> [ng-flex="50"] </div>
      <div ng-flex>      [ng-flex]      </div>
      
    </div>    
    <div class="hint">ng-layout = "{{ direction }}"</div>
    </div>
    
  `,
  encapsulation: ViewEncapsulation.None,
})
export class DemoFlexRowFillWrap {
  direction = "row";

    toggleDirection() {
      let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
      this.direction = DIRECTIONS[next];
    }
}
const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
