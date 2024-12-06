import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';

bootstrapApplication(AppComponent,{
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(routes)
  ]
})
  .catch((err) => console.error(err));
