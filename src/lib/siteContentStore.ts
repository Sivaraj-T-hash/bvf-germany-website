import { get, onValue, push, ref, remove, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { DEFAULT_WHATSAPP_MESSAGE } from '@/lib/whatsapp';
import germanyLandmark from '@/assets/germany-landmark.jpg';
import germanCampus from '@/assets/german-campus.jpg';
import studentsGroup from '@/assets/students-group.jpg';

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
    image: germanyLandmark,
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
    image: germanCampus,
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
    image: studentsGroup,
    published: true,
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

const defaultTestimonials: TestimonialItem[] = [
  {
    id: 'aditi',
    name: 'Aditi Sharma',
    university: 'TU Munich',
    quote: 'BVF Germany helped me move from confusion to a clear public-university plan. The dashboard kept everything visible.',
    course: 'MS in Data Engineering',
    result: 'Admit + visa guidance completed',
    photo: '',
    published: true,
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'rohit',
    name: 'Rohit Verma',
    university: 'RWTH Aachen',
    quote: 'The team was structured and practical. I always knew what was pending and what the next milestone was.',
    course: 'MSc Mechanical Engineering',
    result: 'APS + application support completed',
    photo: '',
    published: true,
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'sneha',
    name: 'Sneha Iyer',
    university: 'University of Stuttgart',
    quote: 'The shortlist strategy saved me from weak applications and the profile support made the process much calmer.',
    course: 'MS in Automotive Systems',
    result: 'Shortlist + SOP + application support',
    photo: '',
    published: true,
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

const defaultSettings: SiteSettings = {
  heroBadge: 'India to Germany, with public-university clarity',
  heroTitle: 'A more credible Germany journey for ambitious Indian students.',
  heroDescription:
    'BVF Germany combines practical mentorship, transparent milestones, and a live dashboard across applications, APS, visa, bookings, and student support.',
  founderEmail: 'hello@bvfgermany.com',
  contactEmail: 'hello@bvfgermany.com',
  contactPhone: '+91 99999 99999',
  whatsappNumber: '919999999999',
  prefilledWhatsappMessage: DEFAULT_WHATSAPP_MESSAGE,
  instagramUrl: 'https://www.instagram.com/bratlins_view?igsh=OHBzemJpZWhkYnVu&utm_source=qr',
  youtubeUrl: 'https://youtube.com/@bvfgermany',
  linkedinUrl: 'https://www.linkedin.com/company/bvfgermany',
  facebookUrl: 'https://facebook.com/bvfgermany',
  tiktokUrl: 'https://tiktok.com/@bvfgermany',
  address: 'India & Germany',
};

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
  const snapshot = await get(ref(db, SETTINGS_PATH));
  if (!snapshot.exists()) {
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...(snapshot.val() as Partial<SiteSettings>),
  };
}

export function subscribeToSiteSettings(callback: (settings: SiteSettings) => void): () => void {
  return onValue(ref(db, SETTINGS_PATH), async (snapshot) => {
    if (!snapshot.exists()) {
      callback(await getSiteSettings());
      return;
    }

    callback({
      ...defaultSettings,
      ...(snapshot.val() as Partial<SiteSettings>),
    });
  });
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await set(ref(db, SETTINGS_PATH), settings);
}

export function createContentId(prefix: string): string {
  return `${prefix}-${push(ref(db)).key || crypto.randomUUID()}`;
}
