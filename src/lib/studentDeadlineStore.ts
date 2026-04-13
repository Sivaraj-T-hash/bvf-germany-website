import { equalTo, onValue, orderByChild, push, query, ref, remove, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { DB_PATHS } from '@/lib/dbPaths';

export interface StudentDeadlineItem {
  id: string;
  userId: string;
  email: string;
  title: string;
  dueDate: string;
  dueTime?: string;
  note?: string;
  status: 'pending' | 'completed';
  createdAt: string;
  createdBy: string;
}

const DEADLINES_PATH = DB_PATHS.studentDeadlines;

const toArray = (value: Record<string, StudentDeadlineItem>) =>
  Object.entries(value).map(([id, item]) => ({ id, ...item }));

export function subscribeToAllStudentDeadlines(
  callback: (items: StudentDeadlineItem[]) => void,
): () => void {
  return onValue(ref(db, DEADLINES_PATH), (snapshot) => {
    const value = (snapshot.val() || {}) as Record<string, StudentDeadlineItem>;
    callback(toArray(value).sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
  });
}

export function subscribeToStudentDeadlines(
  input: { userId?: string | null; email?: string | null },
  callback: (items: StudentDeadlineItem[]) => void,
): () => void {
  const normalizedEmail = (input.email || '').toLowerCase();
  let byUserId: StudentDeadlineItem[] = [];
  let byEmail: StudentDeadlineItem[] = [];

  const sync = () => {
    const merged = [...byUserId, ...byEmail];
    const deduped = Array.from(new Map(merged.map((item) => [item.id, item])).values());
    callback(deduped.sort((a, b) => `${a.dueDate}${a.dueTime || ''}`.localeCompare(`${b.dueDate}${b.dueTime || ''}`)));
  };

  const stops: Array<() => void> = [];

  if (input.userId) {
    const byUserQuery = query(ref(db, DEADLINES_PATH), orderByChild('userId'), equalTo(input.userId));
    stops.push(onValue(byUserQuery, (snapshot) => {
      const value = (snapshot.val() || {}) as Record<string, StudentDeadlineItem>;
      byUserId = toArray(value);
      sync();
    }));
  }

  if (normalizedEmail) {
    const byEmailQuery = query(ref(db, DEADLINES_PATH), orderByChild('email'), equalTo(normalizedEmail));
    stops.push(onValue(byEmailQuery, (snapshot) => {
      const value = (snapshot.val() || {}) as Record<string, StudentDeadlineItem>;
      byEmail = toArray(value);
      sync();
    }));
  }

  sync();
  return () => {
    stops.forEach((stop) => stop());
  };
}

export async function saveStudentDeadline(
  input: Omit<StudentDeadlineItem, 'id' | 'createdAt' | 'status'> & { status?: StudentDeadlineItem['status'] },
): Promise<StudentDeadlineItem> {
  const deadlineRef = push(ref(db, DEADLINES_PATH));
  const payload: StudentDeadlineItem = {
    id: deadlineRef.key || crypto.randomUUID(),
    status: input.status || 'pending',
    createdAt: new Date().toISOString(),
    ...input,
  };
  await set(deadlineRef, payload);
  return payload;
}

export async function deleteStudentDeadline(deadlineId: string): Promise<void> {
  await remove(ref(db, `${DEADLINES_PATH}/${deadlineId}`));
}
