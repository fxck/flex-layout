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
    <div class="colorNested box" fl-layout="row" *ngIf="isVisible">
      <div  [fl-layout]="firstCol" 
            [fl-layout.xs]="'column'" 
            fl-layout.md="column" 
            fl-layout.lg="invalid"  
            [fl-layout.gt-lg]="responsiveCol" 
            fl-flex="50%" fl-flex.gt-sm="25" (click)="toggleLayoutFor(1)">
        <div fl-flex>First item in row</div>
        <div fl-flex>Second item in row</div>
      </div>
      <div [fl-layout]="secondCol" fl-flex (click)="toggleLayoutFor(2)">
        <div fl-flex>First item in column</div>
        <div fl-flex>Second item in column</div>
      </div>
    </div>
    <div fl-layout="row" class="hint" fl-layout-align="space-around"> 
      <div>&lt;div fl-layout="{{ firstCol }}" fl-flex="25%" fl-flex.gt-sm="50%" &gt;</div>
      <div fl-flex></div>
      <div>&lt;div fl-layout="{{ secondCol }}" fl-flex&gt;</div>
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
