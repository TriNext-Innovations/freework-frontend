import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  // Home/Landing - redirect to jobs for now
  {
    path: '',
    redirectTo: '/jobs',
    pathMatch: 'full'
  },

  // Auth Routes
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Job Routes
  {
    path: 'jobs',
    loadComponent: () => import('./jobs/job-list/job-list.component').then(m => m.JobListComponent)
  },
  {
    path: 'jobs/new',
    loadComponent: () => import('./jobs/job-form/job-form.component').then(m => m.JobFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'jobs/edit/:id',
    loadComponent: () => import('./jobs/job-form/job-form.component').then(m => m.JobFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./jobs/job-detail/job-detail.component').then(m => m.JobDetailComponent)
  },
  {
    path: 'jobs/:id/apply',
    loadComponent: () => import('./jobs/job-application/job-application.component').then(m => m.JobApplicationComponent),
    canActivate: [authGuard]
  },

  // My Jobs Routes
  {
    path: 'my-jobs',
    loadComponent: () => import('./jobs/my-active-jobs/my-active-jobs.component').then(m => m.MyActiveJobsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-active-jobs',
    loadComponent: () => import('./jobs/my-active-jobs/my-active-jobs.component').then(m => m.MyActiveJobsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-applications',
    loadComponent: () => import('./jobs/my-applications/my-applications.component').then(m => m.MyApplicationsComponent),
    canActivate: [authGuard]
  },

  // Messaging Routes
  {
    path: 'messages',
    loadComponent: () => import('./messaging/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [authGuard]
  },

  // Payment Routes
  {
    path: 'payments',
    loadComponent: () => import('./payments/payment-list/payment-list.component').then(m => m.PaymentListComponent),
    canActivate: [authGuard]
  },

  // Profile Routes
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile-view/profile-view.component').then(m => m.ProfileViewComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile/edit',
    loadComponent: () => import('./profile/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./profile/profile-view/profile-view.component').then(m => m.ProfileViewComponent)
  },

  // Settings (placeholder - create component if needed)
  {
    path: 'settings',
    redirectTo: '/profile/edit',
    pathMatch: 'full'
  },

  // Reviews Demo
  {
    path: 'reviews-demo',
    loadComponent: () => import('./reviews/reviews-demo/reviews-demo.component').then(m => m.ReviewsDemoComponent)
  },

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
