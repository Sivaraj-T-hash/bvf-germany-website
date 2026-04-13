import { get, onValue, ref, remove, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { DB_PATHS } from '@/lib/dbPaths';

export interface WebinarCatalogItem {
  id: string;
  title: string;
  topic: string;
  speaker: string;
  imageUrl?: string;
  scheduleAt: string;
  durationMinutes: number;
  capacity: number;
  status: 'draft' | 'upcoming' | 'live' | 'completed';
  accessType: 'free' | 'paid';
  priceLabel: string;
  priceValue: number;
  meetingLink?: string;
  meetingLinkSharedAt?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const WEBINARS_PATH = DB_PATHS.webinars;

export async function getWebinarCatalog(): Promise<WebinarCatalogItem[]> {
  const snapshot = await get(ref(db, WEBINARS_PATH));
  if (!snapshot.exists()) return [];
  const value = snapshot.val() as Record<string, WebinarCatalogItem>;
  return Object.values(value).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function subscribeToWebinarCatalog(callback: (items: WebinarCatalogItem[]) => void): () => void {
  return onValue(ref(db, WEBINARS_PATH), (snapshot) => {
    const value = (snapshot.val() || {}) as Record<string, WebinarCatalogItem>;
    callback(Object.values(value).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  });
}

export async function saveWebinarCatalogItem(item: WebinarCatalogItem): Promise<void> {
  await set(ref(db, `${WEBINARS_PATH}/${item.id}`), item);
}

export async function deleteWebinarCatalogItem(id: string): Promise<void> {
  const registrationsSnapshot = await get(ref(db, DB_PATHS.webinarRegistrations));
  const deleteRegistrationTasks: Array<Promise<void>> = [];

  if (registrationsSnapshot.exists()) {
    const registrations = registrationsSnapshot.val() as Record<string, { webinarId?: string }>;
    Object.entries(registrations).forEach(([registrationId, registration]) => {
      if (registration?.webinarId === id) {
        deleteRegistrationTasks.push(remove(ref(db, `${DB_PATHS.webinarRegistrations}/${registrationId}`)));
      }
    });
  }

  await Promise.all([...deleteRegistrationTasks, remove(ref(db, `${WEBINARS_PATH}/${id}`))]);
}
