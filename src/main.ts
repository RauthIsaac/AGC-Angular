// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { provideZoneChangeDetection } from '@angular/core';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
}).catch(err => console.error(err));