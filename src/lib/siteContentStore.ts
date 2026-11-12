import { get, onValue, push, ref, remove, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { businessInfo } from '@/config/business';
import { cleanContactValue } from '@/lib/contact';
import tumLogo from '@/assets/Technical University of Munich.png';
import rwthLogo from '@/assets/RWTH Aachen University .png';
import tuBerlinLogo from '@/assets/Technical University of Berlin.png';

export interface UniversityItem {
  id: string;
  name: string;
  location: string;
  category: string;
  tuition: string;
  website: string;
  programs: string[];
  description: string;
  image: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  university: string;
  quote: string;
  course: string;
  result: string;
  photo: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  founderEmail: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  prefilledWhatsappMessage: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  address: string;
  workingHours: string;
}

const UNIVERSITIES_PATH = 'siteContent/universities';
const TESTIMONIALS_PATH = 'siteContent/testimonials';
const SETTINGS_PATH = 'siteContent/settings';

const defaultUniversities: UniversityItem[] = [
  {
    id: 'tu-munich',
    name: 'Technical University of Munich',
    location: 'Munich, Germany',
    category: 'Public University',
    tuition: 'Low semester contribution',
    website: 'https://www.tum.de',
    programs: ['Engineering', 'Computer Science', 'Management'],
    description: 'A strong fit for ambitious students targeting research-led public university outcomes.',
    image: tumLogo,
    published: true,
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'rwth-aachen',
    name: 'RWTH Aachen University',
    location: 'Aachen, Germany',
    category: 'Public University',
    tuition: 'Low semester contribution',
    website: 'https://www.rwth-aachen.de',
    programs: ['Mechanical Engineering', 'Data Science', 'Robotics'],
    description: 'Popular with Indian students seeking technical depth and a strong employer brand.',
    image: rwthLogo,
    published: true,
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tu-berlin',
    name: 'TU Berlin',
    location: 'Berlin, Germany',
    category: 'Public University',
    tuition: 'Low semester contribution',
    website: 'https://www.tu.berlin',
    programs: ['AI', 'Urban Systems', 'Electrical Engineering'],
    description: 'An attractive option for students who want city access, tech energy, and public-university value.',
    image: tuBerlinLogo,
    published: true,
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

// Testimonials must be genuine and authorised, so there are no built-in examples.
// Detailed student stories live in src/content/successStories.ts.
const defaultTestimonials: TestimonialItem[] = [];

const defaultSettings: SiteSettings = {
  heroBadge: 'India to Germany, with public-university clarity',
  heroTitle: 'A more credible Germany journey for ambitious Indian students.',
  heroDescription:
    'BVF Germany combines practical mentorship, transparent milestones, and a live dashboard across applications, APS, visa, bookings, and student support.',
  founderEmail: businessInfo.email,
  contactEmail: businessInfo.email,
  contactPhone: businessInfo.phone,
  whatsappNumber: businessInfo.whatsappNumber,
  prefilledWhatsappMessage: businessInfo.whatsappMessage,
  instagramUrl: businessInfo.instagramUrl,
  youtubeUrl: businessInfo.youtubeUrl,
  address: businessInfo.address,
  workingHours: businessInfo.workingHours,
  // Not shown until BVF confirms the accounts (the earlier guesses were not verified).
  linkedinUrl: '',
  facebookUrl: '',
  tiktokUrl: '',
};

/** Confirmed defaults, used before the database responds. */
export const defaultSiteSettings: SiteSettings = defaultSettings;

const CONTACT_FIELDS = ['founderEmail', 'contactEmail', 'contactPhone', 'whatsappNumber', 'instagramUrl', 'youtubeUrl', 'linkedinUrl', 'facebookUrl', 'tiktokUrl', 'address', 'workingHours'] as const;

/**
 * Merges saved settings over the defaults. Empty saved values never wipe a confirmed default,
 * and placeholder values from older versions (e.g. +91 99999 99999) are dropped.
 */
function cleanSettings(saved: Partial<SiteSettings> | null | undefined): SiteSettings {
  const merged: SiteSettings = { ...defaultSettings };
  for (const [key, value] of Object.entries(saved || {})) {
    if (typeof value === 'string' && value.trim()) {
      (merged as unknown as Record<string, string>)[key] = value.trim();
    }
  }
  for (const field of CONTACT_FIELDS) {
    merged[field] = cleanContactValue(merged[field]);
  }
  if (!merged.prefilledWhatsappMessage) merged.prefilledWhatsappMessage = businessInfo.whatsappMessage;
  return merged;
}

const toMap = <T extends { id: string }>(items: T[]) =>
  items.reduce<Record<string, T>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

async function ensureSeeded<T extends { id: string }>(path: string, defaults: T[]): Promise<Record<string, T>> {
  const snapshot = await get(ref(db, path));
  if (snapshot.exists()) {
    return snapshot.val() as Record<string, T>;
  }

  return toMap(defaults);
}

export async function getUniversities(): Promise<UniversityItem[]> {
  const data = await ensureSeeded(UNIVERSITIES_PATH, defaultUniversities);
  return Object.values(data).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function subscribeToUniversities(callback: (items: UniversityItem[]) => void): () => void {
  return onValue(ref(db, UNIVERSITIES_PATH), async (snapshot) => {
    if (!snapshot.exists()) {
      callback(await getUniversities());
      return;
    }

    const data = snapshot.val() as Record<string, UniversityItem>;
    callback(Object.values(data).sort((a, b) => a.sortOrder - b.sortOrder));
  });
}

export async function saveUniversity(item: UniversityItem): Promise<void> {
  await set(ref(db, `${UNIVERSITIES_PATH}/${item.id}`), item);
}

export async function deleteUniversity(id: string): Promise<void> {
  await remove(ref(db, `${UNIVERSITIES_PATH}/${id}`));
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  const data = await ensureSeeded(TESTIMONIALS_PATH, defaultTestimonials);
  return Object.values(data).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function subscribeToTestimonials(callback: (items: TestimonialItem[]) => void): () => void {
  return onValue(ref(db, TESTIMONIALS_PATH), async (snapshot) => {
    if (!snapshot.exists()) {
      callback(await getTestimonials());
      return;
    }

    const data = snapshot.val() as Record<string, TestimonialItem>;
    callback(Object.values(data).sort((a, b) => a.sortOrder - b.sortOrder));
  });
}

export async function saveTestimonial(item: TestimonialItem): Promise<void> {
  await set(ref(db, `${TESTIMONIALS_PATH}/${item.id}`), item);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await remove(ref(db, `${TESTIMONIALS_PATH}/${id}`));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snapshot = await get(ref(db, SETTINGS_PATH));
    return cleanSettings(snapshot.exists() ? (snapshot.val() as Partial<SiteSettings>) : null);
  } catch (error) {
    console.warn('Site settings could not be loaded; using defaults.', error);
    return cleanSettings(null);
  }
}

export function subscribeToSiteSettings(callback: (settings: SiteSettings) => void): () => void {
  return onValue(
    ref(db, SETTINGS_PATH),
    (snapshot) => callback(cleanSettings(snapshot.exists() ? (snapshot.val() as Partial<SiteSettings>) : null)),
    () => callback(cleanSettings(null)),
  );
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await set(ref(db, SETTINGS_PATH), settings);
}

export function createContentId(prefix: string): string {
  return `${prefix}-${push(ref(db)).key || crypto.randomUUID()}`;
}
