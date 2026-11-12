import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, BookOpenCheck, CheckCircle2, ClipboardList, FileSearch, FileText, GraduationCap, Home, Languages, MessageCircle, PenLine, SearchCheck, Send, ShieldCheck, Tag, UserRoundCheck, Wrench } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { serviceCatalog } from '@/lib/serviceCatalog';
import { getSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { whatsappLink } from '@/lib/contact';
import { publishedStories } from '@/content/successStories';
import { useSeo } from '@/lib/useSeo';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const iconMap = {
  profile: FileSearch,
  university: SearchCheck,
  application: FileText,
  ielts: GraduationCap,
  gre: BookOpenCheck,
  language: Languages,
  visa: ShieldCheck,
  arrival: UserRoundCheck,
  accommodation: Home,
  ausbildung: Wrench,
  gmat: BarChart3,
  writing: PenLine,
  cv: ClipboardList,
  submit: Send,
};

export default function ServicePage() {
  const { slug } = useParams();
  const service = serviceCatalog.find((item) => item.slug === slug);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const siteSettings = await getSiteSettings();
      if (active) setSettings(siteSettings);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  useSeo({
    title: service ? `${service.title} | BVF Germany` : 'Services | BVF Germany',
    description: service?.shortDescription || 'Explore BVF Germany services for Indian students.',
  });

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const whatsappHref = whatsappLink(settings, `Hi BVF Germany! I would like help with ${service.title}. Please share the details.`);
  // The German language service has a dedicated course page with batch and fee details.
  if (service.slug === 'germany-language') return <Navigate to="/german-language" replace />;
  const relatedStory = publishedStories.find((story) => story.servicesReceived?.includes(service.title));
  const Icon = iconMap[service.icon];

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
                <p className="eyebrow-chip">Service Detail</p>
                <h1 className="hero-display mt-7">{service.heroTitle}</h1>
                <p className="hero-copy">{service.heroSubtitle}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/bookings" className="button-primary">
                    Get Started
                  </Link>
                  {whatsappHref ? (<a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button-secondary">
                    WhatsApp
                  </a>) : null}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.06 }}
                className="col-span-12 lg:col-span-5"
              >
                <div className="surface-panel p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Service Snapshot</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{service.title}</p>
                  {service.priceTag ? (
                    <p className="mt-3 inline-flex items-start gap-2 rounded-2xl bg-secondary/15 px-3 py-2 text-sm font-semibold text-foreground">
                      <Tag className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                      {service.priceTag}
                    </p>
                  ) : null}
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{service.urgencyLine}</p>
                  <div className="mt-5 space-y-3">
                    {service.whatYouGet.slice(0, 3).map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-[20px] border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-panel p-8">
              <p className="section-kicker">What You Get</p>
              <div className="mt-6 grid gap-4">
                {service.whatYouGet.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[24px] border border-border/70 bg-background/70 p-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <p className="text-sm leading-7 text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel p-8">
              <p className="section-kicker">About This Service</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">This step should create clarity, not confusion.</h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{service.whyThisMatters}</p>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">Process</p>
              <h2 className="section-title">A simple path from request to result.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {service.processSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  className="surface-panel p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">0{index + 1}</p>
                  <p className="mt-4 text-lg font-semibold text-foreground">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className={`container-narrow grid gap-8 ${service.disciplineShortlists?.length ? 'lg:grid-cols-[1.2fr_0.8fr]' : 'lg:grid-cols-[1fr_0.95fr]'}`}>
            <div className="surface-panel p-8">
              {service.disciplineShortlists?.length ? (
                <>
                  <p className="section-kicker">Discipline Shortlists</p>
                  <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">Each engineering discipline gets its own shortlist section.</h2>
                  <div className="mt-6 space-y-5">
                    {service.disciplineShortlists.map((discipline) => (
                      <div key={discipline.title} className="rounded-[26px] border border-border bg-background/70 p-5">
                        <p className="text-lg font-semibold text-foreground">{discipline.title}</p>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{discipline.summary}</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {discipline.items.map((item) => (
                            <div key={item} className="rounded-[18px] border border-border/70 bg-white/80 px-4 py-3 text-sm text-foreground">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="section-kicker">Support Focus</p>
                  <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">What this service helps you handle more clearly.</h2>
                  <div className="mt-6 space-y-4">
                    {service.checklist.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-[22px] border border-border bg-background/70 px-4 py-4">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="rounded-[34px] bg-[linear-gradient(160deg,rgba(10,18,37,1),rgba(23,42,77,0.96))] p-8 text-white shadow-[0_30px_100px_-54px_rgba(15,23,42,0.9)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">{relatedStory ? 'Student Story' : 'Why It Works'}</p>
              <h3 className="mt-3 font-heading text-3xl font-semibold text-secondary">{service.proof.line}</h3>
              {relatedStory ? (
                <>
                  {relatedStory.quote ? <p className="mt-5 text-sm leading-7 text-white/76">&quot;{relatedStory.quote}&quot;</p> : null}
                  <Link to={`/success-stories/${relatedStory.id}`} className="mt-6 flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/10 p-5">
                    <img src={relatedStory.photo} alt={relatedStory.fullName} className="h-14 w-14 rounded-full object-cover" />
                    <span>
                      <span className="block text-sm font-semibold text-white">{relatedStory.fullName}</span>
                      <span className="mt-1 block text-sm text-white/70">{[relatedStory.admittedCourse, relatedStory.germanUniversity].filter(Boolean).join(', ')}</span>
                    </span>
                  </Link>
                </>
              ) : (
                <div className="mt-6 flex flex-col gap-3">
                  <Link to="/bookings" className="button-primary">Book a free consultation</Link>
                  {whatsappHref ? (
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button-secondary">Ask on WhatsApp</a>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-panel p-8">
              <p className="section-kicker">{service.checklistTitle}</p>
              <div className="mt-6 space-y-3">
                {service.checklist.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[22px] border border-border/70 bg-background/70 px-4 py-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel p-8">
              <p className="section-kicker">Required To Begin</p>
              <div className="mt-6 space-y-3">
                {service.requiredDocuments.map((item) => (
                  <div key={item} className="rounded-[22px] border border-border/70 bg-background/70 px-4 py-4 text-sm text-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">FAQ</p>
              <h2 className="section-title">The questions students usually ask before they commit.</h2>
            </div>
            <div className="mt-10 space-y-4">
              {service.faqs.map((faq, index) => (
                <motion.article
                  key={faq.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...spring, delay: index * 0.04 }}
                  className="surface-panel p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground">{faq.q}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.a}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 pt-6 md:px-8 md:pb-24">
          <div className="container-narrow rounded-[36px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-12 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:px-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Final CTA</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold text-secondary md:text-5xl">
                  Start with the right guidance today
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
                  If this service feels like the right next step, we can help you move forward with clarity instead of guesswork.
                </p>
              </div>
                <div className="w-full max-w-[28rem] lg:justify-self-end">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Link to="/bookings" className="button-primary w-full">
                      Get Started
                    </Link>
                    {whatsappHref ? (<a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button-secondary w-full">
                      WhatsApp
                    </a>) : null}
                    <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white">
                      Back to Services
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link to="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white">
                      Check Eligibility
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
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
