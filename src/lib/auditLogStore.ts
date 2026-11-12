import { push, ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { DB_PATHS } from '@/lib/dbPaths';

export interface AuditLogItem {
  id: string;
  entityType: 'student';
  entityId: string;
  action: 'status_changed';
  actorId: string;
  actorEmail: string;
  details: Record<string, string>;
  createdAt: string;
}

export async function createAuditLog(input: Omit<AuditLogItem, 'id' | 'createdAt'>): Promise<void> {
  const logRef = push(ref(db, DB_PATHS.auditLogs));
  const payload: AuditLogItem = {
    id: logRef.key || crypto.randomUUID(),
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    actorId: input.actorId,
    actorEmail: input.actorEmail,
    details: input.details,
    createdAt: new Date().toISOString(),
  };
  await set(logRef, payload);
}
