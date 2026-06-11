import { ApplicationConfig, Injectable, inject, provideZoneChangeDetection } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter, RouterStateSnapshot, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './auth/token.interceptor';

import { routes } from './app.routes';

/** Appends the brand to every route title: "Browse jobs · freework". */
@Injectable()
export class FreeworkTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(snapshot);
    this.title.setTitle(routeTitle ? `${routeTitle} · freework` : 'freework — doing what you love');
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    ),
    { provide: TitleStrategy, useClass: FreeworkTitleStrategy },
  ]
};
