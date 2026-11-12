import { push, ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { DB_PATHS } from '@/lib/dbPaths';
import { addStudentTimelineEvent } from '@/lib/studentStore';

export interface WebinarRegistrationRecord {
  id: string;
  webinarId: string;
  webinarTitle: string;
  webinarDate: string;
  webinarAccessType?: 'free' | 'paid';
  name: string;
  email: string;
  studentEmail: string;
  phone: string;
  qualification: string;
  intake: string;
  planningYear: string;
  ownerType: 'public' | 'user';
  userId: string | null;
  orderId?: string | null;
  attendanceStatus: 'registered' | 'attended' | 'missed';
  status: 'new' | 'contacted' | 'confirmed';
  createdAt: string;
}

interface CreateWebinarRegistrationInput {
  webinarId: string;
  webinarTitle: string;
  webinarDate: string;
  webinarAccessType?: 'free' | 'paid';
  name: string;
  email: string;
  phone: string;
  qualification: string;
  intake: string;
  planningYear: string;
  userId?: string | null;
  orderId?: string | null;
  consentAt?: string;
}

export async function createWebinarRegistration(
  input: CreateWebinarRegistrationInput,
): Promise<WebinarRegistrationRecord> {
  const registrationRef = push(ref(db, DB_PATHS.webinarRegistrations));
  const payload: WebinarRegistrationRecord = {
    id: registrationRef.key || crypto.randomUUID(),
    webinarId: input.webinarId,
    webinarTitle: input.webinarTitle,
    webinarDate: input.webinarDate,
    webinarAccessType: input.webinarAccessType || 'free',
    name: input.name,
    email: input.email,
    studentEmail: input.email,
    phone: input.phone,
    qualification: input.qualification,
    intake: input.intake,
    planningYear: input.planningYear,
    ownerType: input.userId ? 'user' : 'public',
    userId: input.userId || null,
    orderId: input.orderId || null,
    attendanceStatus: 'registered',
    status: 'new',
    ...(input.consentAt ? { consentAt: input.consentAt } : {}),
    createdAt: new Date().toISOString(),
  };

  await set(registrationRef, payload);

  if (input.userId) {
    try {
      await addStudentTimelineEvent(
        input.userId,
        'Webinar registered',
        `Registered for webinar: ${payload.webinarTitle}.`,
        'webinar',
      );
    } catch (error) {
      console.warn('Webinar registration saved but timeline event failed', error);
    }
  }

  return payload;
}
