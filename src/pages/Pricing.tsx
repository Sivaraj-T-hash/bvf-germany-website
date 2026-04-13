import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getSiteSettings, getTestimonials, type SiteSettings, type TestimonialItem } from '@/lib/siteContentStore';
import { useSeo } from '@/lib/useSeo';
import { createLeadRecord } from '@/lib/leadStore';
import { useAuth } from '@/components/AuthProvider';
import { getStudentProfile } from '@/lib/studentStore';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const pricingPlans = [
  {
    id: 'starter',
    name: 'Profile Verification',
    price: 'FREE',
    subtitle: 'Starter',
    description: 'Best for students who are just exploring Germany and want a clear first answer before spending time or money.',
    features: [
      'Academic evaluation including CGPA and backlogs',
      'IELTS requirement check',
      'Basic eligibility report',
      '2-page PDF within 48 hours',
    ],
    bestFor: 'Students just exploring Germany',
    primaryCta: { label: 'Get Started', to: '/services/profile-verification', type: 'link' as const },
    badge: 'Free Entry',
    tone: 'free' as const,
  },
  {
    id: 'diy',
    name: 'Self-Preparation Toolkit',
    price: 'INR999',
    subtitle: 'DIY Success',
    description: 'For students who want to prepare independently but still need structure, templates, and the right checklist.',
    features: [
      'SOP writing guide',
      'LOR templates',
      'IELTS preparation kit',
      'University shortlisting tips',
      'Application checklist',
    ],
    bestFor: 'Students who want to do it themselves',
    primaryCta: { label: 'Send Inquiry', to: '#pricing-inquiry', type: 'anchor' as const },
    secondaryKind: 'whatsapp' as const,
    badge: 'Serious DIY',
    tone: 'diy' as const,
  },
  {
    id: 'full',
    name: 'Full Consultation Package',
    price: 'Custom Pricing',
    subtitle: 'Complete Guidance',
    description: 'The full end-to-end support system for students who are serious about studying in Germany and want fewer mistakes.',
    features: [
      'University verification including Anabin and APS-safe checks',
      'University shortlisting',
      'Application support for Uni-Assist and direct routes',
      'SOP and LOR writing',
      'Visa guidance',
      'Pre-departure support',
      'Accommodation assistance',
      '1:1 expert consultation',
    ],
    bestFor: 'Students serious about studying in Germany',
    primaryCta: { label: 'Book Consultation', to: '/bookings', type: 'link' as const },
    secondaryKind: 'whatsapp' as const,
    badge: 'Most Popular',
    tone: 'full' as const,
  },
];

const comparisonRows = [
  { label: 'Profile Check', starter: true, diy: true, full: true },
  { label: 'SOP & LOR', starter: false, diy: true, full: true },
  { label: 'Application Support', starter: false, diy: false, full: true },
  { label: 'Visa Guidance', starter: false, diy: false, full: true },
  { label: 'Accommodation Help', starter: false, diy: false, full: true },
];

const faqItems = [
  {
    q: 'Why is full package pricing not fixed?',
    a: 'Because the complexity changes by profile, intake urgency, backlog history, and how much support the student actually needs.',
  },
  {
    q: 'Can I upgrade later?',
    a: 'Yes. Many students start with a free or DIY option and move into full consultation later.',
  },
  {
    q: 'Is payment refundable?',
    a: 'That depends on the service stage and work already delivered. The BVF team explains this clearly before payment.',
  },
];

const inquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(10, 'Enter a valid phone number').max(15),
  selectedPackage: z.string().trim().min(1, 'Select a package'),
  message: z.string().trim().min(1, 'Message is required').max(1000),
  website: z.string().optional(),
});

type InquiryForm = z.infer<typeof inquirySchema>;

export default function PricingPage() {
  const { user } = useAuth();
  useSeo({
    title: 'Pricing | BVF Germany',
    description: 'Compare BVF Germany support options from free profile verification to complete Germany guidance.',
    url: 'https://bvf-student-support.web.app/pricing',
    image: '/hero-og.png',
  });

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      selectedPackage: 'Full Consultation Package',
      message: 'Hi BVF Germany, I am interested in the Full Consultation Package. Please share details.',
    },
  });

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

    const hydrateForm = async () => {
      const profile = await getStudentProfile(user.uid);
      reset({
        name: profile?.name || '',
        email: user.email || profile?.email || '',
        phone: profile?.phone || '',
        selectedPackage: 'Full Consultation Package',
        message: 'Hi BVF Germany, I am interested in the Full Consultation Package. Please share details.',
      });
    };

    void hydrateForm();
  }, [reset, user]);

  const whatsappHref = `https://wa.me/${settings?.whatsappNumber || '919999999999'}?text=${encodeURIComponent(
    'Hi BVF Germany, Iâ€™m interested in the Full Consultation Package. Please share details.',
  )}`;

  const onSubmit = async (data: InquiryForm & { website?: string }) => {
    try {
      if (data.website) {
        setSubmitError('Submission failed. Please try again.');
        return;
      }

      await createLeadRecord({
        source: 'pricing',
        sourcePage: '/pricing',
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: `Pricing Inquiry: ${data.selectedPackage}`,
        message: data.message,
        userId: user?.uid || null,
        metadata: {
          selectedPackage: data.selectedPackage,
        },
      });

      setSubmitted(true);
      setSubmitError('');
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit pricing inquiry:', error);
      setSubmitError('Submission failed. Please try again later.');
    }
  };

  const renderPlanCta = (plan: (typeof pricingPlans)[number]) => {
    if (plan.primaryCta.type === 'link') {
      return (
        <Link to={plan.primaryCta.to} className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${plan.tone === 'full' ? 'bg-gradient-cta text-primary-foreground hover:opacity-90' : 'bg-foreground text-white hover:-translate-y-0.5'}`}>
          {plan.primaryCta.label}
        </Link>
      );
    }

    return (
      <a href={plan.primaryCta.to} className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
        {plan.primaryCta.label}
      </a>
    );
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
                <p className="eyebrow-chip">Pricing</p>
                <h1 className="hero-display mt-7">Simple Pricing. Complete Guidance.</h1>
                <p className="hero-copy">
                  Choose the level of support you need, from basic guidance to full end-to-end assistance for Germany.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.06 }}
                className="col-span-12 lg:col-span-4"
              >
                <div className="surface-panel card-shadow-lg p-6">
                  <p className="section-kicker">Value Framing</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    This page is built to help you choose the right support level, not just compare prices in isolation.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 md:px-8 md:pb-20">
          <div className="container-narrow grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...spring, delay: index * 0.06 }}
                className={`relative flex h-full flex-col rounded-[34px] border p-7 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.55)] ${
                  plan.tone === 'full'
                    ? 'border-secondary/30 bg-[linear-gradient(180deg,rgba(18,33,70,1),rgba(9,18,39,0.98))] text-white md:-translate-y-2'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${plan.tone === 'full' ? 'text-white/60' : 'text-muted-foreground'}`}>
                      {plan.subtitle}
                    </p>
                    <h2 className={`mt-3 text-2xl font-semibold ${plan.tone === 'full' ? 'text-white' : 'text-foreground'}`}>{plan.name}</h2>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                    plan.tone === 'full' ? 'bg-secondary text-secondary-foreground' : 'bg-primary/10 text-primary'
                  }`}>
                    {plan.badge}
                  </span>
                </div>

                <div className={`mt-6 text-4xl font-semibold ${plan.tone === 'full' ? 'text-secondary' : 'text-foreground'}`}>{plan.price}</div>
                <p className={`mt-4 text-sm leading-7 ${plan.tone === 'full' ? 'text-white/76' : 'text-muted-foreground'}`}>{plan.description}</p>

                <div className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <span className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${plan.tone === 'full' ? 'bg-white/12 text-secondary' : 'bg-primary/10 text-primary'}`}>
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className={`text-sm leading-7 ${plan.tone === 'full' ? 'text-white/82' : 'text-foreground'}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className={`mt-6 rounded-[24px] px-4 py-4 ${plan.tone === 'full' ? 'bg-white/8' : 'bg-muted/60'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${plan.tone === 'full' ? 'text-white/55' : 'text-muted-foreground'}`}>Best For</p>
                  <p className={`mt-2 text-sm ${plan.tone === 'full' ? 'text-white' : 'text-foreground'}`}>{plan.bestFor}</p>
                </div>

                {renderPlanCta(plan)}
                {plan.secondaryKind === 'whatsapp' ? (
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className={`mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold transition ${plan.tone === 'full' ? 'text-white/84 hover:text-white' : 'text-secondary hover:text-primary'}`}>
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp Inquiry
                  </a>
                ) : null}
              </motion.article>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">Value Comparison</p>
              <h2 className="section-title">The comparison should make the full package feel obvious.</h2>
            </div>
            <div className="mt-10 overflow-hidden rounded-[30px] border border-border bg-card">
              <div className="grid grid-cols-[1.2fr_0.6fr_0.6fr_0.6fr] border-b border-border bg-muted/50 px-5 py-4 text-sm font-semibold text-foreground">
                <div>Feature</div>
                <div>Free</div>
                <div>DIY</div>
                <div>Full</div>
              </div>
              {comparisonRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[1.2fr_0.6fr_0.6fr_0.6fr] items-center border-b border-border/70 px-5 py-4 text-sm last:border-b-0">
                  <div className="font-medium text-foreground">{row.label}</div>
                  <div className="text-muted-foreground">{row.starter ? 'Yes' : 'No'}</div>
                  <div className="text-muted-foreground">{row.diy ? 'Yes' : 'No'}</div>
                  <div className="font-semibold text-primary">{row.full ? 'Yes' : 'No'}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="premium-card p-8">
              <p className="section-kicker">Why Invest In Guidance</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">A single avoidable mistake can cost you an intake.</h2>
              <div className="mt-6 space-y-4">
                {[
                  'Avoid rejections caused by weak shortlists or poor documents',
                  'Save time by moving in the right order',
                  'Increase acceptance chances with stronger execution',
                  'Plan the full journey correctly from applications to landing',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm leading-7 text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] bg-[linear-gradient(160deg,rgba(10,18,37,1),rgba(23,42,77,0.96))] p-8 text-white shadow-[0_30px_100px_-54px_rgba(15,23,42,0.9)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Positioning</p>
              <h3 className="mt-3 font-heading text-3xl font-semibold text-secondary">The goal is not to sell every package equally.</h3>
              <p className="mt-4 text-sm leading-7 text-white/76">
                Free builds trust. DIY filters serious users. Full Consultation is where the value stack becomes strongest and the support becomes truly outcome-focused.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">Student Proof</p>
              <h2 className="section-title">Students pay for clarity because confusion gets expensive fast.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...spring, delay: index * 0.06 }}
                  className="surface-panel card-shadow-lg p-6"
                >
                  <p className="text-sm leading-7 text-muted-foreground">&quot;{item.quote}&quot;</p>
                  <p className="mt-5 font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.university}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing-inquiry" className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="surface-panel card-shadow-lg p-8">
              <p className="section-kicker">Package Inquiry</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">Need pricing details or want the right package recommendation?</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Send an inquiry and the BVF team can suggest the best fit based on your profile and current stage.
              </p>
              {submitted ? (
                <div className="mt-8 rounded-[24px] bg-accent/10 p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                    <Send className="h-6 w-6 text-accent" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-foreground">Inquiry sent successfully.</p>
                  <p className="mt-2 text-sm text-muted-foreground">We&apos;ll get back to you with details shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                  <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register('website')} />
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="pricing-name" className="mb-1.5 block text-sm font-semibold text-foreground">Name</label>
                      <input id="pricing-name" className="input-premium" {...register('name')} />
                      {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
                    </div>
                    <div>
                      <label htmlFor="pricing-email" className="mb-1.5 block text-sm font-semibold text-foreground">Email</label>
                      <input id="pricing-email" type="email" className="input-premium" {...register('email')} />
                      {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
                    </div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="pricing-phone" className="mb-1.5 block text-sm font-semibold text-foreground">Phone</label>
                      <input id="pricing-phone" className="input-premium" {...register('phone')} />
                      {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
                    </div>
                    <div>
                      <label htmlFor="pricing-package" className="mb-1.5 block text-sm font-semibold text-foreground">Selected Package</label>
                      <select id="pricing-package" className="input-premium" {...register('selectedPackage')}>
                        {pricingPlans.map((plan) => (
                          <option key={plan.id} value={plan.name}>{plan.name}</option>
                        ))}
                      </select>
                      {errors.selectedPackage ? <p className="mt-1 text-xs text-destructive">{errors.selectedPackage.message}</p> : null}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="pricing-message" className="mb-1.5 block text-sm font-semibold text-foreground">Message</label>
                    <textarea id="pricing-message" rows={5} className="input-premium resize-none" {...register('message')} />
                    {errors.message ? <p className="mt-1 text-xs text-destructive">{errors.message.message}</p> : null}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:opacity-50">
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                  <p className={`text-xs ${submitError ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {submitError || 'For faster replies, WhatsApp usually works best.'}
                  </p>
                </form>
              )}
            </div>

            <div className="premium-card p-8">
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
          </div>
        </section>

        <section className="px-4 pb-20 pt-6 md:px-8 md:pb-24">
          <div className="container-narrow rounded-[36px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-12 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:px-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Final CTA</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold text-secondary md:text-5xl">
                  Not sure which package is right for you?
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
                  Start with a free consultation and we can map the smartest path based on your profile and seriousness level.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:items-start">
                <Link to="/bookings" className="button-primary">
                  Book Free Consultation
                </Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="button-secondary">
                  Chat on WhatsApp
                </a>
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
