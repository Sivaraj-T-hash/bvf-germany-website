import { get, onValue, ref, set, update } from 'firebase/database';
import { db } from '@/lib/firebase';

export interface AdminProfile {
  uid: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

const ADMINS_PATH = 'admins';

export async function getAdminProfile(uid: string): Promise<AdminProfile | null> {
  const snapshot = await get(ref(db, `${ADMINS_PATH}/${uid}`));
  if (!snapshot.exists()) return null;
  return snapshot.val() as AdminProfile;
}

export function subscribeToAdminProfile(
  uid: string,
  callback: (profile: AdminProfile | null) => void,
): () => void {
  return onValue(ref(db, `${ADMINS_PATH}/${uid}`), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback(snapshot.val() as AdminProfile);
  });
}

export async function saveAdminProfile(profile: AdminProfile): Promise<void> {
  await set(ref(db, `${ADMINS_PATH}/${profile.uid}`), profile);
}

export async function touchAdminLogin(uid: string): Promise<void> {
  await update(ref(db, `${ADMINS_PATH}/${uid}`), {
    lastLoginAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
