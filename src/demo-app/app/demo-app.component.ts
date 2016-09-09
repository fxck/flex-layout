import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-app',
  styleUrls : ['demo-app.component.css'],
  templateUrl: `
      <h2>Layout API Demos  
        <span class="title" style="font-size: 0.6em; font-weight:normal; padding-left: 20px;">
        Hint: Click on any of the samples below to toggle the layout direction.
        </span>
      </h2>
      
      <simple-row-column class="small-demo"></simple-row-column>
      
      <flex-row-fill class="small-demo" ></flex-row-fill>
      
      <flex-row-fill-wrap class="small-demo" ></flex-row-fill-wrap>
      
      <issue-5345></issue-5345>
      
  `,
  encapsulation: ViewEncapsulation.None,
})
export class DemoAppComponent {
}
