import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'sample-simple-row-column',
  styles : [
    ".hint { margin:5px; font-size:0.9em;color: #a3a3a3; margin-bottom:0;}"
  ],
  template: `
  <div>
    <div class="title">Simple row with nested layout containers.</div> 
    <button (click)="isVisible = !isVisible">Toggle</button>
    <div class="colorNested box" ng-layout="row" *ngIf="isVisible">
      <div  [ng-layout]="firstCol" 
            [ng-layout.xs]="'column'" 
            ng-layout.md="column" 
            ng-layout.lg="invalid"  
            [ng-layout.gt-lg]="responsiveCol" 
            ng-flex="50%" 
            ng-flex.gt-sm="25"
            ng-show="true"
            ng-show.md="false" 
            (click)="toggleLayoutFor(1)" >
        <div ng-flex>First item in row</div>
        <div ng-flex>Second item in row</div>
      </div>
      <div [ng-layout]="secondCol" ng-flex (click)="toggleLayoutFor(2)">
        <div ng-flex>First item in column</div>
        <div ng-flex>Second item in column</div>
      </div>
    </div>
    <div ng-layout="row" class="hint" ng-layout-align="space-around"> 
      <div>&lt;div ng-layout="{{ firstCol }}" ng-flex="25%" ng-flex.gt-sm="50%" &gt;</div>
      <div ng-flex></div>
      <div>&lt;div ng-layout="{{ secondCol }}" ng-flex&gt;</div>
    </div>
  </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class SimpleRowColumnComponent {
  firstCol = "row";
  secondCol = "column";
  responsiveCol = "column";

  isVisible = true;

  toggleLayoutFor(col) {
    let key = (col == "2") ? "secondCol" : "firstCol" ;
    this[key] = (this[key] == "row") ? "column" : "row";
  }
}
