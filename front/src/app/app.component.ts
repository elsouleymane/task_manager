import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [
    RouterOutlet
  ],
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
  `]
})
export class AppComponent { }
