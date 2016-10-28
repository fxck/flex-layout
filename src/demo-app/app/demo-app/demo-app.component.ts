import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-app',
  styleUrls : ['demo-app.component.css'],
  templateUrl: `
      
    <md-toolbar>
      <h2>Demos: </h2>
      <button md-raised-button color="primary" [routerLink]="['issues']">Github Issues</button>
      <button md-raised-button color="primary" [routerLink]="['']">Layout Docs</button>
      <button md-raised-button color="primary" [routerLink]="['stackoverflow']">StackOverflow</button>
    </md-toolbar>
    
    <div #root="$implicit" dir="ltr" class="demo-content">
      <router-outlet></router-outlet>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class DemoApp {
}
