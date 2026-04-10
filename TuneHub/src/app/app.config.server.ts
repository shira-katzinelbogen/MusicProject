import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { SOCIAL_AUTH_CONFIG } from '@abacritt/angularx-social-login';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: { autoLogin: false, providers: [] }
    },
    {
      provide: 'SocialAuthService', 
      useValue: { authState: { subscribe: () => {} } }
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);