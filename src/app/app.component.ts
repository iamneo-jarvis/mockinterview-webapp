import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InterviewModuleComponent } from './core/interview-module/interview-module.component';
import { neoIcon, dashboard } from '../assets/index';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InterviewModuleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'mockinterview-webapp';
  path: any;
  neoIcon2 = neoIcon;
  dashboard = dashboard;
  // get isMainPage(): boolean {
  //   return ( 
  //     this.path && 
  //     this.path !== '/login' && 
  //     this.path !== '/' && 
  //     !this.path.includes('/forgot') && 
  //     !this.path.includes('redirect') &&
  //     !this.path.includes('student-resume')
  //   );
  // }
}
