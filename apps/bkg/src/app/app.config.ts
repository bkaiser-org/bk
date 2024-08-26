import {
  provideClientHydration,
  BrowserModule,
} from '@angular/platform-browser';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withPreloading,
} from '@angular/router';
import { appRoutes } from './app.routes';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { ColorPickerModule } from '@iplab/ngx-color-picker';

// plain firebase with rxfire
import { ENV, I18nService, TranslocoHttpLoader } from '@bk/util';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTransloco } from '@jsverse/transloco';
import { FlagBasedPreloadingStrategy } from './config/preloading-strategy';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';
import { provideServiceWorker } from '@angular/service-worker';

const app = initializeApp(environment.firebase);

if (environment.production === false) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (<any>window).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
// Create a ReCaptchaEnterpriseProvider instance using the reCAPTCHA Enterprise
// site key and pass it to initializeAppCheck().
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    environment.firebase.appcheckRecaptchaEnterpriseKey
  ),
  isTokenAutoRefreshEnabled: true, // Set to true to allow auto-refresh.
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: ENV, useValue: environment },
    provideAnimations(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      useSetInputAPI: true,
    }),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withPreloading(FlagBasedPreloadingStrategy),
      withEnabledBlockingInitialNavigation()
    ),

    // Browser and HttpClient
    importProvidersFrom(BrowserModule),
    importProvidersFrom(ColorPickerModule),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'de', 'fr', 'es', 'it'],
        defaultLang: 'de',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    I18nService, provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
};
