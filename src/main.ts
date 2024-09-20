// main.ts or the root file where your application is bootstrapped

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Routes, provideRouter } from '@angular/router';
import { NavbarInterviewComponent } from './app/navbar-interview/navbar-interview.component';
import { ZoomComponent } from './app/zoom-module/zoom.component';
import { ResumeParsingComponent } from './app/core/interview-module/resume-parsing/resume-parsing.component';

// Define the routes
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'mockinterview', component: ZoomComponent},
  { path: 'home', component: NavbarInterviewComponent },
  // { path: 'interview', component: InterviewModuleComponent },
  { path: 'resume-parsing', component: ResumeParsingComponent }
];
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule), provideAnimationsAsync(), provideAnimationsAsync(), provideRouter(routes)  // Provide HttpClientModule here
  ]
}).catch(err => console.error(err));
