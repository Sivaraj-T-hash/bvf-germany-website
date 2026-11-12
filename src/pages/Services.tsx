import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BookOpenCheck, CheckCircle2, CircleDollarSign, FileSearch, FileText, GraduationCap, HeartPulse, Home, Languages, SearchCheck, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { serviceCatalog } from '@/lib/serviceCatalog';
import { getSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { useSeo } from '@/lib/useSeo';
import { buildWhatsappHref } from '@/lib/whatsapp';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const iconMap = {
  university: SearchCheck,
  application: FileText,
  ielts: GraduationCap,
  gre: BookOpenCheck,
  language: Languages,
  visa: ShieldCheck,
  arrival: UserRoundCheck,
  accommodation: Home,
  sop: FileText,
  cv: FileSearch,
  loan: CircleDollarSign,
  insurance: HeartPulse,
  'uni-application': Activity,
};

export default function ServicesPage() {
  useSeo({
    title: 'Services | BVF Germany',
    description: 'Explore BVF Germany services for university shortlisting, APS, IELTS, GRE, German language, visa guidance, arrival support, accommodation, SOP and LOR writing, and CV writing.',
    url: '/services',
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

  const whatsappHref = buildWhatsappHref(settings);

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
                <h1 className="hero-display mt-7">Complete Germany support, from shortlist to settlement.</h1>
                <p className="hero-copy">
                  Every service on this page is mapped to a real Germany milestone: shortlisting, APS, exams, visa,
                  landing, housing, SOP and LOR writing, and German-format CV support.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/services/university-shortlist" className="button-primary">
                    Start with Shortlisting
                  </Link>
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="button-secondary">Chat on WhatsApp</a>
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
                      'Start with university shortlisting so your applications stay realistic',
                      'Move into APS, IELTS or GRE, and language prep based on your route',
                      'Finish with visa, arrival, housing, SOP and LOR, and CV support as needed',
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {serviceCatalog.map((service, index) => {
                const Icon = iconMap[service.icon];
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...spring, delay: index * 0.04 }}
                  >
                    <Link
                      to={`/services/${service.slug}`}
                      className="surface-panel group flex h-full flex-col p-6 transition-all hover:ring-2 hover:ring-primary/20 hover:-translate-y-1"
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
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3">
                        Learn More
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 md:px-8 md:pb-16">
          <div className="container-narrow rounded-[34px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-10 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:flex md:items-center md:justify-between md:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Start Here</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-secondary md:text-4xl">
                Not sure where to start?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76">
                Start with University Shortlisting, then add APS, language, visa, and writing services only where your profile needs them.
              </p>
            </div>
            <Link to="/services/university-shortlist" className="button-primary mt-6 md:mt-0">
              Start University Shortlisting
            </Link>
          </div>
        </section>


        <section className="px-4 pb-20 md:px-8 md:pb-24">
          <div className="container-narrow overflow-hidden rounded-[36px] bg-gradient-dark p-8 text-white md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="section-kicker text-[#FFCE00]">Final CTA</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold md:text-5xl">
                  Join BVF Germany
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                  Get expert guidance from shortlisting to landing in Germany
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
                >
                  Get Free Profile Evaluation
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
