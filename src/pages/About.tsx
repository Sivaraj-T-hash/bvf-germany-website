import { motion } from 'framer-motion';
import { ArrowRight, Check, GraduationCap, HeartHandshake, Quote, Scale, ShieldCheck, Target, Users } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import StudentStories from '@/components/StudentStories';
import { founder, operationalHead, peopleIntro, founderStory, whyStarted, everyStudent, whatWeStandFor, founderMessage, operationalHeadProfile } from '@/content/team';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { buildWhatsappHref } from '@/lib/whatsapp';
import { useSeo } from '@/lib/useSeo';

const spring = { type: 'spring' as const, stiffness: 260, damping: 28 };
const valueIcons = [ShieldCheck, Target, GraduationCap, Users, HeartHandshake];

export default function AboutPage() {
  useSeo({
    title: 'About BVF Germany | The People Behind BVF Germany',
    description: 'Meet Bratlin, founder of BVF Germany, and Srinivasan Sivakumar, Operational Head: honest guidance for Indian students applying to German public universities.',
    image: '/hero-og.png',
  });

  const settings = useSiteSettings();
  const whatsappHref = buildWhatsappHref(settings, 'Hi BVF Germany! I read about your team and would like guidance for my Master’s in Germany.');

  return (
    <div className="site-shell home-showcase">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="page-hero overflow-hidden">
          <div className="page-hero-inner">
            <div className="poster-grid items-center gap-y-10">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="col-span-12 lg:col-span-7">
                <p className="eyebrow-chip">About BVF Germany</p>
                <h1 className="hero-display mt-7 max-w-4xl">{peopleIntro.title}</h1>
                <p className="mt-5 text-xl font-semibold text-foreground md:text-2xl">{peopleIntro.subtitle}</p>
                <div className="mt-6 max-w-2xl space-y-4 text-base leading-8 text-muted-foreground">
                  {peopleIntro.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/bookings" className="button-primary group">
                    Book Free Consultation
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button-secondary inline-flex items-center gap-2">
                    <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp
                  </a>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 0.08 }} className="col-span-12 lg:col-span-5">
                <figure className="overflow-hidden rounded-[32px] bg-[#1b1714] shadow-2xl">
                  <img src={founder.photo} alt={`${founder.name}, founder of BVF Germany`} className="h-[420px] w-full object-cover object-top" />
                  <figcaption className="p-6 text-white md:p-7">
                    <p className="font-heading text-2xl font-bold md:text-3xl">The Vision Behind BVF Germany</p>
                    <p className="mt-2 text-sm text-white/80 md:text-base">Real experiences. Honest guidance. Better opportunities.</p>
                    <p className="mt-4 text-lg font-bold">{founder.name} | {founder.role}</p>
                    <p className="mt-1 text-sm text-white/75">{founder.headline}</p>
                  </figcaption>
                </figure>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Founder story */}
        <section id="founder" className="scroll-mt-28 px-4 py-16 md:px-8 md:py-24">
          <div className="container-narrow grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={spring} className="lg:sticky lg:top-28">
              <img src={founder.photo} alt={founder.name} className="h-[520px] w-full rounded-[36px] border-4 border-white object-cover object-top shadow-2xl" loading="lazy" />
              <div className="mt-5 rounded-[24px] border border-border bg-card p-5">
                <p className="text-lg font-bold text-foreground">{founder.name}</p>
                <p className="text-sm font-semibold text-primary">Founder, BVF Germany</p>
                <p className="mt-2 text-sm text-muted-foreground">{founder.headline}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.1 }} transition={spring}>
              <p className="section-kicker">Our Founder</p>
              <h2 className="section-title">{founderStory.heading}</h2>
              <p className="mt-5 text-lg font-semibold leading-8 text-foreground">{founderStory.lead}</p>
              <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
                {founderStory.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <blockquote className="mt-6 rounded-[24px] border-l-4 border-secondary bg-secondary/10 p-6 text-lg font-semibold leading-8 text-foreground">
                {founderStory.question}
              </blockquote>
              <p className="mt-6 text-base font-semibold text-foreground">{founderStory.closing}</p>

              <h3 className="mt-14 font-heading text-3xl font-semibold text-foreground">{whyStarted.heading}</h3>
              <div className="mt-5 space-y-5 text-base leading-8 text-muted-foreground">
                {whyStarted.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-6 font-semibold text-foreground">{whyStarted.helpIntro}</p>
              <ul className="mt-4 space-y-3">
                {whyStarted.helpItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-7 text-foreground">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-base leading-8 text-muted-foreground">{whyStarted.closing}</p>
            </motion.div>
          </div>
        </section>

        {/* Every student has a story */}
        <section className="bg-muted/30 px-4 pt-16 md:px-8 md:pt-24">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">Student journeys</p>
              <h2 className="section-title">{everyStudent.heading}</h2>
              <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
                {everyStudent.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
        <StudentStories kicker="Success stories" title="Some of the students we have guided" className="bg-muted/30 px-4 pb-16 pt-10 md:px-8 md:pb-24" />

        {/* What we stand for */}
        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">Our values</p>
              <h2 className="section-title">{whatWeStandFor.heading}</h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{whatWeStandFor.intro}</p>
              <p className="mt-6 flex items-start gap-3 text-xl font-semibold leading-8 text-foreground">
                <Quote className="mt-1 h-6 w-6 shrink-0 text-secondary" aria-hidden="true" />
                {whatWeStandFor.belief}
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {whatWeStandFor.values.map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length];
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...spring, delay: index * 0.05 }}
                    className="surface-panel p-6"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#132033]">
                      <Icon className="h-6 w-6 text-[#facc15]" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{value.text}</p>
                  </motion.div>
                );
              })}
            </div>
            <p className="mt-8 flex items-start gap-3 rounded-[24px] border border-border bg-card p-6 text-sm leading-7 text-foreground">
              <Scale className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              {whatWeStandFor.disclaimer}
            </p>
          </div>
        </section>

        {/* Operational head */}
        <section id="operational-head" className="scroll-mt-28 bg-[linear-gradient(160deg,#0c1a38,#1d345e)] px-4 py-16 text-white md:px-8 md:py-24">
          <div className="container-narrow grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={spring}>
              <img src={operationalHead.photo} alt={operationalHead.name} className="h-[520px] w-full rounded-[36px] object-cover object-top shadow-2xl" loading="lazy" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ ...spring, delay: 0.05 }}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#facc15]">Operational Head</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold md:text-5xl">{operationalHeadProfile.heading}</h2>
              <p className="mt-4 text-base font-semibold text-white/85">{operationalHead.headline}</p>
              <div className="mt-6 space-y-5 text-base leading-8 text-white/78">
                {operationalHeadProfile.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <h3 className="mt-10 text-2xl font-semibold text-[#facc15]">{operationalHeadProfile.visionHeading}</h3>
              <div className="mt-4 space-y-4 text-base leading-8 text-white/78">
                {operationalHeadProfile.vision.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-6 rounded-[24px] bg-white/10 p-6 text-lg font-semibold leading-8 text-white">{operationalHeadProfile.visionHighlight}</p>
              <p className="mt-6 text-base leading-8 text-white/78">{operationalHeadProfile.closing}</p>
            </motion.div>
          </div>
        </section>

        {/* Founder message */}
        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="container-narrow max-w-4xl">
            <p className="section-kicker">From our founder</p>
            <h2 className="section-title">{founderMessage.heading}</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
              {founderMessage.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-8 rounded-[28px] bg-[#132033] p-7 text-xl font-semibold leading-9 text-white">{founderMessage.highlight}</p>
            <p className="mt-8 text-base leading-8 text-muted-foreground">{founderMessage.invitation}</p>
            <p className="mt-4 text-lg font-bold text-foreground">{founderMessage.signoff}</p>
            <div className="mt-6 flex items-center gap-4">
              <img src={founder.photo} alt="" className="h-14 w-14 rounded-full object-cover object-top" loading="lazy" />
              <p className="text-base font-semibold text-foreground">{founderMessage.signature}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 pt-6 md:px-8 md:pb-24">
          <div className="container-narrow overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-12 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:px-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Free first consultation</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold text-secondary md:text-5xl">Your future deserves the right guidance.</h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
                  Book a free consultation with our team. No pressure, just honest advice about your profile and your options at German public universities.
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
