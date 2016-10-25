import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'issue-5345',
  styleUrls: ['issue.5345.component.css'],
  template: `
  <div style="margin-top: 50px;">
    <div class="title">
      <a href="https://github.com/angular/material/issues/5345" target="_blank">
        Issue #5345
      </a>
      : Visualize the affects of 'flex' and 'flex-offset' with %, px, or raw values.
    </div> 
    <div class="box" (click)="toggleDirection()" >
      <div [ng-layout]="direction" class="md-whiteframe-2dp">
        <div ng-flex ng-flex-offset="20" class="one">&lt;div <b>ng-flex-offset="20"</b> ng-flex &gt;</div>
        <div ng-flex="150px" class="two">&lt;div ng-flex="150px"&gt;</div>
      </div>
      <div [ng-layout]="direction" class="md-whiteframe-3dp">
        <div ng-flex ng-flex-offset="50%" class="three">&lt;div <b>ng-flex-offset="50%"</b> ng-flex &gt;</div>
        <div ng-flex class="four">&lt;div ng-flex&gt;</div>
      </div>
      <div [ng-layout]="direction" class="md-whiteframe-3dp">
        <div ng-flex="25%" ng-flex-offset="25" class="five">&lt;div <b>ng-flex-offset="25"</b> ng-flex="25%" &gt;</div>
        <div ng-flex="50" ng-flex-offset="20" class="six">&lt;div <b>ng-flex-offset="20"</b> ng-flex="50" &gt;</div>
      </div>
    </div>
    <div class="hint">ng-layout = "{{ direction }}"</div>
   </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class Issue5345Component  {
  direction = "row";

    toggleDirection() {
      let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
      this.direction = DIRECTIONS[next];
    }
  }
  const DIRECTIONS = ['row', 'row-reverse'];
