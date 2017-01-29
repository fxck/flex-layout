import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-gutter',
  styleUrls : [
    'gutter.demo.css',
    '../demo-app/material2.css'
  ],
  template: `
  <md-card class="card-demo">
    <div class="container">
      <div
        fxLayout="row"
        fxLayoutWrap="wrap"
        fxLayoutGutter="50px">
        <div class="flexitem" fxFlex="20">
          <div class="content  one">A</div>
        </div>
        <div class="flexitem" fxFlex="60">
          <div class="content  two">B</div>
        </div>
        <div class="flexitem" fxFlex="20">
          <div class="content  three">C</div>
        </div>
        <div class="flexitem" fxFlex="20">
          <div class="content  two">D</div>
        </div>
        <div class="flexitem" fxFlex="60">
          <div class="content  three">E</div>
        </div>
        <div class="flexitem" fxFlex="20">
          <div class="content  one">F</div>
        </div>
      </div>
    </div>
  </md-card>
  `
})
export class DemoGutter {

}

