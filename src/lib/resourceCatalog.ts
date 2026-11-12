import germanyLandmark from '@/assets/germany-landmark.jpg';
import germanCampus from '@/assets/german-campus.jpg';
import studentsGroup from '@/assets/students-group.jpg';

export type ResourceCatalogItem = {
  id: string;
  title: string;
  shortLabel: string;
  department?: string;
  priceValue: number;
  originalPriceValue: number;
  rating: string;
  reviews: string;
  viewed: string;
  badge?: string;
  duration?: string;
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

export const resourceCatalog: ResourceCatalogItem[] = [
  {
    id: 'bachelor',
    title: "Bachelor's in Germany",
    shortLabel: 'Course Bundle',
    department: 'Studienkolleg',
    priceValue: 2499,
    originalPriceValue: 5499,
    rating: '4.8/5',
    reviews: '420 reviews',
    viewed: '3.2k students viewed',
    image: germanyLandmark,
    tagline: 'A compact academic toolkit for students planning their bachelor journey in Germany.',
    description:
      'Get all the core tools needed to shortlist, prepare, and apply for bachelor programs in Germany. Built for fast clarity, stronger shortlisting, and cleaner next-step planning.',
    ctaLabel: 'Buy Bachelor Bundle',
    previewNote: 'Pricing for UI preview only. Replace with live checkout once the payment gateway is ready.',
    bullets: [
      'A unique mix of great universities and high quality of life.',
      'One of the most popular study-abroad destinations.',
      "Bachelor's degrees are respected worldwide.",
      'Strong focus on technology, research, and innovation.',
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
    rating: '4.5/5',
    reviews: '520+ Reviews',
    viewed: 'Top Selling',
    image: studentsGroup,
    tagline: 'A guided planning tool for students who want a more independent preparation path.',
    description: 'Streamline your education abroad journey with a personalized roadmap and clear action order.',
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
    rating: '4.7/5',
    reviews: '2.5k+ Reviews',
    viewed: 'Top Selling',
    image: germanCampus,
    tagline: 'A shortlist-ready dataset to speed up research and comparison.',
    description: 'Access a curated Excel of German universities and simplify your search.',
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
    rating: '4.7/5',
    reviews: 'Focused guidance',
    viewed: '30 Min - 60 Min',
    duration: '30 Min - 60 Min',
    image: studentsGroup,
    tagline: 'One clear conversation to unblock your current study-abroad decision.',
    description: 'Streamline your education abroad journey with one focused guidance session.',
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
