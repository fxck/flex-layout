import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'sample-simple-row-column',
  styles : [
    ".hint { margin:5px; font-size:0.9em;color: #a3a3a3; margin-bottom:0;}"
  ],
  template: `
  <div>
    <div class="title">Simple row with nested layout containers.</div> 
    <div class="colorNested box" layout="row">
      <div [layout]="firstCol" flex (click)="toggleLayoutFor(1)">
        <div flex>First item in row</div>
        <div flex>Second item in row</div>
      </div>
      <div [layout]="secondCol" flex (click)="toggleLayoutFor(2)">
        <div flex>First item in column</div>
        <div flex>Second item in column</div>
      </div>
    </div>
    <div layout="row" class="hint" layout-align="space-around"> 
      <div>layout="{{ firstCol }}"</div>
      <div flex></div>
      <div>layout="{{ secondCol }}"</div>
    </div>
  </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class SimpleRowColumnComponent {
  firstCol = "row";
  secondCol = "column";

  toggleLayoutFor(col) {
    let key = (col == "2") ? "secondCol" : "firstCol" ;
    this[key] = (this[key] == "row") ? "column" : "row";
  }
}
