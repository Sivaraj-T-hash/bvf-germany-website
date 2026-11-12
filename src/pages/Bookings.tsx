import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CalendlyEmbed from '@/components/CalendlyEmbed';
import { useSeo } from '@/lib/useSeo';
import { useAuth } from '@/components/AuthProvider';
import { getStudentProfile } from '@/lib/studentStore';
import { createBookingRecord } from '@/lib/bookingStore';
import { sendSubmissionEmails } from '@/lib/submissionEmailApi';
import { getSiteSettings, getTestimonials, type SiteSettings, type TestimonialItem } from '@/lib/siteContentStore';
import { buildWhatsappHref } from '@/lib/whatsapp';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const bookingSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(10, 'Enter a valid phone number').max(15),
  preferredDate: z.string().min(1, 'Select a date'),
  preferredTime: z.string().min(1, 'Select a time'),
  notes: z.string().trim().max(1000).optional(),
  website: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

const faqItems = [
  { q: 'Is this really free?', a: 'Yes. The 30-minute consultation is completely free.' },
  { q: 'How long is the session?', a: 'The consultation is planned as a 30-minute session.' },
  { q: 'What should I prepare?', a: 'Basic academic details, target intake, and any major questions you already have.' },
  { q: 'Will this help me decide?', a: 'Yes. The goal is to give you a clearer roadmap, not leave you with more confusion.' },
];

export default function BookingsPage() {
  const { user } = useAuth();
  useSeo({
    title: 'Consultation Booking | BVF Germany',
    description: 'Book your free 30-minute Germany consultation with BVF Germany.',
    url: '/bookings',
    image: '/hero-og.png',
  });

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || '';

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [siteSettings, nextTestimonials] = await Promise.all([getSiteSettings(), getTestimonials()]);
      if (!active) return;
      setSettings(siteSettings);
      setTestimonials(nextTestimonials.filter((item) => item.published).slice(0, 3));
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const hydrateBookingForm = async () => {
      const profile = await getStudentProfile(user.uid);
      setValue('name', profile?.name || '');
      setValue('email', user.email || profile?.email || '');
      setValue('phone', profile?.phone || '');
    };

    void hydrateBookingForm();
  }, [setValue, user]);

  const whatsappHref = buildWhatsappHref(settings);

  const onSubmit = async (data: BookingForm & { website?: string }) => {
    try {
      if (data.website) {
        setSubmitError('Submission failed. Please try again.');
        return;
      }

      const lastSubmit = Number(localStorage.getItem('bvf_last_booking') || '0');
      if (Date.now() - lastSubmit < 30000) {
        setSubmitError('Please wait 30 seconds before submitting again.');
        return;
      }

      await createBookingRecord({
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        notes: data.notes,
        userId: user?.uid || null,
      });

      try {
        await sendSubmissionEmails({
          formType: 'booking',
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          notes: data.notes || '',
        });
      } catch (mailError) {
        console.warn('Booking email notifications skipped', mailError);
      }

      localStorage.setItem('bvf_last_booking', Date.now().toString());
      setSubmitted(true);
      setSubmitError('');
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit booking:', error);
      setSubmitError('Submission failed. Please try again later.');
    }
  };

  return (
    <div className="site-shell">
      <Navbar />

      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <div className="poster-grid items-end">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="col-span-12 lg:col-span-7"
              >
                <p className="eyebrow-chip">Bookings</p>
                <h1 className="hero-display mt-7">Book Your Free 30-Min Germany Consultation</h1>
                <p className="hero-copy">
                  Get a clear roadmap for your study abroad journey, from eligibility to landing in Germany.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.06 }}
                className="col-span-12 lg:col-span-5"
              >
                <div className="surface-panel card-shadow-lg p-6">
                  <p className="section-kicker">If You Are Logged In</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Your booking request is automatically tied to your student account so it can appear in the dashboard later.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-10 md:px-8 md:pb-12">
          <div className="container-narrow grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {[
              'Profile evaluation including CGPA, backlogs, and IELTS',
              'University shortlisting strategy',
              'Application and SOP guidance',
              'Visa and blocked account clarity',
              'Personalized roadmap for your intake',
            ].map((item) => (
              <div key={item} className="surface-panel p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm leading-7 text-foreground">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="surface-panel card-shadow-lg p-8">
              <p className="section-kicker">Book Instantly</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">Choose your slot</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                All times are shown in your local timezone. If instant scheduling is not available, you can still request your preferred slot below.
              </p>

              {calendlyUrl ? (
                <div className="mt-6 overflow-hidden rounded-[28px] border border-border bg-background/60 p-3">
                  <CalendlyEmbed url={calendlyUrl} className="min-h-[700px]" />
                </div>
              ) : (
                <div className="mt-6 rounded-[28px] border border-dashed border-border bg-muted/40 p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <CalendarDays className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <p className="mt-5 text-lg font-semibold text-foreground">Instant scheduling will be available soon.</p>
                    <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                      For now, share your preferred date and time in the request form and the BVF team will confirm your consultation manually.
                    </p>
                  </div>
                  <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Manual booking support is active
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="premium-card p-6">
                <p className="section-kicker">Trust + Reassurance</p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>500+ students guided</p>
                  <p>No spam, no pressure</p>
                  <p>100% personalized advice</p>
                </div>
              </div>

              <div className="premium-card p-6">
                <p className="section-kicker">Limited Slots</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Limited slots are available each week. Book early to secure your preferred time.
                </p>
              </div>

              <div className="surface-panel card-shadow-lg p-6">
                <p className="section-kicker">Manual Request</p>
                {submitted ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                      <Send className="h-8 w-8 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">Booking requested.</h3>
                    <p className="mt-2 text-sm text-muted-foreground">The BVF team will confirm your slot shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register('website')} />
                    <div>
                      <label htmlFor="booking-name" className="mb-1.5 block text-sm font-semibold text-foreground">Full Name</label>
                      <input id="booking-name" className="input-premium" {...register('name')} />
                      {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="booking-email" className="mb-1.5 block text-sm font-semibold text-foreground">Email</label>
                        <input id="booking-email" type="email" className="input-premium" {...register('email')} />
                        {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
                      </div>
                      <div>
                        <label htmlFor="booking-phone" className="mb-1.5 block text-sm font-semibold text-foreground">Phone Number</label>
                        <input id="booking-phone" className="input-premium" {...register('phone')} />
                        {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="booking-date" className="mb-1.5 block text-sm font-semibold text-foreground">Preferred Date</label>
                        <input id="booking-date" type="date" className="input-premium" {...register('preferredDate')} />
                        {errors.preferredDate ? <p className="mt-1 text-xs text-destructive">{errors.preferredDate.message}</p> : null}
                      </div>
                      <div>
                        <label htmlFor="booking-time" className="mb-1.5 block text-sm font-semibold text-foreground">Preferred Time</label>
                        <input id="booking-time" type="time" className="input-premium" {...register('preferredTime')} />
                        {errors.preferredTime ? <p className="mt-1 text-xs text-destructive">{errors.preferredTime.message}</p> : null}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="booking-notes" className="mb-1.5 block text-sm font-semibold text-foreground">Notes</label>
                      <textarea id="booking-notes" rows={4} className="input-premium resize-none" {...register('notes')} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:opacity-50">
                      {isSubmitting ? 'Sending...' : 'Get Free Evaluation'}
                    </button>
                    <p className={`text-xs ${submitError ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {submitError || 'Manual requests stay public unless you are already logged in.'}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">Student Confidence</p>
              <h2 className="section-title">Short calls work when they create immediate clarity.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  className="surface-panel p-6"
                >
                  <p className="text-sm leading-7 text-muted-foreground">&quot;{item.quote}&quot;</p>
                  <p className="mt-5 font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.university}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="surface-panel p-8">
              <p className="section-kicker">FAQ</p>
              <div className="mt-6 space-y-5">
                {faqItems.map((faq) => (
                  <div key={faq.q}>
                    <p className="text-base font-semibold text-foreground">{faq.q}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] bg-[linear-gradient(160deg,rgba(10,18,37,1),rgba(23,42,77,0.96))] p-8 text-white shadow-[0_30px_100px_-54px_rgba(15,23,42,0.9)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Fallback</p>
              <h3 className="mt-3 font-heading text-3xl font-semibold text-secondary">Prefer quick help instead?</h3>
              <p className="mt-4 text-sm leading-7 text-white/76">
                WhatsApp is still the fastest fallback if you are not ready to choose a time slot yet.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="button-primary">
                  Chat on WhatsApp
                </a>
                {!user ? (
                  <Link to="/register" className="button-secondary">
                    Book Free Consultation Now
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

