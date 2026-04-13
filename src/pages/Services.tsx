import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, CheckCircle2, FileSearch, FileText, GraduationCap, Home, Languages, SearchCheck, ShieldCheck, Trophy, UserRoundCheck, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { serviceCatalog } from '@/lib/serviceCatalog';
import { getSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
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
};

export default function ServicesPage() {
  useSeo({
    title: 'Services | BVF Germany',
    description: 'Explore BVF Germany services covering profile verification, university shortlist, APS, IELTS, GRE, German language, visa, arrival, accommodation, and Ausbildung support.',
    url: 'https://bvf-student-support.web.app/services',
    image: '/hero-og.png',
  });

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

  const whatsappHref = `https://wa.me/${settings?.whatsappNumber || '919999999999'}?text=${encodeURIComponent(
    settings?.prefilledWhatsappMessage || 'Hi BVF Germany! I want help with studying in Germany.',
  )}`;
  const universityShortlistService = serviceCatalog.find((service) => service.slug === 'university-shortlist');

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
                <p className="eyebrow-chip">Services Hub</p>
                <h1 className="hero-display mt-7">Complete Support - In The Exact Order Students Usually Need It</h1>
                <p className="hero-copy">
                  From profile verification to Ausbildung guidance, each service is arranged in a clearer progression so
                  students can move step by step without unnecessary confusion.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/tools" className="button-primary">
                    Check My Eligibility
                  </Link>
                  <Link to="/bookings" className="button-secondary">
                    Book Consultation
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.06 }}
                className="col-span-12 lg:col-span-5"
              >
                <div className="surface-panel p-6">
                  <p className="section-kicker">Service Order</p>
                  <ul className="mt-4 space-y-3">
                    {[
                      'Start with profile verification before anything else',
                      'Move into shortlisting, APS, and exam preparation in sequence',
                      'Finish with visa, arrival, accommodation, and Ausbildung guidance where relevant',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 md:px-8 md:pb-20">
          <div className="container-narrow">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {serviceCatalog.map((service, index) => {
                const Icon = iconMap[service.icon];
                return (
                  <motion.article
                    key={service.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...spring, delay: index * 0.04 }}
                    className="surface-panel group flex h-full flex-col p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <span className="rounded-full bg-[#f7f2ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="mt-5 text-2xl font-heading font-semibold text-foreground">{service.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{service.shortDescription}</p>
                    <Link
                      to={`/services/${service.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {universityShortlistService?.disciplineShortlists?.length ? (
          <section className="px-4 pb-16 md:px-8 md:pb-20">
            <div className="container-narrow">
              <div className="max-w-3xl">
                <p className="section-kicker">University Shortlist</p>
                <h2 className="section-title">Engineering disciplines are broken into dedicated shortlist sections.</h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  Each branch has its own shortlist direction so students do not end up using one generic university list
                  for every engineering path.
                </p>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {universityShortlistService.disciplineShortlists.map((discipline) => (
                  <article key={discipline.title} className="surface-panel h-full p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Dedicated shortlist</p>
                    <h3 className="mt-3 text-2xl font-semibold text-foreground">{discipline.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{discipline.summary}</p>
                    <div className="mt-5 space-y-2">
                      {discipline.items.map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-[20px] border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-4 pb-12 md:px-8 md:pb-16">
          <div className="container-narrow rounded-[34px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-10 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:flex md:items-center md:justify-between md:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Start Here</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-secondary md:text-4xl">
                Not sure where to start?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76">
                Start with profile verification and move through the services in the right order instead of guessing the next step.
              </p>
            </div>
            <Link to="/services/profile-verification" className="button-primary mt-6 md:mt-0">
              Start Free Profile Verification
            </Link>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">How The Flow Works</p>
              <h2 className="section-title">The service order follows the actual Germany journey.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {serviceCatalog.map((service, index) => (
                <div key={service.id} className="surface-panel p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">0{index + 1}</p>
                  <p className="mt-4 text-lg font-semibold text-foreground">{service.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 md:px-8 md:pb-24">
          <div className="container-narrow overflow-hidden rounded-[36px] bg-gradient-dark p-8 text-white md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="section-kicker text-[#FFCE00]">Final CTA</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold md:text-5xl">
                  Get a clear roadmap for your Germany journey
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                  The strongest funnel move is simple: begin with clarity, then upgrade only when the next step is
                  genuinely needed.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/78">
                  <Trophy className="h-4 w-4 text-secondary" aria-hidden="true" />
                  500+ students placed with structured support
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/bookings" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5">
                  Book Consultation
                </Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="outline-button-light">
                  WhatsApp Chat
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
