import { get, onValue, ref as dbRef, set, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import {
  defaultServiceProgress,
  serviceCatalog,
  serviceStatusLabels,
  type ServiceProgressItem,
  type ServiceStatus,
  type StudentDocumentLink,
} from '@/lib/serviceCatalog';
import { createAuditLog } from '@/lib/auditLogStore';
import { createStudentNotification } from '@/lib/notificationStore';

export type StudentAccountStatus = 'pending_approval' | 'approved' | 'rejected' | 'suspended';

export interface StudentAdminNote {
  id: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

export interface StudentTimelineEvent {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  type: 'system' | 'profile' | 'service' | 'document' | 'booking' | 'webinar';
}

export interface StudentProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'student';
  status: StudentAccountStatus;
  isApproved: boolean;
  approvedAt?: string;
  approvedBy?: string | null;
  rejectionReason?: string | null;
  universityPreference: string;
  profilePhoto: string;
  services: ServiceProgressItem[];
  adminNotes: StudentAdminNote[];
  timeline: StudentTimelineEvent[];
  hasLoggedInOnce: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentEditableProfileFields {
  name: string;
  phone: string;
  universityPreference: string;
  profilePhoto: string;
}

const STUDENTS_PATH = 'students';

const createTimelineEvent = (
  title: string,
  description: string,
  type: StudentTimelineEvent['type'],
): StudentTimelineEvent => ({
  id: crypto.randomUUID(),
  title,
  description,
  type,
  createdAt: new Date().toISOString(),
});

const normalizeProfile = (profile: Partial<StudentProfile>, uidFallback?: string): StudentProfile => {
  const serviceMap = new Map((Array.isArray(profile.services) ? profile.services : []).map((service) => [service.id, service]));
  const createdAt = typeof profile.createdAt === 'string' && profile.createdAt ? profile.createdAt : new Date().toISOString();
  const updatedAt = typeof profile.updatedAt === 'string' && profile.updatedAt ? profile.updatedAt : createdAt;

  return {
    uid: profile.uid || uidFallback || '',
    name: profile.name || profile.email || 'Student',
    email: profile.email || '',
    phone: profile.phone || '',
    role: 'student',
    status:
      profile.status === 'pending_approval' || profile.status === 'approved' || profile.status === 'rejected' || profile.status === 'suspended'
        ? profile.status
        : profile.isApproved
          ? 'approved'
          : 'pending_approval',
    isApproved:
      profile.status === 'pending_approval' || profile.status === 'rejected' || profile.status === 'suspended'
        ? false
        : profile.status === 'approved'
          ? true
          : Boolean(profile.isApproved),
    approvedAt: profile.approvedAt,
    approvedBy: profile.approvedBy || null,
    rejectionReason: profile.rejectionReason || null,
    universityPreference: profile.universityPreference || 'Public Universities',
    profilePhoto: profile.profilePhoto || '',
    adminNotes: Array.isArray(profile.adminNotes) ? profile.adminNotes : [],
    timeline: Array.isArray(profile.timeline) ? profile.timeline : [],
    services: defaultServiceProgress().map((base) => {
      const current = serviceMap.get(base.id);
      return {
        ...base,
        ...current,
        title: current?.title || base.title,
        requiredDocuments:
          Array.isArray(current?.requiredDocuments) && current.requiredDocuments.length > 0
            ? current.requiredDocuments
            : base.requiredDocuments,
        documentLinks: Array.isArray(current?.documentLinks) ? current.documentLinks : [],
        adminNote: current?.adminNote || '',
        enrolled: Boolean(current?.enrolled),
        updatedAt: current?.updatedAt || base.updatedAt,
      };
    }),
    hasLoggedInOnce: typeof profile.hasLoggedInOnce === 'boolean' ? profile.hasLoggedInOnce : true,
    createdAt,
    updatedAt,
  };
};

export const createDefaultStudentProfile = (input: {
  uid: string;
  name: string;
  email: string;
  phone: string;
}): StudentProfile => ({
  uid: input.uid,
  name: input.name,
  email: input.email,
  phone: input.phone,
  role: 'student',
  status: 'approved',
  isApproved: true,
  approvedAt: new Date().toISOString(),
  approvedBy: null,
  rejectionReason: null,
  universityPreference: 'Public Universities',
  profilePhoto: '',
  services: defaultServiceProgress(),
  adminNotes: [],
  timeline: [
    createTimelineEvent('Account created', 'Your BVF Germany student dashboard is ready.', 'system'),
  ],
  hasLoggedInOnce: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const pickEditableProfileFields = (
  patch: Partial<StudentEditableProfileFields>,
): Partial<StudentEditableProfileFields> => ({
  ...(typeof patch.name === 'string' ? { name: patch.name } : {}),
  ...(typeof patch.phone === 'string' ? { phone: patch.phone } : {}),
  ...(typeof patch.universityPreference === 'string' ? { universityPreference: patch.universityPreference } : {}),
  ...(typeof patch.profilePhoto === 'string' ? { profilePhoto: patch.profilePhoto } : {}),
});

export async function getStudentProfile(uid: string): Promise<StudentProfile | null> {
  const snapshot = await get(dbRef(db, `${STUDENTS_PATH}/${uid}`));
  if (snapshot.exists()) {
    return normalizeProfile(snapshot.val() as Partial<StudentProfile>, uid);
  }
  return null;
}

export async function ensureStudentProfile(input: {
  uid: string;
  email: string;
  name?: string;
  phone?: string;
}): Promise<StudentProfile> {
  const existing = await getStudentProfile(input.uid);
  if (existing) {
    return existing;
  }

  const created = createDefaultStudentProfile({
    uid: input.uid,
    email: input.email,
    name: input.name?.trim() || input.email,
    phone: input.phone?.trim() || '',
  });

  await createStudentProfile(created);
  return created;
}

export function subscribeToStudents(callback: (students: StudentProfile[]) => void): () => void {
  const studentsRef = dbRef(db, STUDENTS_PATH);
  const unsubscribe = onValue(studentsRef, (snapshot) => {
    const value = (snapshot.val() || {}) as Record<string, Partial<StudentProfile>>;
    const students = Object.entries(value)
      .map(([uid, student]) => normalizeProfile(student, uid))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    callback(students);
  });

  return () => unsubscribe();
}

export function subscribeToStudentProfile(uid: string, callback: (student: StudentProfile | null) => void): () => void {
  const studentRef = dbRef(db, `${STUDENTS_PATH}/${uid}`);
  const unsubscribe = onValue(studentRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback(normalizeProfile(snapshot.val() as Partial<StudentProfile>, uid));
  });

  return () => unsubscribe();
}

export async function createStudentProfile(profile: StudentProfile): Promise<void> {
  await set(dbRef(db, `${STUDENTS_PATH}/${profile.uid}`), profile);
}

export async function saveStudentProfileAsAdmin(profile: StudentProfile): Promise<void> {
  await set(dbRef(db, `${STUDENTS_PATH}/${profile.uid}`), profile);
}

export async function patchStudentProfile(
  uid: string,
  patch: Partial<StudentEditableProfileFields>,
  timelineEvent?: StudentTimelineEvent,
): Promise<void> {
  const current = await getStudentProfile(uid);
  if (!current) return;

  const nextTimeline = timelineEvent ? [timelineEvent, ...current.timeline].slice(0, 30) : current.timeline;
  const editablePatch = pickEditableProfileFields(patch);

  await update(dbRef(db, `${STUDENTS_PATH}/${uid}`), {
    ...editablePatch,
    timeline: nextTimeline,
    updatedAt: new Date().toISOString(),
  });
}

export async function setStudentStatus(
  uid: string,
  status: StudentAccountStatus,
  options?: { actorId?: string; actorEmail?: string; note?: string; rejectionReason?: string | null },
): Promise<void> {
  const current = await getStudentProfile(uid);
  if (!current) return;

  const isApproved = status === 'approved';
  const title =
    status === 'approved'
      ? 'Account approved'
      : status === 'rejected'
        ? 'Account rejected'
        : status === 'suspended'
          ? 'Account suspended'
          : 'Account pending approval';
  const description =
    status === 'approved'
      ? 'The BVF admin team approved your student account.'
      : status === 'rejected'
        ? `The BVF admin team declined your registration${options?.rejectionReason ? `: ${options.rejectionReason}` : '.'}`
        : status === 'suspended'
          ? 'The BVF admin team suspended your student access.'
          : 'Your student account is waiting for admin approval.';

  const timeline = [
    createTimelineEvent(title, description, 'system'),
    ...current.timeline,
  ].slice(0, 30);

  await update(dbRef(db, `${STUDENTS_PATH}/${uid}`), {
    status,
    isApproved,
    approvedAt: isApproved ? new Date().toISOString() : null,
    approvedBy: options?.actorId || null,
    rejectionReason: status === 'rejected' ? options?.rejectionReason || 'Registration not approved.' : null,
    timeline,
    updatedAt: new Date().toISOString(),
  });

  if (options?.note?.trim()) {
    await addStudentAdminNote(uid, options.note.trim(), options.actorEmail || 'BVF Admin');
  }

  if (options?.actorId && options?.actorEmail) {
    await createAuditLog({
      entityType: 'student',
      entityId: uid,
      action: 'status_changed',
      actorId: options.actorId,
      actorEmail: options.actorEmail,
      details: {
        previousStatus: current.status,
        nextStatus: status,
        rejectionReason: options?.rejectionReason || '',
      },
    });
  }

  await createStudentNotification({
    userId: uid,
    title,
    message:
      status === 'approved'
        ? 'Your account has been approved. You can now log in.'
        : status === 'rejected'
          ? `Your registration was not approved.${options?.rejectionReason ? ` Reason: ${options.rejectionReason}` : ''}`
          : status === 'suspended'
            ? 'Your account is suspended. Please contact admin.'
            : 'Your account is waiting for admin approval.',
    type: 'account',
  });
}

export async function setStudentApproval(uid: string, isApproved: boolean): Promise<void> {
  await setStudentStatus(uid, isApproved ? 'approved' : 'pending_approval');
}

export async function markStudentLoginSeen(uid: string): Promise<boolean> {
  const current = await getStudentProfile(uid);
  if (!current || current.hasLoggedInOnce) {
    return false;
  }

  await update(dbRef(db, `${STUDENTS_PATH}/${uid}`), {
    hasLoggedInOnce: true,
    updatedAt: new Date().toISOString(),
  });

  return true;
}

export async function updateStudentService(
  uid: string,
  serviceId: string,
  patch: Partial<ServiceProgressItem>,
): Promise<void> {
  const current = await getStudentProfile(uid);
  if (!current) return;

  const nextServices = current.services.map((service) =>
    service.id === serviceId
      ? {
          ...service,
          ...patch,
          updatedAt: new Date().toISOString(),
        }
      : service,
  );

  const updatedService = nextServices.find((service) => service.id === serviceId);
  const statusLabel = updatedService ? serviceStatusLabels[updatedService.status] : 'Updated';
  const timeline = updatedService
    ? [
        createTimelineEvent(
          `${updatedService.title} updated`,
          `Status is now ${statusLabel}${updatedService.enrolled ? '' : ' and service is not enrolled'}.`,
          'service',
        ),
        ...current.timeline,
      ].slice(0, 30)
    : current.timeline;

  await update(dbRef(db, `${STUDENTS_PATH}/${uid}`), {
    services: nextServices,
    timeline,
    updatedAt: new Date().toISOString(),
  });
}

export async function addStudentAdminNote(uid: string, message: string, createdBy = 'BVF Admin'): Promise<void> {
  const current = await getStudentProfile(uid);
  if (!current) return;

  const note: StudentAdminNote = {
    id: crypto.randomUUID(),
    message,
    createdAt: new Date().toISOString(),
    createdBy,
  };

  await update(dbRef(db, `${STUDENTS_PATH}/${uid}`), {
    adminNotes: [note, ...current.adminNotes].slice(0, 20),
    timeline: [
      createTimelineEvent('Admin note added', 'A new note from the BVF Germany team was added to your account.', 'system'),
      ...current.timeline,
    ].slice(0, 30),
    updatedAt: new Date().toISOString(),
  });
}

export async function addStudentDocumentLink(
  uid: string,
  serviceId: string,
  input: { label: string; url: string },
): Promise<void> {
  const current = await getStudentProfile(uid);
  if (!current) return;

  const nextServices = current.services.map((service) => {
    if (service.id !== serviceId) return service;

    const nextDocument: StudentDocumentLink = {
      id: crypto.randomUUID(),
      label: input.label,
      url: input.url,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    return {
      ...service,
      documentLinks: [nextDocument, ...service.documentLinks],
      updatedAt: new Date().toISOString(),
    };
  });

  const service = nextServices.find((item) => item.id === serviceId);

  await update(dbRef(db, `${STUDENTS_PATH}/${uid}`), {
    services: nextServices,
    timeline: [
      createTimelineEvent(
        'Document link submitted',
        `${input.label} was submitted for ${service?.title || 'your service'}.`,
        'document',
      ),
      ...current.timeline,
    ].slice(0, 30),
    updatedAt: new Date().toISOString(),
  });
}

export async function addStudentTimelineEvent(
  uid: string,
  title: string,
  description: string,
  type: StudentTimelineEvent['type'],
): Promise<void> {
  const current = await getStudentProfile(uid);
  if (!current) return;

  await update(dbRef(db, `${STUDENTS_PATH}/${uid}`), {
    timeline: [createTimelineEvent(title, description, type), ...current.timeline].slice(0, 30),
    updatedAt: new Date().toISOString(),
  });
}

export const getServiceTitle = (serviceId: string) =>
  serviceCatalog.find((service) => service.id === serviceId)?.title || 'Service';

export async function getAllStudents(): Promise<StudentProfile[]> {
  const snapshot = await get(dbRef(db, STUDENTS_PATH));
  if (!snapshot.exists()) return [];

  const value = snapshot.val() as Record<string, Partial<StudentProfile>>;
  return Object.entries(value)
    .map(([uid, student]) => normalizeProfile(student, uid))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
