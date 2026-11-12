import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock3, ReceiptText, ShieldCheck, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import WhatsAppCta from '@/components/WhatsAppCta';
import { useSeo } from '@/lib/useSeo';
import { useAuth } from '@/components/AuthProvider';
import { getStudentProfile } from '@/lib/studentStore';
import { createOrder, type OrderRecord } from '@/lib/orderStore';
import { getWebinarCatalog, type WebinarCatalogItem } from '@/lib/webinarCatalogStore';
import { createWebinarRegistration } from '@/lib/webinarStore';
import { sendSubmissionEmails } from '@/lib/submissionEmailApi';
import { subscribeToResourceCatalog, type ResourcePackage } from '@/lib/resourceCatalogStore';

type CheckoutItem = {
  itemType: 'plan' | 'webinar';
  itemId: string;
  title: string;
  description: string;
  subtitle: string;
  priceValue: number;
  originalPriceValue: number;
  image?: string;
};

type PendingWebinarRegistration = {
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

const formatInr = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

export default function CheckoutPage() {
  useSeo({ title: 'Checkout | BVF Germany', description: 'Place an order for a BVF Germany resource or paid webinar.', noindex: true });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);
  const [consent, setConsent] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarCatalogItem | null>(null);
  const [webinarLoaded, setWebinarLoaded] = useState(false);
  const [resourceCatalogItems, setResourceCatalogItems] = useState<ResourcePackage[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', city: '' });

  const planKey = searchParams.get('plan') || '';
  const itemType = searchParams.get('itemType') === 'webinar' ? 'webinar' : 'plan';
  const webinarId = searchParams.get('webinarId') || '';

  useEffect(() => {
    const stop = subscribeToResourceCatalog((items) => {
      setResourceCatalogItems(items);
      setCatalogLoaded(true);
    });
    return () => stop();
  }, []);

  useEffect(() => {
    if (itemType !== 'webinar' || !webinarId) {
      setSelectedWebinar(null);
      setWebinarLoaded(true);
      return;
    }

    let active = true;
    void getWebinarCatalog().then((catalog) => {
      if (!active) return;
      setSelectedWebinar(catalog.find((item) => item.id === webinarId) || null);
      setWebinarLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [itemType, webinarId]);

  // The price always comes from the catalog, never from the URL.
  const selectedItem: CheckoutItem | null = useMemo(() => {
    if (itemType === 'webinar') {
      if (!selectedWebinar || selectedWebinar.accessType !== 'paid') return null;
      return {
        itemType: 'webinar',
        itemId: selectedWebinar.id,
        title: selectedWebinar.title,
        description: selectedWebinar.description || `Join ${selectedWebinar.speaker} for ${selectedWebinar.topic}.`,
        subtitle: `${selectedWebinar.topic} | ${new Date(selectedWebinar.scheduleAt).toLocaleString('en-IN')}`,
        priceValue: Number(selectedWebinar.priceValue) || 0,
        originalPriceValue: Number(selectedWebinar.priceValue) || 0,
        image: selectedWebinar.imageUrl || undefined,
      };
    }

    const resource = resourceCatalogItems.find((item) => item.id === planKey && item.published);
    if (!resource) return null;
    return {
      itemType: 'plan',
      itemId: resource.id,
      title: resource.title,
      description: resource.description,
      subtitle: resource.tagline,
      priceValue: resource.priceValue,
      originalPriceValue: Math.max(resource.originalPriceValue, resource.priceValue),
      image: resource.image || undefined,
    };
  }, [itemType, planKey, resourceCatalogItems, selectedWebinar]);

  useEffect(() => {
    if (!user?.uid) return;
    let active = true;
    const loadProfile = async () => {
      setLoadingProfile(true);
      try {
        const profile = await getStudentProfile(user.uid);
        if (!active) return;
        const [first, ...rest] = (profile?.name || '').split(' ');
        setForm((prev) => ({
          ...prev,
          firstName: first || prev.firstName,
          lastName: rest.join(' ') || prev.lastName,
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

  const email = (user?.email || '').toLowerCase();
  const isValid = Boolean(form.firstName.trim() && form.lastName.trim() && form.phone.trim().length >= 10 && email && consent);
  const discountPercent =
    selectedItem && selectedItem.originalPriceValue > selectedItem.priceValue
      ? Math.round(((selectedItem.originalPriceValue - selectedItem.priceValue) / selectedItem.originalPriceValue) * 100)
      : 0;

  const placeOrder = async () => {
    if (!user) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } });
      return;
    }
    if (!selectedItem || !isValid || placing) return;

    setPlacing(true);
    setError('');
    try {
      const name = `${form.firstName.trim()} ${form.lastName.trim()}`;
      const order = await createOrder({
        userId: user.uid,
        name,
        email,
        phone: form.phone.trim(),
        itemType: selectedItem.itemType,
        itemId: selectedItem.itemId,
        title: selectedItem.title,
        amountLabel: formatInr(selectedItem.priceValue),
        amountValue: selectedItem.priceValue,
      });

      if (selectedItem.itemType === 'webinar') {
        const raw = window.sessionStorage.getItem('pending-webinar-registration');
        const pending = raw ? (JSON.parse(raw) as PendingWebinarRegistration) : null;
        await createWebinarRegistration({
          webinarId: selectedItem.itemId,
          webinarTitle: selectedItem.title,
          webinarDate: pending?.webinarDate || selectedItem.subtitle,
          webinarAccessType: 'paid',
          name: pending?.name || name,
          email,
          phone: pending?.phone || form.phone.trim(),
          qualification: pending?.qualification || '',
          intake: pending?.intake || '',
          planningYear: pending?.planningYear || '',
          userId: user.uid,
          orderId: order.id,
        });
        window.sessionStorage.removeItem('pending-webinar-registration');
      }

      try {
        await sendSubmissionEmails({
          formType: 'order',
          name,
          email,
          phone: form.phone.trim(),
          orderTitle: selectedItem.title,
          amountLabel: order.amountLabel,
          orderId: order.id,
        });
      } catch (mailError) {
        console.warn('Order emails skipped', mailError);
      }

      setPlacedOrder(order);
    } catch (caughtError) {
      console.error('Failed to place order', caughtError);
      setError('We could not place your order right now. Please try again, or contact BVF Germany.');
    } finally {
      setPlacing(false);
    }
  };

  const itemMissing = (itemType === 'webinar' ? webinarLoaded : catalogLoaded) && !selectedItem;

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 pt-28 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold md:text-3xl">Checkout</h1>
          <p className="mt-1 text-sm text-slate-500">Place your order and the BVF team will send you the payment details.</p>
        </div>

        {itemMissing ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">This item is not available</h2>
            <p className="mt-2 text-sm text-slate-600">It may have been removed or is no longer on sale.</p>
            <Link to={itemType === 'webinar' ? '/webinars' : '/resources'} className="mt-4 inline-block text-sm font-semibold text-teal-700">
              {itemType === 'webinar' ? 'Back to webinars' : 'Back to resources'}
            </Link>
          </section>
        ) : placedOrder ? (
          <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Order placed. Payment pending.</h2>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
              <p className="flex items-center gap-2"><ReceiptText className="h-4 w-4 text-slate-500" aria-hidden="true" />Order {placedOrder.id.slice(-8).toUpperCase()}</p>
              <p className="flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-slate-500" aria-hidden="true" />{placedOrder.title}</p>
              <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-slate-500" aria-hidden="true" />{placedOrder.amountLabel}</p>
            </div>
            <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
              <li>The BVF team will contact you at {placedOrder.email} with the payment details.</li>
              <li>Once your payment is confirmed, the order changes to "paid" in your dashboard.</li>
              <li>{placedOrder.itemType === 'webinar' ? 'The webinar link then appears in the Webinars section of your dashboard.' : 'Your Google Drive access then appears in the Resources section of your dashboard.'}</li>
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/dashboard" className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white">Go to my dashboard</Link>
              <WhatsAppCta variant="outline" label="Ask about payment on WhatsApp" message={`Hi BVF Germany, I placed order ${placedOrder.id.slice(-8).toUpperCase()} for ${placedOrder.title}. Please share the payment details.`} />
            </div>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              {!user ? (
                <div>
                  <h2 className="text-lg font-semibold">Student login required</h2>
                  <p className="mt-1 text-sm text-slate-500">Sign in with your student account so the order appears in your dashboard.</p>
                  <button
                    type="button"
                    onClick={() => navigate('/login', { state: { from: `${location.pathname}${location.search}` } })}
                    className="mt-5 w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Login to continue
                  </button>
                  <p className="mt-3 text-center text-xs text-slate-500">
                    New here? <Link to="/register" state={{ from: `${location.pathname}${location.search}` }} className="font-semibold text-teal-700">Create an account</Link>
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">Your details</h2>
                  <p className="mt-1 text-xs text-slate-500">{loadingProfile ? 'Loading profile...' : 'We use these details to confirm your order and send payment instructions.'}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <input aria-label="First name" value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="First name" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                    <input aria-label="Last name" value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="Last name" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                    <input aria-label="Email" value={email} readOnly className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-500" />
                    <input aria-label="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone (with country code)" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                    <input aria-label="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="City (optional)" className="rounded-xl border border-stone-300 px-3 py-2 text-sm md:col-span-2" />
                  </div>

                  <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
                      How payment works
                    </div>
                    <p className="mt-2 text-xs leading-6 text-slate-600">
                      No payment is taken on this page. After you place the order, the BVF team sends you the payment details.
                      Your order is confirmed once the payment has been received.
                    </p>
                  </div>

                  <ConsentCheckbox className="mt-4" id="checkout-consent" checked={consent} onChange={(event) => setConsent(event.target.checked)} />

                  {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

                  <button
                    type="button"
                    onClick={() => void placeOrder()}
                    disabled={!isValid || placing || !selectedItem}
                    className="mt-5 w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {placing ? 'Placing order...' : selectedItem ? `Place order (${formatInr(selectedItem.priceValue)})` : 'Loading...'}
                  </button>
                </>
              )}
            </section>

            <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              {selectedItem ? (
                <>
                  <div className="flex gap-3">
                    {selectedItem.image ? (
                      <img src={selectedItem.image} alt={selectedItem.title} className="h-16 w-16 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#132033]">
                        <ShoppingBag className="h-6 w-6 text-[#facc15]" aria-hidden="true" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-semibold">{selectedItem.title}</h3>
                      <p className="text-xs text-slate-500">{selectedItem.subtitle}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{selectedItem.description}</p>
                  <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
                    {discountPercent > 0 ? (
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="line-through">{formatInr(selectedItem.originalPriceValue)}</span>
                        <span>{discountPercent}% off</span>
                      </div>
                    ) : null}
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-semibold">Payable</span>
                      <span className="text-xl font-semibold text-teal-700">{formatInr(selectedItem.priceValue)}</span>
                    </div>
                  </div>
                  <Link className="mt-4 inline-block text-xs font-semibold text-teal-700" to={selectedItem.itemType === 'webinar' ? '/webinars' : '/resources'}>
                    {selectedItem.itemType === 'webinar' ? 'Change webinar' : 'Change resource'}
                  </Link>
                </>
              ) : (
                <p className="text-sm text-slate-500">Loading item...</p>
              )}
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
