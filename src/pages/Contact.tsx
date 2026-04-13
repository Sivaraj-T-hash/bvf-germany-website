import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail, MessageCircle, Phone, Send, Youtube } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useSeo } from '@/lib/useSeo';
import { subscribeToSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { createLeadRecord } from '@/lib/leadStore';
import { sendSubmissionEmails } from '@/lib/submissionEmailApi';
import { useAuth } from '@/components/AuthProvider';
import { getStudentProfile } from '@/lib/studentStore';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(10, 'Enter a valid phone number').max(15),
  message: z.string().trim().min(1, 'Message is required').max(1000),
  website: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { user } = useAuth();
  useSeo({
    title: 'Contact | BVF Germany',
    description: 'Get in touch with BVF Germany through WhatsApp, email, or the contact form for study-in-Germany guidance.',
    url: 'https://bvf-student-support.web.app/contact',
    image: '/hero-og.png',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const unsubscribe = subscribeToSiteSettings(setSettings);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const hydrateForm = async () => {
      const profile = await getStudentProfile(user.uid);
      reset({
        name: profile?.name || '',
        email: user.email || profile?.email || '',
        phone: profile?.phone || '',
        message: '',
      });
    };

    void hydrateForm();
  }, [reset, user]);

  const whatsappHref = `https://wa.me/${settings?.whatsappNumber || '919999999999'}?text=${encodeURIComponent(
    settings?.prefilledWhatsappMessage || 'Hi BVF Germany, I need guidance.',
  )}`;

  const onSubmit = async (data: ContactForm & { website?: string }) => {
    try {
      if (data.website) {
        setSubmitError('Submission failed. Please try again.');
        return;
      }

      const lastSubmit = Number(localStorage.getItem('bvf_last_submit') || '0');
      if (Date.now() - lastSubmit < 30000) {
        setSubmitError('Please wait 30 seconds before submitting again.');
        return;
      }

      await createLeadRecord({
        source: 'contact',
        sourcePage: '/contact',
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: 'Contact page inquiry',
        message: data.message,
        userId: user?.uid || null,
      });

      try {
        await sendSubmissionEmails({
          formType: 'contact',
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
        });
      } catch (mailError) {
        console.warn('Contact email notifications skipped', mailError);
      }

      localStorage.setItem('bvf_last_submit', Date.now().toString());
      setSubmitted(true);
      setSubmitError('');
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit lead:', error);
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
                className="col-span-12 lg:col-span-7"
              >
                <p className="eyebrow-chip">Contact BVF Germany</p>
                <h1 className="hero-display mt-7">Get in Touch With BVF Germany</h1>
                <p className="hero-copy">
                  Have questions about studying in Germany? We&apos;re here to help you at every step.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.06 }}
                className="col-span-12 lg:col-span-5"
              >
                <div className="surface-panel card-shadow-lg p-6">
                  <p className="section-kicker">Fastest Response</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    WhatsApp is the quickest way to reach us. For longer questions, you can also use the form below and
                    we usually reply within 24 hours.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 md:px-8 md:pb-16">
          <div className="container-narrow">
            <div className="rounded-[36px] bg-[linear-gradient(135deg,rgba(22,163,74,1),rgba(21,128,61,0.95))] px-6 py-10 text-center text-white shadow-[0_28px_100px_-56px_rgba(22,163,74,0.75)] md:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Primary CTA</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">Chat with us on WhatsApp</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/82 md:text-base">
                Need quick answers? Start on WhatsApp and get guidance faster than email.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-base font-semibold text-emerald-700 transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Chat with us on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={spring}
              className="surface-panel card-shadow-lg p-8"
            >
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Send className="h-8 w-8 text-accent" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 font-heading text-4xl font-semibold text-foreground">Message sent.</h2>
                  <p className="mt-3 text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <p className="section-kicker">Contact Form</p>
                    <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">Prefer email or a form?</h2>
                  </div>

                  <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register('website')} />

                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-foreground">
                      Full Name
                    </label>
                    <input id="contact-name" type="text" autoComplete="name" className="input-premium" placeholder="Enter your full name" {...register('name')} />
                    {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-foreground">
                        Email Address
                      </label>
                      <input id="contact-email" type="email" autoComplete="email" className="input-premium" placeholder="name@example.com" {...register('email')} />
                      {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-semibold text-foreground">
                        Phone Number
                      </label>
                      <input id="contact-phone" type="tel" autoComplete="tel" className="input-premium" placeholder="+91 99999 99999" {...register('phone')} />
                      {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-foreground">
                      Message
                    </label>
                    <textarea id="contact-message" rows={5} className="input-premium resize-none" placeholder="Tell us how we can help with your Germany journey" {...register('message')} />
                    {errors.message ? <p className="mt-1 text-xs text-destructive">{errors.message.message}</p> : null}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:opacity-50">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  <p aria-live="polite" className={`text-xs ${submitError ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {submitError || 'We typically reply within 24 hours. WhatsApp is usually faster.'}
                  </p>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...spring, delay: 0.06 }}
              className="space-y-6"
            >
                <div className="premium-card p-6">
                <p className="section-kicker">Email Contact</p>
                <a href={`mailto:${settings?.contactEmail || 'support@bvfgermany.com'}`} className="mt-3 inline-flex items-center gap-3 text-lg font-semibold text-foreground transition hover:text-secondary">
                  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                  {settings?.contactEmail || 'support@bvfgermany.com'}
                </a>
              </div>

              <div className="premium-card p-6">
                <p className="section-kicker">Phone</p>
                <a href={`tel:${(settings?.contactPhone || '+91 99999 99999').replace(/\s+/g, '')}`} className="mt-3 inline-flex items-center gap-3 text-lg font-semibold text-foreground transition hover:text-secondary">
                  <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                  {settings?.contactPhone || '+91 99999 99999'}
                </a>
              </div>

              <div className="premium-card p-6">
                <p className="section-kicker">Social Media</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <a
                    href={settings?.instagramUrl || 'https://instagram.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[24px] border border-border bg-background/70 p-5 transition hover:-translate-y-1 hover:border-primary/30"
                  >
                    <Instagram className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="mt-4 text-base font-semibold text-foreground">@bvfgermany</p>
                    <p className="text-sm text-muted-foreground">Instagram</p>
                  </a>
                  <a
                    href={settings?.youtubeUrl || 'https://youtube.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[24px] border border-border bg-background/70 p-5 transition hover:-translate-y-1 hover:border-primary/30"
                  >
                    <Youtube className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="mt-4 text-base font-semibold text-foreground">BVF Germany</p>
                    <p className="text-sm text-muted-foreground">YouTube</p>
                  </a>
                </div>
              </div>

              <div className="premium-card p-6">
                <p className="section-kicker">Mini FAQ</p>
                <div className="mt-4 space-y-4 text-sm leading-7">
                  <div>
                    <p className="font-semibold text-foreground">How fast do you respond?</p>
                    <p className="text-muted-foreground">Usually within 24 hours. WhatsApp is faster.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Can I directly book a call?</p>
                    <p className="text-muted-foreground">
                      Yes. <Link to="/bookings" className="font-semibold text-secondary">Go to the bookings page</Link> and schedule your consultation.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 pb-20 pt-6 md:px-8 md:pb-24">
          <div className="container-narrow rounded-[36px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-12 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:px-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Final CTA</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold text-secondary md:text-5xl">Need quick answers?</h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
                  Start on WhatsApp if you want the fastest path to clarity, or book a consultation if you are ready for a deeper discussion.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:items-start">
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="button-primary">
                  Chat on WhatsApp
                </a>
                <Link to="/bookings" className="button-secondary">
                  Book Consultation
                </Link>
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

