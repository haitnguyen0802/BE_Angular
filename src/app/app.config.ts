import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, HttpHeaders } from '@angular/common/http';
import { HTTP_INTERCEPTORS, HttpRequest, HttpHandlerFn } from '@angular/common/http';

import { routes } from './app.routes';
import { TranslationService } from './services/translation.service';

// Interceptor để xử lý CORS
function corsInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const corsReq = req.clone({
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    })
  });
  return next(corsReq);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([corsInterceptor])
    ),
    TranslationService
  ]
};
