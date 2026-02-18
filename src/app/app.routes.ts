import { Routes } from '@angular/router';

export const routes: Routes = [
  // 404 Not Found page
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  },

  // Redirect everything to 404 (including home page)
  {
    path: '',
    redirectTo: '/404',
    pathMatch: 'full'
  },

  // Wildcard route - catch all other paths and redirect to 404
  {
    path: '**',
    redirectTo: '/404'
  }
];
