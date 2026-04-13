import { equalTo, get, onValue, orderByChild, push, query, ref, set, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { DB_PATHS } from '@/lib/dbPaths';

export interface StudentNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'account' | 'document' | 'deadline' | 'system';
  read: boolean;
  createdAt: string;
}

export function subscribeToStudentNotifications(userId: string, callback: (items: StudentNotification[]) => void): () => void {
  const notificationsQuery = query(ref(db, DB_PATHS.notifications), orderByChild('userId'), equalTo(userId));
  return onValue(notificationsQuery, (snapshot) => {
    const value = (snapshot.val() || {}) as Record<string, StudentNotification>;
    const items = Object.values(value)
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    callback(items);
  });
}

export async function createStudentNotification(input: Omit<StudentNotification, 'id' | 'createdAt' | 'read'> & { read?: boolean }): Promise<void> {
  const notificationRef = push(ref(db, DB_PATHS.notifications));
  const payload: StudentNotification = {
    id: notificationRef.key || crypto.randomUUID(),
    userId: input.userId,
    title: input.title,
    message: input.message,
    type: input.type,
    read: input.read ?? false,
    createdAt: new Date().toISOString(),
  };
  await set(notificationRef, payload);
}

export async function markStudentNotificationRead(id: string, read = true): Promise<void> {
  await update(ref(db, `${DB_PATHS.notifications}/${id}`), { read });
}

export async function notifyAdminUsers(input: { title: string; message: string; type?: StudentNotification['type'] }): Promise<void> {
  try {
    const snapshot = await get(ref(db, 'admins'));
    if (!snapshot.exists()) return;

    const admins = (snapshot.val() || {}) as Record<string, { isAdmin?: boolean }>;
    const adminIds = Object.entries(admins)
      .filter(([, admin]) => admin?.isAdmin)
      .map(([uid]) => uid);

    await Promise.all(
      adminIds.map((uid) =>
        createStudentNotification({
          userId: uid,
          title: input.title,
          message: input.message,
          type: input.type || 'system',
        }),
      ),
    );
  } catch (error) {
    console.warn('Admin notifications skipped because the current client cannot access /admins.', error);
  }
}
