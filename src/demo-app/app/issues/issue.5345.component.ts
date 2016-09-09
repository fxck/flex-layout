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
    <div class="box">
      <div layout="row" class="md-whiteframe-2dp">
        <div flex flex-offset="20" class="one">&lt;div <b>flex-offset="20"</b> flex &gt;</div>
        <div flex="150px" class="two">&lt;div flex="150px"&gt;</div>
      </div>
      <div layout="row" class="md-whiteframe-3dp">
        <div flex flex-offset="50%" class="three">&lt;div <b>flex-offset="50%"</b> flex &gt;</div>
        <div flex class="four">&lt;div flex&gt;</div>
      </div>
      <div layout="row" class="md-whiteframe-3dp">
        <div flex="25%" flex-offset="25" class="five">&lt;div <b>flex-offset="25"</b> flex="25%" &gt;</div>
        <div flex="50" flex-offset="20" class="six">&lt;div <b>flex-offset="20"</b> flex="50" &gt;</div>
      </div>
    </div>
    <div class="hint">layout = "row"</div>
   </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class Issue5345Component  { }
