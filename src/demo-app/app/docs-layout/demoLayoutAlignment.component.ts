import {Component, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'demo-layout-alignment',
  styles : [
    ".hint { margin:5px; font-size:0.9em;color: #a3a3a3; }",
    "md-radio-group { padding-top: 15px;}",
    ".demo_controls { width: 100%;height: 200px; margin-bottom: 25px; }",
    ".demo_controls > div { padding-top: 15px; color: #6c6c6c; }",
    ".demo { margin-bottom:60px; }"
  ],
  templateUrl: 'demoLayoutAlignment.html',
  encapsulation: ViewEncapsulation.None,
})
export class DemoLayoutAlignment {
  public direction = "row";
  public mainAxis = "space-around";
  public crossAxis = "center";

  layoutAlign () {
      return `${this.mainAxis} ${this.crossAxis}`;
  }
}
