import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BsModalService } from 'ngx-bootstrap/modal';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    BsModalService,
  ],
};
