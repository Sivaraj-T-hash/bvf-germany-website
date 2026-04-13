import { push, ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { DB_PATHS } from '@/lib/dbPaths';

export type LeadSource = 'contact' | 'pricing' | 'tool';

export interface LeadRecord {
  id: string;
  source: LeadSource;
  sourcePage: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  ownerType: 'public' | 'user';
  userId: string | null;
  studentEmail: string;
  metadata: Record<string, string>;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: string;
}

interface CreateLeadInput {
  source: LeadSource;
  sourcePage: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  userId?: string | null;
  metadata?: Record<string, string>;
}

export async function createLeadRecord(input: CreateLeadInput): Promise<LeadRecord> {
  const leadRef = push(ref(db, DB_PATHS.leads));
  const payload: LeadRecord = {
    id: leadRef.key || crypto.randomUUID(),
    source: input.source,
    sourcePage: input.sourcePage,
    name: input.name,
    email: input.email,
    phone: input.phone || '',
    subject: input.subject,
    message: input.message,
    ownerType: input.userId ? 'user' : 'public',
    userId: input.userId || null,
    studentEmail: input.email,
    metadata: input.metadata || {},
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  await set(leadRef, payload);
  return payload;
}
