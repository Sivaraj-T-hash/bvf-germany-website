import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import StudentStories from '@/components/StudentStories';
import { AddOnsTable, ComparisonCards, NoHiddenCharges, OfficialFeesTable, PackagePriceCard } from '@/components/OfferSections';
import { addOnSteps, journeyStages, offerFaqs } from '@/content/offer';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useFormGuard } from '@/lib/formGuard';
import { sendSubmissionEmails } from '@/lib/submissionEmailApi';
import { buildWhatsappHref } from '@/lib/whatsapp';
import { useSeo } from '@/lib/useSeo';
import { createLeadRecord } from '@/lib/leadStore';
import { useAuth } from '@/components/AuthProvider';
import { getStudentProfile } from '@/lib/studentStore';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const packageChoices = [
  'Free first consultation',
  'Complete package (₹59,999)',
  'IELTS Preparation (₹7,000)',
  'GRE Preparation (₹14,999)',
  'GMAT Preparation (₹14,999)',
  'German classes (₹15,000 per level)',
  'Accommodation support (fee on request)',
];

const inquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(10, 'Enter a valid phone number').max(15),
  selectedPackage: z.string().trim().min(1, 'Select an option'),
  message: z.string().trim().min(1, 'Message is required').max(1000),
  consent: z.boolean().refine((value) => value, 'Please agree so we can reply to your inquiry.'),
  website: z.string().optional(),
});

type InquiryForm = z.infer<typeof inquirySchema>;
const DEFAULT_PACKAGE = packageChoices[1];
const DEFAULT_MESSAGE = 'Hi BVF Germany, I am interested in the complete package. Please share the next steps.';

export default function PricingPage() {
  const { user } = useAuth();
  useSeo({
    title: 'Pricing | BVF Germany',
    description: 'One ₹59,999 package for 14 services, paid in two parts. Optional add-ons: IELTS ₹7,000, GRE ₹14,999, GMAT ₹14,999, German A1/A2 ₹15,000 per level.',
    image: '/hero-og.png',
  });

  const settings = useSiteSettings();
  const guard = useFormGuard('pricing');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { selectedPackage: DEFAULT_PACKAGE, message: DEFAULT_MESSAGE, consent: false },
  });

  useEffect(() => {
    if (!user?.uid) return;
    const hydrateForm = async () => {
      const profile = await getStudentProfile(user.uid);
      reset({
        name: profile?.name || '',
        email: user.email || profile?.email || '',
        phone: profile?.phone || '',
        selectedPackage: DEFAULT_PACKAGE,
        message: DEFAULT_MESSAGE,
        consent: false,
      });
    };
    void hydrateForm();
  }, [reset, user]);

  const whatsappHref = buildWhatsappHref(settings, 'Hi BVF Germany, I would like to know more about the ₹59,999 package and add-ons.');

  const onSubmit = async (data: InquiryForm) => {
    const guardError = guard.check(data.website);
    if (guardError) {
      setSubmitError(guardError);
      return;
    }
    try {
      await createLeadRecord({
        source: 'pricing',
        sourcePage: '/pricing',
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: `Pricing Inquiry: ${data.selectedPackage}`,
        message: data.message,
        userId: user?.uid || null,
        metadata: { selectedPackage: data.selectedPackage },
        consentAt: new Date().toISOString(),
      });
      try {
        await sendSubmissionEmails({
          formType: 'pricing',
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          selectedPackage: data.selectedPackage,
        });
      } catch (mailError) {
        console.warn('Pricing email notifications skipped', mailError);
      }
      guard.markSubmitted();
      setSubmitted(true);
      setSubmitError('');
      reset({ name: '', email: '', phone: '', selectedPackage: DEFAULT_PACKAGE, message: DEFAULT_MESSAGE, consent: false });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit pricing inquiry:', error);
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
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="col-span-12 lg:col-span-8">
                <p className="eyebrow-chip">Pricing</p>
                <h1 className="hero-display mt-7">Simple, honest pricing</h1>
                <p className="hero-copy">
                  One package covers your whole journey. You pay in two parts, and the second part is due only once you have your
                  offer letter.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.06 }} className="col-span-12 lg:col-span-4">
                <div className="surface-panel card-shadow-lg p-6">
                  <p className="section-kicker">Free first consultation</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Start with a free consultation. We look at your profile and suggest only what you really need.
                  </p>
                  <Link to="/bookings" className="button-primary mt-5 w-full justify-center">Book Free Consultation</Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 md:px-8 md:pb-20">
          <div className="container-narrow">
            <PackagePriceCard />
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-foreground">What the package covers</h2>
              <p className="mt-2 text-sm text-muted-foreground">From your first shortlist to your first week in Germany. Items marked add-on are optional and priced separately.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {journeyStages.map((stage) => (
                  <div key={stage.id} className="surface-panel p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{stage.number}. {stage.title}</p>
                    <ul className="mt-3 space-y-2">
                      {stage.services.map((service) => (
                        <li key={service.title} className="flex items-start gap-2 text-sm text-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#15803d]" aria-hidden="true" />
                          <Link to={service.path} className="hover:underline">
                            {service.title}
                            {service.addOn ? <span className="ml-1 text-xs font-semibold text-[#92400e]">(add-on)</span> : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="section-kicker">Add-on services</p>
              <h2 className="section-title">Extra support, only when you need it.</h2>
              <AddOnsTable className="mt-4" />
            </div>
            <div>
              <p className="section-kicker">How add-ons work</p>
              <ol className="mt-6 space-y-4">
                {addOnSteps.map((step, index) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f59e0b] text-sm font-bold text-white">{index + 1}</span>
                    <span>
                      <span className="block font-semibold text-foreground">{step.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">{step.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-10 lg:grid-cols-2">
            <OfficialFeesTable />
            <div className="space-y-6">
              <NoHiddenCharges />
              <ComparisonCards className="md:grid-cols-1" />
            </div>
          </div>
        </section>

        <StudentStories kicker="Student Success Stories" title="Students we have guided to German universities." />

        <section id="pricing-inquiry" className="scroll-mt-28 px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="surface-panel card-shadow-lg p-8">
              <p className="section-kicker">Package Inquiry</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">Questions about the package or an add-on?</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Send an inquiry and the BVF team will suggest what fits your profile, plan and budget.
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
                  <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website')} />
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
                      <label htmlFor="pricing-package" className="mb-1.5 block text-sm font-semibold text-foreground">Interested in</label>
                      <select id="pricing-package" className="input-premium" {...register('selectedPackage')}>
                        {packageChoices.map((choice) => (
                          <option key={choice} value={choice}>{choice}</option>
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
                  <ConsentCheckbox id="pricing-consent" error={errors.consent?.message} {...register('consent')} />
                  <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:opacity-50">
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                  <p className={`text-xs ${submitError ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {submitError || 'We usually reply within 24 hours.'}
                  </p>
                </form>
              )}
            </div>

            <div className="premium-card p-8">
              <p className="section-kicker">Common questions</p>
              <div className="mt-6 space-y-5">
                {offerFaqs.map((faq) => (
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
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Ready to add what you need?</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold text-secondary md:text-5xl">Start your Germany journey today</h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
                  Book a free consultation with our student counsellors. No pressure, just honest advice.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:items-start">
                <Link to="/bookings" className="button-primary">Book Free Consultation</Link>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button-secondary inline-flex items-center gap-2">
                  <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp
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
