import { push, ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { DB_PATHS } from '@/lib/dbPaths';
import { addStudentTimelineEvent } from '@/lib/studentStore';

export interface BookingRecord {
  id: string;
  name: string;
  email: string;
  studentEmail: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  ownerType: 'public' | 'user';
  userId: string | null;
  source: 'manual_request' | 'calendly_webhook';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  meetingLink?: string;
  adminInstructions?: string;
}

interface CreateBookingInput {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  userId?: string | null;
  source?: BookingRecord['source'];
}

export async function createBookingRecord(input: CreateBookingInput): Promise<BookingRecord> {
  const bookingRef = push(ref(db, DB_PATHS.bookings));
  const payload: BookingRecord = {
    id: bookingRef.key || crypto.randomUUID(),
    name: input.name,
    email: input.email,
    studentEmail: input.email,
    phone: input.phone,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    notes: input.notes || '',
    ownerType: input.userId ? 'user' : 'public',
    userId: input.userId || null,
    source: input.source || 'manual_request',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  await set(bookingRef, payload);

  if (input.userId) {
    try {
      await addStudentTimelineEvent(
        input.userId,
        'Consultation booked',
        `Consultation request submitted for ${payload.preferredDate} at ${payload.preferredTime}.`,
        'booking',
      );
    } catch (error) {
      console.warn('Booking saved but timeline event failed', error);
    }
  }

  return payload;
}
