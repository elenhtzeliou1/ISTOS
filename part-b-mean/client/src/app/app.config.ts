import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter,withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // enable anchor scrolling (navigate from footer or index to a specific part in categoires.html page)
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
         scrollPositionRestoration: 'top',
      })
    ),
  ],
};