import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).catch((err: unknown) =>
  console.error(err),
);
