import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSeo } from '@/lib/useSeo';
import { useAuth } from '@/components/AuthProvider';
import { getStudentProfile } from '@/lib/studentStore';
import { createOrder, parseAmountValue, updateOrderStatus } from '@/lib/orderStore';
import { getWebinarCatalog, type WebinarCatalogItem } from '@/lib/webinarCatalogStore';
import { createWebinarRegistration } from '@/lib/webinarStore';
import { createStudentNotification, notifyAdminUsers } from '@/lib/notificationStore';
import { sendSubmissionEmails } from '@/lib/submissionEmailApi';
import { getResourceCatalogItem } from '@/lib/resourceCatalog';
import { subscribeToResourceCatalog, type ResourcePackage } from '@/lib/resourceCatalogStore';
import germanyLandmark from '@/assets/germany-landmark.jpg';
import studentsGroup from '@/assets/students-group.jpg';

type PlanConfig = {
  title: string;
  description: string;
  discountedPrice: string;
  originalPrice: string;
  image: string;
  subtitle: string;
  rating: string;
  reviews: string;
  viewed: string;
};

type CheckoutItem = PlanConfig & {
  itemType: 'plan' | 'webinar';
  itemId: string;
};

const LEGACY_PLAN_MAP: Record<string, PlanConfig> = {
  engineering: {
    title: 'Engineering in Germany Bundle',
    description: 'Hands-on guidance for engineering courses and placements.',
    discountedPrice: '2999',
    originalPrice: '5999',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
    subtitle: 'Great for technical pathways and research-led universities.',
    rating: '4.7/5',
    reviews: '310 reviews',
    viewed: '2.4k students viewed',
  },
  mba: {
    title: 'MBA in Germany Bundle',
    description: 'MBA admissions support, profile review, SOP and interview prep.',
    discountedPrice: '3499',
    originalPrice: '6999',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    subtitle: 'Built for competitive MBA profile positioning.',
    rating: '4.8/5',
    reviews: '280 reviews',
    viewed: '1.9k students viewed',
  },
  ms: {
    title: 'MS in Germany Bundle',
    description: 'MS application kit with university shortlist and documentation support.',
    discountedPrice: '3299',
    originalPrice: '6499',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    subtitle: 'A complete preparation stack for masters applications.',
    rating: '4.7/5',
    reviews: '390 reviews',
    viewed: '2.8k students viewed',
  },
};

const DEFAULT_PLAN: PlanConfig = {
  title: "Bachelor's in Germany",
  description: 'Get all the core tools needed to shortlist, prepare, and apply for bachelor programs in Germany.',
  discountedPrice: '2499',
  originalPrice: '5499',
  image: germanyLandmark,
  subtitle: 'One of the most popular study-abroad destinations with high quality of life.',
  rating: '4.8/5',
  reviews: '420 reviews',
  viewed: '3.2k students viewed',
};

export default function CheckoutPage() {
  useSeo({ title: 'Checkout | BVF Germany', description: 'Secure your bundle or webinar seat with mock Razorpay checkout.', noindex: true });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const autoStartedRef = useRef(false);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [notice, setNotice] = useState('');
  const [savingOrder, setSavingOrder] = useState(false);
  const [showMockGateway, setShowMockGateway] = useState(false);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarCatalogItem | null>(null);
  const [resourceCatalogItems, setResourceCatalogItems] = useState<ResourcePackage[]>([]);

  const planKey = searchParams.get('plan') || 'bachelor';
  const itemType = searchParams.get('itemType') === 'webinar' ? 'webinar' : 'plan';
  const webinarId = searchParams.get('webinarId') || '';
  const autostart = searchParams.get('autostart') === '1';
  const resource = useMemo(
    () =>
      resourceCatalogItems.find((item) => item.id === planKey) ||
      getResourceCatalogItem(planKey),
    [planKey, resourceCatalogItems],
  );
  const plan = useMemo(
    () =>
      (resource
        ? {
            title: resource.title,
            description: resource.description,
            discountedPrice: String(resource.priceValue),
            originalPrice: String(resource.originalPriceValue),
            image: resource.image,
            subtitle: resource.tagline,
            rating: resource.rating,
            reviews: resource.reviews,
            viewed: resource.viewed,
          }
        : LEGACY_PLAN_MAP[planKey]) ?? DEFAULT_PLAN,
    [planKey, resource],
  );

  useEffect(() => {
    const stop = subscribeToResourceCatalog(setResourceCatalogItems);
    return () => stop();
  }, []);

  useEffect(() => {
    if (itemType !== 'webinar' || !webinarId) {
      setSelectedWebinar(null);
      return;
    }

    let active = true;
    const loadWebinar = async () => {
      const catalog = await getWebinarCatalog();
      if (!active) return;
      setSelectedWebinar(catalog.find((item) => item.id === webinarId) || null);
    };
    void loadWebinar();
    return () => {
      active = false;
    };
  }, [itemType, webinarId]);

  const selectedItem: CheckoutItem = useMemo(() => {
    if (itemType === 'webinar' && selectedWebinar) {
      return {
        itemType: 'webinar',
        itemId: selectedWebinar.id,
        title: selectedWebinar.title,
        description: selectedWebinar.description || `Join ${selectedWebinar.speaker} for ${selectedWebinar.topic}.`,
        discountedPrice: String(selectedWebinar.priceValue || 0),
        originalPrice: String(selectedWebinar.priceValue || 0),
        image: selectedWebinar.imageUrl || studentsGroup,
        subtitle: `${selectedWebinar.topic} | ${new Date(selectedWebinar.scheduleAt).toLocaleString('en-IN')} | ${selectedWebinar.accessType === 'paid' ? 'Paid access' : 'Free access'}`,
        rating: selectedWebinar.accessType === 'paid' ? 'Premium' : 'Open',
        reviews: `${selectedWebinar.capacity} seats`,
        viewed: selectedWebinar.speaker,
      };
    }

    return {
      ...plan,
      itemType: 'plan',
      itemId: planKey,
    };
  }, [itemType, plan, planKey, selectedWebinar]);

  const queryPrice = searchParams.get('price');
  const discountedPrice = queryPrice ? queryPrice.replace(/[^\d]/g, '') : selectedItem.discountedPrice;
  const amountValue = parseAmountValue(discountedPrice);
  const originalAmountValue = parseAmountValue(selectedItem.originalPrice);
  const discountPercent = originalAmountValue > amountValue ? Math.round(((originalAmountValue - amountValue) / originalAmountValue) * 100) : 0;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
  });

  useEffect(() => {
    if (!user?.uid) return;
    let active = true;
    const loadProfile = async () => {
      setLoadingProfile(true);
      try {
        const profile = await getStudentProfile(user.uid);
        if (!active) return;
        const name = profile?.name || '';
        const [first, ...rest] = name.split(' ');
        setForm((prev) => ({
          ...prev,
          firstName: first || prev.firstName,
          lastName: rest.join(' ') || prev.lastName,
          email: user.email || profile?.email || prev.email,
          phone: profile?.phone || prev.phone,
        }));
      } finally {
        if (active) setLoadingProfile(false);
      }
    };
    void loadProfile();
    return () => {
      active = false;
    };
  }, [user]);

  const isValid = useMemo(
    () => Boolean(form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.phone.trim()),
    [form],
  );

  const openMockPayment = useCallback(async () => {
    if (!user) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } });
      return;
    }
    if (!isValid || savingOrder) return;
    setSavingOrder(true);
    setNotice('');
    try {
      const created = await createOrder({
        userId: user.uid,
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        itemType: selectedItem.itemType,
        itemId: selectedItem.itemId,
        title: selectedItem.title,
        amountLabel: `INR ${amountValue.toLocaleString('en-IN')}`,
        amountValue,
      });
      setOrderId(created.id);
      setShowMockGateway(true);
      setNotice('Order created. Complete mock payment to confirm purchase.');
    } catch (error) {
      console.error('Failed to create order', error);
      setNotice('Unable to create order right now. Please try again.');
    } finally {
      setSavingOrder(false);
    }
  }, [amountValue, form.email, form.firstName, form.lastName, form.phone, isValid, location.pathname, location.search, navigate, savingOrder, selectedItem.itemId, selectedItem.itemType, selectedItem.title, user]);

  useEffect(() => {
    if (!user || !autostart || autoStartedRef.current || loadingProfile || showMockGateway || orderId || !isValid) return;
    autoStartedRef.current = true;
    void openMockPayment();
  }, [autostart, isValid, loadingProfile, openMockPayment, orderId, showMockGateway, user]);

  const completeMockPayment = async (success: boolean) => {
    if (!orderId || paymentBusy) return;
    setPaymentBusy(true);
    try {
      if (success) {
        await updateOrderStatus(orderId, { status: 'paid' });
        if (selectedItem.itemType === 'webinar') {
          const rawPending = window.sessionStorage.getItem('pending-webinar-registration');
          if (rawPending) {
            const pendingRegistration = JSON.parse(rawPending) as {
              webinarId: string;
              webinarTitle: string;
              webinarDate: string;
              webinarAccessType: 'paid';
              name: string;
              email: string;
              phone: string;
              qualification: string;
              intake: string;
              planningYear: string;
              userId?: string | null;
            };
            const registration = await createWebinarRegistration({
              ...pendingRegistration,
              orderId,
            });
            try {
              await sendSubmissionEmails({
                formType: 'webinar',
                name: registration.name,
                email: registration.email,
                phone: registration.phone,
                webinarTitle: registration.webinarTitle,
                webinarDate: registration.webinarDate,
                qualification: registration.qualification,
                intake: registration.intake,
                planningYear: registration.planningYear,
              });
            } catch (mailError) {
              console.warn('Paid webinar email notifications skipped', mailError);
            }
            try {
              await notifyAdminUsers({
                title: 'Paid webinar registration confirmed',
                message: `${registration.name} completed payment for ${registration.webinarTitle}.`,
                type: 'system',
              });
            } catch (error) {
              console.warn('Admin notification skipped after paid webinar registration', error);
            }
            if (registration.userId && selectedWebinar?.meetingLink) {
              try {
                await createStudentNotification({
                  userId: registration.userId,
                  title: 'Webinar link available',
                  message: `${registration.webinarTitle} meeting link is ready: ${selectedWebinar.meetingLink}`,
                  type: 'system',
                });
              } catch (error) {
                console.warn('Student webinar-link notification skipped', error);
              }
            }
            window.sessionStorage.removeItem('pending-webinar-registration');
          }
        } else {
          try {
            await notifyAdminUsers({
              title: 'Resource purchase completed',
              message: `${form.firstName.trim()} ${form.lastName.trim()} paid for ${selectedItem.title}.`,
              type: 'system',
            });
          } catch (error) {
            console.warn('Admin notification skipped after resource purchase', error);
          }
        }
        setNotice('Mock payment successful. Your purchase is now visible in dashboards.');
        setShowMockGateway(false);
        setTimeout(() => {
          navigate('/dashboard');
        }, 600);
      } else {
        await updateOrderStatus(orderId, { status: 'cancelled' });
        setNotice('Mock payment cancelled. You can retry anytime.');
        setShowMockGateway(false);
      }
    } catch (error) {
      console.error('Mock payment update failed', error);
      setNotice('Payment status update failed. Please retry.');
    } finally {
      setPaymentBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 pt-28 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold md:text-3xl">Checkout</h1>
          <p className="mt-1 text-sm text-slate-500">
            {selectedItem.itemType === 'webinar'
              ? 'Mock Razorpay flow for webinar registration and dashboard sync.'
              : 'Mock Razorpay flow for resource purchase, admin delivery, and dashboard access.'}
          </p>
        </div>

        {notice ? <div className="mb-4 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">{notice}</div> : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            {!user ? (
              <div>
                <h2 className="text-lg font-semibold">Student login required</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Continue with your approved student account so we can save this purchase in the admin dashboard and your resource history.
                </p>

                <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4 text-teal-700" />
                    Purchase handoff
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>1. Sign in with your student account</p>
                    <p>2. Return here automatically</p>
                    <p>3. Complete the mock payment</p>
                    <p>4. Let admin attach your Google Drive resource access</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login', { state: { from: `${location.pathname}${location.search}` } })}
                  className="mt-5 w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Login to continue
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Customer details</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {loadingProfile ? 'Loading profile...' : 'Use your active student account details for dashboard sync.'}
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="First name" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                  <input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="Last name" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                  <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                  <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                  <input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="City (optional)" className="rounded-xl border border-stone-300 px-3 py-2 text-sm md:col-span-2" />
                </div>

                <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CreditCard className="h-4 w-4 text-teal-700" />
                    Payment Method: Razorpay (Mock)
                  </div>
                  <p className="mt-2 text-xs text-slate-600">
                    This is a simulated gateway for current testing. On success, order status is updated to paid in Firebase and the admin can deliver your Google Drive access.
                  </p>
                </div>

                <button
                  onClick={openMockPayment}
                  disabled={!isValid || savingOrder}
                  className="mt-5 w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingOrder ? 'Creating order...' : `Pay INR ${amountValue.toLocaleString('en-IN')}`}
                </button>
              </>
            )}
          </section>

          <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex gap-3">
              <img src={selectedItem.image} alt={selectedItem.title} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <h3 className="text-base font-semibold">{selectedItem.title}</h3>
                <p className="text-xs text-slate-500">{selectedItem.viewed} | {selectedItem.rating} ({selectedItem.reviews})</p>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-700">{selectedItem.description}</p>
            <p className="mt-1 text-xs text-slate-500">{selectedItem.subtitle}</p>

            <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="line-through">INR {originalAmountValue.toLocaleString('en-IN')}</span>
                <span>{discountPercent}% Off</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-semibold">Payable</span>
                <span className="text-xl font-semibold text-teal-700">INR {amountValue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />Payment success updates Student and Admin dashboards</p>
              <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-teal-700" />Mock Razorpay flow for preview and QA</p>
            </div>

            <Link className="mt-4 inline-block text-xs font-semibold text-teal-700" to={selectedItem.itemType === 'webinar' ? '/webinars' : '/resources'}>
              {selectedItem.itemType === 'webinar' ? 'Change webinar' : 'Change resource'}
            </Link>
          </aside>
        </div>
      </main>

      {showMockGateway ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-xl">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Razorpay Mock</p>
            <h3 className="mt-1 text-lg font-semibold">Complete payment</h3>
            <p className="mt-1 text-sm text-slate-600">Order #{orderId?.slice(0, 8)} | INR {amountValue.toLocaleString('en-IN')}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => void completeMockPayment(true)} disabled={paymentBusy} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {paymentBusy ? 'Processing...' : 'Mock Success'}
              </button>
              <button onClick={() => void completeMockPayment(false)} disabled={paymentBusy} className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60">
                Mock Fail
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}
