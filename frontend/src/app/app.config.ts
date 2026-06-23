import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt-interceptor';
import { Auth } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCharts(withDefaultRegisterables()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideAppInitializer(() => inject(Auth).init()),
  ]
};
