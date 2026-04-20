import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, CalendarDays, CheckCircle2, FileText, Filter, GraduationCap, LayoutDashboard, LifeBuoy, LogOut, MessageCircle, Search, ShoppingBag, Upload, UserCircle2, Video } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { addStudentDocumentLink, ensureStudentProfile, patchStudentProfile, subscribeToStudentProfile, updateStudentService, type StudentProfile } from '@/lib/studentStore';
import { DB_PATHS } from '@/lib/dbPaths';
import { serviceStatusLabels, type ServiceStatus } from '@/lib/serviceCatalog';
import type { OrderRecord } from '@/lib/orderStore';
import { subscribeToBlogPosts, type BlogPost } from '@/lib/blogStore';
import { useSeo } from '@/lib/useSeo';
import { subscribeToUniversities, type UniversityItem } from '@/lib/siteContentStore';
import { subscribeToPricingPlans, type PricingPlan } from '@/lib/pricingStore';
import { subscribeToWebinarCatalog, type WebinarCatalogItem } from '@/lib/webinarCatalogStore';
import { subscribeToStudentDeadlines, type StudentDeadlineItem } from '@/lib/studentDeadlineStore';
import { markStudentNotificationRead, subscribeToStudentNotifications, type StudentNotification } from '@/lib/notificationStore';
import { getResourceCatalogItem } from '@/lib/resourceCatalog';
import { subscribeToResourceCatalog, type ResourcePackage } from '@/lib/resourceCatalogStore';

interface BookingItem { id: string; preferredDate: string; preferredTime: string; createdAt: string; status: string; email?: string; studentEmail?: string }
interface WebinarRegistration {
  id: string;
  webinarId: string;
  webinarTitle?: string;
  createdAt: string;
  status: string;
  email?: string;
  studentEmail?: string;
  webinarAccessType?: 'free' | 'paid';
  orderId?: string | null;
  userId?: string | null;
}

type Section = 'overview' | 'journey' | 'universities' | 'applications' | 'documents' | 'blogs' | 'webinars' | 'mentor' | 'resources' | 'profile';
type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  section: Section;
  type: 'task' | 'deadline' | 'document' | 'blog' | 'webinar' | 'application' | 'resource' | 'university' | 'notification';
  webinarId?: string | null;
};

const toArray = <T extends { id?: string }>(snapshot: Parameters<Parameters<typeof onValue>[1]>[0]) => {
  const value = (snapshot.val() || {}) as Record<string, T>;
  return Object.entries(value).map(([id, item]) => ({ id, ...item })) as Array<T & { id: string }>;
};

const journeyStages = ['Profile Setup', 'University Shortlist', 'Exams + APS', 'SOP/LOR', 'Applications', 'Visa + Finance', 'Pre-departure'];

const statusTone = (status: string) => {
  if (status === 'completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'in-progress' || status === 'submitted') return 'bg-teal-50 text-teal-700 border-teal-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const documentStatusTone = (status: 'submitted' | 'reviewed' | 'rejected') => {
  if (status === 'reviewed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'rejected') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
};

const documentStatusLabel = (status: 'submitted' | 'reviewed' | 'rejected') => {
  if (status === 'reviewed') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  return 'Under review';
};

const serviceProgressWeight: Record<ServiceStatus, number> = {
  'not-started': 0,
  'in-progress': 0.35,
  'documents-received': 0.55,
  submitted: 0.8,
  completed: 1,
};

const dedupeById = <T extends { id: string }>(items: T[]) =>
  Array.from(new Map(items.map((item) => [item.id, item])).values());

const getNotificationTarget = (item: Pick<StudentNotification, 'title' | 'message' | 'type'>): Section | null => {
  const content = `${item.title} ${item.message}`.toLowerCase();
  if (item.type === 'deadline' || content.includes('deadline')) return 'overview';
  if (content.includes('webinar')) return 'webinars';
  if (content.includes('blog')) return 'blogs';
  if (content.includes('document')) return 'documents';
  if (content.includes('application')) return 'applications';
  return null;
};

const highlightText = (text: string, queryText: string) => {
  if (!queryText.trim()) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = queryText.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);
  if (matchIndex === -1) return text;
  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + queryText.length);
  const after = text.slice(matchIndex + queryText.length);
  return (
    <>
      {before}
      <mark className="rounded bg-amber-100 px-0.5 text-slate-900">{match}</mark>
      {after}
    </>
  );
};

export default function StudentDashboardPage() {
  useSeo({ title: 'Student Dashboard | BVF Germany', description: 'Track your Germany journey progress, docs, webinars, and mentor support.', noindex: true });
  const { user, loading, studentApproved, studentStatus } = useAuth();
  const navigate = useNavigate();

  const [section, setSection] = useState<Section>('overview');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [allServices, setAllServices] = useState<StudentProfile['services']>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [adminDeadlines, setAdminDeadlines] = useState<StudentDeadlineItem[]>([]);
  const [webinars, setWebinars] = useState<WebinarRegistration[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [webinarCatalog, setWebinarCatalog] = useState<WebinarCatalogItem[]>([]);
  const [resourceCatalog, setResourceCatalog] = useState<ResourcePackage[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [applicationFilter, setApplicationFilter] = useState({ title: '', stage: '' });
  const [docForm, setDocForm] = useState({ serviceId: '', label: '', url: '' });
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [uniFilters, setUniFilters] = useState({ course: '', type: '', intake: '', tuition: '', status: '' });
  const [previousApproval, setPreviousApproval] = useState<boolean | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'webinar'>('all');
  const [webinarViewFilter, setWebinarViewFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedWebinarId, setSelectedWebinarId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToBlogPosts((items) => setBlogs(items.filter((p) => p.published).slice(0, 12)));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToUniversities((items) => {
      setUniversities(items.filter((item) => item.published));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const stopPlans = subscribeToPricingPlans((items) => setPlans(items.filter((plan) => plan.published).sort((a, b) => a.sortOrder - b.sortOrder)));
    const stopCatalog = subscribeToWebinarCatalog((items) =>
      setWebinarCatalog(items.sort((a, b) => a.scheduleAt.localeCompare(b.scheduleAt))),
    );
    const stopResources = subscribeToResourceCatalog((items) =>
      setResourceCatalog(items.filter((item) => item.published).sort((a, b) => a.sortOrder - b.sortOrder)),
    );
    return () => {
      stopPlans();
      stopCatalog();
      stopResources();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const email = user.email ?? '';
    void ensureStudentProfile({ uid: user.uid, email, name: user.displayName ?? email });
    const stopProfile = subscribeToStudentProfile(user.uid, (student) => {
      setProfile(student);
      setAllServices(student?.services || []);
    });
    const stopDeadlines = subscribeToStudentDeadlines({ userId: user.uid, email }, setAdminDeadlines);
    const stopNotifications = subscribeToStudentNotifications(user.uid, setNotifications);

    const qBookings1 = query(ref(db, DB_PATHS.bookings), orderByChild('studentEmail'), equalTo(email));
    const qBookings2 = query(ref(db, DB_PATHS.bookings), orderByChild('email'), equalTo(email));
    const qWeb1 = query(ref(db, DB_PATHS.webinarRegistrations), orderByChild('studentEmail'), equalTo(email));
    const qWeb2 = query(ref(db, DB_PATHS.webinarRegistrations), orderByChild('email'), equalTo(email));
    const qOrders = query(ref(db, DB_PATHS.orders), orderByChild('email'), equalTo(email));

    let b1: BookingItem[] = []; let b2: BookingItem[] = []; let w1: WebinarRegistration[] = []; let w2: WebinarRegistration[] = [];
    const syncB = () => setBookings(dedupeById([...b1, ...b2]).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    const syncW = () => setWebinars(dedupeById([...w1, ...w2]).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));

    const s1 = onValue(qBookings1, (snap) => { b1 = toArray<BookingItem>(snap); syncB(); });
    const s2 = onValue(qBookings2, (snap) => { b2 = toArray<BookingItem>(snap); syncB(); });
    const s3 = onValue(qWeb1, (snap) => { w1 = toArray<WebinarRegistration>(snap); syncW(); });
    const s4 = onValue(qWeb2, (snap) => { w2 = toArray<WebinarRegistration>(snap); syncW(); });
    const s5 = onValue(qOrders, (snap) => setOrders(toArray<OrderRecord>(snap).sort((a, b) => b.createdAt.localeCompare(a.createdAt))));

    return () => { stopProfile(); stopDeadlines(); stopNotifications(); s1(); s2(); s3(); s4(); s5(); };
  }, [user]);

  const services = useMemo(() => allServices.filter((s) => s.enrolled), [allServices]);
  const completion = useMemo(() => {
    if (!profile) return 0;
    const totalServices = profile.services.length || 1;
    const serviceProgress = profile.services.reduce((sum, service) => {
      const docProgress = service.requiredDocuments.length
        ? Math.min(service.documentLinks.length / service.requiredDocuments.length, 1) * 0.2
        : 0;
      const baseProgress = service.enrolled ? 0.1 : 0;
      return sum + Math.min(1, serviceProgressWeight[service.status] + baseProgress + docProgress);
    }, 0);
    const profileFields = [
      profile.name?.trim(),
      profile.email?.trim(),
      profile.phone?.trim(),
      profile.universityPreference?.trim(),
    ];
    const profileProgress = profileFields.filter(Boolean).length / profileFields.length;
    const verificationProgress = profile.isApproved ? 1 : 0.35;
    const combinedProgress = (serviceProgress / totalServices) * 0.75 + profileProgress * 0.15 + verificationProgress * 0.1;
    return Math.max(4, Math.min(100, Math.round(combinedProgress * 100)));
  }, [profile]);

  const pendingDocs = useMemo(
    () => services.reduce((sum, service) => sum + Math.max(service.requiredDocuments.length - service.documentLinks.length, 0), 0),
    [services],
  );

  const currentStageIndex = useMemo(() => {
    const activeIndex = allServices.reduce((currentMax, service, index) => {
      if (service.enrolled || service.status !== 'not-started' || service.documentLinks.length > 0) {
        return Math.max(currentMax, Math.min(index, journeyStages.length - 1));
      }
      return currentMax;
    }, studentApproved ? 0 : -1);
    if (activeIndex >= 0) return activeIndex;
    return Math.min(journeyStages.length - 1, Math.max(0, Math.floor((completion / 100) * journeyStages.length)));
  }, [allServices, completion, studentApproved]);

  const completedServiceCount = services.filter((service) => service.status === 'completed').length;

  const todayFocus = useMemo(() => {
    const focus: Array<{ id: string; label: string; action: Section }> = [];
    if (!studentApproved) {
      focus.push({ id: 'approval', label: 'Complete and verify your profile details', action: 'profile' });
    }
    if (pendingDocs > 0) {
      focus.push({ id: 'docs', label: `Upload or resubmit ${pendingDocs} pending documents`, action: 'documents' });
    }
    if (!services.length) {
      focus.push({ id: 'apps-start', label: 'Start your first application from service enrollment', action: 'applications' });
    } else if (services.some((service) => service.status !== 'completed')) {
      focus.push({ id: 'apps-progress', label: 'Move at least one application to submitted stage', action: 'applications' });
    }
    if (!webinars.length && webinarCatalog.some((item) => item.status === 'upcoming' || item.status === 'live')) {
      focus.push({ id: 'webinar', label: 'Register for an upcoming guidance webinar', action: 'webinars' });
    }
    if (!bookings.length) {
      focus.push({ id: 'booking', label: 'Book a counseling session for your next milestone', action: 'mentor' });
    }
    return focus.slice(0, 3);
  }, [bookings.length, pendingDocs, services, studentApproved, webinarCatalog, webinars.length]);

  const normalizedSearch = search.trim().toLowerCase();

  const recommendedBlogs = useMemo(() => {
    const stageTerms = ['profile', 'university', 'ielts', 'sop', 'application', 'visa', 'departure'][currentStageIndex] ?? '';
    const ranked = [...blogs].sort((a, b) => {
      const aScore = Number(a.category.toLowerCase().includes(stageTerms) || a.title.toLowerCase().includes(stageTerms));
      const bScore = Number(b.category.toLowerCase().includes(stageTerms) || b.title.toLowerCase().includes(stageTerms));
      return bScore - aScore || b.popularity - a.popularity;
    });
    return ranked.slice(0, 3);
  }, [blogs, currentStageIndex]);

  const filteredBlogs = useMemo(() => {
    if (!normalizedSearch) return blogs;
    return blogs.filter((blog) =>
      [blog.title, blog.category, blog.excerpt, blog.author, blog.slug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
    );
  }, [blogs, normalizedSearch]);

  const upcomingCatalogWebinars = useMemo(
    () =>
      webinarCatalog
        .filter((item) => item.status === 'upcoming' || item.status === 'live')
        .sort((a, b) => a.scheduleAt.localeCompare(b.scheduleAt)),
    [webinarCatalog],
  );

  const studentRegisteredIds = useMemo(() => new Set(webinars.map((item) => item.webinarId)), [webinars]);
  const recommendedCatalogWebinars = useMemo(
    () => upcomingCatalogWebinars.filter((item) => !studentRegisteredIds.has(item.id)).slice(0, 3),
    [upcomingCatalogWebinars, studentRegisteredIds],
  );

  const filteredRecommendedCatalogWebinars = useMemo(() => {
    if (!normalizedSearch) return recommendedCatalogWebinars;
    return recommendedCatalogWebinars.filter((item) =>
      [item.title, item.topic, item.speaker, item.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
    );
  }, [normalizedSearch, recommendedCatalogWebinars]);

  const needsReupload = useMemo(
    () => profile?.adminNotes.filter((note) => note.message.toLowerCase().includes('changes requested')).length ?? 0,
    [profile],
  );

  const filteredUniversities = useMemo(() => {
    const normalized = {
      course: uniFilters.course.trim().toLowerCase(),
      type: uniFilters.type.trim().toLowerCase(),
      intake: uniFilters.intake.trim().toLowerCase(),
      tuition: uniFilters.tuition.trim().toLowerCase(),
      status: uniFilters.status.trim().toLowerCase(),
      search: search.trim().toLowerCase(),
    };

    return universities.filter((uni) => {
      const haystack = `${uni.name} ${uni.category} ${uni.location} ${uni.tuition} ${uni.programs.join(' ')}`.toLowerCase();
      if (normalized.search && !haystack.includes(normalized.search)) return false;
      if (normalized.course && !uni.programs.some((program) => program.toLowerCase().includes(normalized.course))) return false;
      if (normalized.type && !uni.category.toLowerCase().includes(normalized.type)) return false;
      if (normalized.intake && !uni.description.toLowerCase().includes(normalized.intake) && !uni.location.toLowerCase().includes(normalized.intake)) return false;
      if (normalized.tuition && !uni.tuition.toLowerCase().includes(normalized.tuition)) return false;
      if (normalized.status) {
        const linkedService = services.find((service) => service.title.toLowerCase().includes('application') || service.title.toLowerCase().includes('university'));
        const statusLabel = linkedService ? serviceStatusLabels[linkedService.status].toLowerCase() : 'not-started';
        if (!statusLabel.includes(normalized.status)) return false;
      }
      return true;
    });
  }, [search, services, uniFilters, universities]);

  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      if (applicationFilter.title && !service.title.toLowerCase().includes(applicationFilter.title.toLowerCase())) return false;
      if (normalizedSearch) {
        const haystack = [
          service.title,
          service.adminNote,
          service.requiredDocuments.join(' '),
          ...service.documentLinks.map((doc) => `${doc.label} ${doc.url} ${doc.status}`),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(normalizedSearch)) return false;
      }
      if (applicationFilter.stage && serviceStatusLabels[service.status].toLowerCase() !== applicationFilter.stage.toLowerCase()) return false;
      return true;
    });
  }, [allServices, applicationFilter.stage, applicationFilter.title, normalizedSearch]);

  const timelineUpdates = useMemo(
    () => profile?.timeline?.slice(0, 8) || [],
    [profile],
  );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const dashboardDeadlines = useMemo(() => {
    const bookingItems = bookings.map((booking) => ({
      id: `booking-${booking.id}`,
      title: 'Consultation deadline',
      dueDate: booking.preferredDate,
      dueTime: booking.preferredTime,
      note: booking.status,
      source: 'booking' as const,
    }));
    const adminItems = adminDeadlines.map((deadline) => ({
      id: `admin-${deadline.id}`,
      title: deadline.title,
      dueDate: deadline.dueDate,
      dueTime: deadline.dueTime || '',
      note: deadline.note || 'Admin update',
      source: 'admin' as const,
      status: deadline.status,
      rawId: deadline.id,
    }));
    return [...bookingItems, ...adminItems].sort((a, b) => `${a.dueDate}${a.dueTime}`.localeCompare(`${b.dueDate}${b.dueTime}`));
  }, [adminDeadlines, bookings]);

  const calendarDays = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ day: number; key: string; hasDeadline: boolean; deadlines: typeof dashboardDeadlines }> = [];
    for (let i = 0; i < firstDay; i += 1) cells.push({ day: 0, key: `empty-${i}`, hasDeadline: false, deadlines: [] });
    for (let day = 1; day <= daysInMonth; day += 1) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const deadlineItems = dashboardDeadlines.filter((item) => item.dueDate === iso);
      const hasDeadline = deadlineItems.length > 0;
      cells.push({ day, key: iso, hasDeadline, deadlines: deadlineItems });
    }
    return cells;
  }, [dashboardDeadlines]);

  const visibleNotifications = useMemo(() => {
    if (notifications.length) return notifications.slice(0, 8);
    return timelineUpdates.slice(0, 8).map((item) => ({
      id: item.id,
      userId: profile?.uid || user.uid,
      title: item.title,
      message: item.description,
      type: 'system' as const,
      read: true,
      createdAt: item.createdAt,
    }));
  }, [notifications, profile?.uid, timelineUpdates, user.uid]);

  const filteredVisibleNotifications = useMemo(
    () =>
      visibleNotifications.filter((item) => {
        if (notificationFilter !== 'all' && getNotificationTarget(item) !== 'webinars') return false;
        if (!normalizedSearch) return true;
        return [item.title, item.message, item.type]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch));
      }),
    [normalizedSearch, notificationFilter, visibleNotifications],
  );

  const filteredStudentWebinars = useMemo(
    () =>
      webinars.filter((item) => {
        if (webinarViewFilter === 'all') return true;
        const catalogItem = webinarCatalog.find((catalog) => catalog.id === item.webinarId);
        const accessType = item.webinarAccessType || catalogItem?.accessType || 'free';
        return accessType === webinarViewFilter;
      }),
    [webinarCatalog, webinarViewFilter, webinars],
  );

  const searchedStudentWebinars = useMemo(() => {
    if (!normalizedSearch) return filteredStudentWebinars;
    return filteredStudentWebinars.filter((item) => {
      const catalogItem = webinarCatalog.find((catalog) => catalog.id === item.webinarId);
      return [
        item.webinarTitle,
        item.webinarId,
        item.webinarAccessType,
        catalogItem?.title,
        catalogItem?.topic,
        catalogItem?.speaker,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    });
  }, [filteredStudentWebinars, normalizedSearch, webinarCatalog]);

  const filteredDashboardDeadlines = useMemo(() => {
    if (!normalizedSearch) return dashboardDeadlines;
    return dashboardDeadlines.filter((item) =>
      [item.title, item.note, item.dueDate, item.dueTime]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
    );
  }, [dashboardDeadlines, normalizedSearch]);

  const filteredTodayFocus = useMemo(() => {
    if (!normalizedSearch) return todayFocus;
    return todayFocus.filter((item) => item.label.toLowerCase().includes(normalizedSearch));
  }, [normalizedSearch, todayFocus]);

  const filteredPlans = useMemo(() => {
    if (!normalizedSearch) return plans;
    return plans.filter((plan) =>
      [plan.name, plan.description, plan.price, plan.billing]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
    );
  }, [normalizedSearch, plans]);

  const filteredOrders = useMemo(() => {
    if (!normalizedSearch) return orders;
    return orders.filter((order) =>
      [order.title, order.amountLabel, order.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
    );
  }, [normalizedSearch, orders]);

  const filteredResourceOrders = useMemo(
    () => filteredOrders.filter((order) => order.itemType === 'plan'),
    [filteredOrders],
  );
  const resourceById = useMemo(
    () => new Map(resourceCatalog.map((item) => [item.id, item])),
    [resourceCatalog],
  );

  const filteredJourneyServices = useMemo(() => {
    if (!normalizedSearch) return services;
    return services.filter((service) =>
      [service.title, service.adminNote, service.requiredDocuments.join(' ')]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
    );
  }, [normalizedSearch, services]);

  const getNotificationWebinarId = useCallback((item: Pick<StudentNotification, 'title' | 'message'>) => {
    const content = `${item.title} ${item.message}`.toLowerCase();
    const catalogMatch = webinarCatalog.find((webinar) =>
      [webinar.title, webinar.topic, webinar.speaker]
        .filter(Boolean)
        .some((value) => content.includes(String(value).toLowerCase())),
    );
    if (catalogMatch) return catalogMatch.id;

    const registrationMatch = webinars.find((webinar) =>
      [webinar.webinarTitle, webinar.webinarId]
        .filter(Boolean)
        .some((value) => content.includes(String(value).toLowerCase())),
    );
    return registrationMatch?.webinarId ?? null;
  }, [webinarCatalog, webinars]);

  const markVisibleNotificationsRead = async () => {
    const unread = notifications.filter((item) => !item.read).slice(0, 8);
    await Promise.all(unread.map((item) => markStudentNotificationRead(item.id)));
  };

  const studentSearchResults = useMemo<SearchResult[]>(() => {
    if (!normalizedSearch) return [];

    const results: SearchResult[] = [];

    filteredTodayFocus.forEach((item) => {
      results.push({
        id: `task-${item.id}`,
        title: item.label,
        subtitle: 'Today focus',
        section: item.action,
        type: 'task',
      });
    });

    filteredDashboardDeadlines.slice(0, 5).forEach((item) => {
      results.push({
        id: item.id,
        title: item.title,
        subtitle: `${item.dueDate}${item.dueTime ? ` ${item.dueTime}` : ''}`,
        section: 'overview',
        type: 'deadline',
      });
    });

    filteredServices.slice(0, 5).forEach((service) => {
      results.push({
        id: service.id,
        title: service.title,
        subtitle: `Application | ${serviceStatusLabels[service.status]}`,
        section: 'applications',
        type: 'application',
      });
    });

    services.forEach((service) => {
      service.documentLinks
        .filter((doc) =>
          [doc.label, doc.url, doc.status, service.title]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
        )
        .slice(0, 2)
        .forEach((doc) => {
          results.push({
            id: doc.id,
            title: doc.label,
            subtitle: `${service.title} | ${documentStatusLabel(doc.status)}`,
            section: 'documents',
            type: 'document',
          });
        });
    });

    filteredBlogs.slice(0, 5).forEach((blog) => {
      results.push({
        id: blog.id,
        title: blog.title,
        subtitle: `${blog.category} | ${blog.readTime}`,
        section: 'blogs',
        type: 'blog',
      });
    });

    searchedStudentWebinars.slice(0, 5).forEach((webinar) => {
      results.push({
        id: webinar.id,
        title: webinar.webinarTitle || webinar.webinarId,
        subtitle: 'Registered webinar',
        section: 'webinars',
        type: 'webinar',
        webinarId: webinar.webinarId,
      });
    });

    filteredRecommendedCatalogWebinars.slice(0, 5).forEach((webinar) => {
      results.push({
        id: webinar.id,
        title: webinar.title,
        subtitle: webinar.accessType === 'paid' ? `Paid | INR ${webinar.priceValue}` : 'Free webinar',
        section: 'webinars',
        type: 'webinar',
        webinarId: webinar.id,
      });
    });

    filteredUniversities.slice(0, 5).forEach((university) => {
      results.push({
        id: university.id,
        title: university.name,
        subtitle: `${university.category} | ${university.location}`,
        section: 'universities',
        type: 'university',
      });
    });

    filteredVisibleNotifications.slice(0, 4).forEach((item) => {
      const target = getNotificationTarget(item) || 'overview';
      results.push({
        id: item.id,
        title: item.title,
        subtitle: item.message,
        section: target,
        type: 'notification',
        webinarId: target === 'webinars' ? getNotificationWebinarId(item) : null,
      });
    });

    filteredPlans.slice(0, 4).forEach((plan) => {
      results.push({
        id: plan.id,
        title: plan.name,
        subtitle: `${plan.price} | ${plan.billing}`,
        section: 'resources',
        type: 'resource',
      });
    });

    filteredOrders.slice(0, 4).forEach((order) => {
      results.push({
        id: order.id,
        title: order.title,
        subtitle: `${order.amountLabel} | ${order.status}`,
        section: 'resources',
        type: 'resource',
      });
    });

    return dedupeById(results).slice(0, 10);
  }, [
    filteredBlogs,
    filteredDashboardDeadlines,
    filteredOrders,
    filteredPlans,
    filteredRecommendedCatalogWebinars,
    filteredServices,
    filteredTodayFocus,
    filteredUniversities,
    filteredVisibleNotifications,
    getNotificationWebinarId,
    normalizedSearch,
    searchedStudentWebinars,
    services,
  ]);

  useEffect(() => {
    if (!profile) return;
    if (previousApproval === null) {
      setPreviousApproval(profile.isApproved);
      return;
    }
    if (previousApproval !== profile.isApproved) {
      setNotice(profile.isApproved ? 'Your account has been verified by admin.' : 'Your verification status changed. Please check with support.');
      setPreviousApproval(profile.isApproved);
    }
  }, [previousApproval, profile]);

  useEffect(() => {
    const unreadAccountNotice = notifications.find((item) => !item.read && item.type === 'account');
    if (!unreadAccountNotice) return;
    setNotice(unreadAccountNotice.message);
    void markStudentNotificationRead(unreadAccountNotice.id);
  }, [notifications]);

  useEffect(() => {
    if (!searchOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!searchWrapperRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingField =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (event.key === '/' && !isTypingField) {
        event.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(Boolean(search.trim()));
      }

      if (event.key === 'Escape') {
        setSearchOpen(false);
        setCalendarOpen(false);
        setNotificationsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [search]);


  if (loading) return <div className="min-h-screen bg-slate-50" />;
  if (!user) return <Navigate to="/login" replace />;
  if (studentStatus && studentStatus !== 'approved') {
    return <Navigate to="/login" replace state={{ requiresApproval: true, studentStatus }} />;
  }

  const onLogout = async () => { await signOut(auth); navigate('/'); };
  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); if (!profile) return;
    await patchStudentProfile(
      profile.uid,
      { name: profile.name, phone: profile.phone, universityPreference: profile.universityPreference, profilePhoto: profile.profilePhoto },
      {
        id: crypto.randomUUID(),
        title: 'Profile updated',
        description: 'Student updated personal/profile details from dashboard.',
        createdAt: new Date().toISOString(),
        type: 'profile',
      },
    );
    setNotice('Profile updated successfully.');
  };
  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault(); if (!profile || !docForm.serviceId || !docForm.label || !docForm.url) return;
    const service = allServices.find((item) => item.id === docForm.serviceId);
    if (service && !service.enrolled) {
      await updateStudentService(profile.uid, service.id, { enrolled: true, status: service.status === 'not-started' ? 'in-progress' : service.status });
    }
    await addStudentDocumentLink(profile.uid, docForm.serviceId, { label: docForm.label, url: docForm.url });
    setDocForm({ serviceId: '', label: '', url: '' }); setNotice('Document uploaded for review.');
  };

  const applyForService = async (serviceId: string) => {
    if (!profile) return;
    await updateStudentService(profile.uid, serviceId, { enrolled: true, status: 'in-progress' });
    setNotice('Application stage started for selected service.');
  };

  const updateServiceStage = async (serviceId: string, status: ServiceStatus) => {
    if (!profile) return;
    await updateStudentService(profile.uid, serviceId, { status, enrolled: true });
    setNotice(`Service moved to ${serviceStatusLabels[status]}.`);
  };

  const nav = [
    ['overview', 'Overview', LayoutDashboard], ['journey', 'My Journey', LayoutDashboard], ['universities', 'Universities', GraduationCap], ['applications', 'Applications', LayoutDashboard],
    ['documents', 'Documents', FileText], ['blogs', 'Blogs', BookOpen], ['webinars', 'Webinars', Video], ['mentor', 'Mentor Chat', MessageCircle], ['resources', 'Resources', ShoppingBag], ['profile', 'Profile', UserCircle2],
  ] as const;

  const stageToSection: Section[] = ['profile', 'universities', 'documents', 'documents', 'applications', 'documents', 'overview'];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-slate-200 bg-white p-4 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Student Dashboard</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.name || user.email}</p>
          <p className="text-xs text-slate-500">{studentApproved ? 'Verified' : 'Pending approval'}</p>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {nav.map(([key, label, Icon]) => <button key={key} onClick={() => setSection(key as Section)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm lg:w-full ${section === key ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-100'}`}><Icon className="h-4 w-4" />{label}</button>)}
          </nav>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"><LogOut className="h-4 w-4" />Logout</button>
          </div>
        </aside>

        <main className="flex-1 space-y-6 p-4 md:p-6 lg:h-screen lg:overflow-y-auto">
          <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{section === 'overview' ? 'Student Overview' : section.charAt(0).toUpperCase() + section.slice(1)}</h1>
              <p className="text-sm text-slate-500">Your Germany journey workspace with priorities, actions, and context.</p>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
              <div ref={searchWrapperRef} className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSearchOpen(Boolean(e.target.value.trim()));
                  }}
                  onFocus={() => setSearchOpen(Boolean(search.trim()))}
                  placeholder="Search tasks, docs, webinars"
                  className="w-full rounded-lg border border-stone-300 bg-stone-50 py-2 pl-9 pr-3 text-sm"
                />
                {searchOpen && (
                  <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
                    <div className="border-b border-stone-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Search Results</div>
                    <div className="max-h-80 overflow-y-auto p-2">
                      {studentSearchResults.length ? (
                        <div className="space-y-1">
                          {studentSearchResults.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSection(item.section);
                                setSearchOpen(false);
                                setCalendarOpen(item.type === 'deadline');
                                setNotificationsOpen(false);
                                setSelectedWebinarId(item.section === 'webinars' ? item.webinarId || null : null);
                              }}
                              className="flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-teal-50"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">{highlightText(item.title, search)}</p>
                                <p className="truncate text-xs text-slate-500">{highlightText(item.subtitle, search)}</p>
                              </div>
                              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">{item.type}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="px-3 py-4 text-sm text-slate-500">No student dashboard results found for this search.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarOpen((current) => !current);
                    setNotificationsOpen(false);
                    setSearchOpen(false);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-2 text-xs text-slate-700"
                >
                  <CalendarDays className="h-4 w-4 text-amber-600" />
                  {dashboardDeadlines.length} deadlines
                </button>
                {calendarOpen && (
                  <div className="absolute left-0 right-0 z-30 mt-2 w-auto rounded-2xl border border-stone-200 bg-white p-4 shadow-xl sm:left-auto sm:right-0 sm:w-[320px]">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Deadline calendar</p>
                        <p className="text-xs text-slate-500">{today.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
                      </div>
                      <button type="button" onClick={() => setCalendarOpen(false)} className="text-xs font-semibold text-slate-500">Close</button>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => <div key={label}>{label}</div>)}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px]">
                      {calendarDays.map((cell) => (
                        <div key={cell.key} className="relative">
                          <div
                            title={cell.deadlines.map((item) => item.title).join(', ')}
                            className={`group flex h-9 items-center justify-center rounded-md ${
                              cell.day === 0
                                ? 'opacity-0'
                                : cell.hasDeadline
                                  ? 'cursor-pointer bg-teal-100 font-semibold text-teal-700'
                                  : 'bg-stone-100 text-slate-500'
                            }`}
                          >
                            {cell.day || '.'}
                            {cell.hasDeadline ? <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-teal-700" /> : null}
                            {cell.hasDeadline ? (
                              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-40 -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1.5 text-left text-[10px] text-white shadow-lg group-hover:block">
                                {cell.deadlines.map((item) => (
                                  <p key={item.id} className="truncate">{item.title}</p>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2">
                      {dashboardDeadlines.length ? dashboardDeadlines.slice(0, 4).map((item) => (
                        <div key={item.id} className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                          <p className="font-semibold">{item.title}</p>
                          <p>{item.dueDate}{item.dueTime ? ` ${item.dueTime}` : ''}</p>
                        </div>
                      )) : <p className="text-sm text-slate-500">No immediate deadlines. Admin can assign deadlines.</p>}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen((current) => !current);
                    setCalendarOpen(false);
                    setSearchOpen(false);
                    void markVisibleNotificationsRead();
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-2 text-xs text-slate-700"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotificationsCount || visibleNotifications.length} updates
                </button>
                {notificationsOpen && (
                  <div className="absolute left-0 right-0 z-30 mt-2 w-auto rounded-2xl border border-stone-200 bg-white p-4 shadow-xl sm:left-auto sm:right-0 sm:w-[340px]">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Notifications</p>
                        <p className="text-xs text-slate-500">{unreadNotificationsCount} unread</p>
                      </div>
                      <button type="button" onClick={() => setNotificationsOpen(false)} className="text-xs font-semibold text-slate-500">Close</button>
                    </div>
                    <div className="mt-3 flex gap-2 text-xs">
                      <button type="button" onClick={() => setNotificationFilter('all')} className={`rounded-full px-3 py-1 ${notificationFilter === 'all' ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-slate-600'}`}>All</button>
                      <button type="button" onClick={() => setNotificationFilter('webinar')} className={`rounded-full px-3 py-1 ${notificationFilter === 'webinar' ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-slate-600'}`}>Webinars</button>
                    </div>
                    <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
                      {filteredVisibleNotifications.length ? filteredVisibleNotifications.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            if ('read' in item && !item.read && notifications.some((notification) => notification.id === item.id)) {
                              void markStudentNotificationRead(item.id);
                            }
                            const target = getNotificationTarget(item);
                            if (target) {
                              if (target === 'webinars') {
                                setSelectedWebinarId(getNotificationWebinarId(item));
                              } else {
                                setSelectedWebinarId(null);
                              }
                              setSection(target);
                              setNotificationsOpen(false);
                            }
                          }}
                          className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                            item.read ? 'border-stone-200 bg-stone-50' : 'border-teal-200 bg-teal-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-slate-900">{item.title}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              item.read ? 'bg-slate-200 text-slate-600' : 'bg-teal-100 text-teal-700'
                            }`}>
                              {item.read ? 'Read' : 'Unread'}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{item.message}</p>
                          <p className="mt-1 text-[11px] text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                        </button>
                      )) : <p className="text-sm text-slate-500">No notifications found for this filter.</p>}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/bookings" className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white"><LifeBuoy className="h-4 w-4" />Book session</Link>
            </div>
          </div>

          {notice && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">{notice}</div>}

          {section === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-r from-teal-700 to-teal-600 p-6 text-white shadow-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-white/80">Student command center</p>
                <h2 className="mt-1 text-2xl font-semibold">Welcome, {profile?.name || 'Student'}</h2>
                <p className="mt-1 text-sm text-white/90">Current stage: {journeyStages[currentStageIndex]} | Profile: {studentApproved ? 'Verified' : 'Pending verification'}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setSection('journey')} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-teal-700">Continue journey</button>
                  <button onClick={() => setSection('documents')} className="rounded-lg border border-white/70 px-3 py-2 text-sm font-semibold text-white">Upload pending documents</button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  ['Journey completion', `${completion}%`, 'Across all milestones'],
                  ['Upcoming deadlines', dashboardDeadlines.length, 'Applications, docs, webinars'],
                  ['Documents pending', pendingDocs, 'Need upload/review'],
                  ['Webinars registered', webinars.length, 'Learning progress'],
                ].map(([label, value, hint]) => (
                  <div key={String(label)} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{String(label)}</p>
                    <p className="mt-1 text-3xl font-semibold text-slate-900">{String(value)}</p>
                    <p className="mt-1 text-xs text-slate-500">{String(hint)}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-900">Journey tracker</p><p className="text-xs text-slate-500">{completion}% complete</p></div>
                <div className="mt-3 h-2 rounded-full bg-stone-100"><div className="h-2 rounded-full bg-teal-600" style={{ width: `${Math.max(6, completion)}%` }} /></div>
                <div className="mt-3 grid gap-2 md:grid-cols-7">{journeyStages.map((stage, index) => <div key={stage} className={`rounded-lg border p-2 text-[11px] font-semibold ${index <= currentStageIndex ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-stone-200 bg-white text-slate-500'}`}>{stage}</div>)}</div>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-4 xl:col-span-6">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold">Today's focus</p>
                    <div className="mt-2 space-y-2 text-sm text-slate-700">
                      {filteredTodayFocus.length ? filteredTodayFocus.map((item) => (
                        <button key={item.id} onClick={() => setSection(item.action)} className="flex w-full items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 text-left hover:bg-teal-50">
                          <CheckCircle2 className="h-4 w-4 text-teal-700" />{item.label}
                        </button>
                      )) : <div className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">{normalizedSearch ? 'No focus items match this search.' : 'Everything is up to date for today.'}</div>}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold">Applications snapshot</p>
                    {services.length ? (
                      <div className="mt-3 overflow-x-auto">
                        <table className="min-w-[520px] w-full text-sm"><thead><tr className="text-left text-slate-500"><th>Application</th><th>Status</th><th>Missing docs</th></tr></thead><tbody>{filteredServices.slice(0, 4).map((s) => <tr key={s.id} className="border-t border-stone-100"><td className="py-2">{s.title}</td><td><span className={`rounded-full border px-2 py-0.5 text-xs ${statusTone(s.status)}`}>{serviceStatusLabels[s.status]}</span></td><td>{Math.max(s.requiredDocuments.length - s.documentLinks.length, 0)}</td></tr>)}</tbody></table>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-slate-600">{normalizedSearch ? 'No application items match this search.' : 'No active applications yet. Start by selecting universities and creating your first application.'}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-4 xl:col-span-3">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-sm font-semibold">Deadlines</p>{filteredDashboardDeadlines.length ? <div className="mt-2 space-y-2">{filteredDashboardDeadlines.slice(0, 4).map((item) => <div key={item.id} className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{item.dueDate} {item.dueTime ? ` ${item.dueTime}` : ''} - {item.title}</div>)}</div> : <p className="mt-2 text-sm text-slate-500">{normalizedSearch ? 'No deadlines match this search.' : 'No immediate deadlines. Admin can assign deadlines.'}</p>}<div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px]">{calendarDays.map((cell) => <div key={cell.key} className={`rounded px-1 py-1 ${cell.day === 0 ? 'opacity-0' : cell.hasDeadline ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-slate-500'}`}>{cell.day || '.'}</div>)}</div></div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-sm font-semibold">Latest mentor message</p><p className="mt-2 text-sm text-slate-600">{profile?.adminNotes[0]?.message || 'No latest message. Open mentor chat to ask a question.'}</p><button onClick={() => setSection('mentor')} className="mt-3 text-sm font-semibold text-teal-700">Open mentor support</button></div>
                </div>
                <div className="space-y-4 xl:col-span-3">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-sm font-semibold">Recommended blogs</p><div className="mt-2 space-y-2">{filteredBlogs.length ? filteredBlogs.slice(0, 3).map((b) => <Link key={b.id} to={`/blog/${b.slug}`} className="block rounded-lg bg-stone-50 p-2 text-sm"><div className="flex gap-3">{b.featuredImage ? <img src={b.featuredImage} alt={b.title} className="h-14 w-20 rounded-lg object-cover" /> : null}<div className="min-w-0"><p className="font-semibold text-slate-900">{b.title}</p><p className="text-xs text-teal-700">{b.category}</p></div></div></Link>) : <p className="text-sm text-slate-500">{normalizedSearch ? 'No blogs match this search.' : 'No published blogs available yet.'}</p>}</div></div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-sm font-semibold">Recommended webinars</p>{filteredRecommendedCatalogWebinars.length ? <div className="mt-2 space-y-2">{filteredRecommendedCatalogWebinars.map((w) => <div key={w.id} className="rounded-lg bg-stone-50 p-2 text-sm"><div className="flex gap-3">{w.imageUrl ? <img src={w.imageUrl} alt={w.title} className="h-14 w-20 rounded-lg object-cover" /> : null}<div className="min-w-0"><p className="font-semibold">{w.title}</p><p className="text-xs text-slate-500">{new Date(w.scheduleAt).toLocaleString()} | {w.speaker} | {w.accessType === 'paid' ? `INR ${w.priceValue}` : 'Free'}</p></div></div></div>)}</div> : <p className="mt-2 text-sm text-slate-500">{normalizedSearch ? 'No webinars match this search.' : 'No upcoming webinars available right now.'}</p>}</div>
                </div>
              </div>
            </div>
          )}

          {section === 'journey' && (
            <div className="space-y-4">
              {journeyStages
                .map((stage, originalIndex) => ({ stage, originalIndex }))
                .filter(({ stage, originalIndex }) => {
                  if (!normalizedSearch) return true;
                  const linkedService = allServices[originalIndex];
                  const haystack = `${stage} ${linkedService?.title || ''} ${linkedService?.requiredDocuments.join(' ') || ''}`.toLowerCase();
                  return haystack.includes(normalizedSearch);
                })
                .map(({ stage, originalIndex: index }) => (
                <div key={stage} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{stage}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${index <= currentStageIndex ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-stone-200 bg-slate-100 text-slate-600'}`}>
                      {index < currentStageIndex ? 'Completed' : index === currentStageIndex ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Required tasks</p>
                      <ul className="mt-1 list-disc pl-4 text-sm text-slate-700">
                        <li>{index <= currentStageIndex ? 'Keep progress moving for this milestone' : 'Prepare documents for this milestone'}</li>
                        <li>{allServices[index]?.requiredDocuments[0] ? `Primary required document: ${allServices[index]?.requiredDocuments[0]}` : 'Enroll relevant service to unlock checklist'}</li>
                      </ul>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {allServices[index] ? (
                          <>
                            {!allServices[index].enrolled ? (
                              <button onClick={() => void applyForService(allServices[index].id)} className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white">
                                Enroll service
                              </button>
                            ) : (
                              <button onClick={() => setSection(stageToSection[index])} className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                                Continue stage
                              </button>
                            )}
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Support links</p>
                      <p className="mt-1 text-sm text-slate-700">Related blog: {recommendedBlogs[index % Math.max(recommendedBlogs.length, 1)]?.title || 'No recommendation yet.'}</p>
                      <p className="text-sm text-slate-700">Related webinar: {upcomingCatalogWebinars[index % Math.max(upcomingCatalogWebinars.length, 1)]?.title || 'No webinar scheduled yet.'}</p>
                      <p className="text-sm text-slate-700">Mentor note: {profile?.adminNotes[0]?.message || 'No note yet.'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === 'universities' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="grid gap-2 md:grid-cols-6">
                  <input value={uniFilters.course} onChange={(e) => setUniFilters((prev) => ({ ...prev, course: e.target.value }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" placeholder="Course" />
                  <input value={uniFilters.type} onChange={(e) => setUniFilters((prev) => ({ ...prev, type: e.target.value }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" placeholder="Public/Private" />
                  <input value={uniFilters.intake} onChange={(e) => setUniFilters((prev) => ({ ...prev, intake: e.target.value }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" placeholder="Intake" />
                  <input value={uniFilters.tuition} onChange={(e) => setUniFilters((prev) => ({ ...prev, tuition: e.target.value }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" placeholder="Tuition range" />
                  <input value={uniFilters.status} onChange={(e) => setUniFilters((prev) => ({ ...prev, status: e.target.value }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" placeholder="Application status" />
                  <button onClick={() => setUniFilters({ course: '', type: '', intake: '', tuition: '', status: '' })} className="inline-flex items-center justify-center gap-1 rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-slate-700"><Filter className="h-4 w-4" />Clear</button>
                </div>
              </div>
              <div className="space-y-3">
                {filteredUniversities.length ? filteredUniversities.map((u, index) => (
                  <div key={u.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                    <div className="grid gap-2 md:grid-cols-7">
                      <div className="md:col-span-2"><p className="font-semibold">{u.name}</p><p className="text-xs text-slate-500">{u.category}</p></div>
                      <p className="text-sm">{u.programs[0] || 'Program details in profile'}</p>
                      <p className="text-sm">{u.tuition || 'Tuition info pending'}</p>
                      <p className="text-sm">{u.location}</p>
                      <p className="text-sm font-semibold text-teal-700">{92 - index * 4}% match</p>
                      <div className="flex gap-2">
                        <button onClick={() => setCompareIds((prev) => prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id])} className="rounded-lg border border-stone-300 px-2 py-1 text-xs">Compare</button>
                        <a href={u.website || '/universities'} target="_blank" rel="noreferrer" className="rounded-lg bg-teal-600 px-2 py-1 text-xs font-semibold text-white">Open</a>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-slate-600">
                    No university records match the selected filters.
                  </div>
                )}
              </div>
              {compareIds.length > 1 && <div className="rounded-2xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">Compare mode enabled for {compareIds.length} universities.</div>}
            </div>
          )}

          {section === 'applications' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Total services</p><p className="text-2xl font-semibold">{allServices.length}</p></div>
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Submitted</p><p className="text-2xl font-semibold">{allServices.filter((s) => s.status === 'submitted').length}</p></div>
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Pending docs</p><p className="text-2xl font-semibold">{pendingDocs}</p></div>
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Admits</p><p className="text-2xl font-semibold">{completedServiceCount}</p></div>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex flex-wrap gap-2">
                  <input value={applicationFilter.title} onChange={(e) => setApplicationFilter((prev) => ({ ...prev, title: e.target.value }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" placeholder="Filter by application/service" />
                  <select value={applicationFilter.stage} onChange={(e) => setApplicationFilter((prev) => ({ ...prev, stage: e.target.value }))} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
                    <option value="">All stages</option>
                    {Object.values(serviceStatusLabels).map((label) => <option key={label} value={label}>{label}</option>)}
                  </select>
                </div>
                {filteredServices.length ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-[720px] w-full text-sm"><thead><tr className="text-left text-slate-500"><th className="py-2">Application</th><th>Stage</th><th>Missing docs</th><th>Last updated</th><th>Next action</th></tr></thead><tbody>{filteredServices.map((s) => <tr key={s.id} className="border-t border-stone-100"><td className="py-2">{s.title}</td><td><span className={`rounded-full border px-2 py-0.5 text-xs ${statusTone(s.status)}`}>{serviceStatusLabels[s.status]}</span></td><td>{Math.max(s.requiredDocuments.length - s.documentLinks.length, 0)}</td><td>{new Date(s.updatedAt).toLocaleDateString()}</td><td><div className="flex flex-wrap gap-2">{!s.enrolled ? <button onClick={() => void applyForService(s.id)} className="rounded bg-teal-600 px-2 py-1 text-xs font-semibold text-white">Start application</button> : <button onClick={() => setSection('documents')} className="font-semibold text-teal-700">Manage docs</button>}<select value={s.status} onChange={(e) => void updateServiceStage(s.id, e.target.value as ServiceStatus)} className="rounded border border-stone-300 px-2 py-1 text-xs"><option value="not-started">Not Started</option><option value="in-progress">In Progress</option><option value="documents-received">Documents Received</option><option value="submitted">Submitted</option><option value="completed">Completed</option></select></div></td></tr>)}</tbody></table>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
                    <p className="text-sm font-semibold text-slate-900">No active applications yet</p>
                    <p className="mt-1 text-sm text-slate-600">Start with your university shortlist to generate your tracker.</p>
                    <Link to="/universities" className="mt-3 inline-flex rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white">Explore Universities</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {section === 'documents' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Completion</p><p className="text-2xl font-semibold">{completion}%</p></div>
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Approved</p><p className="text-2xl font-semibold">{services.reduce((sum, s) => sum + s.documentLinks.filter((d) => d.status === 'reviewed').length, 0)}</p></div>
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Pending</p><p className="text-2xl font-semibold">{services.reduce((sum, s) => sum + s.documentLinks.filter((d) => d.status === 'submitted').length, 0)}</p></div>
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Rejected</p><p className="text-2xl font-semibold">{services.reduce((sum, s) => sum + s.documentLinks.filter((d) => d.status === 'rejected').length, 0)}</p></div>
                <div className="rounded-xl border border-stone-200 bg-white p-3"><p className="text-xs text-slate-500">Needs reupload</p><p className="text-2xl font-semibold">{needsReupload}</p></div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h2 className="text-lg font-semibold">Upload center</h2>
                <form onSubmit={onUpload} className="mt-3 grid gap-2 md:grid-cols-2"><select value={docForm.serviceId} onChange={(e) => setDocForm((p) => ({ ...p, serviceId: e.target.value }))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="">Select service</option>{allServices.map((s) => <option key={s.id} value={s.id}>{s.title} {s.enrolled ? '' : '(Not enrolled)'}</option>)}</select><input value={docForm.label} onChange={(e) => setDocForm((p) => ({ ...p, label: e.target.value }))} placeholder="Document name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /><input value={docForm.url} onChange={(e) => setDocForm((p) => ({ ...p, url: e.target.value }))} placeholder="Document URL" className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" /><button className="inline-flex w-fit items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white"><Upload className="h-4 w-4" />Upload</button></form>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="space-y-2">{filteredServices.length ? filteredServices.map((s) => <div key={s.id} className="rounded-lg border border-slate-200 p-3"><p className="text-sm font-semibold">{s.title}</p><p className="text-xs text-slate-500">Required: {s.requiredDocuments.join(', ')}</p><p className="mt-1 text-xs text-slate-600">Uploaded: {s.documentLinks.length}</p>{s.documentLinks.length ? s.documentLinks.map((doc) => <div key={doc.id} className="mt-1 flex items-center justify-between rounded bg-stone-50 px-2 py-2 text-xs"><div><span className="font-medium text-slate-800">{doc.label}</span><p className="text-[11px] text-slate-500">{new Date(doc.submittedAt).toLocaleString()}</p></div><span className={`rounded-full border px-2 py-0.5 ${documentStatusTone(doc.status)}`}>{documentStatusLabel(doc.status)}</span></div>) : <div className="mt-2 rounded bg-stone-50 px-2 py-2 text-xs text-slate-500">No files uploaded yet for this service.</div>}{profile?.adminNotes.find((note) => note.message.toLowerCase().includes(s.title.toLowerCase())) && <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-xs text-amber-800">{profile.adminNotes.find((note) => note.message.toLowerCase().includes(s.title.toLowerCase()))?.message}</p>}</div>) : <div className="rounded-lg bg-stone-50 px-3 py-3 text-sm text-slate-500">No document items match this search.</div>}</div></div>
            </div>
          )}

          {section === 'blogs' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-teal-700">Recommended for your stage</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{blogs[0]?.title || 'Top guidance article'}</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filteredBlogs.length ? filteredBlogs.map((b) => <Link key={b.id} to={`/blog/${b.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-teal-50/40">{b.featuredImage ? <img src={b.featuredImage} alt={b.title} className="mb-3 h-40 w-full rounded-xl object-cover" /> : null}<p className="text-xs text-slate-500">{b.category} | {b.readTime}</p><p className="mt-1 font-semibold text-slate-900">{b.title}</p><p className="mt-1 text-xs text-teal-700">Useful for your application stage</p></Link>) : <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-slate-600">No blog articles match this search yet.</div>}</div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-sm font-semibold">Saved and continue reading</p><p className="mt-1 text-sm text-slate-500">No saved articles yet.</p></div>
            </div>
          )}

          {section === 'webinars' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Registration status</p>
                  <div className="flex gap-2 text-xs">
                    <button type="button" onClick={() => setWebinarViewFilter('all')} className={`rounded-full px-3 py-1 ${webinarViewFilter === 'all' ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-slate-700'}`}>All</button>
                    <button type="button" onClick={() => setWebinarViewFilter('free')} className={`rounded-full px-3 py-1 ${webinarViewFilter === 'free' ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-slate-700'}`}>Free</button>
                    <button type="button" onClick={() => setWebinarViewFilter('paid')} className={`rounded-full px-3 py-1 ${webinarViewFilter === 'paid' ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-slate-700'}`}>Paid</button>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{searchedStudentWebinars.length ? searchedStudentWebinars.map((w) => {
                const catalogItem = webinarCatalog.find((item) => item.id === w.webinarId);
                const accessType = w.webinarAccessType || catalogItem?.accessType || 'free';
                return (
                  <div
                    key={w.id}
                    className={`rounded-2xl border bg-white p-4 shadow-sm ${
                      selectedWebinarId === w.webinarId
                        ? 'border-teal-300 ring-2 ring-teal-100'
                        : 'border-slate-200'
                    }`}
                  >
                    {catalogItem?.imageUrl ? <img src={catalogItem.imageUrl} alt={w.webinarTitle || w.webinarId} className="mb-3 h-40 w-full rounded-xl object-cover" /> : null}
                    <p className="font-semibold text-slate-900">{w.webinarTitle || w.webinarId}</p>
                    <p className="text-xs text-slate-500">Registered | {new Date(w.createdAt).toLocaleDateString()}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{accessType === 'paid' ? `Paid webinar | ${catalogItem ? `INR ${catalogItem.priceValue}` : 'Payment confirmed'}` : 'Free webinar'}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => setNotice(`Reminder set for ${w.webinarTitle || w.webinarId}`)} className="rounded-lg bg-teal-600 px-2 py-1 text-xs font-semibold text-white">Set reminder</button>
                      {catalogItem?.meetingLink ? (
                        <a href={catalogItem.meetingLink} target="_blank" rel="noreferrer" className="rounded-lg border border-emerald-300 px-2 py-1 text-xs font-semibold text-emerald-700">
                          Join webinar
                        </a>
                      ) : (
                        <span className="rounded-lg border border-stone-300 px-2 py-1 text-xs text-slate-500">Link will appear here</span>
                      )}
                      <Link to="/webinars" className="rounded-lg border border-stone-300 px-2 py-1 text-xs">Open</Link>
                    </div>
                  </div>
                );
              }) : <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-slate-600">{normalizedSearch ? 'No webinar registrations match this search right now.' : 'No webinar registrations match this filter yet.'}</div>}</div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold">Recommended upcoming sessions</p>
                <div className="mt-2 space-y-2">
                  {filteredRecommendedCatalogWebinars.length ? filteredRecommendedCatalogWebinars.map((item) => (
                    <div key={item.id} className="rounded-lg bg-stone-50 p-2 text-sm">
                      <div className="flex gap-3">
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-16 w-24 rounded-lg object-cover" /> : null}
                        <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{new Date(item.scheduleAt).toLocaleString()} | {item.speaker} | {item.accessType === 'paid' ? `INR ${item.priceValue}` : 'Free'}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedWebinarId(item.id);
                          setSection('webinars');
                        }}
                        className="mt-2 inline-block text-xs font-semibold text-teal-700"
                      >
                        {item.accessType === 'paid' ? 'Register and pay' : 'Register now'}
                      </button>
                        </div>
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-500">{normalizedSearch ? 'No open sessions match this search.' : 'No open sessions right now.'}</p>}
                </div>
              </div>
              <Link to="/webinars" className="inline-block text-sm font-semibold text-teal-700">Browse webinar catalog</Link>
            </div>
          )}

          {section === 'mentor' && (
            <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-sm font-semibold">Thread list</p><div className="mt-2 space-y-2">{['Applications', 'Documents', 'Visa'].map((item) => <button key={item} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-left text-sm hover:bg-stone-50">{item}</button>)}</div></div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-sm font-semibold">Mentor conversation</p><div className="mt-3 space-y-2">{profile?.adminNotes.length ? profile.adminNotes.map((n) => <div key={n.id} className="rounded-lg bg-stone-50 p-3 text-sm"><p>{n.message}</p><p className="mt-1 text-xs text-slate-500">{n.createdBy}</p></div>) : <p className="text-sm text-slate-500">No mentor messages yet.</p>}</div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => { setNotice('Prompt noted: Please review my SOP.'); setSection('documents'); }} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">Review my SOP</button><button onClick={() => { setNotice('Prompt noted: Please check my visa documents.'); setSection('documents'); }} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">Check visa documents</button></div></div>
            </div>
          )}

          {section === 'resources' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Featured resources</p>
                    <p className="mt-1 text-sm text-slate-500">Browse the public resource store and complete payment before the admin shares your Google Drive access.</p>
                  </div>
                  <Link to="/resources" className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white">Browse resources</Link>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  {filteredPlans.length ? filteredPlans.slice(0, 3).map((plan) => (
                    <div key={plan.id} className="rounded-lg border border-stone-200 p-3 text-sm">
                      <p className="font-semibold">{plan.name}</p>
                      <p className="text-xs text-slate-500">{plan.price} | {plan.billing}</p>
                      <Link to="/resources" className="mt-2 inline-block text-xs font-semibold text-teal-700">Open resource store</Link>
                    </div>
                  )) : <p className="text-sm text-slate-500">{normalizedSearch ? 'No resource plans match this search.' : 'Visit the resource store to explore available bundles and tools.'}</p>}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold">Purchased resources</h2>
                <div className="mt-3 space-y-2">
                  {filteredResourceOrders.length ? filteredResourceOrders.map((o) => {
                    const catalogItem = resourceById.get(o.itemId) || getResourceCatalogItem(o.itemId);
                    return (
                    <div key={o.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex gap-3">
                          {catalogItem?.image ? (
                            <img
                              src={catalogItem.image}
                              alt={o.title}
                              className="h-16 w-24 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-stone-100 text-2xl">📦</div>
                          )}
                          <div>
                          <p className="font-semibold">{o.title}</p>
                          <p className="text-xs text-slate-500">{o.amountLabel} | {o.status}</p>
                          <p className="mt-1 text-[11px] text-slate-500">Purchased {new Date(o.createdAt).toLocaleString()}</p>
                          {o.resourceDeliveredAt ? <p className="mt-1 text-[11px] text-emerald-700">Delivered {new Date(o.resourceDeliveredAt).toLocaleString()}</p> : null}
                          </div>
                        </div>
                        {o.resourceDriveUrl ? (
                          <a href={o.resourceDriveUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
                            Open resource
                          </a>
                        ) : (
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${o.status === 'paid' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            {o.status === 'paid' ? 'Waiting for admin drive link' : 'Payment pending'}
                          </span>
                        )}
                      </div>
                    </div>
                    );
                  }) : <p className="text-sm text-slate-500">{normalizedSearch ? 'No resource purchases match this search.' : 'No resource purchases yet.'}</p>}
                </div>
              </div>
            </div>
          )}

          {section === 'profile' && profile && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Profile completion</p><p className="text-xs text-slate-500">{completion}%</p></div><div className="mt-2 h-2 rounded-full bg-stone-100"><div className="h-2 rounded-full bg-teal-600" style={{ width: `${Math.max(6, completion)}%` }} /></div></div>
              <form onSubmit={onSaveProfile} className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-sm font-semibold">Personal details</p><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Name" /><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Phone" /></div>
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-sm font-semibold">Academic preferences</p><input value={profile.universityPreference} onChange={(e) => setProfile({ ...profile, universityPreference: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Target course/intake" /><input value={profile.profilePhoto} onChange={(e) => setProfile({ ...profile, profilePhoto: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Profile image URL" /></div>
                <button className="w-fit rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white">Save Profile</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
