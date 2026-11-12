export type ResourceCatalogItem = {
  id: string;
  title: string;
  shortLabel: string;
  department?: string;
  priceValue: number;
  originalPriceValue: number;
  /** Show only genuine figures (e.g. real review averages). Leave empty to hide. */
  rating: string;
  reviews: string;
  viewed: string;
  badge?: string;
  duration?: string;
  /** Genuine product image URL, or empty to show the branded graphic. */
  image: string;
  tagline: string;
  description: string;
  ctaLabel: string;
  previewNote?: string;
  bullets: string[];
  deliverables?: string[];
  files?: string[];
};

export const RESOURCE_DEPARTMENTS = [
  'Masters in Engineering',
  'Masters in Business & Management',
  'Natural Sciences',
  'Humanities & Social Sciences',
  'IT & Computer Science',
  'Health & Medicine',
  'Architecture & Design',
  'Law & Economics',
  'Studienkolleg',
  'Language & Test Prep',
  'Visa & Documentation',
  'Scholarships & Finance',
  'Accommodation & Arrival',
  'Career & CV',
] as const;

// Built-in packages, used until the admin saves packages in the dashboard.
// Prices must be confirmed by BVF before launch.
export const resourceCatalog: ResourceCatalogItem[] = [
  {
    id: 'bachelor',
    title: "Bachelor's in Germany",
    shortLabel: 'Course Bundle',
    department: 'Studienkolleg',
    priceValue: 2499,
    originalPriceValue: 2499,
    rating: '',
    reviews: '',
    viewed: '',
    image: '',
    tagline: 'A compact academic toolkit for students planning their bachelor journey in Germany.',
    description:
      'Get the core tools needed to shortlist, prepare, and apply for bachelor programs in Germany: clearer shortlisting and cleaner next-step planning.',
    ctaLabel: 'Buy Bachelor Bundle',
    bullets: [
      'Studienkolleg and direct-admission routes explained',
      'Shortlisting support for bachelor programs',
      'Application preparation checklist',
      'Document readiness worksheet',
    ],
    deliverables: [
      'Studienkolleg bundle sheet',
      'Bachelor program shortlist notes',
      'Application prep checklist',
      'Document readiness worksheet',
    ],
    files: ['Studienkolleg Bundle Sheet.xlsx'],
  },
  {
    id: 'selfhelp',
    title: 'BVF Selfhelp Tool',
    shortLabel: 'Digital Tool',
    department: 'Visa & Documentation',
    priceValue: 1450,
    originalPriceValue: 1450,
    rating: '',
    reviews: '',
    viewed: '',
    image: '',
    tagline: 'A guided planning tool for students who want a more independent preparation path.',
    description: 'Plan your Germany application with a personalized roadmap and a clear order of actions.',
    ctaLabel: 'Buy Now',
    bullets: [
      'Personal planning prompts',
      'Simple decision checkpoints',
      'Reusable workflow for next milestones',
    ],
  },
  {
    id: 'excel',
    title: 'University Excel Sheet',
    shortLabel: 'Data Pack',
    department: 'Masters in Engineering',
    priceValue: 499,
    originalPriceValue: 499,
    rating: '',
    reviews: '',
    viewed: '',
    image: '',
    tagline: 'A shortlist-ready dataset to speed up research and comparison.',
    description: 'A curated Excel sheet of German universities to simplify your search.',
    ctaLabel: 'Buy Now',
    bullets: [
      'Curated university list',
      'Faster compare-and-filter workflow',
      'Useful for self-shortlisting and mentor calls',
    ],
    files: ['University Excel Sheet.xlsx'],
  },
  {
    id: 'appointment',
    title: 'Personal Appointment',
    shortLabel: 'Mentor Session',
    department: 'Career & CV',
    priceValue: 999,
    originalPriceValue: 999,
    rating: '',
    reviews: '',
    viewed: '',
    duration: '30 Min - 60 Min',
    image: '',
    tagline: 'One clear conversation to unblock your current study-abroad decision.',
    description: 'One focused one-on-one guidance session on your current stage.',
    ctaLabel: 'Buy Now',
    bullets: [
      'One-on-one session',
      'Focused feedback on your current stage',
      'Ideal for questions on shortlist, docs, and next actions',
    ],
  },
];

export const getResourceCatalogItem = (id: string) =>
  resourceCatalog.find((item) => item.id === id) || null;
