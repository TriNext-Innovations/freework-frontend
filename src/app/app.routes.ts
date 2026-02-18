import { Routes } from '@angular/router';

export const routes: Routes = [

  // 404 Not Found page
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/404'
  }
];
