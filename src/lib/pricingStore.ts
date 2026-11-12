import { db } from '@/lib/firebase';
import { get, onValue, ref, remove, set } from 'firebase/database';

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  billing: string;
  description: string;
  features: string[];
  badge?: string;
  ctaText: string;
  ctaLink: string;
  highlighted: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const defaultPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Guidance',
    price: 'INR 0',
    billing: 'Free Consultation',
    description: 'Perfect to understand your eligibility and next steps.',
    features: [
      'Profile evaluation',
      'University shortlist guidance',
      'APS readiness checklist',
      'Email support for 7 days',
    ],
    badge: 'Best for Starters',
    ctaText: 'Book Free Call',
    ctaLink: '/bookings',
    highlighted: false,
    published: true,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'pro',
    name: 'Visa + APS Support',
    price: 'INR 14,999',
    billing: 'One-time',
    description: 'Hands-on guidance for APS and visa success.',
    features: [
      'Document checklist & review',
      'APS interview preparation',
      'Visa documentation support',
      'Mock interview session',
      'Priority WhatsApp responses',
    ],
    badge: 'Most Popular',
    ctaText: 'Buy Now',
    ctaLink: '/pricing',
    highlighted: true,
    published: true,
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'premium',
    name: 'BVF Premium Mentorship',
    price: 'INR 39,999',
    billing: 'End-to-end',
    description: 'Personal mentorship from applications to arrival.',
    features: [
      'University applications',
      'SOP & LOR review',
      'Blocked account guidance',
      'Visa interview coaching',
      'Pre-departure support',
    ],
    badge: 'All-in-One',
    ctaText: 'Buy Now',
    ctaLink: '/pricing',
    highlighted: false,
    published: true,
    sortOrder: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const PRICING_PATH = 'pricingPlans';

const toMap = (plans: PricingPlan[]) =>
  plans.reduce<Record<string, PricingPlan>>((acc, plan) => {
    acc[plan.id] = plan;
    return acc;
  }, {});

const normalizePlan = (plan: PricingPlan): PricingPlan => ({
  ...plan,
  name: plan.name ?? '',
  price: plan.price ?? '',
  billing: plan.billing ?? '',
  description: plan.description ?? '',
  features: Array.isArray(plan.features) ? plan.features : [],
  ctaText: plan.ctaText ?? 'Get Started',
  ctaLink: plan.ctaLink ?? '/bookings',
  highlighted: Boolean(plan.highlighted),
  published: Boolean(plan.published),
  sortOrder: typeof plan.sortOrder === 'number' ? plan.sortOrder : 0,
});

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const snapshot = await get(ref(db, PRICING_PATH));
  if (!snapshot.exists()) {
    return defaultPlans.map(normalizePlan);
  }
  const data = snapshot.val() as Record<string, PricingPlan>;
  return Object.values(data).map(normalizePlan);
}

export async function savePricingPlan(plan: PricingPlan): Promise<void> {
  await set(ref(db, `${PRICING_PATH}/${plan.id}`), plan);
}

export async function deletePricingPlan(id: string): Promise<void> {
  await remove(ref(db, `${PRICING_PATH}/${id}`));
}

export function subscribeToPricingPlans(callback: (plans: PricingPlan[]) => void): () => void {
  return onValue(ref(db, PRICING_PATH), (snapshot) => {
    if (!snapshot.exists()) {
      callback(defaultPlans.map(normalizePlan));
      return;
    }
    const data = snapshot.val() as Record<string, PricingPlan>;
    callback(Object.values(data).map(normalizePlan));
  });
}
