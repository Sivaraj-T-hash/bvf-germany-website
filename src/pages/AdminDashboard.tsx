import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, BarChart3, Bell, BookOpen, CheckCircle2, CreditCard, FileText, LayoutDashboard, LogOut, Plus, Search, Settings, Users, Video } from 'lucide-react';
import { deleteApp, initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signOut, updateProfile } from 'firebase/auth';
import { onValue, ref, update } from 'firebase/database';
import { auth, db, firebaseConfig } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { DB_PATHS } from '@/lib/dbPaths';
import { addStudentAdminNote, createDefaultStudentProfile, saveStudentProfileAsAdmin, setStudentStatus, subscribeToStudents, updateStudentService, type StudentProfile } from '@/lib/studentStore';
import { serviceStatusLabels, type ServiceStatus } from '@/lib/serviceCatalog';
import { subscribeToOrders, type OrderRecord, updateOrderResourceAccess, updateOrderStatus } from '@/lib/orderStore';
import { createLeadRecord } from '@/lib/leadStore';
import { deleteBlogPost, estimateReadTime, generateSlug, getBlogPosts, saveBlogPost, type BlogPost } from '@/lib/blogStore';
import { getSiteSettings, saveSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { deleteWebinarCatalogItem, saveWebinarCatalogItem, subscribeToWebinarCatalog, type WebinarCatalogItem } from '@/lib/webinarCatalogStore';
import { deleteStudentDeadline, saveStudentDeadline, subscribeToAllStudentDeadlines, type StudentDeadlineItem } from '@/lib/studentDeadlineStore';
import { createStudentNotification, markStudentNotificationRead, subscribeToStudentNotifications, type StudentNotification } from '@/lib/notificationStore';
import { getResourceCatalogItem } from '@/lib/resourceCatalog';
import { deleteResourcePackage, saveResourcePackage, subscribeToResourceCatalog, type ResourcePackage } from '@/lib/resourceCatalogStore';
import { sendAdminBroadcastEmails } from '@/lib/submissionEmailApi';
import { useSeo } from '@/lib/useSeo';

interface Lead { id: string; name: string; email: string; status: string; createdAt: string; phone?: string }
interface Booking { id: string; name: string; email: string; preferredDate: string; preferredTime: string; status: string; createdAt: string }
interface WebinarRegistration { id: string; webinarTitle?: string; webinarId: string; name: string; email: string; status: string; attendanceStatus: 'registered' | 'attended' | 'missed'; createdAt: string; webinarAccessType?: 'free' | 'paid'; orderId?: string | null; userId?: string | null }
interface SubmissionFeedItem {
  id: string;
  createdAt: string;
  type: string;
  title: string;
  subtitle: string;
  studentUid: string;
  studentName: string;
  studentEmail: string;
}
interface DocumentQueueItem {
  student: StudentProfile;
  serviceId: string;
  serviceTitle: string;
  doc: {
    id: string;
    label: string;
    url: string;
    status: 'submitted' | 'reviewed' | 'rejected';
    submittedAt: string;
  };
}
interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  tab: Tab;
  imageUrl?: string;
}

type Tab = 'overview' | 'students' | 'pipeline' | 'documents' | 'applications' | 'blogs' | 'webinars' | 'resources' | 'reports' | 'settings';
type QuickAction = 'student' | 'blog' | 'webinar' | 'resource' | null;

const toArray = <T extends { id?: string }>(snapshot: Parameters<Parameters<typeof onValue>[1]>[0]) => {
  const value = (snapshot.val() || {}) as Record<string, T>;
  return Object.entries(value).map(([id, item]) => ({ id, ...item })) as Array<T & { id: string }>;
};

const normalizeSearch = (value: string) => value.trim().toLowerCase();
const matchesSearch = (query: string, ...parts: Array<string | number | undefined | null>) => {
  if (!query) return true;
  const haystack = parts
    .filter((part) => part !== undefined && part !== null)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
};
const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const lower = text.toLowerCase();
  const index = lower.indexOf(query);
  if (index === -1) return text;
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  return { before, match, after };
};

const tabs: Array<{ key: Tab; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'pipeline', label: 'Pipeline', icon: BarChart3 },
  { key: 'documents', label: 'Documents Review', icon: FileText },
  { key: 'applications', label: 'Applications', icon: CheckCircle2 },
  { key: 'blogs', label: 'Blogs', icon: BookOpen },
  { key: 'webinars', label: 'Webinars', icon: Video },
  { key: 'resources', label: 'Resources', icon: CreditCard },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  useSeo({
    title: 'Admin Dashboard | BVF Germany',
    description: 'Private admin dashboard for BVF Germany operations.',
    noindex: true,
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [tab, setTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [webinars, setWebinars] = useState<WebinarRegistration[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [webinarCatalog, setWebinarCatalog] = useState<WebinarCatalogItem[]>([]);
  const [resourceCatalog, setResourceCatalog] = useState<ResourcePackage[]>([]);
  const [deadlines, setDeadlines] = useState<StudentDeadlineItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [deadlineDrafts, setDeadlineDrafts] = useState<Record<string, { title: string; dueDate: string; dueTime: string; note: string }>>({});
  const [quickAction, setQuickAction] = useState<QuickAction>(null);
  const [actionNotice, setActionNotice] = useState('');
  const [studentForm, setStudentForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [blogForm, setBlogForm] = useState({ title: '', category: 'Admissions', excerpt: '', content: '', imageUrl: '', publishNow: true });
  const [webinarForm, setWebinarForm] = useState({
    title: '',
    topic: '',
    speaker: '',
    imageUrl: '',
    scheduleAt: '',
    durationMinutes: '60',
    capacity: '300',
    description: '',
    accessType: 'free' as 'free' | 'paid',
    priceLabel: '0',
  });
  const [resourceForm, setResourceForm] = useState({
    id: '',
    title: '',
    shortLabel: '',
    image: '',
    tagline: '',
    description: '',
    ctaLabel: 'Buy Now',
    rating: '',
    reviews: '',
    viewed: '',
    duration: '',
    badge: '',
    priceValue: '0',
    originalPriceValue: '0',
    sortOrder: '0',
    published: true,
    bulletsText: '',
  });
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [webinarLinkDrafts, setWebinarLinkDrafts] = useState<Record<string, string>>({});
  const [resourceLinkDrafts, setResourceLinkDrafts] = useState<Record<string, string>>({});
  const [resourceOrderFilter, setResourceOrderFilter] = useState<'all' | 'paid_undelivered' | 'delivered'>('all');
  const [adminNotifications, setAdminNotifications] = useState<StudentNotification[]>([]);
  const [adminNotificationsOpen, setAdminNotificationsOpen] = useState(false);
  const [studentStageFilter, setStudentStageFilter] = useState('');
  const [studentApprovalFilter, setStudentApprovalFilter] = useState<'all' | 'approved' | 'pending' | 'rejected' | 'suspended'>('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalTarget, setApprovalTarget] = useState<StudentProfile | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [documentTarget, setDocumentTarget] = useState<StudentProfile | null>(null);
  const [activityTarget, setActivityTarget] = useState<StudentProfile | null>(null);
  const [documentsUnreadOnly, setDocumentsUnreadOnly] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activityReadMap, setActivityReadMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const stopStudents = subscribeToStudents(setStudents);
    const stopOrders = subscribeToOrders(setOrders);
    const stopCatalog = subscribeToWebinarCatalog(setWebinarCatalog);
    const stopResourceCatalog = subscribeToResourceCatalog(setResourceCatalog);
    const stopDeadlines = subscribeToAllStudentDeadlines(setDeadlines);
    const stopLeads = onValue(ref(db, DB_PATHS.leads), (snap) => setLeads(toArray<Lead>(snap).sort((a, b) => b.createdAt.localeCompare(a.createdAt))));
    const stopBookings = onValue(ref(db, DB_PATHS.bookings), (snap) => setBookings(toArray<Booking>(snap).sort((a, b) => b.createdAt.localeCompare(a.createdAt))));
    const stopWebinars = onValue(ref(db, DB_PATHS.webinarRegistrations), (snap) => setWebinars(toArray<WebinarRegistration>(snap).sort((a, b) => b.createdAt.localeCompare(a.createdAt))));

    void getBlogPosts().then(setBlogs);
    void getSiteSettings().then(setSettings);

    return () => { stopStudents(); stopOrders(); stopCatalog(); stopResourceCatalog(); stopDeadlines(); stopLeads(); stopBookings(); stopWebinars(); };
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    return subscribeToStudentNotifications(user.uid, setAdminNotifications);
  }, [user?.uid]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;
      if (event.key === '/' && !isTypingTarget) {
        event.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!searchInputRef.current) return;
      if (searchInputRef.current.contains(event.target as Node)) return;
      setSearchOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    try {
      const stored = window.localStorage.getItem(`admin-activity-read:${user.uid}`);
      if (stored) {
        setActivityReadMap(JSON.parse(stored) as Record<string, string>);
      }
    } catch {
      setActivityReadMap({});
    }
  }, [user?.uid]);

  const persistActivityReadMap = (next: Record<string, string>) => {
    setActivityReadMap(next);
    if (!user?.uid) return;
    try {
      window.localStorage.setItem(`admin-activity-read:${user.uid}`, JSON.stringify(next));
    } catch {
      // ignore localStorage persistence failures
    }
  };

  const getStudentStage = (student: StudentProfile) => {
    const completed = student.services.filter((x) => x.status === 'completed').length;
    if (completed <= 1) return 'Onboarding';
    if (completed <= 3) return 'Preparation';
    if (completed <= 5) return 'Applications';
    if (completed <= 6) return 'Visa';
    return 'Departure';
  };

  const searchQuery = useMemo(() => normalizeSearch(search), [search]);
  const searchedStudents = useMemo(
    () =>
      students.filter((student) =>
        matchesSearch(
          searchQuery,
          student.name,
          student.email,
          student.phone,
          student.universityPreference,
          getStudentStage(student),
          student.services.map((service) => service.title).join(' '),
        ),
      ),
    [searchQuery, students],
  );

  const filteredStudents = useMemo(
    () =>
      searchedStudents.filter((s) => {
        if (studentStageFilter && getStudentStage(s) !== studentStageFilter) return false;
        if (studentApprovalFilter === 'approved' && s.status !== 'approved') return false;
        if (studentApprovalFilter === 'pending' && s.status !== 'pending_approval') return false;
        if (studentApprovalFilter === 'rejected' && s.status !== 'rejected') return false;
        if (studentApprovalFilter === 'suspended' && s.status !== 'suspended') return false;
        return true;
      }),
    [searchedStudents, studentApprovalFilter, studentStageFilter],
  );
  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) =>
        matchesSearch(searchQuery, lead.name, lead.email, lead.phone, lead.status, lead.createdAt),
      ),
    [leads, searchQuery],
  );

  const stageBuckets = useMemo(() => {
    const map: Record<string, number> = { Onboarding: 0, Preparation: 0, Applications: 0, Visa: 0, Departure: 0 };
    searchedStudents.forEach((s) => {
      map[getStudentStage(s)] += 1;
    });
    return map;
  }, [searchedStudents]);

  const stageStudents = useMemo(() => {
    return {
      Onboarding: searchedStudents.filter((s) => getStudentStage(s) === 'Onboarding'),
      Preparation: searchedStudents.filter((s) => getStudentStage(s) === 'Preparation'),
      Applications: searchedStudents.filter((s) => getStudentStage(s) === 'Applications'),
      Visa: searchedStudents.filter((s) => getStudentStage(s) === 'Visa'),
      Departure: searchedStudents.filter((s) => getStudentStage(s) === 'Departure'),
    };
  }, [searchedStudents]);

  const pendingApprovalStudents = useMemo(
    () => searchedStudents.filter((student) => student.status === 'pending_approval').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [searchedStudents],
  );

  const approvalSummary = useMemo(() => {
    if (!approvalTarget) return null;
    const profileChecks = [
      Boolean(approvalTarget.name?.trim()),
      Boolean(approvalTarget.email?.trim()),
      Boolean(approvalTarget.phone?.trim()),
      Boolean(approvalTarget.universityPreference?.trim()),
    ];
    const enrolledServices = approvalTarget.services.filter((service) => service.enrolled);
    const uploadedDocuments = approvalTarget.services.flatMap((service) =>
      service.documentLinks.map((doc) => ({ ...doc, serviceTitle: service.title })),
    );
    const completedChecks = profileChecks.filter(Boolean).length;
    const completeness = Math.round((completedChecks / profileChecks.length) * 100);
    return {
      completeness,
      enrolledServices,
      uploadedDocuments,
      latestEvents: approvalTarget.timeline.slice(0, 5),
    };
  }, [approvalTarget]);

  const docQueue = useMemo<DocumentQueueItem[]>(() => {
    return searchedStudents.flatMap((s) =>
      s.services.flatMap((service) =>
        service.documentLinks.map((doc) => ({ student: s, serviceId: service.id, serviceTitle: service.title, doc })),
      ),
    ).sort((a, b) => b.doc.submittedAt.localeCompare(a.doc.submittedAt));
  }, [searchedStudents]);

  const escalatedDocs = useMemo(() => {
    const now = Date.now();
    return docQueue.filter((item) => item.doc.status === 'submitted' && now - new Date(item.doc.submittedAt).getTime() > 1000 * 60 * 60 * 24 * 2).length;
  }, [docQueue]);
  const totalUnreadDocuments = useMemo(
    () => docQueue.filter((item) => item.doc.status === 'submitted').length,
    [docQueue],
  );
  const unreadAdminNotifications = useMemo(
    () => adminNotifications.filter((item) => !item.read).length,
    [adminNotifications],
  );
  const paidOrderIds = useMemo(
    () => new Set(orders.filter((order) => order.status === 'paid').map((order) => order.id)),
    [orders],
  );
  const pendingPaymentOrders = useMemo(
    () => orders.filter((order) => order.status === 'pending').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders],
  );

  const documentGroups = useMemo(() => {
    const grouped = new Map<string, { student: StudentProfile; items: DocumentQueueItem[] }>();

    docQueue.forEach((item) => {
      const existing = grouped.get(item.student.uid);
      if (existing) {
        existing.items.push(item);
      } else {
        grouped.set(item.student.uid, { student: item.student, items: [item] });
      }
    });

    return Array.from(grouped.values())
      .map((group) => {
        const unreadCount = group.items.filter((item) => item.doc.status === 'submitted').length;
        const readCount = group.items.filter((item) => item.doc.status !== 'submitted').length;
        const approvedCount = group.items.filter((item) => item.doc.status === 'reviewed').length;
        const rejectedCount = group.items.filter((item) => item.doc.status === 'rejected').length;
        return {
          ...group,
          unreadCount,
          readCount,
          approvedCount,
          rejectedCount,
          latestSubmittedAt: group.items[0]?.doc.submittedAt || group.student.updatedAt,
        };
      })
      .sort((a, b) => b.unreadCount - a.unreadCount || b.latestSubmittedAt.localeCompare(a.latestSubmittedAt));
  }, [docQueue]);

  const documentTargetItems = useMemo(
    () => (documentTarget ? docQueue.filter((item) => item.student.uid === documentTarget.uid) : []),
    [docQueue, documentTarget],
  );
  const visibleDocumentGroups = useMemo(
    () => (documentsUnreadOnly ? documentGroups.filter((group) => group.unreadCount > 0) : documentGroups),
    [documentGroups, documentsUnreadOnly],
  );
  const studentUnreadMap = useMemo(
    () =>
      new Map(
        documentGroups.map((group) => [group.student.uid, group.unreadCount]),
      ),
    [documentGroups],
  );
  const filteredBlogs = useMemo(
    () =>
      blogs.filter((blog) =>
        matchesSearch(searchQuery, blog.title, blog.category, blog.excerpt, blog.authorName, blog.slug),
      ),
    [blogs, searchQuery],
  );
  const filteredWebinarCatalog = useMemo(
    () =>
      webinarCatalog.filter((item) =>
        matchesSearch(searchQuery, item.title, item.topic, item.speaker, item.description, item.status),
      ),
    [searchQuery, webinarCatalog],
  );
  const filteredWebinarRegistrations = useMemo(
    () =>
      webinars.filter((item) =>
        matchesSearch(searchQuery, item.name, item.email, item.webinarTitle, item.webinarId, item.status, item.attendanceStatus),
      ),
    [searchQuery, webinars],
  );
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        matchesSearch(searchQuery, order.name, order.email, order.title, order.status, order.amountLabel),
      ),
    [orders, searchQuery],
  );
  const filteredResourceOrders = useMemo(() => {
    const resourceOrders = filteredOrders.filter((order) => order.itemType === 'plan');
    if (resourceOrderFilter === 'paid_undelivered') {
      return resourceOrders.filter((order) => order.status === 'paid' && !order.resourceDriveUrl);
    }
    if (resourceOrderFilter === 'delivered') {
      return resourceOrders.filter((order) => Boolean(order.resourceDriveUrl));
    }
    return resourceOrders;
  }, [filteredOrders, resourceOrderFilter]);
  const filteredResourceCatalog = useMemo(
    () =>
      resourceCatalog
        .filter((item) =>
          matchesSearch(
            searchQuery,
            item.title,
            item.shortLabel,
            item.description,
            item.tagline,
            item.viewed,
            item.rating,
          ),
        )
        .sort((a, b) => a.sortOrder - b.sortOrder || b.updatedAt.localeCompare(a.updatedAt)),
    [resourceCatalog, searchQuery],
  );
  const resourceById = useMemo(
    () => new Map(resourceCatalog.map((item) => [item.id, item])),
    [resourceCatalog],
  );
  const deliveredResourceOrders = useMemo(
    () => orders.filter((order) => order.itemType === 'plan' && Boolean(order.resourceDriveUrl)).sort((a, b) => (b.resourceDeliveredAt || '').localeCompare(a.resourceDeliveredAt || '')),
    [orders],
  );
  const filteredApplicationStudents = useMemo(
    () =>
      searchedStudents.filter((student) =>
        student.services.some((service) => service.enrolled),
      ),
    [searchedStudents],
  );
  const searchResults = useMemo<SearchResultItem[]>(() => {
    if (!searchQuery) return [];

    const studentResults = filteredStudents.slice(0, 4).map((student) => ({
      id: `student-${student.uid}`,
      title: student.name || student.email,
      subtitle: `Student | ${student.email} | ${getStudentStage(student)}`,
      tab: 'students' as const,
    }));

    const documentResults = visibleDocumentGroups.slice(0, 4).map((group) => ({
      id: `document-${group.student.uid}`,
      title: `${group.student.name || group.student.email} documents`,
      subtitle: `Documents | Unread ${group.unreadCount} | Approved ${group.approvedCount} | Rejected ${group.rejectedCount}`,
      tab: 'documents' as const,
    }));

    const applicationResults = filteredApplicationStudents.slice(0, 4).map((student) => ({
      id: `application-${student.uid}`,
      title: `${student.name || student.email} applications`,
      subtitle: `Applications | ${student.services.filter((service) => service.enrolled).length} active services`,
      tab: 'applications' as const,
    }));

    const blogResults = filteredBlogs.slice(0, 3).map((blog) => ({
      id: `blog-${blog.id}`,
      title: blog.title,
      subtitle: `Blog | ${blog.category} | ${blog.published ? 'Published' : 'Draft'}`,
      tab: 'blogs' as const,
      imageUrl: blog.featuredImage,
    }));

    const webinarResults = filteredWebinarCatalog.slice(0, 3).map((item) => ({
      id: `webinar-${item.id}`,
      title: item.title,
      subtitle: `Webinar | ${item.speaker} | ${item.status}`,
      tab: 'webinars' as const,
      imageUrl: item.imageUrl,
    }));

    const resourceResults = filteredOrders.slice(0, 3).map((order) => ({
      id: `order-${order.id}`,
      title: order.title,
      subtitle: `Resource | ${order.name} | ${order.status}`,
      tab: 'resources' as const,
    }));

    return [...studentResults, ...documentResults, ...applicationResults, ...blogResults, ...webinarResults, ...resourceResults].slice(0, 10);
  }, [
    filteredApplicationStudents,
    filteredBlogs,
    filteredOrders,
    filteredStudents,
    filteredWebinarCatalog,
    searchQuery,
    visibleDocumentGroups,
  ]);

  const openAdminNotifications = () => {
    setAdminNotificationsOpen((prev) => !prev);
    const unread = adminNotifications.filter((item) => !item.read);
    if (unread.length) {
      void Promise.all(unread.map((item) => markStudentNotificationRead(item.id)));
    }
  };

  const submissionFeed = useMemo<SubmissionFeedItem[]>(() => {
    const findStudentByIdentity = (email?: string | null, uid?: string | null) =>
      searchedStudents.find((student) => (uid && student.uid === uid) || (email && student.email.toLowerCase() === email.toLowerCase()));

    const studentEvents = searchedStudents.flatMap((student) =>
      student.timeline.map((event) => ({
        id: `timeline-${student.uid}-${event.id}`,
        createdAt: event.createdAt,
        type: event.type,
        title: `${student.name || student.email}: ${event.title}`,
        subtitle: event.description,
        studentUid: student.uid,
        studentName: student.name || student.email,
        studentEmail: student.email,
      })),
    );

    const bookingEvents = bookings
      .filter((booking) => matchesSearch(searchQuery, booking.name, booking.email, booking.preferredDate, booking.preferredTime, booking.status))
      .map((booking) => {
        const student = findStudentByIdentity(booking.email);
        if (!student) return null;
        return {
          id: `booking-${booking.id}`,
          createdAt: booking.createdAt,
          type: 'booking',
          title: `${booking.name}: Consultation request`,
          subtitle: `${booking.preferredDate} ${booking.preferredTime} | ${booking.status}`,
          studentUid: student.uid,
          studentName: student.name || student.email,
          studentEmail: student.email,
        };
      })
      .filter((item): item is SubmissionFeedItem => Boolean(item));

    const webinarEvents = webinars
      .filter((registration) => matchesSearch(searchQuery, registration.name, registration.email, registration.webinarTitle, registration.webinarId, registration.status, registration.attendanceStatus))
      .map((registration) => {
        const student = findStudentByIdentity(registration.email);
        if (!student) return null;
        return {
          id: `webinar-${registration.id}`,
          createdAt: registration.createdAt,
          type: 'webinar',
          title: `${registration.name}: Webinar registration`,
          subtitle: `${registration.webinarTitle || registration.webinarId} | ${registration.attendanceStatus}`,
          studentUid: student.uid,
          studentName: student.name || student.email,
          studentEmail: student.email,
        };
      })
      .filter((item): item is SubmissionFeedItem => Boolean(item));

    const orderEvents = orders
      .filter((order) => matchesSearch(searchQuery, order.name, order.email, order.title, order.status, order.amountLabel))
      .map((order) => {
        const student = findStudentByIdentity(order.email);
        if (!student) return null;
        return {
          id: `order-${order.id}`,
          createdAt: order.createdAt,
          type: 'order',
          title: `${order.name}: Resource order`,
          subtitle: `${order.title} | ${order.status} | ${order.amountLabel}`,
          studentUid: student.uid,
          studentName: student.name || student.email,
          studentEmail: student.email,
        };
      })
      .filter((item): item is SubmissionFeedItem => Boolean(item));

    return [...studentEvents, ...bookingEvents, ...webinarEvents, ...orderEvents]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 60);
  }, [bookings, orders, searchQuery, searchedStudents, webinars]);

  const activityGroups = useMemo(() => {
    const grouped = new Map<string, {
      student: StudentProfile;
      items: SubmissionFeedItem[];
      latestAt: string;
      unreadCount: number;
      readCount: number;
      typeCounts: Record<string, number>;
    }>();

    submissionFeed.forEach((item) => {
      const student = searchedStudents.find((candidate) => candidate.uid === item.studentUid);
      if (!student) return;
      const existing = grouped.get(student.uid);
      const lastReadAt = activityReadMap[student.uid] || '';
      const isUnread = !lastReadAt || item.createdAt > lastReadAt;

      if (existing) {
        existing.items.push(item);
        existing.latestAt = existing.latestAt > item.createdAt ? existing.latestAt : item.createdAt;
        existing.unreadCount += isUnread ? 1 : 0;
        existing.readCount += isUnread ? 0 : 1;
        existing.typeCounts[item.type] = (existing.typeCounts[item.type] || 0) + 1;
        return;
      }

      grouped.set(student.uid, {
        student,
        items: [item],
        latestAt: item.createdAt,
        unreadCount: isUnread ? 1 : 0,
        readCount: isUnread ? 0 : 1,
        typeCounts: { [item.type]: 1 },
      });
    });

    return Array.from(grouped.values()).map((group) => ({
      ...group,
      items: group.items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    }));
  }, [activityReadMap, searchedStudents, submissionFeed]);

  const submissionGroups = useMemo(
    () =>
      [...activityGroups]
        .sort((a, b) => (b.items.length - a.items.length) || b.latestAt.localeCompare(a.latestAt))
        .slice(0, 8),
    [activityGroups],
  );

  const recentActivityGroups = useMemo(
    () =>
      [...activityGroups]
        .sort((a, b) => b.latestAt.localeCompare(a.latestAt))
        .slice(0, 8),
    [activityGroups],
  );

  const activityTargetItems = useMemo(
    () => (activityTarget ? submissionFeed.filter((item) => item.studentUid === activityTarget.uid) : []),
    [activityTarget, submissionFeed],
  );

  const logout = () => { void signOut(auth).then(() => navigate('/admin', { replace: true })); };

  const setDocStatus = async (student: StudentProfile, serviceId: string, docId: string, status: 'submitted' | 'reviewed' | 'rejected') => {
    const service = student.services.find((s) => s.id === serviceId);
    if (!service) return;
    const nextLinks = service.documentLinks.map((d) => (d.id === docId ? { ...d, status } : d));
    await updateStudentService(student.uid, serviceId, { documentLinks: nextLinks });
  };

  const requestDocChanges = async (student: StudentProfile, serviceId: string, serviceTitle: string, label: string, docId: string) => {
    await setDocStatus(student, serviceId, docId, 'rejected');
    await addStudentAdminNote(student.uid, `Changes requested: Please re-upload '${label}' for ${serviceTitle}.`, user?.email || 'BVF Admin');
  };

  const setServiceStatus = async (uid: string, serviceId: string, status: ServiceStatus) => {
    await updateStudentService(uid, serviceId, { status, enrolled: true });
  };

  const saveSettings = async () => { if (settings) await saveSiteSettings(settings); };

  const openApprovalWindow = (student: StudentProfile) => {
    setApprovalTarget(student);
    setApprovalNote(student.adminNotes[0]?.message || '');
    setRejectionReason(student.rejectionReason || '');
  };

  const closeApprovalWindow = () => {
    setApprovalTarget(null);
    setApprovalNote('');
    setRejectionReason('');
  };

  const openActivityWindow = (student: StudentProfile, latestAt: string) => {
    setActivityTarget(student);
    const current = activityReadMap[student.uid];
    if (!current || latestAt > current) {
      persistActivityReadMap({ ...activityReadMap, [student.uid]: latestAt });
    }
  };

  const submitApprovalDecision = async (status: 'approved' | 'pending_approval' | 'rejected' | 'suspended') => {
    if (!approvalTarget) return;
    await setStudentStatus(approvalTarget.uid, status, {
      actorId: user?.uid || '',
      actorEmail: user?.email || 'BVF Admin',
      note: approvalNote.trim(),
      rejectionReason: rejectionReason.trim() || null,
    });
    setActionNotice(`${approvalTarget.name || approvalTarget.email} status updated to ${status.replace('_', ' ')}.`);
    closeApprovalWindow();
  };

  const saveDeadlineForStudent = async (student: StudentProfile) => {
    const draft = deadlineDrafts[student.uid];
    if (!draft?.title || !draft?.dueDate) {
      setActionNotice('Deadline title and due date are required.');
      return;
    }
    await saveStudentDeadline({
      userId: student.uid,
      email: student.email,
      title: draft.title.trim(),
      dueDate: draft.dueDate,
      dueTime: draft.dueTime || '',
      note: draft.note || '',
      createdBy: user?.email || 'BVF Admin',
    });
    await createStudentNotification({
      userId: student.uid,
      title: 'New deadline assigned',
      message: `${draft.title.trim()} was added to your dashboard for ${draft.dueDate}${draft.dueTime ? ` at ${draft.dueTime}` : ''}.`,
      type: 'deadline',
    });
    setDeadlineDrafts((prev) => ({ ...prev, [student.uid]: { title: '', dueDate: '', dueTime: '', note: '' } }));
    setActionNotice(`Deadline assigned to ${student.name || student.email}.`);
  };

  const exportStudentsCsv = () => {
    const headers = ['Name', 'Email', 'Stage', 'Approved', 'UniversityPreference', 'ProgressPercent'];
    const rows = filteredStudents.map((student) => {
      const progress = Math.round((student.services.filter((x) => x.status === 'completed').length / Math.max(1, student.services.length)) * 100);
      return [student.name, student.email, getStudentStage(student), student.status, student.universityPreference, String(progress)];
    });
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const createStudent = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = studentForm.email.trim().toLowerCase();
    if (!studentForm.name.trim() || !email || !studentForm.phone.trim()) {
      setActionNotice('Full name, email, and phone are required for Add Student.');
      return;
    }
    if (studentForm.password.length < 6) {
      setActionNotice('Password must be at least 6 characters long.');
      return;
    }
    if (studentForm.password !== studentForm.confirmPassword) {
      setActionNotice('Password and confirm password do not match.');
      return;
    }
    if (students.some((item) => item.email.toLowerCase() === email)) {
      setActionNotice('A student with this email already exists.');
      return;
    }

    const studentName = studentForm.name.trim();
    const studentPhone = studentForm.phone.trim();
    const helperApp = initializeApp(firebaseConfig, `admin-create-student-${crypto.randomUUID()}`);
    const helperAuth = getAuth(helperApp);

    try {
      const credential = await createUserWithEmailAndPassword(helperAuth, email, studentForm.password);
      await updateProfile(credential.user, { displayName: studentName });

      const profile = createDefaultStudentProfile({
        uid: credential.user.uid,
        name: studentName,
        email,
        phone: studentPhone,
      });
      await saveStudentProfileAsAdmin(profile);
      await createLeadRecord({
        source: 'tool',
        sourcePage: '/admin/dashboard',
        name: studentName,
        email,
        phone: studentPhone,
        subject: 'Student added by admin awaiting approval',
        message: 'Admin created a student account and it is waiting for verification.',
        userId: credential.user.uid,
        metadata: {
          stage: 'admin-create',
          requiresApproval: 'true',
        },
      });

      setActionNotice(`Student account created for ${profile.name}.`);
      setStudentForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
      setQuickAction(null);
    } catch (caughtError) {
      const message = (caughtError as { message?: string }).message || 'Could not create the student account.';
      if (message.includes('email-already-in-use')) {
        setActionNotice('A Firebase Auth account with this email already exists.');
      } else {
        setActionNotice(message);
      }
    } finally {
      await signOut(helperAuth).catch(() => undefined);
      await deleteApp(helperApp).catch(() => undefined);
    }
  };

  const createBlog = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = blogForm.title.trim();
    const content = blogForm.content.trim();
    if (!title || !content) {
      setActionNotice('Blog title and content are required.');
      return;
    }

    const now = new Date().toISOString();
    const post: BlogPost = {
      id: crypto.randomUUID(),
      title,
      slug: generateSlug(title),
      excerpt: blogForm.excerpt.trim() || content.slice(0, 160),
      content,
      category: blogForm.category || 'Admissions',
      tags: [],
      keywords: [],
      featuredImage: blogForm.imageUrl.trim(),
      authorName: user?.email || 'BVF Admin',
      authorRole: 'Admin',
      authorImage: '',
      authorBio: 'BVF admin team updates and guidance.',
      readTime: estimateReadTime(content),
      popularity: 50,
      featured: false,
      published: blogForm.publishNow,
      createdAt: now,
      updatedAt: now,
    };
    await saveBlogPost(post);
    let blogBroadcastSent = 0;
    if (post.published) {
      await Promise.all(
        students
          .filter((student) => student.status !== 'rejected' && student.status !== 'suspended')
          .map((student) =>
            createStudentNotification({
              userId: student.uid,
              title: 'New blog published',
              message: `${title} is now available in your dashboard blogs section.`,
              type: 'system',
            }),
          ),
      );
      try {
        const idToken = await user?.getIdToken?.();
        if (idToken) {
          const broadcast = await sendAdminBroadcastEmails({
            idToken,
            eventType: 'blog',
            title,
            ctaUrl: `${window.location.origin}/blog/${post.slug}`,
          });
          blogBroadcastSent = broadcast.sent;
        }
      } catch (error) {
        console.warn('Blog broadcast email skipped', error);
      }
    }
    setBlogs(await getBlogPosts());
    setActionNotice(
      post.published
        ? `Blog published and students notified: ${title}${blogBroadcastSent ? ` | Emails sent: ${blogBroadcastSent}` : ''}`
        : `Blog draft created: ${title}`,
    );
    setBlogForm({ title: '', category: 'Admissions', excerpt: '', content: '', imageUrl: '', publishNow: true });
    setQuickAction(null);
  };

  const sendTestBlogBroadcast = async () => {
    const title = blogForm.title.trim();
    if (!title) {
      setActionNotice('Enter a blog title before sending a test email.');
      return;
    }

    const idToken = await user?.getIdToken?.();
    if (!idToken) {
      setActionNotice('Admin session missing. Please login again.');
      return;
    }

    try {
      await sendAdminBroadcastEmails({
        idToken,
        eventType: 'blog',
        title,
        ctaUrl: `${window.location.origin}/blog/${generateSlug(title)}`,
        testOnly: true,
      });
      setActionNotice('Test blog email sent to your admin email.');
    } catch (error) {
      console.error('Test blog broadcast failed', error);
      setActionNotice('Unable to send test blog email right now.');
    }
  };

  const createWebinar = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = webinarForm.title.trim();
    const speaker = webinarForm.speaker.trim();
    const scheduleAt = webinarForm.scheduleAt.trim();
    if (!title || !speaker || !scheduleAt) {
      setActionNotice('Webinar title, speaker, and schedule are required.');
      return;
    }

    const now = new Date().toISOString();
    const item: WebinarCatalogItem = {
      id: crypto.randomUUID(),
      title,
      topic: webinarForm.topic.trim() || 'General',
      speaker,
      imageUrl: webinarForm.imageUrl.trim(),
      scheduleAt,
      durationMinutes: Number(webinarForm.durationMinutes) || 60,
      capacity: Number(webinarForm.capacity) || 300,
      status: 'upcoming',
      accessType: webinarForm.accessType,
      priceLabel: webinarForm.accessType === 'paid' ? webinarForm.priceLabel.trim() || '0' : '0',
      priceValue: webinarForm.accessType === 'paid' ? Number(webinarForm.priceLabel) || 0 : 0,
      meetingLink: '',
      description: webinarForm.description.trim(),
      createdAt: now,
      updatedAt: now,
    };
    await saveWebinarCatalogItem(item);
    let webinarBroadcastSent = 0;
    await Promise.all(
      students
        .filter((student) => student.status !== 'rejected' && student.status !== 'suspended')
        .map((student) =>
          createStudentNotification({
            userId: student.uid,
            title: 'New webinar available',
            message: `${title} has been scheduled as a ${item.accessType} webinar. Check the webinars section to register.`,
            type: 'system',
          }),
        ),
    );
    try {
      const idToken = await user?.getIdToken?.();
      if (idToken) {
        const broadcast = await sendAdminBroadcastEmails({
          idToken,
          eventType: 'webinar',
          title,
          ctaUrl: `${window.location.origin}/webinars`,
        });
        webinarBroadcastSent = broadcast.sent;
      }
    } catch (error) {
      console.warn('Webinar broadcast email skipped', error);
    }
    setActionNotice(`Webinar created: ${title}${webinarBroadcastSent ? ` | Emails sent: ${webinarBroadcastSent}` : ''}`);
    setWebinarForm({ title: '', topic: '', speaker: '', imageUrl: '', scheduleAt: '', durationMinutes: '60', capacity: '300', description: '', accessType: 'free', priceLabel: '0' });
    setQuickAction(null);
  };

  const sendTestWebinarBroadcast = async () => {
    const title = webinarForm.title.trim();
    if (!title) {
      setActionNotice('Enter a webinar title before sending a test email.');
      return;
    }

    const idToken = await user?.getIdToken?.();
    if (!idToken) {
      setActionNotice('Admin session missing. Please login again.');
      return;
    }

    try {
      await sendAdminBroadcastEmails({
        idToken,
        eventType: 'webinar',
        title,
        ctaUrl: `${window.location.origin}/webinars`,
        testOnly: true,
      });
      setActionNotice('Test webinar email sent to your admin email.');
    } catch (error) {
      console.error('Test webinar broadcast failed', error);
      setActionNotice('Unable to send test webinar email right now.');
    }
  };

  const resetResourceForm = () => {
    setEditingResourceId(null);
    setResourceForm({
      id: '',
      title: '',
      shortLabel: '',
      image: '',
      tagline: '',
      description: '',
      ctaLabel: 'Buy Now',
      rating: '',
      reviews: '',
      viewed: '',
      duration: '',
      badge: '',
      priceValue: '0',
      originalPriceValue: '0',
      sortOrder: String(resourceCatalog.length + 1),
      published: true,
      bulletsText: '',
    });
  };

  const slugifyResourceId = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 48);

  const editResourcePackage = (item: ResourcePackage) => {
    setEditingResourceId(item.id);
    setResourceForm({
      id: item.id,
      title: item.title,
      shortLabel: item.shortLabel,
      image: item.image,
      tagline: item.tagline,
      description: item.description,
      ctaLabel: item.ctaLabel || 'Buy Now',
      rating: item.rating,
      reviews: item.reviews,
      viewed: item.viewed,
      duration: item.duration || '',
      badge: item.badge || '',
      priceValue: String(item.priceValue),
      originalPriceValue: String(item.originalPriceValue),
      sortOrder: String(item.sortOrder),
      published: item.published,
      bulletsText: item.bullets.join('\n'),
    });
    setQuickAction('resource');
  };

  const openCreateResourcePackage = () => {
    resetResourceForm();
    setQuickAction('resource');
  };

  const saveResourceCatalogEntry = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = resourceForm.title.trim();
    const image = resourceForm.image.trim();
    const description = resourceForm.description.trim();
    if (!title || !image || !description) {
      setActionNotice('Resource title, image URL, and description are required.');
      return;
    }

    const resolvedIdBase = editingResourceId || resourceForm.id.trim() || slugifyResourceId(title);
    if (!resolvedIdBase) {
      setActionNotice('Unable to generate resource ID. Enter title or ID and retry.');
      return;
    }

    const alreadyExists = resourceCatalog.some((item) => item.id === resolvedIdBase);
    if (!editingResourceId && alreadyExists) {
      setActionNotice('A resource with this ID already exists. Edit it or choose a different ID.');
      return;
    }

    const now = new Date().toISOString();
    const existing = resourceCatalog.find((item) => item.id === resolvedIdBase);
    const bullets = resourceForm.bulletsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const priceValue = Math.max(0, Number(resourceForm.priceValue) || 0);
    const originalPriceValue = Math.max(
      priceValue,
      Number(resourceForm.originalPriceValue) || priceValue,
    );

    const next: ResourcePackage = {
      id: resolvedIdBase,
      title,
      shortLabel: resourceForm.shortLabel.trim() || 'Resource',
      image,
      tagline: resourceForm.tagline.trim() || title,
      description,
      ctaLabel: resourceForm.ctaLabel.trim() || 'Buy Now',
      // Ratings and counts are shown only when BVF enters real figures.
      rating: resourceForm.rating.trim(),
      reviews: resourceForm.reviews.trim(),
      viewed: resourceForm.viewed.trim(),
      duration: resourceForm.duration.trim() || undefined,
      badge: resourceForm.badge.trim() || undefined,
      priceValue,
      originalPriceValue,
      bullets,
      deliverables: existing?.deliverables || [],
      files: existing?.files || [],
      published: resourceForm.published,
      sortOrder: Number(resourceForm.sortOrder) || resourceCatalog.length + 1,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    try {
      await saveResourcePackage(next);
      setActionNotice(editingResourceId ? `Resource updated: ${next.title}` : `Resource created: ${next.title}`);
      resetResourceForm();
      setQuickAction(null);
      setTab('resources');
    } catch (error) {
      console.error('Failed to save resource package', error);
      setActionNotice('Could not save this package. Check the required fields and Firebase admin access, then try again.');
    }
  };

  const removeResourceCatalogEntry = async (item: ResourcePackage) => {
    const orderCount = orders.filter((order) => order.itemType === 'plan' && order.itemId === item.id).length;
    const confirmed = window.confirm(
      orderCount
        ? `Delete "${item.title}"? ${orderCount} order(s) already reference this resource. Existing orders will remain but this package will disappear from the public resources page.`
        : `Delete "${item.title}" from resource catalog?`,
    );
    if (!confirmed) return;

    await deleteResourcePackage(item.id);
    if (editingResourceId === item.id) {
      resetResourceForm();
    }
    setActionNotice(`Resource deleted: ${item.title}`);
  };

  const removeBlogEntry = async (post: BlogPost) => {
    const confirmed = window.confirm(`Delete blog "${post.title}" permanently from database?`);
    if (!confirmed) return;

    await deleteBlogPost(post.id);
    setBlogs(await getBlogPosts());
    setActionNotice(`Blog deleted permanently: ${post.title}`);
  };

  const removeWebinarCatalogEntry = async (item: WebinarCatalogItem) => {
    const registrationCount = webinars.filter((registration) => registration.webinarId === item.id).length;
    const confirmed = window.confirm(
      registrationCount
        ? `Delete webinar "${item.title}" permanently? This will also remove ${registrationCount} related registration record(s) from the database.`
        : `Delete webinar "${item.title}" permanently from database?`,
    );
    if (!confirmed) return;

    await deleteWebinarCatalogItem(item.id);
    setActionNotice(`Webinar deleted permanently: ${item.title}`);
  };

  const shareWebinarMeetingLink = async (item: WebinarCatalogItem) => {
    const link = (webinarLinkDrafts[item.id] ?? item.meetingLink ?? '').trim();
    if (!link) {
      setActionNotice('Add a valid webinar meeting link before sharing.');
      return;
    }

    const updatedItem: WebinarCatalogItem = {
      ...item,
      meetingLink: link,
      meetingLinkSharedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveWebinarCatalogItem(updatedItem);

    const eligibleRegistrations = webinars.filter((registration) => {
      if (registration.webinarId !== item.id || !registration.userId) return false;
      if ((registration.webinarAccessType || item.accessType) === 'paid') {
        return Boolean(registration.orderId && paidOrderIds.has(registration.orderId));
      }
      return true;
    });

    await Promise.all(
      eligibleRegistrations.map((registration) =>
        createStudentNotification({
          userId: registration.userId!,
          title: 'Webinar link available',
          message: `${item.title} meeting link is now available: ${link}`,
          type: 'system',
        }),
      ),
    );

    setActionNotice(`Meeting link shared for ${item.title}. Eligible students were notified.`);
  };

  const confirmOrderPayment = async (order: OrderRecord, status: 'paid' | 'cancelled') => {
    const label = status === 'paid' ? 'paid' : 'cancelled';
    const confirmed = window.confirm(
      status === 'paid'
        ? `Mark order "${order.title}" (${order.amountLabel}) from ${order.name} as paid? Do this only after the payment has reached BVF.`
        : `Cancel order "${order.title}" from ${order.name}?`,
    );
    if (!confirmed) return;

    await updateOrderStatus(order.id, { status });
    if (order.userId) {
      await createStudentNotification({
        userId: order.userId,
        title: status === 'paid' ? 'Payment confirmed' : 'Order cancelled',
        message:
          status === 'paid'
            ? `Your payment for ${order.title} is confirmed.${order.itemType === 'plan' ? ' Your resource access will appear in your dashboard shortly.' : ''}`
            : `Your order for ${order.title} was cancelled. Contact BVF Germany if you have questions.`,
        type: 'system',
      });
    }
    setActionNotice(`Order for ${order.title} (${order.name}) marked as ${label}.`);
  };

  const saveResourceDriveLink = async (order: OrderRecord) => {
    const link = (resourceLinkDrafts[order.id] ?? order.resourceDriveUrl ?? '').trim();
    if (!link) {
      setActionNotice('Add a valid Google Drive link before saving resource access.');
      return;
    }
    if (order.status !== 'paid') {
      setActionNotice('Only paid resource orders can receive Google Drive access.');
      return;
    }

    await updateOrderResourceAccess(order.id, {
      resourceDriveUrl: link,
      resourceDriveLabel: `${order.title} drive`,
      resourceDeliveredBy: user?.email || 'BVF Admin',
    });

    if (order.userId) {
      await createStudentNotification({
        userId: order.userId,
        title: 'Resource access ready',
        message: `${order.title} is now available in your student dashboard resources section.`,
        type: 'system',
      });
    }

    setResourceLinkDrafts((prev) => ({ ...prev, [order.id]: link }));
    setActionNotice(`Google Drive access saved for ${order.name}.`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-200 bg-white p-4 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admin Dashboard</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{user?.email}</p>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {tabs.map((item) => (
              <button key={item.key} onClick={() => setTab(item.key)} className={`flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm lg:w-full ${tab === item.key ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                <span className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                {item.key === 'documents' && totalUnreadDocuments > 0 ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    {totalUnreadDocuments}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"><LogOut className="h-4 w-4" />Logout</button>
            <Link to="/" className="text-sm font-semibold text-teal-700">Open Website</Link>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:h-screen lg:overflow-y-auto">
          <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 md:max-w-xs lg:max-w-sm">
              <h1 className="text-2xl font-semibold text-slate-900">{tab === 'overview' ? 'Admin Overview' : tab.charAt(0).toUpperCase() + tab.slice(1)}</h1>
              <p className="text-sm text-slate-500">Operational workspace with pipeline movement, reviews, and performance context.</p>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-end">
              {totalUnreadDocuments > 0 ? (
                <div className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">{totalUnreadDocuments} unread docs</div>
              ) : null}
              <button
                onClick={() => {
                  setTab('resources');
                  resetResourceForm();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Resources
              </button>
              <div className="relative w-full md:w-64 lg:w-72">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Global search"
                  className="w-full rounded-lg border border-stone-300 bg-stone-50 py-1.5 pl-8 pr-9 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">/</span>
                {searchOpen && searchQuery ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl">
                    <div className="border-b border-stone-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Search results
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2">
                      {searchResults.length ? searchResults.map((result) => {
                        const titleParts = highlightMatch(result.title, searchQuery);
                        const subtitleParts = highlightMatch(result.subtitle, searchQuery);
                        return (
                          <button
                            key={result.id}
                            onClick={() => {
                              setTab(result.tab);
                              setSearchOpen(false);
                            }}
                            className="w-full rounded-lg px-3 py-2 text-left hover:bg-stone-50"
                          >
                            <div className="flex gap-3">
                              {result.imageUrl ? <img src={result.imageUrl} alt={result.title} className="h-12 w-16 rounded-lg object-cover" /> : null}
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900">
                                  {typeof titleParts === 'string' ? titleParts : <>{titleParts.before}<mark className="rounded bg-amber-100 px-0.5 text-inherit">{titleParts.match}</mark>{titleParts.after}</>}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {typeof subtitleParts === 'string' ? subtitleParts : <>{subtitleParts.before}<mark className="rounded bg-amber-100 px-0.5 text-inherit">{subtitleParts.match}</mark>{subtitleParts.after}</>}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      }) : <p className="px-3 py-4 text-sm text-slate-500">No matches found.</p>}
                    </div>
                  </div>
                ) : null}
              </div>
              <button onClick={() => setQuickAction('student')} className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700"><Plus className="h-3.5 w-3.5" />Add Student</button>
              <button onClick={() => setQuickAction('blog')} className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700"><Plus className="h-3.5 w-3.5" />Create Blog</button>
              <button onClick={() => setQuickAction('webinar')} className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700"><Plus className="h-3.5 w-3.5" />Create Webinar</button>
              <button onClick={openCreateResourcePackage} className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700"><Plus className="h-3.5 w-3.5" />Create Package</button>
            </div>
          </div>

          {actionNotice && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{actionNotice}</div>}

          {quickAction ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
              <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl">
                {quickAction === 'student' ? (
                  <form onSubmit={createStudent}>
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Quick Action</p><h2 className="mt-1 text-xl font-semibold text-slate-900">Add Student</h2></div>
                      <button type="button" onClick={() => setQuickAction(null)} className="rounded-lg border border-stone-300 px-3 py-1 text-sm">Close</button>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">Use the same core student details as the registration page. The profile will be created in pending approval state.</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-semibold text-slate-900">Full Name</label>
                        <input value={studentForm.name} onChange={(e) => setStudentForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Enter full name" className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-900">Email</label>
                        <input value={studentForm.email} onChange={(e) => setStudentForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="you@example.com" className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-900">Phone</label>
                        <input value={studentForm.phone} onChange={(e) => setStudentForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="+91 99999 99999" className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-900">Password</label>
                        <input type="password" value={studentForm.password} onChange={(e) => setStudentForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="Minimum 6 characters" className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-900">Confirm Password</label>
                        <input type="password" value={studentForm.confirmPassword} onChange={(e) => setStudentForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} placeholder="Re-enter password" className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white">Create Student</button>
                      <button type="button" onClick={() => setQuickAction(null)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">Cancel</button>
                    </div>
                  </form>
                ) : null}
                {quickAction === 'blog' ? (
                  <form onSubmit={createBlog}>
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Quick Action</p><h2 className="mt-1 text-xl font-semibold text-slate-900">Create Blog</h2></div>
                      <button type="button" onClick={() => setQuickAction(null)} className="rounded-lg border border-stone-300 px-3 py-1 text-sm">Close</button>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <input value={blogForm.title} onChange={(e) => setBlogForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Title" className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2" />
                      <input value={blogForm.category} onChange={(e) => setBlogForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Category" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                      <input value={blogForm.excerpt} onChange={(e) => setBlogForm((prev) => ({ ...prev, excerpt: e.target.value }))} placeholder="Excerpt (optional)" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                      <input value={blogForm.imageUrl} onChange={(e) => setBlogForm((prev) => ({ ...prev, imageUrl: e.target.value }))} placeholder="Image URL (optional)" className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2" />
                      <textarea value={blogForm.content} onChange={(e) => setBlogForm((prev) => ({ ...prev, content: e.target.value }))} placeholder="Article content" rows={6} className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2" />
                      <label className="inline-flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
                        <input type="checkbox" checked={blogForm.publishNow} onChange={(e) => setBlogForm((prev) => ({ ...prev, publishNow: e.target.checked }))} />
                        Publish immediately and notify students
                      </label>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button type="button" onClick={() => void sendTestBlogBroadcast()} className="rounded-lg border border-teal-300 px-3 py-2 text-sm font-semibold text-teal-700">Send Test Email</button>
                      <button className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white">{blogForm.publishNow ? 'Publish Blog' : 'Save Draft'}</button>
                      <button type="button" onClick={() => setQuickAction(null)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">Cancel</button>
                    </div>
                  </form>
                ) : null}
                {quickAction === 'webinar' ? (
                  <form onSubmit={createWebinar}>
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Quick Action</p><h2 className="mt-1 text-xl font-semibold text-slate-900">Create Webinar</h2></div>
                      <button type="button" onClick={() => setQuickAction(null)} className="rounded-lg border border-stone-300 px-3 py-1 text-sm">Close</button>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <input value={webinarForm.title} onChange={(e) => setWebinarForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Webinar title" className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2" />
                      <input value={webinarForm.topic} onChange={(e) => setWebinarForm((prev) => ({ ...prev, topic: e.target.value }))} placeholder="Topic" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                      <input value={webinarForm.speaker} onChange={(e) => setWebinarForm((prev) => ({ ...prev, speaker: e.target.value }))} placeholder="Speaker" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                      <input value={webinarForm.imageUrl} onChange={(e) => setWebinarForm((prev) => ({ ...prev, imageUrl: e.target.value }))} placeholder="Image URL (optional)" className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2" />
                      <input type="datetime-local" value={webinarForm.scheduleAt} onChange={(e) => setWebinarForm((prev) => ({ ...prev, scheduleAt: e.target.value }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                      <input value={webinarForm.durationMinutes} onChange={(e) => setWebinarForm((prev) => ({ ...prev, durationMinutes: e.target.value }))} placeholder="Duration (mins)" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                      <input value={webinarForm.capacity} onChange={(e) => setWebinarForm((prev) => ({ ...prev, capacity: e.target.value }))} placeholder="Capacity" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
                      <select value={webinarForm.accessType} onChange={(e) => setWebinarForm((prev) => ({ ...prev, accessType: e.target.value as 'free' | 'paid', priceLabel: e.target.value === 'paid' ? prev.priceLabel : '0' }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
                        <option value="free">Free webinar</option>
                        <option value="paid">Paid webinar</option>
                      </select>
                      <input value={webinarForm.priceLabel} onChange={(e) => setWebinarForm((prev) => ({ ...prev, priceLabel: e.target.value }))} disabled={webinarForm.accessType === 'free'} placeholder="Price in INR" className="rounded-lg border border-stone-300 px-3 py-2 text-sm disabled:bg-stone-100" />
                      <textarea value={webinarForm.description} onChange={(e) => setWebinarForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" rows={4} className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2" />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button type="button" onClick={() => void sendTestWebinarBroadcast()} className="rounded-lg border border-teal-300 px-3 py-2 text-sm font-semibold text-teal-700">Send Test Email</button>
                      <button className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white">Create Webinar</button>
                      <button type="button" onClick={() => setQuickAction(null)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">Cancel</button>
                    </div>
                  </form>
                ) : null}
                {quickAction === 'resource' ? (
                  <form onSubmit={saveResourceCatalogEntry}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Quick Action</p>
                        <h2 className="mt-1 text-xl font-semibold text-slate-900">{editingResourceId ? 'Edit Package' : 'Create Package'}</h2>
                      </div>
                      <button type="button" onClick={() => setQuickAction(null)} className="rounded-lg border border-stone-300 px-3 py-1 text-sm">Close</button>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">This popup saves catalog packages for the public Resources page. Required fields are title, image URL, and description.</p>
                    <div className="mt-4 grid max-h-[65vh] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                      <input
                        value={resourceForm.title}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, title: event.target.value }))}
                        placeholder="Package title"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.id}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, id: event.target.value }))}
                        placeholder="Package ID (optional for new)"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                        disabled={Boolean(editingResourceId)}
                      />
                      <input
                        value={resourceForm.shortLabel}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, shortLabel: event.target.value }))}
                        placeholder="Short label"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.image}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, image: event.target.value }))}
                        placeholder="Cover image URL"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.priceValue}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, priceValue: event.target.value }))}
                        placeholder="Current price (INR)"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.originalPriceValue}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, originalPriceValue: event.target.value }))}
                        placeholder="Original price (INR)"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.rating}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, rating: event.target.value }))}
                        placeholder="Rating"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.reviews}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, reviews: event.target.value }))}
                        placeholder="Reviews text"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.viewed}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, viewed: event.target.value }))}
                        placeholder="Viewed text"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.duration}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, duration: event.target.value }))}
                        placeholder="Duration (optional)"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.badge}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, badge: event.target.value }))}
                        placeholder="Badge (optional)"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.sortOrder}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
                        placeholder="Sort order"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={resourceForm.tagline}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, tagline: event.target.value }))}
                        placeholder="Tagline"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2"
                      />
                      <textarea
                        value={resourceForm.description}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, description: event.target.value }))}
                        rows={3}
                        placeholder="Description"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2"
                      />
                      <textarea
                        value={resourceForm.bulletsText}
                        onChange={(event) => setResourceForm((prev) => ({ ...prev, bulletsText: event.target.value }))}
                        rows={4}
                        placeholder="Highlights (one per line)"
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2"
                      />
                      <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                        <input
                          value={resourceForm.ctaLabel}
                          onChange={(event) => setResourceForm((prev) => ({ ...prev, ctaLabel: event.target.value }))}
                          placeholder="CTA label"
                          className="min-w-[220px] flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
                        />
                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={resourceForm.published}
                            onChange={(event) => setResourceForm((prev) => ({ ...prev, published: event.target.checked }))}
                          />
                          Published
                        </label>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white">
                        {editingResourceId ? 'Update package' : 'Create package'}
                      </button>
                      <button
                        type="button"
                        onClick={resetResourceForm}
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                      >
                        Clear form
                      </button>
                      <button type="button" onClick={() => setQuickAction(null)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">Cancel</button>
                    </div>
                  </form>
                ) : null}
              </div>
            </div>
          ) : null}

          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">{([
                ['Active students', students.length, Users], ['New leads', leads.filter((l) => l.status !== 'closed').length, AlertTriangle], ['Pending docs', docQueue.filter((d) => d.doc.status === 'submitted').length, FileText], ['At-risk', students.filter((s) => s.status !== 'approved').length, AlertTriangle], ['Webinar regs', webinars.length, Video], ['Revenue orders', orders.length, CreditCard],
              ] as Array<[string, number, typeof Users]>).map(([label, value, Icon]) => <div key={String(label)} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{String(label)}</p><div className="mt-1 flex items-center gap-2"><Icon className="h-4 w-4 text-teal-700" /><p className="text-2xl font-semibold text-slate-900">{String(value)}</p></div></div>)}</div>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm xl:col-span-8"><h2 className="text-lg font-semibold">Pipeline stage summary</h2><div className="mt-3 grid gap-2 md:grid-cols-5">{Object.entries(stageBuckets).map(([k, v]) => <div key={k} className="rounded-lg border border-stone-200 bg-stone-50 p-3"><p className="text-xs text-slate-500">{k}</p><p className="text-2xl font-semibold text-slate-900">{v}</p></div>)}</div></div>
                <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm xl:col-span-4"><h2 className="text-lg font-semibold">Urgent actions</h2><div className="mt-2 space-y-2 text-sm"><div className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">{students.filter((s) => s.status === 'pending_approval').length} students pending approval</div><div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700">{docQueue.filter((d) => d.doc.status === 'submitted').length} documents awaiting review</div><div className="rounded-lg bg-stone-100 px-3 py-2 text-slate-700">{leads.filter((l) => l.status !== 'closed').length} open leads need follow-up</div></div></div>
              </div>
              <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold">Pending Student Approvals</h2>
                  <button onClick={() => setTab('students')} className="text-sm font-semibold text-teal-700">Open students tab</button>
                </div>
                <div className="mt-3 space-y-2">
                  {pendingApprovalStudents.length ? pendingApprovalStudents.slice(0, 6).map((student) => (
                    <div key={student.uid} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm">
                      <div>
                        <p className="font-semibold text-slate-900">{student.name || student.email}</p>
                        <p className="text-xs text-slate-500">{student.email} | Created {new Date(student.createdAt).toLocaleString()}</p>
                      </div>
                      <button onClick={() => openApprovalWindow(student)} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Review & verify</button>
                    </div>
                  )) : <p className="text-sm text-slate-500">No pending students right now. New signups should appear here immediately after registration.</p>}
                </div>
              </div>
              <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold">Student submissions feed</h2>
                <div className="mt-3 space-y-3">
                  {submissionGroups.length ? submissionGroups.map((group) => (
                    <div key={group.student.uid} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{group.student.name || group.student.email}</p>
                          <p className="text-xs text-slate-500">{group.student.email}</p>
                          <p className="mt-1 text-xs text-slate-500">Latest submission: {new Date(group.latestAt).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Unread {group.unreadCount}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Read {group.readCount}</span>
                          <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">Bookings {group.typeCounts.booking || 0}</span>
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">Webinars {group.typeCounts.webinar || 0}</span>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Orders {group.typeCounts.order || 0}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">{group.items.length} total submission items for this student</p>
                        <button onClick={() => openActivityWindow(group.student, group.latestAt)} className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white">Open student activity</button>
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-500">No student submissions yet.</p>}
                </div>
              </div>
            </div>
          )}

          {tab === 'students' && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Student Management</h2>
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
                <p className="text-sm font-semibold text-rose-800">Pending approvals: {pendingApprovalStudents.length}</p>
                <p className="mt-1 text-xs text-rose-700">Every new signup should appear here automatically. If it does not, the student profile is not being written to the `students` path correctly.</p>
              </div>
              <div className="mb-3 mt-2 flex flex-wrap gap-2">
                <select value={studentStageFilter} onChange={(e) => setStudentStageFilter(e.target.value)} className="rounded-lg border border-stone-300 px-3 py-1 text-xs">
                  <option value="">All stages</option>
                  {Object.keys(stageBuckets).map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                </select>
                <select value={studentApprovalFilter} onChange={(e) => setStudentApprovalFilter(e.target.value as 'all' | 'approved' | 'pending' | 'rejected' | 'suspended')} className="rounded-lg border border-stone-300 px-3 py-1 text-xs">
                  <option value="all">All approvals</option>
                  <option value="approved">Approved only</option>
                  <option value="pending">Pending approval</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
                <button onClick={exportStudentsCsv} className="rounded-lg border border-stone-300 px-3 py-1 text-xs">Export CSV</button>
              </div>
              <div className="space-y-3">
                {filteredStudents.map((s) => (
                  <div key={s.uid} className="rounded-lg border border-stone-200 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div><p className="font-semibold text-slate-900">{s.name || s.email}</p><p className="text-xs text-slate-500">{s.email} | {s.universityPreference}</p><p className="text-xs text-slate-500">Stage {getStudentStage(s)} | Progress {Math.round((s.services.filter((x) => x.status === 'completed').length / Math.max(1, s.services.length)) * 100)}%</p><p className="text-xs text-slate-500">Upcoming deadlines: {deadlines.filter((d) => d.userId === s.uid && d.status === 'pending').length}</p><p className="text-xs text-slate-500">Latest update: {s.timeline[0] ? `${s.timeline[0].title} (${new Date(s.timeline[0].createdAt).toLocaleDateString()})` : 'No recent activity'}</p></div>
                      <div className="flex gap-2">
                        {(studentUnreadMap.get(s.uid) || 0) > 0 ? (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            {studentUnreadMap.get(s.uid)} unread docs
                          </span>
                        ) : null}
                        <button onClick={() => openApprovalWindow(s)} className={`rounded-lg px-3 py-1 text-xs font-semibold ${s.status === 'approved' ? 'bg-slate-100 text-slate-700' : s.status === 'rejected' ? 'bg-rose-100 text-rose-700' : s.status === 'suspended' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{s.status === 'approved' ? 'Review status' : 'Open approval window'}</button>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2"><input value={noteDrafts[s.uid] || ''} onChange={(e) => setNoteDrafts((p) => ({ ...p, [s.uid]: e.target.value }))} placeholder="Add internal note or follow-up" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" /><button onClick={() => addStudentAdminNote(s.uid, (noteDrafts[s.uid] || '').trim(), user?.email || 'BVF Admin')} className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white">Save note</button></div>
                    <div className="mt-2 grid gap-2 md:grid-cols-4">
                      <input value={deadlineDrafts[s.uid]?.title || ''} onChange={(e) => setDeadlineDrafts((prev) => ({ ...prev, [s.uid]: { ...(prev[s.uid] || { title: '', dueDate: '', dueTime: '', note: '' }), title: e.target.value } }))} placeholder="Deadline title" className="rounded-lg border border-slate-300 px-3 py-2 text-xs" />
                      <input type="date" value={deadlineDrafts[s.uid]?.dueDate || ''} onChange={(e) => setDeadlineDrafts((prev) => ({ ...prev, [s.uid]: { ...(prev[s.uid] || { title: '', dueDate: '', dueTime: '', note: '' }), dueDate: e.target.value } }))} className="rounded-lg border border-slate-300 px-3 py-2 text-xs" />
                      <input type="time" value={deadlineDrafts[s.uid]?.dueTime || ''} onChange={(e) => setDeadlineDrafts((prev) => ({ ...prev, [s.uid]: { ...(prev[s.uid] || { title: '', dueDate: '', dueTime: '', note: '' }), dueTime: e.target.value } }))} className="rounded-lg border border-slate-300 px-3 py-2 text-xs" />
                      <button onClick={() => void saveDeadlineForStudent(s)} className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white">Assign deadline</button>
                    </div>
                    <div className="mt-2 space-y-1">
                      {deadlines.filter((d) => d.userId === s.uid && d.status === 'pending').slice(0, 3).map((deadline) => (
                        <div key={deadline.id} className="flex items-center justify-between rounded bg-stone-50 px-2 py-1 text-xs">
                          <span>{deadline.dueDate} {deadline.dueTime ? deadline.dueTime : ''} - {deadline.title}</span>
                          <button onClick={() => void deleteStudentDeadline(deadline.id)} className="font-semibold text-rose-700">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'pipeline' && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Pipeline Board</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-5">{Object.entries(stageBuckets).map(([k, v]) => <div key={k} className="rounded-lg border border-stone-200 bg-stone-50 p-3"><p className="text-xs text-slate-500">{k}</p><p className="text-2xl font-semibold text-slate-900">{v}</p><p className="mt-1 text-xs text-slate-500">Stage load</p></div>)}</div>
              <div className="mt-4 grid gap-3 xl:grid-cols-5">
                {Object.entries(stageStudents).map(([stage, items]) => (
                  <div key={stage} className="rounded-lg border border-stone-200 p-3">
                    <p className="text-sm font-semibold text-slate-900">{stage}</p>
                    <div className="mt-2 space-y-2">
                      {items.slice(0, 4).map((student) => (
                        <div key={student.uid} className="rounded bg-stone-50 px-2 py-1 text-xs">
                          <p className="font-semibold text-slate-800">{student.name || student.email}</p>
                          <p className="text-slate-500">{student.status === 'approved' ? 'Approved' : student.status === 'rejected' ? 'Rejected' : student.status === 'suspended' ? 'Suspended' : 'Needs approval'}</p>
                        </div>
                      ))}
                      {!items.length && <p className="text-xs text-slate-500">No students in this stage.</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'documents' && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Document Review Queue</h2>
              <div className="mt-2 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Fresh uploads {totalUnreadDocuments}</span><span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">Escalations {escalatedDocs}</span><button onClick={() => setDocumentsUnreadOnly((current) => !current)} className={`rounded-full px-3 py-1 font-semibold ${documentsUnreadOnly ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-slate-700'}`}>{documentsUnreadOnly ? 'Showing unread only' : 'Unread only'}</button></div>
              <div className="mt-3 space-y-3">{visibleDocumentGroups.length ? visibleDocumentGroups.map((group) => (
                <div key={group.student.uid} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{group.student.name || group.student.email}</p>
                      <p className="text-xs text-slate-500">{group.student.email}</p>
                      <p className="mt-1 text-xs text-slate-500">Last document activity: {new Date(group.latestSubmittedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Unread {group.unreadCount}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Read {group.readCount}</span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Approved {group.approvedCount}</span>
                      <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">Rejected {group.rejectedCount}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">{group.items.length} total documents across {new Set(group.items.map((item) => item.serviceId)).size} services</p>
                    <button onClick={() => setDocumentTarget(group.student)} className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white">Open student documents</button>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-500">{documentsUnreadOnly ? 'No students with unread documents right now.' : 'No uploaded documents yet.'}</p>}</div>
            </div>
          )}

          {tab === 'applications' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Total apps</p><p className="text-2xl font-semibold">{students.reduce((sum, s) => sum + s.services.filter((x) => x.enrolled).length, 0)}</p></div>
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Approaching deadlines</p><p className="text-2xl font-semibold">{bookings.length}</p></div>
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Incomplete apps</p><p className="text-2xl font-semibold">{students.filter((s) => s.services.some((x) => x.enrolled && x.status !== 'completed')).length}</p></div>
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Recent admits</p><p className="text-2xl font-semibold">{students.filter((s) => s.services.some((x) => x.enrolled && x.status === 'completed')).length}</p></div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-lg font-semibold">Application Operations</h2>
              <div className="mt-3 space-y-3">{filteredApplicationStudents.map((s) => (
                <div key={s.uid} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-900">{s.name || s.email}</p>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">{s.services.filter((x) => x.enrolled).map((service) => (
                    <div key={service.id} className="rounded-lg bg-slate-50 p-2"><p className="text-xs font-semibold text-slate-900">{service.title}</p><div className="mt-1 flex flex-wrap gap-1">{(['not-started', 'in-progress', 'documents-received', 'submitted', 'completed'] as ServiceStatus[]).map((st) => <button key={st} onClick={() => setServiceStatus(s.uid, service.id, st)} className={`rounded px-2 py-0.5 text-[10px] ${service.status === st ? 'bg-teal-100 text-teal-700' : 'bg-white text-slate-600'}`}>{serviceStatusLabels[st]}</button>)}</div></div>
                  ))}</div>
                </div>
              ))}</div>
            </div>
            </div>
          )}

          {tab === 'blogs' && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex gap-2 text-xs">
                <span className="rounded-full bg-stone-100 px-3 py-1">Drafts</span>
                <span className="rounded-full bg-stone-100 px-3 py-1">Published</span>
                <span className="rounded-full bg-stone-100 px-3 py-1">Analytics</span>
              </div>
              <h2 className="text-lg font-semibold">Blog Performance View</h2>
              <div className="mt-3 space-y-2">
                {filteredBlogs.length ? filteredBlogs.map((b) => (
                  <div key={b.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        {b.featuredImage ? <img src={b.featuredImage} alt={b.title} className="h-16 w-24 rounded-lg object-cover" /> : null}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{b.title}</p>
                          <p className="text-xs text-slate-500">{b.category} | {b.published ? 'Published' : 'Draft'} | Popularity {b.popularity}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => void removeBlogEntry(b)}
                        className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )) : <p className="text-sm text-slate-500">No blogs match the current search.</p>}
              </div>
            </div>
          )}

          {tab === 'webinars' && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Webinar Operations</h2>
              <div className="mt-2 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-stone-100 px-3 py-1">Upcoming</span><span className="rounded-full bg-stone-100 px-3 py-1">Live</span><span className="rounded-full bg-stone-100 px-3 py-1">Completed</span></div>
              <div className="mt-3 rounded-lg border border-stone-200 p-3">
                <p className="mb-2 text-sm font-semibold text-slate-900">Created webinars</p>
                {filteredWebinarCatalog.length ? filteredWebinarCatalog.map((item) => (
                  <div key={item.id} className="mb-2 rounded-lg bg-stone-50 p-2 text-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex gap-3">
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-16 w-24 rounded-lg object-cover" /> : null}
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.speaker} | {item.topic} | {item.status}</p>
                          <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                            <span className={`rounded-full px-2 py-0.5 ${item.accessType === 'paid' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {item.accessType === 'paid' ? `Paid | INR ${item.priceValue}` : 'Free'}
                            </span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-700">
                              Registrations {webinars.filter((registration) => registration.webinarId === item.id).length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-col gap-2 md:flex-row">
                      <input
                        value={webinarLinkDrafts[item.id] ?? item.meetingLink ?? ''}
                        onChange={(e) => setWebinarLinkDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Paste webinar meeting link"
                        className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                      />
                      <button onClick={() => void shareWebinarMeetingLink(item)} className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white">
                        {item.meetingLink ? 'Update & notify' : 'Share link'}
                      </button>
                      <button
                        onClick={() => void removeWebinarCatalogEntry(item)}
                        className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )) : <p className="text-sm text-slate-500">No webinar events created yet.</p>}
              </div>
              <div className="mt-3 space-y-2">{filteredWebinarRegistrations.length ? filteredWebinarRegistrations.map((w) => (
                <div key={w.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-900">{w.webinarTitle || w.webinarId}</p>
                  <p className="text-xs text-slate-500">{w.name} | {w.email}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{w.webinarAccessType === 'paid' ? `Paid registration${w.orderId ? ` • Order ${w.orderId.slice(0, 8)}` : ''}` : 'Free registration'}</p>
                  <div className="mt-1 flex gap-2 text-xs"><button onClick={() => update(ref(db, `${DB_PATHS.webinarRegistrations}/${w.id}`), { attendanceStatus: 'attended' })} className="rounded bg-emerald-100 px-2 py-1 text-emerald-700">Attended</button><button onClick={() => update(ref(db, `${DB_PATHS.webinarRegistrations}/${w.id}`), { attendanceStatus: 'missed' })} className="rounded bg-rose-100 px-2 py-1 text-rose-700">Missed</button></div>
                </div>
              )) : <p className="text-sm text-slate-500">No webinar registrations match the current search.</p>}</div>
            </div>
          )}

          {tab === 'resources' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Payments to confirm</h2>
                    <p className="mt-1 text-xs text-slate-500">Orders for resources and paid webinars. Mark an order as paid only after the payment has reached BVF.</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Pending {pendingPaymentOrders.length}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {pendingPaymentOrders.length ? pendingPaymentOrders.map((order) => (
                    <div key={`pending-${order.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm">
                      <div>
                        <p className="font-semibold text-slate-900">{order.title} <span className="text-xs font-normal text-slate-500">({order.itemType === 'webinar' ? 'Paid webinar' : 'Resource'})</span></p>
                        <p className="text-xs text-slate-500">{order.name} | {order.email} | {order.phone} | {order.amountLabel}</p>
                        <p className="mt-1 text-[11px] text-slate-500">Order {order.id.slice(-8).toUpperCase()} | Placed {new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => void confirmOrderPayment(order, 'paid')} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Mark as paid</button>
                        <button onClick={() => void confirmOrderPayment(order, 'cancelled')} className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700">Cancel</button>
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-500">No orders are waiting for payment confirmation.</p>}
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Resource Package Catalog</h2>
                    <p className="mt-1 text-xs text-slate-500">Create and manage what appears on the public Resources page.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Total {resourceCatalog.length}
                    </span>
                    <button onClick={openCreateResourcePackage} className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white">
                      Create package
                    </button>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-slate-600">
                  Create and edit packages in the popup form so you can stay focused without the catalog list shifting underneath.
                </div>

                <div className="mt-4 space-y-2">
                  {filteredResourceCatalog.length ? filteredResourceCatalog.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 bg-stone-50 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex gap-3">
                          {item.image ? <img src={item.image} alt={item.title} className="h-16 w-24 rounded-lg object-cover" /> : null}
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-500">
                              ID {item.id} | INR {item.priceValue} | Sort {item.sortOrder} | {item.published ? 'Published' : 'Hidden'}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500">Updated {new Date(item.updatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => editResourcePackage(item)} className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                          <button onClick={() => void removeResourceCatalogEntry(item)} className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700">Delete</button>
                        </div>
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-500">No catalog packages match the current search.</p>}
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold">Resource Delivery Operations</h2>
                <div className="mt-2 text-xs text-slate-500">Handle paid orders and attach Google Drive access for each student.</div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <button onClick={() => setResourceOrderFilter('all')} className={`rounded-full px-3 py-1 ${resourceOrderFilter === 'all' ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-slate-700'}`}>All resource orders</button>
                  <button onClick={() => setResourceOrderFilter('paid_undelivered')} className={`rounded-full px-3 py-1 ${resourceOrderFilter === 'paid_undelivered' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-slate-700'}`}>Paid not delivered</button>
                  <button onClick={() => setResourceOrderFilter('delivered')} className={`rounded-full px-3 py-1 ${resourceOrderFilter === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-slate-700'}`}>Delivered</button>
                </div>
                <div className="mt-3 space-y-3">
                  {filteredResourceOrders.length ? filteredResourceOrders.map((o) => {
                    const catalogItem = resourceById.get(o.itemId) || getResourceCatalogItem(o.itemId);
                    return (
                    <div key={o.id} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex gap-3">
                          {catalogItem?.image ? <img src={catalogItem.image} alt={o.title} className="h-16 w-24 rounded-lg object-cover" /> : null}
                          <div>
                          <p className="text-sm font-semibold text-slate-900">{o.title}</p>
                          <p className="text-xs text-slate-500">{o.name} | {o.email} | {o.amountLabel} | {o.status}</p>
                          <p className="mt-1 text-[11px] text-slate-500">Purchased {new Date(o.createdAt).toLocaleString()}</p>
                          {o.resourceDeliveredAt ? <p className="mt-1 text-[11px] text-emerald-700">Delivered {new Date(o.resourceDeliveredAt).toLocaleString()} by {o.resourceDeliveredBy || 'BVF Admin'}</p> : null}
                          </div>
                        </div>
                        {o.resourceDriveUrl ? (
                          <a href={o.resourceDriveUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            Open drive link
                          </a>
                        ) : (
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${o.status === 'paid' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            {o.status === 'paid' ? 'Awaiting drive upload' : 'Waiting for payment'}
                          </span>
                        )}
                      </div>

                      {o.itemType === 'plan' ? (
                        <div className="mt-3 rounded-lg bg-stone-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Admin Drive</p>
                          <div className="mt-2 flex flex-col gap-2 md:flex-row">
                            <input
                              value={resourceLinkDrafts[o.id] ?? o.resourceDriveUrl ?? ''}
                              onChange={(event) => setResourceLinkDrafts((prev) => ({ ...prev, [o.id]: event.target.value }))}
                              placeholder="Paste Google Drive folder or file link"
                              className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
                            />
                            <button
                              onClick={() => void saveResourceDriveLink(o)}
                              disabled={o.status !== 'paid'}
                              className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Save drive link
                            </button>
                          </div>
                          <p className="mt-2 text-[11px] text-slate-500">
                            Once saved, the student can open this resource from the Resources section in the student dashboard.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  );}) : <p className="text-sm text-slate-500">No resource orders match the current search and filter.</p>}
                </div>
                <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Delivery history</h3>
                      <p className="mt-1 text-xs text-slate-500">Latest students who already received Google Drive access</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Delivered {deliveredResourceOrders.length}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {deliveredResourceOrders.length ? deliveredResourceOrders.slice(0, 8).map((order) => (
                      <div key={`delivery-${order.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm">
                        <div>
                          <p className="font-semibold text-slate-900">{order.title}</p>
                          <p className="text-xs text-slate-500">{order.name} | {order.email}</p>
                          <p className="mt-1 text-[11px] text-slate-500">{order.resourceDeliveredAt ? new Date(order.resourceDeliveredAt).toLocaleString() : 'No delivery time'} | {order.resourceDeliveredBy || 'BVF Admin'}</p>
                        </div>
                        <a href={order.resourceDriveUrl || '#'} target="_blank" rel="noreferrer" className="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          Open link
                        </a>
                      </div>
                    )) : <p className="text-sm text-slate-500">No delivered resources yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'reports' && (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="font-semibold">Lead to Student Conversion</h3><p className="mt-2 text-sm text-slate-600">Leads: {leads.length} | Approved students: {students.filter((s) => s.status === 'approved').length}</p></div>
              <div className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="font-semibold">Application Success Signal</h3><p className="mt-2 text-sm text-slate-600">Students with submitted/completed services: {students.filter((s) => s.services.some((x) => x.status === 'submitted' || x.status === 'completed')).length}</p></div>
              <div className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="font-semibold">Offer/Visa Readiness Proxy</h3><p className="mt-2 text-sm text-slate-600">Students near final stages: {stageBuckets.Visa + stageBuckets.Departure}</p></div>
              <div className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="font-semibold">Revenue Snapshot</h3><p className="mt-2 text-sm text-slate-600">Orders: {orders.length} | Paid: {orders.filter((o) => o.status === 'paid').length}</p></div>
            </div>
          )}

          {tab === 'settings' && settings && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Settings</h2>
              <p className="mt-1 text-xs text-slate-500">Official contact details shown across the website. Leave a field empty to hide it. Placeholder values (such as +91 99999 99999) are never shown.</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {([
                  ['whatsappNumber', 'WhatsApp Business number', 'Digits with country code, e.g. 9198XXXXXXXX'],
                  ['contactPhone', 'Phone number (as displayed)', 'e.g. +91 98XXX XXXXX'],
                  ['contactEmail', 'Business email', 'e.g. info@yourdomain.com'],
                  ['instagramUrl', 'Instagram profile URL', 'https://www.instagram.com/...'],
                  ['youtubeUrl', 'YouTube channel URL', 'https://www.youtube.com/@...'],
                  ['workingHours', 'Working hours', 'e.g. Mon–Sat, 10:00–18:00 IST'],
                  ['address', 'Business address', 'Street, city, PIN code'],
                  ['prefilledWhatsappMessage', 'Default WhatsApp message', 'Hi BVF Germany! ...'],
                ] as const).map(([key, label, hint]) => (
                  <label key={key} className={`block text-xs font-semibold text-slate-700 ${key === 'address' || key === 'prefilledWhatsappMessage' ? 'md:col-span-2' : ''}`}>
                    {label}
                    <input
                      value={settings[key]}
                      onChange={(e) => setSettings({ ...settings, [key]: e.target.value, ...(key === 'contactEmail' ? { founderEmail: e.target.value } : {}) })}
                      placeholder={hint}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                    />
                  </label>
                ))}
              </div>
              <button onClick={() => void saveSettings().then(() => setActionNotice('Settings saved. The website now uses these contact details.'))} className="mt-3 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white">Save settings</button>
            </div>
          )}

          {tab === 'overview' && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-lg font-semibold">Recent Activity Feed</h2>
              <div className="mt-3 space-y-3">
                {recentActivityGroups.length ? recentActivityGroups.map((group) => (
                  <div key={group.student.uid} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{group.student.name || group.student.email}</p>
                        <p className="text-xs text-slate-500">{group.student.email}</p>
                        <p className="mt-1 text-xs text-slate-500">Latest activity: {new Date(group.latestAt).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Unread {group.unreadCount}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Read {group.readCount}</span>
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">Timeline {group.typeCounts.system || 0}</span>
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">Bookings {group.typeCounts.booking || 0}</span>
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">Webinars {group.typeCounts.webinar || 0}</span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Orders {group.typeCounts.order || 0}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">{group.items[0]?.title || 'No recent activity summary available.'}</p>
                      <button onClick={() => openActivityWindow(group.student, group.latestAt)} className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white">Open student activity</button>
                    </div>
                  </div>
                )) : <p className="text-sm text-slate-500">No recent activity yet.</p>}
              </div>
            </div>
          )}

          {approvalTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 md:p-5">
              <div className="flex max-h-[88vh] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Approval Window</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">{approvalTarget.name || approvalTarget.email}</h2>
                    <p className="text-sm text-slate-500">{approvalTarget.email}</p>
                  </div>
                  <button onClick={closeApprovalWindow} className="rounded-lg border border-stone-300 px-3 py-1 text-sm text-slate-600">Close</button>
                </div>
                <div className="mt-4 flex-1 overflow-y-auto pr-1">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
                      <p className="font-semibold text-slate-900">Student summary</p>
                      <p className="mt-2 text-slate-600">Phone: {approvalTarget.phone || 'Not provided'}</p>
                      <p className="text-slate-600">Preference: {approvalTarget.universityPreference}</p>
                      <p className="text-slate-600">Created: {new Date(approvalTarget.createdAt).toLocaleString()}</p>
                      <p className="text-slate-600">Current status: {approvalTarget.status.replace('_', ' ')}</p>
                    </div>
                    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
                      <p className="font-semibold text-slate-900">Readiness snapshot</p>
                      <p className="mt-2 text-slate-600">Profile completeness: {approvalSummary?.completeness ?? 0}%</p>
                      <div className="mt-2 h-2 rounded-full bg-stone-200">
                        <div className="h-2 rounded-full bg-teal-600" style={{ width: `${Math.max(6, approvalSummary?.completeness ?? 0)}%` }} />
                      </div>
                      <p className="mt-2 text-slate-600">Enrolled services: {approvalSummary?.enrolledServices.length ?? 0}</p>
                      <p className="text-slate-600">Uploaded documents: {approvalSummary?.uploadedDocuments.length ?? 0}</p>
                      <p className="text-slate-600">Pending deadlines: {deadlines.filter((deadline) => deadline.userId === approvalTarget.uid && deadline.status === 'pending').length}</p>
                      <p className="text-slate-600">Latest timeline: {approvalTarget.timeline[0]?.title || 'No activity yet'}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-xl border border-stone-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">Uploaded documents</p>
                        <span className="text-xs text-slate-500">{approvalSummary?.uploadedDocuments.length ?? 0} files</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {approvalSummary?.uploadedDocuments.length ? approvalSummary.uploadedDocuments.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-xs">
                            <div>
                              <p className="font-semibold text-slate-800">{doc.label}</p>
                              <p className="text-slate-500">{doc.serviceTitle} | {new Date(doc.submittedAt).toLocaleString()}</p>
                            </div>
                            <a href={doc.url} target="_blank" rel="noreferrer" className="font-semibold text-teal-700">Open</a>
                          </div>
                        )) : <p className="text-sm text-slate-500">No documents uploaded yet.</p>}
                      </div>
                    </div>

                    <div className="rounded-xl border border-stone-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">Recent activity</p>
                        <span className="text-xs text-slate-500">{approvalSummary?.latestEvents.length ?? 0} events</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {approvalSummary?.latestEvents.length ? approvalSummary.latestEvents.map((event) => (
                          <div key={event.id} className="rounded-lg bg-stone-50 px-3 py-2 text-xs">
                            <p className="font-semibold text-slate-800">{event.title}</p>
                            <p className="mt-1 text-slate-500">{event.description}</p>
                            <p className="mt-1 text-slate-400">{new Date(event.createdAt).toLocaleString()}</p>
                          </div>
                        )) : <p className="text-sm text-slate-500">No timeline events recorded yet.</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-semibold text-slate-900">Admin note</label>
                    <textarea
                      value={approvalNote}
                      onChange={(event) => setApprovalNote(event.target.value)}
                      rows={3}
                      placeholder="Add a note for the student before approving or sending back for corrections."
                      className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-semibold text-slate-900">Rejection or suspension reason</label>
                    <input
                      value={rejectionReason}
                      onChange={(event) => setRejectionReason(event.target.value)}
                      placeholder="Optional reason shown when access is rejected or suspended."
                      className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-200 pt-4">
                  <button onClick={() => void submitApprovalDecision('approved')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Approve student</button>
                  <button onClick={() => void submitApprovalDecision('pending_approval')} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Keep pending</button>
                  <button onClick={() => void submitApprovalDecision('rejected')} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Reject student</button>
                  {approvalTarget.status === 'approved' && (
                    <button onClick={() => void submitApprovalDecision('suspended')} className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-700">Suspend access</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {documentTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 md:p-5">
              <div className="flex max-h-[86vh] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Student Documents</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">{documentTarget.name || documentTarget.email}</h2>
                    <p className="text-sm text-slate-500">{documentTarget.email}</p>
                  </div>
                  <button onClick={() => setDocumentTarget(null)} className="rounded-lg border border-stone-300 px-3 py-1 text-sm text-slate-600">Close</button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
                    <p className="font-semibold text-slate-900">Student summary</p>
                    <p className="mt-2 text-slate-600">Phone: {documentTarget.phone || 'Not provided'}</p>
                    <p className="text-slate-600">Preference: {documentTarget.universityPreference}</p>
                    <p className="text-slate-600">Status: {documentTarget.status.replace('_', ' ')}</p>
                    <p className="text-slate-600">Created: {new Date(documentTarget.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
                    <p className="font-semibold text-slate-900">Document snapshot</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Unread {documentTargetItems.filter((item) => item.doc.status === 'submitted').length}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Read {documentTargetItems.filter((item) => item.doc.status !== 'submitted').length}</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Approved {documentTargetItems.filter((item) => item.doc.status === 'reviewed').length}</span>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">Rejected {documentTargetItems.filter((item) => item.doc.status === 'rejected').length}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
                  <div className="rounded-xl border border-stone-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">Recent activity</p>
                      <span className="text-xs text-slate-500">{documentTarget.timeline.slice(0, 4).length} events</span>
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {documentTarget.timeline.slice(0, 4).map((event) => (
                        <div key={event.id} className="rounded-lg bg-stone-50 px-3 py-2 text-xs">
                          <p className="font-semibold text-slate-800">{event.title}</p>
                          <p className="mt-1 text-slate-500">{event.description}</p>
                          <p className="mt-1 text-slate-400">{new Date(event.createdAt).toLocaleString()}</p>
                        </div>
                      ))}
                      {!documentTarget.timeline.length && <p className="text-sm text-slate-500">No timeline events recorded yet.</p>}
                    </div>
                  </div>

                  {documentTargetItems.map((item) => (
                    <div key={`${item.student.uid}-${item.doc.id}`} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.doc.label}</p>
                          <p className="text-xs text-slate-500">{item.serviceTitle} | {new Date(item.doc.submittedAt).toLocaleString()}</p>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs ${item.doc.status === 'reviewed' ? 'bg-emerald-50 text-emerald-700' : item.doc.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{item.doc.status === 'reviewed' ? 'Approved' : item.doc.status === 'rejected' ? 'Rejected' : 'Pending'}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <a href={item.doc.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 px-3 py-1 text-xs">Open file</a>
                        {item.doc.status !== 'reviewed' && (
                          <button onClick={() => setDocStatus(item.student, item.serviceId, item.doc.id, 'reviewed')} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Approve</button>
                        )}
                        <button onClick={() => setDocStatus(item.student, item.serviceId, item.doc.id, 'rejected')} className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white">Reject</button>
                        <button onClick={() => requestDocChanges(item.student, item.serviceId, item.serviceTitle, item.doc.label, item.doc.id)} className="rounded-lg border border-slate-300 px-3 py-1 text-xs">Request changes</button>
                      </div>
                    </div>
                  ))}
                  {!documentTargetItems.length && <p className="text-sm text-slate-500">No documents found for this student.</p>}
                </div>
              </div>
            </div>
          )}

          {activityTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 md:p-5">
              <div className="flex max-h-[86vh] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-2xl md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Student Activity</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">{activityTarget.name || activityTarget.email}</h2>
                    <p className="text-sm text-slate-500">{activityTarget.email}</p>
                  </div>
                  <button onClick={() => setActivityTarget(null)} className="rounded-lg border border-stone-300 px-3 py-1 text-sm text-slate-600">Close</button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
                    <p className="font-semibold text-slate-900">Student summary</p>
                    <p className="mt-2 text-slate-600">Phone: {activityTarget.phone || 'Not provided'}</p>
                    <p className="text-slate-600">Preference: {activityTarget.universityPreference}</p>
                    <p className="text-slate-600">Status: {activityTarget.status.replace('_', ' ')}</p>
                    <p className="text-slate-600">Created: {new Date(activityTarget.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
                    <p className="font-semibold text-slate-900">Activity snapshot</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                        Unread {activityTargetItems.filter((item) => !activityReadMap[activityTarget.uid] || item.createdAt > activityReadMap[activityTarget.uid]).length}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        Read {activityTargetItems.filter((item) => activityReadMap[activityTarget.uid] && item.createdAt <= activityReadMap[activityTarget.uid]).length}
                      </span>
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">Timeline {activityTargetItems.filter((item) => item.type === 'system').length}</span>
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">Bookings {activityTargetItems.filter((item) => item.type === 'booking').length}</span>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">Webinars {activityTargetItems.filter((item) => item.type === 'webinar').length}</span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Orders {activityTargetItems.filter((item) => item.type === 'order').length}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex-1 overflow-y-auto pr-1">
                  <div className="rounded-xl border border-stone-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">All activity items</p>
                      <span className="text-xs text-slate-500">{activityTargetItems.length} items</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {activityTargetItems.length ? activityTargetItems.map((item) => {
                        const isUnread = !activityReadMap[activityTarget.uid] || item.createdAt > activityReadMap[activityTarget.uid];
                        return (
                          <div key={item.id} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-3 text-sm">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-slate-900">{item.title}</p>
                                <p className="mt-1 text-xs text-slate-600">{item.subtitle}</p>
                                <p className="mt-1 text-[11px] text-slate-500">{item.type} | {new Date(item.createdAt).toLocaleString()}</p>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isUnread ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                                {isUnread ? 'Unread' : 'Read'}
                              </span>
                            </div>
                          </div>
                        );
                      }) : <p className="text-sm text-slate-500">No activity found for this student.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

