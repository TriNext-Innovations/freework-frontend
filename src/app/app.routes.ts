import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard, profileSetupDeactivateGuard } from './auth/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    redirectTo: '/jobs',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // Job routes
  {
    path: 'jobs',
    loadComponent: () => import('./jobs/job-list/job-list.component').then(m => m.JobListComponent)
  },
  {
    path: 'jobs/new',
    loadComponent: () => import('./jobs/job-form/job-form.component').then(m => m.JobFormComponent),
    canActivate: [authGuard, roleGuard(['CUSTOMER'])]
  },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./jobs/job-detail/job-detail.component').then(m => m.JobDetailComponent)
  },
  {
    path: 'jobs/:id/edit',
    loadComponent: () => import('./jobs/job-form/job-form.component').then(m => m.JobFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'jobs/:id/apply',
    loadComponent: () => import('./jobs/job-application/job-application.component').then(m => m.JobApplicationComponent),
    canActivate: [authGuard, roleGuard(['FREELANCER'])]
  },
  {
    path: 'jobs/:id/applications',
    loadComponent: () => import('./jobs/job-applications/job-applications.component').then(m => m.JobApplicationsComponent),
    canActivate: [authGuard, roleGuard(['CUSTOMER'])]
  },

  // My Jobs & Applications
  {
    path: 'my-jobs',
    loadComponent: () => import('./jobs/my-active-jobs/my-active-jobs.component').then(m => m.MyActiveJobsComponent),
    canActivate: [authGuard, roleGuard(['CUSTOMER'])]
  },
  {
    path: 'my-applications',
    loadComponent: () => import('./jobs/my-applications/my-applications.component').then(m => m.MyApplicationsComponent),
    canActivate: [authGuard, roleGuard(['FREELANCER'])]
  },
  {
    path: 'my-active-jobs',
    loadComponent: () => import('./jobs/my-active-jobs/my-active-jobs.component').then(m => m.MyActiveJobsComponent),
    canActivate: [authGuard, roleGuard(['FREELANCER'])]
  },

  // Messaging routes
  {
    path: 'messages',
    loadComponent: () => import('./messaging/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [authGuard]
  },
  {
    path: 'messages/:conversationId',
    loadComponent: () => import('./messaging/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [authGuard]
  },

  // Payment routes
  {
    path: 'payments',
    loadComponent: () => import('./payments/payment-list/payment-list.component').then(m => m.PaymentListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'payments/:id',
    loadComponent: () => import('./payments/payment-status/payment-status.component').then(m => m.PaymentStatusComponent),
    canActivate: [authGuard]
  },
  {
    path: 'payments/:id/escrow',
    loadComponent: () => import('./payments/payment-escrow/payment-escrow.component').then(m => m.PaymentEscrowComponent),
    canActivate: [authGuard]
  },
  {
    path: 'payments/create/:jobId',
    loadComponent: () => import('./payments/stripe-payment/stripe-payment.component').then(m => m.StripePaymentComponent),
    canActivate: [authGuard, roleGuard(['CUSTOMER'])]
  },

  // Review routes
  {
    path: 'reviews',
    loadComponent: () => import('./reviews/review-list/review-list.component').then(m => m.ReviewListComponent)
  },
  {
    path: 'reviews/demo',
    loadComponent: () => import('./reviews/reviews-demo/reviews-demo.component').then(m => m.ReviewsDemoComponent)
  },

  // Settings
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },

  // Profile setup (post-registration onboarding)
  {
    path: 'profile/setup',
    loadComponent: () => import('./profile/profile-setup/profile-setup.component').then(m => m.ProfileSetupComponent),
    canActivate: [authGuard],
    canDeactivate: [profileSetupDeactivateGuard]
  },

  // Profile routes
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
    path: 'profile/:userId',
    loadComponent: () => import('./profile/profile-view/profile-view.component').then(m => m.ProfileViewComponent)
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '/jobs'
  }
];
