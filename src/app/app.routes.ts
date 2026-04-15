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
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'verify',
    loadComponent: () => import('./auth/email-verify/email-verify.component').then(m => m.EmailVerifyComponent)
  },
  // Landing page for the backend email-verification redirect.
  // Backend redirects here with ?code=<one-time-code>; this page exchanges it for a JWT.
  {
    path: 'auth/verified',
    loadComponent: () => import('./auth/email-verified/email-verified.component').then(m => m.EmailVerifiedComponent)
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
  {
    path: 'payments/success',
    loadComponent: () => import('./payments/payment-result/payment-result.component').then(m => m.PaymentResultComponent),
    canActivate: [authGuard],
    data: { success: true }
  },
  {
    path: 'payments/cancel',
    loadComponent: () => import('./payments/payment-result/payment-result.component').then(m => m.PaymentResultComponent),
    canActivate: [authGuard],
    data: { success: false }
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

  // Pricing
  {
    path: 'pricing',
    loadComponent: () => import('./subscription/pricing/pricing.component').then(m => m.PricingComponent)
  },

  // Subscription result pages (post-checkout redirects)
  {
    path: 'subscription/success',
    loadComponent: () => import('./subscription/subscription-result/subscription-result.component').then(m => m.SubscriptionResultComponent),
    canActivate: [authGuard],
    data: { success: true }
  },
  {
    path: 'subscription/cancel',
    loadComponent: () => import('./subscription/subscription-result/subscription-result.component').then(m => m.SubscriptionResultComponent),
    canActivate: [authGuard],
    data: { success: false }
  },

  // Settings
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings/billing',
    loadComponent: () => import('./subscription/billing/billing.component').then(m => m.BillingComponent),
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

  // Legal pages (public)
  {
    path: 'legal/privacy-policy',
    loadComponent: () => import('./legal/legal-page/legal-page.component').then(m => m.LegalPageComponent),
    data: { documentKey: 'privacy-policy' }
  },
  {
    path: 'legal/cookie-policy',
    loadComponent: () => import('./legal/legal-page/legal-page.component').then(m => m.LegalPageComponent),
    data: { documentKey: 'cookie-policy' }
  },
  {
    path: 'legal/freelancer-terms',
    loadComponent: () => import('./legal/legal-page/legal-page.component').then(m => m.LegalPageComponent),
    data: { documentKey: 'freelancer-terms' }
  },
  {
    path: 'legal/business-terms',
    loadComponent: () => import('./legal/legal-page/legal-page.component').then(m => m.LegalPageComponent),
    data: { documentKey: 'business-terms' }
  },
  {
    path: 'legal/popia-request',
    loadComponent: () => import('./legal/popia-request/popia-request.component').then(m => m.PopiaRequestComponent),
    canActivate: [authGuard]
  },
  {
    path: 'unsubscribe',
    loadComponent: () => import('./legal/unsubscribe/unsubscribe.component').then(m => m.UnsubscribeComponent)
  },
  {
    path: 'reconsent',
    loadComponent: () => import('./legal/reconsent/reconsent.component').then(m => m.ReconsentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/popia-requests',
    loadComponent: () => import('./admin/popia-admin/popia-admin.component').then(m => m.PopiaAdminComponent),
    canActivate: [authGuard, roleGuard(['ADMIN'])]
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '/jobs'
  }
];
