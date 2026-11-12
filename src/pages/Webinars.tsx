import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, MessageCircle, PlayCircle, Send, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import StudentStories from '@/components/StudentStories';
import { useSeo } from '@/lib/useSeo';
import { createWebinarRegistration } from '@/lib/webinarStore';
import { useAuth } from '@/components/AuthProvider';
import { getStudentProfile } from '@/lib/studentStore';
import { getWebinarCatalog, type WebinarCatalogItem } from '@/lib/webinarCatalogStore';
import { sendSubmissionEmails } from '@/lib/submissionEmailApi';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { whatsappLink } from '@/lib/contact';
import { useFormGuard } from '@/lib/formGuard';
import { webinarReplays } from '@/content/webinarReplays';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

// Shown when no webinar is scheduled: visitors register interest and are told the date later.
const defaultUpcomingWebinar = {
  id: 'next-webinar-interest',
  title: 'Next BVF Germany Webinar',
  date: 'Date to be announced',
  time: '',
  duration: 'About 60 minutes',
  description:
    'Register your interest and we will email you the date and joining details as soon as the next live session is scheduled.',
  learnings: [
    'Eligibility and requirements',
    'University selection strategy',
    'Application and SOP process',
    'Visa and financial proof',
    'Live Q&A',
  ],
};

const currentYear = new Date().getFullYear();
const planningYears = [currentYear, currentYear + 1, currentYear + 2].map(String);

const whyAttend = [
  'Learn directly from experts',
  'Avoid costly mistakes',
  'Get answers to your questions',
  'Understand real student journeys',
];

const webinarSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(10, 'Enter a valid phone number').max(15),
  qualification: z.string().trim().min(1, 'Qualification is required').max(100),
  intake: z.string().trim().min(1, 'Target intake is required').max(50),
  planningYear: z.string().trim().min(1, 'Planning year is required').max(10),
  consent: z.boolean().refine((value) => value, 'Please agree so we can send you the webinar details.'),
  website: z.string().optional(),
});

type WebinarForm = z.infer<typeof webinarSchema>;

export default function WebinarsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useSeo({
    title: 'Webinars | BVF Germany',
    description: 'Register for BVF Germany webinars and watch replay sessions on admissions, visas, and student life in Germany.',
    url: 'https://bvf-student-support.web.app/webinars',
    image: '/hero-og.png',
  });

  const settings = useSiteSettings();
  const guard = useFormGuard('webinar');
  const [webinarCatalog, setWebinarCatalog] = useState<WebinarCatalogItem[]>([]);
  const [selectedWebinarId, setSelectedWebinarId] = useState('');
  const [selectedReplay, setSelectedReplay] = useState(webinarReplays[0]);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WebinarForm>({
    resolver: zodResolver(webinarSchema),
    defaultValues: {
      intake: 'Winter',
      planningYear: planningYears[0],
      consent: false,
    },
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      const catalog = await getWebinarCatalog().catch(() => [] as WebinarCatalogItem[]);
      if (!active) return;
      const now = Date.now();
      const liveCatalog = catalog
        .filter((item) => (item.status === 'upcoming' || item.status === 'live') && new Date(item.scheduleAt).getTime() > now - 3 * 60 * 60 * 1000)
        .sort((a, b) => a.scheduleAt.localeCompare(b.scheduleAt));
      setWebinarCatalog(liveCatalog);
      setSelectedWebinarId((prev) => prev || liveCatalog[0]?.id || '');
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const hydrateForm = async () => {
      const profile = await getStudentProfile(user.uid);
      setValue('name', profile?.name || '');
      setValue('email', user.email || profile?.email || '');
      setValue('phone', profile?.phone || '');
    };

    void hydrateForm();
  }, [setValue, user]);

  const whatsappHref = whatsappLink(settings, 'Hi BVF Germany, I want to register for the upcoming webinar.');

  const countdownText = useMemo(() => {
    if (!webinarCatalog[0]?.scheduleAt) return 'The next date will be announced soon. Register your interest to be notified.';
    const target = new Date(webinarCatalog[0].scheduleAt).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return 'Registrations are now open.';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days} days ${hours} hours left to register`;
  }, [webinarCatalog]);

  const selectedCatalogItem = useMemo(
    () => webinarCatalog.find((item) => item.id === selectedWebinarId) || webinarCatalog[0],
    [selectedWebinarId, webinarCatalog],
  );

  const upcomingWebinar = useMemo(() => {
    const next = selectedCatalogItem;
    if (!next) return defaultUpcomingWebinar;
    const when = new Date(next.scheduleAt);
    return {
      id: next.id,
      title: next.title,
      date: when.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: when.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
      duration: `${next.durationMinutes} minutes`,
      description: next.description || `Join ${next.speaker} for a focused session on ${next.topic}.`,
      learnings: [
        `Topic focus: ${next.topic}`,
        `Speaker: ${next.speaker}`,
        `Capacity: ${next.capacity} seats`,
        `Session status: ${next.status}`,
        'Live Q&A and next-step guidance',
      ],
    };
  }, [selectedCatalogItem]);

  const onSubmit = async (form: WebinarForm) => {
    const guardError = guard.check(form.website);
    if (guardError) {
      setSubmitError(guardError);
      return;
    }

    const registrationData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      qualification: form.qualification,
      intake: form.intake,
      planningYear: form.planningYear,
    };

    try {
      if (selectedCatalogItem?.accessType === 'paid') {
        window.sessionStorage.setItem(
          'pending-webinar-registration',
          JSON.stringify({
            webinarId: selectedCatalogItem.id,
            webinarTitle: selectedCatalogItem.title,
            webinarDate: upcomingWebinar.date,
            webinarAccessType: 'paid',
            ...registrationData,
            userId: user?.uid || null,
          }),
        );
        navigate(`/checkout?itemType=webinar&webinarId=${selectedCatalogItem.id}`);
        return;
      }

      await createWebinarRegistration({
        webinarId: upcomingWebinar.id,
        webinarTitle: upcomingWebinar.title,
        webinarDate: upcomingWebinar.date,
        webinarAccessType: selectedCatalogItem?.accessType || 'free',
        ...registrationData,
        userId: user?.uid || null,
        consentAt: new Date().toISOString(),
      });
      try {
        await sendSubmissionEmails({
          formType: 'webinar',
          name: registrationData.name,
          email: registrationData.email,
          phone: registrationData.phone,
          webinarTitle: upcomingWebinar.title,
          webinarDate: upcomingWebinar.date,
          qualification: registrationData.qualification,
          intake: registrationData.intake,
          planningYear: registrationData.planningYear,
        });
      } catch (mailError) {
        console.warn('Webinar email notifications skipped', mailError);
      }

      guard.markSubmitted();
      setSubmitted(true);
      setSubmitError('');
      reset({
        name: '',
        email: '',
        phone: '',
        qualification: '',
        intake: 'Winter',
        planningYear: planningYears[0],
        consent: false,
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit webinar registration:', error);
      setSubmitError('Submission failed. Please try again later.');
    }
  };

  return (
    <div className="site-shell home-showcase">
      <Navbar />

      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <div className="poster-grid items-end">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="col-span-12 lg:col-span-8"
              >
                <p className="eyebrow-chip">Webinars</p>
                <h1 className="hero-display mt-7">Learn How to Study in Germany - Live</h1>
                <p className="hero-copy">
                  Join our expert-led webinars and get step-by-step guidance on admissions, visa, and student life in Germany.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="#register-webinar" className="button-primary">
                    Register for Next Webinar
                  </a>
                  {selectedReplay ? (
                    <a href="#past-sessions" className="button-secondary">
                      Watch Past Sessions
                    </a>
                  ) : null}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.06 }}
                className="col-span-12 lg:col-span-4"
              >
                <div className="surface-panel card-shadow-lg p-6">
                  <p className="section-kicker">Urgency</p>
                  <p className="mt-3 text-lg font-semibold text-foreground">Limited seats available</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{countdownText}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="register-webinar" className="px-4 pb-16 md:px-8 md:pb-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={spring}
              className="rounded-[36px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] p-8 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:p-10"
            >
              {selectedCatalogItem?.imageUrl ? (
                <img
                  src={selectedCatalogItem.imageUrl}
                  alt={upcomingWebinar.title}
                  className="mb-6 h-52 w-full rounded-[28px] object-cover"
                />
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">{selectedCatalogItem ? 'Upcoming Webinar' : 'Register Your Interest'}</p>
              <h2 className="mt-4 font-heading text-4xl font-semibold text-secondary md:text-5xl">{upcomingWebinar.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76">{upcomingWebinar.description}</p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2">
                  <CalendarDays className="h-4 w-4 text-secondary" aria-hidden="true" />
                  {upcomingWebinar.date}
                </span>
                {upcomingWebinar.time ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2">
                    <Clock3 className="h-4 w-4 text-secondary" aria-hidden="true" />
                    {upcomingWebinar.time}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2">
                  <Users className="h-4 w-4 text-secondary" aria-hidden="true" />
                  {upcomingWebinar.duration}
                </span>
              </div>

              <div className="mt-8 rounded-[28px] border border-white/12 bg-white/8 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">What you will learn</p>
                <div className="mt-5 space-y-3">
                  {upcomingWebinar.learnings.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/12 text-secondary">+</span>
                      <span className="text-sm text-white/82">{item}</span>
                    </div>
                  ))}
                </div>
                </div>

                {webinarCatalog.length > 1 ? (
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Choose webinar</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {webinarCatalog.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedWebinarId(item.id)}
                          className={`rounded-full border px-3 py-2 text-xs ${selectedCatalogItem?.id === item.id ? 'border-white/40 bg-white/15 text-white' : 'border-white/10 bg-white/5 text-white/75'}`}
                        >
                          {item.title} | {item.accessType === 'paid' ? `INR ${item.priceValue}` : 'Free'}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...spring, delay: 0.06 }}
              className="surface-panel card-shadow-lg p-8"
            >
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Send className="h-8 w-8 text-accent" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 font-heading text-4xl font-semibold text-foreground">Registration submitted.</h2>
                  <p className="mt-3 text-muted-foreground">We&apos;ll reach out with your webinar confirmation details.</p>
                  <div className="mt-6">
                    <Link to="/bookings" className="button-primary">
                      Book Consultation
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <p className="section-kicker">Registration Form</p>
                    <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">
                      {selectedCatalogItem?.accessType === 'paid' ? `Register & Pay INR ${selectedCatalogItem.priceValue}` : 'Register Now for Free'}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Use the same email you plan to use with BVF so follow-ups, payment, and webinar links stay connected.
                    </p>
                    <div className="mt-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
                      <p className="font-semibold">{upcomingWebinar.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[selectedCatalogItem?.accessType === 'paid' ? `Paid webinar | INR ${selectedCatalogItem.priceValue}` : 'Free webinar', upcomingWebinar.date, upcomingWebinar.time].filter(Boolean).join(' | ')}
                      </p>
                    </div>
                  </div>

                  <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website')} />

                  <div>
                    <label htmlFor="webinar-name" className="mb-1.5 block text-sm font-semibold text-foreground">Full Name</label>
                    <input id="webinar-name" className="input-premium" {...register('name')} />
                    {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="webinar-email" className="mb-1.5 block text-sm font-semibold text-foreground">Email</label>
                      <input id="webinar-email" type="email" className="input-premium" {...register('email')} />
                      {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
                    </div>
                    <div>
                      <label htmlFor="webinar-phone" className="mb-1.5 block text-sm font-semibold text-foreground">Phone Number</label>
                      <input id="webinar-phone" className="input-premium" {...register('phone')} />
                      {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="webinar-qualification" className="mb-1.5 block text-sm font-semibold text-foreground">Current Qualification</label>
                      <input id="webinar-qualification" className="input-premium" {...register('qualification')} />
                      {errors.qualification ? <p className="mt-1 text-xs text-destructive">{errors.qualification.message}</p> : null}
                    </div>
                    <div>
                      <label htmlFor="webinar-intake" className="mb-1.5 block text-sm font-semibold text-foreground">Target Intake</label>
                      <select id="webinar-intake" className="input-premium" {...register('intake')}>
                        {['Winter', 'Summer'].map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                      {errors.intake ? <p className="mt-1 text-xs text-destructive">{errors.intake.message}</p> : null}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="webinar-year" className="mb-1.5 block text-sm font-semibold text-foreground">Planning For</label>
                    <select id="webinar-year" className="input-premium" {...register('planningYear')}>
                      {planningYears.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    {errors.planningYear ? <p className="mt-1 text-xs text-destructive">{errors.planningYear.message}</p> : null}
                  </div>

                  <ConsentCheckbox id="webinar-consent" error={errors.consent?.message} {...register('consent')} />

                  <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:opacity-50">
                    {isSubmitting ? 'Processing...' : selectedCatalogItem?.accessType === 'paid' ? 'Continue to Checkout' : 'Register Now (Free)'}
                  </button>
                  <p className={`text-xs ${submitError ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {submitError || (selectedCatalogItem?.accessType === 'paid'
                      ? 'Paid webinars continue to checkout, where you place your order and receive payment details.'
                      : 'The BVF team receives your registration and sends you the webinar details.')}
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {selectedReplay ? (
        <section id="past-sessions" className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="section-kicker">Past Webinar Replays</p>
                <h2 className="section-title">Watch a recorded BVF session.</h2>
              </div>
              <p className="text-sm text-muted-foreground">Watch a replay, then take the next step if it gives you clarity.</p>
            </div>

            <div className="mt-10 overflow-hidden rounded-[34px] border border-border bg-card">
              <iframe
                title={selectedReplay.title}
                width="100%"
                height="420"
                src={`https://www.youtube-nocookie.com/embed/${selectedReplay.youtubeId}`}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full border-0"
              />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {webinarReplays.map((video, index) => (
                <motion.button
                  key={video.id}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  onClick={() => setSelectedReplay(video)}
                  className={`premium-card text-left ${selectedReplay.id === video.id ? 'ring-2 ring-primary/30' : ''}`}
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-[26px] bg-slate-950">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                    {video.duration}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">{video.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{video.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
        ) : null}

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="premium-card p-8">
              <p className="section-kicker">Why Attend</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">Webinars work because they teach before they sell.</h2>
              <div className="mt-6 space-y-4">
                {whyAttend.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">+</span>
                    <span className="text-sm leading-7 text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        <StudentStories kicker="Student Feedback" title="What students say after working with BVF." />

        <section className="px-4 pb-20 pt-6 md:px-8 md:pb-24">
          <div className="container-narrow rounded-[36px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-12 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:px-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Final CTA</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold text-secondary md:text-5xl">Don&apos;t miss your chance to get clarity</h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
                  Use the webinar as the first trust step, then move into consultation if you want deeper, profile-based guidance.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:items-start">
                <a href="#register-webinar" className="button-primary">
                  Register Now
                </a>
                {whatsappHref ? (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button-secondary">
                    WhatsApp
                  </a>
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


