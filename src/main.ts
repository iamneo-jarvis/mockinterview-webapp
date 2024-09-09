// main.ts or the root file where your application is bootstrapped

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule), provideAnimationsAsync()  // Provide HttpClientModule here
  ]
}).catch(err => console.error(err));
