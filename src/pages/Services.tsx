import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, CheckCircle2, FileSearch, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import WhatsAppCta from '@/components/WhatsAppCta';
import { AddOnsTable, JourneyStagesSection, PackagePriceCard, TimelineSection } from '@/components/OfferSections';
import { serviceCatalog } from '@/lib/serviceCatalog';
import { testPrep } from '@/content/offer';
import { useSeo } from '@/lib/useSeo';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const moreOptions = [
  { icon: FileSearch, title: 'Free first consultation', text: 'Profile check and honest advice on where you can apply, before you pay anything.', to: '/services/profile-verification' },
  { icon: BarChart3, title: 'GMAT Preparation (add-on)', text: 'For management and business master’s programmes, such as MSc Management and MBA. ₹14,999.', to: '/services/gmat-preparation' },
  { icon: Wrench, title: 'Ausbildung guidance', text: 'Understand Germany’s vocational training route and whether it fits you.', to: '/services/ausbildung' },
];

export default function ServicesPage() {
  useSeo({
    title: 'Services | BVF Germany',
    description: '14 services in six stages, from university shortlisting to settling in Germany, in one ₹59,999 package. Optional add-ons for IELTS, GRE, GMAT, German classes and accommodation.',
    url: 'https://www.bvfgermany.com/services',
    image: '/hero-og.png',
  });

  const universityShortlistService = serviceCatalog.find((service) => service.slug === 'university-shortlist');

  return (
    <div className="site-shell home-showcase">
      <Navbar />

      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <div className="poster-grid items-end">
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="col-span-12 lg:col-span-7">
                <p className="eyebrow-chip">Services</p>
                <h1 className="hero-display mt-7">14 services, one journey</h1>
                <p className="hero-copy">
                  Six stages, one team, with you from India to Germany. Items marked Add-on are optional, so you pay only for
                  what you need.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/bookings" className="button-primary">Book Free Consultation</Link>
                  <Link to="/pricing" className="button-secondary">See Pricing</Link>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.06 }} className="col-span-12 lg:col-span-5">
                <div className="surface-panel p-6">
                  <p className="section-kicker">The six stages</p>
                  <ol className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    {['Discover', 'Prepare', 'Apply', 'Fund', 'Fly', 'Settle'].map((stage, index) => (
                      <li key={stage} className="flex items-center gap-3 font-semibold text-foreground">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">{index + 1}</span>
                        {stage}
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <JourneyStagesSection className="pt-4 md:pt-6" />

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">Simple, honest pricing</p>
              <h2 className="section-title">One package covers your whole journey.</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                You pay in two parts, and the second part is due only once you have your offer letter.
              </p>
            </div>
            <PackagePriceCard className="mt-8" />
            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-bold text-foreground">Add-ons at a glance</h3>
                <AddOnsTable className="mt-2" />
              </div>
              <div className="surface-panel h-fit p-6">
                <p className="font-semibold text-foreground">Not sure which test you need?</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{testPrep.testAdvice.replace('Not sure which test you need? ', '')}</p>
                <Link to="/pricing" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                  Full pricing and official fees <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 md:px-8 md:pb-20">
          <div className="container-narrow">
            <h2 className="text-2xl font-bold text-foreground">More ways we help</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {moreOptions.map((option) => (
                <Link key={option.title} to={option.to} className="surface-panel group flex flex-col p-6 transition hover:-translate-y-0.5">
                  <option.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <p className="mt-4 text-lg font-semibold text-foreground">{option.title}</p>
                  <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{option.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
              <Link to="/dmat" className="surface-panel group flex flex-col p-6 transition hover:-translate-y-0.5 md:col-span-3">
                <p className="text-lg font-semibold text-foreground">dMAT exam guidance</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Some German universities use the dMAT for Master’s admissions. Read what it is, who needs it and how to register.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <TimelineSection className="pt-0 md:pt-0" />

        {universityShortlistService?.disciplineShortlists?.length ? (
          <section className="px-4 pb-16 md:px-8 md:pb-20">
            <div className="container-narrow">
              <div className="max-w-3xl">
                <p className="section-kicker">University Shortlisting</p>
                <h2 className="section-title">Shortlists by engineering discipline.</h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  Examples of public universities often considered for each branch. Your own shortlist is matched to your CGPA,
                  experience and goals.
                </p>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {universityShortlistService.disciplineShortlists.map((discipline) => (
                  <article key={discipline.title} className="surface-panel h-full p-6">
                    <h3 className="text-2xl font-semibold text-foreground">{discipline.title}</h3>
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

        <section className="px-4 pb-20 md:px-8 md:pb-24">
          <div className="container-narrow overflow-hidden rounded-[36px] bg-gradient-dark p-8 text-white md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="section-kicker text-[#FFCE00]">Free first consultation</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold md:text-5xl">Start your Germany journey today</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                  Book a free consultation with our student counsellors. No pressure, just honest advice.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/bookings" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5">
                  Book Consultation
                </Link>
                <WhatsAppCta label="WhatsApp Chat" />
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
