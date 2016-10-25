import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'sample-complex-column-ordering',
  styles : [
    `.containerX {
      width: 490px;
      height: 210px;
      padding: 5px;
      border: solid 1px #808080;
      box-sizing: content-box !important;
    }`,
    `.flexitem {
      text-align: center;
      line-height: 100px;
      width: 150px;
      height: 100px;
      margin: 2px;
      box-shadow: none !important;
      padding:0 !important;
    }`,
    `.two { width: 200px; }`,
    `.three {
      width:120px;
      height:100%;
    }`,
    `.markup {
      font-size: 0.7em;
      margin-top:-80px;
      font-weight: bold;
    }`
  ],
  template: `
  <div>
    <div class="title">
      <a href="http://stackoverflow.com/questions/36988183/flex-box-out-of-borders?rq=1" target="_blank">StackOverflow</a>:
      Complex column ordering to wrap items to align to items above: 
    </div> 
    <div class="containerX" (click)="toggleDirection()" [fl-layout]="direction" fl-layout-wrap>
      <div class="one   flexitem "                    > 1 <div class="markup">&lt;div fl-flex-order="1"&gt;</div> </div>
      <div class="two   flexitem "  fl-flex-order="3" > 2 <div class="markup">&lt;div fl-flex-order="3"&gt;</div> </div>
      <div class="three flexitem "  fl-flex-order="5" > 3 <div class="markup">&lt;div fl-flex-order="4"&gt;</div> </div>
      <div class="four  flexitem "                    > 4 <div class="markup">&lt;div fl-flex-order="2"&gt;</div> </div>
      <div class="five  flexitem "  fl-flex-order="4" > 5 <div class="markup">&lt;div fl-flex-order="4"&gt;</div> </div>
    </div>
    <div class="hint">fl-layout = "{{ direction }}"</div>
   </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class ComplexColumnOrderComponent  {
  direction = "column";

  toggleDirection() {
    let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }
}
const DIRECTIONS = ['column', 'column-reverse'];
