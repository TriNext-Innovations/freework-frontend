export type SubscriptionPlan = 'FREE' | 'PRO';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING' | 'INACTIVE';

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  proMember: boolean;
  currentPeriodEnd?: string;
  applicationsThisMonth?: number;  // freelancers
  activeJobsCount?: number;        // customers
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export const FREE_TIER_APPLICATION_LIMIT = 5;
export const FREE_TIER_JOB_LIMIT = 1;
