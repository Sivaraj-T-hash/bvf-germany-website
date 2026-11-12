import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Coins,
  FileText,
  Globe2,
  GraduationCap,
  House,
  Languages,
  PlaneTakeoff,
  SearchCheck,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { whatsappLink } from '@/lib/contact';
import { useSeo } from '@/lib/useSeo';

const spring = { type: 'spring' as const, stiffness: 280, damping: 30 };

const trustStrip = [
  'Low tuition at many public universities',
  'Globally respected degrees',
  'Work opportunities during and after study',
  'End-to-end student support',
];

const sectionNavItems = [
  { label: 'Why Germany', href: '#why' },
  { label: 'Study paths', href: '#paths' },
  { label: 'Journey', href: '#journey' },
  { label: 'Costs', href: '#costs' },
  { label: 'Eligibility', href: '#eligibility' },
  { label: 'Life in Germany', href: '#life' },
];

const whyGermanyCards = [
  {
    number: '01',
    title: 'High-quality education',
    text: 'Germany offers respected universities with strong academic standards, research depth, and practical industry links.',
  },
  {
    number: '02',
    title: 'Low study costs',
    text: 'Public universities often charge no tuition, with students usually paying a semester contribution instead.',
  },
  {
    number: '03',
    title: 'Wide programme choice',
    text: 'Students can choose technical, academic, and business-focused routes across German- and English-medium options.',
  },
  {
    number: '04',
    title: 'Career pathway',
    text: 'Germany offers student work rights during study and post-study time to search for a relevant job after graduation.',
  },
];

const studyPaths = [
  {
    title: "Bachelor's",
    audience: 'Undergraduate degree programs in Germany',
    duration: 'Usually 3 to 4 years',
    language: 'Mostly German, some English options',
    to: '/about-germany/bachelor',
    badge: 'Undergraduate',
  },
  {
    title: "Master's in Engineering",
    audience: 'Postgraduate engineering specializations',
    duration: 'Usually 1.5 to 2 years',
    language: 'Many English-taught options, plus some German routes',
    to: '/about-germany/engineering',
    badge: 'Engineering',
  },
  {
    title: "Master's in Business Management",
    audience: 'MBA & management postgraduate programs',
    duration: 'Usually 1.5 to 2 years',
    language: 'Mostly English with some mixed-format options',
    to: '/about-germany/mba',
    badge: 'Management',
  },
  {
    title: 'Ausbildung',
    audience: 'German vocational training programs',
    duration: 'Usually 2 to 3.5 years',
    language: 'Mostly German',
    to: '/about-germany/ausbildung',
    badge: 'Vocational',
  },
];

const journeySteps = [
  {
    step: '01',
    title: 'Choose your study goal',
    text: "Start with the route that matches your current stage: bachelor's, master's in engineering, business management, or Ausbildung.",
    icon: GraduationCap,
  },
  {
    step: '02',
    title: 'Check eligibility',
    text: 'Verify your academic background, route, and whether you need direct admission, prior study, or Studienkolleg.',
    icon: SearchCheck,
  },
  {
    step: '03',
    title: 'Prepare language and documents',
    text: 'Plan German or English proof and organise transcripts, passport documents, and other required paperwork.',
    icon: FileText,
  },
  {
    step: '04',
    title: 'Apply to universities or via uni-assist',
    text: 'Submit through the correct channel based on the programme and university instructions.',
    icon: ArrowRight,
  },
  {
    step: '05',
    title: 'Arrange visa, finances, and accommodation',
    text: 'Plan blocked account, health insurance, housing, and visa preparation with enough time.',
    icon: ShieldCheck,
  },
  {
    step: '06',
    title: 'Arrive and start your studies',
    text: 'Move from planning into Germany with clearer expectations on enrolment, settlement, and student life.',
    icon: PlaneTakeoff,
  },
];

const costCards = [
  {
    label: 'Tuition',
    value: 'Often none',
    note: 'At many public universities',
  },
  {
    label: 'Semester contribution',
    value: 'Around EUR 300',
    note: 'Depends on the institution and city',
  },
  {
    label: 'Monthly living cost',
    value: 'About EUR 1,150',
    note: 'Including rent, food, transport, and insurance',
  },
];

const budgetingItems = ['Accommodation', 'Food', 'Health insurance', 'Local transport', 'Study materials'];

const lifeCards = [
  {
    title: 'Accommodation',
    text: 'Student residences, shared flats, and private rentals are common options depending on city and availability.',
    icon: House,
  },
  {
    title: 'Student work',
    text: 'International students can usually work 120 full days or 240 half days per year while studying.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Campus life',
    text: 'Universities offer international offices, student communities, events, and local support structures.',
    icon: Globe2,
  },
  {
    title: 'After graduation',
    text: 'Graduates can usually stay up to 18 months to search for relevant work after completing their degree.',
    icon: WalletCards,
  },
];

export default function AboutGermanyPage() {
  useSeo({
    title: 'Study in Germany | BVF Germany',
    description:
      "Explore bachelor's, master's in engineering, master's in business management, and Ausbildung pathways in Germany with a clearer view of eligibility, language, costs, planning, and next steps.",
    url: 'https://bvf-student-support.web.app/about-germany',
    image: '/hero-og.png',
  });

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const siteSettings = await getSiteSettings();
      if (!active) return;
      setSettings(siteSettings);
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const whatsappHref = whatsappLink(settings, settings?.prefilledWhatsappMessage || 'Hi BVF Germany! I want help planning my study route for Germany.');

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-foreground">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#13231f_0%,#1d3a31_48%,#f0dcc2_100%)] pb-14 pt-28 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,201,76,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-[1280px] gap-10 px-4 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#f2c94c]">About Germany</p>
              <h1 className="mt-4 text-5xl font-semibold leading-[0.95] md:text-7xl">
                Study in Germany with clarity, not confusion
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                Explore the best route for your goals - bachelor's, master's in engineering, master's in business
                management, or Ausbildung - and understand eligibility, costs, language, and application steps before
                you apply. Germany is known for strong universities, low tuition at many public institutions, and solid
                career opportunities after graduation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#paths" className="inline-flex items-center justify-center rounded-full bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#115e59]">
                  Explore study paths
                </a>
                <Link to="/bookings" className="inline-flex items-center justify-center rounded-full bg-white/92 px-6 py-3 text-sm font-semibold text-foreground ring-1 ring-white/30 transition hover:bg-white">
                  Book expert guidance
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.06 }}
              className="rounded-[34px] border border-white/18 bg-white/10 p-4 shadow-2xl backdrop-blur-md"
            >
              <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,242,232,0.96))] p-6 text-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Germany study snapshot</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Main routes', value: '4 clear study paths' },
                    { label: 'Public tuition', value: 'Often low or none' },
                    { label: 'Language mix', value: 'German plus English options' },
                    { label: 'Student future', value: 'Work during and after study' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[22px] border border-border/70 bg-white/80 px-4 py-4 shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-[#d5c5af] bg-[#f0dfc9] py-5">
          <div className="mx-auto grid max-w-[1280px] gap-4 px-4 md:grid-cols-2 md:px-8 lg:grid-cols-4">
            {trustStrip.map((item) => (
              <div key={item} className="rounded-[22px] border border-black/5 bg-white/72 px-4 py-4 text-sm font-medium text-foreground shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="sticky top-16 z-30 border-b border-[#dbcab3] bg-[#f5f1e8]/92 backdrop-blur md:top-20">
          <div className="mx-auto flex max-w-[1280px] gap-3 overflow-x-auto px-4 py-3 md:px-8">
            {sectionNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-[#d9cab7] bg-white/88 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/35 hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </div>
        </section>

        <section id="why" className="mx-auto max-w-[1180px] px-4 py-14 md:px-8 md:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Why Germany</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Why students choose Germany</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Germany stands out because it combines academic quality, lower public-study costs, strong student support,
              and a practical route into European study and work life.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {whyGermanyCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...spring, delay: index * 0.05 }}
                className="rounded-[30px] border border-border/80 bg-white/92 p-6 shadow-card"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">{card.number}</p>
                <h3 className="mt-3 text-2xl font-semibold text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="paths" className="mx-auto max-w-[1180px] px-4 py-4 md:px-8 md:py-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Choose your path</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Pick the Germany study route that fits your stage</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              This page is your route selector. Go deeper only into the path that matches your academic stage and goal.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {studyPaths.map((path, index) => (
              <motion.article
                key={path.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...spring, delay: index * 0.05 }}
                className="group overflow-hidden rounded-[30px] border border-border/80 bg-white/92 shadow-card transition hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="relative h-56 overflow-hidden">
                  <div aria-hidden="true" className="h-full w-full bg-[radial-gradient(circle_at_80%_20%,rgba(242,201,76,0.28),transparent_40%),linear-gradient(140deg,#13231f_0%,#1e3a33_60%,#14231f_100%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14231f]/80 via-[#14231f]/15 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                    {path.badge}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f2c94c]">Best for</p>
                    <h3 className="mt-2 text-2xl font-semibold">{path.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-7 text-muted-foreground">{path.audience}</p>
                  <div className="mt-5 grid gap-3 rounded-[24px] bg-[#f7f2ea] p-4 text-sm text-foreground/88">
                    <div>
                      <span className="font-semibold text-foreground">Duration:</span> {path.duration}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Language:</span> {path.language}
                    </div>
                  </div>
                  <Link to={path.to} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    View pathway
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="journey" className="mx-auto max-w-[1180px] px-4 py-14 md:px-8 md:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">How it works</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">The Germany study journey in the right order</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              The process feels much easier when students understand the order of decisions early: goal, eligibility,
              documents, application, visa, and arrival.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {journeySteps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...spring, delay: index * 0.04 }}
                className="rounded-[30px] border border-border/80 bg-white/92 p-6 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0f766e] text-white">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Step {step.step}</p>
                    <h3 className="mt-1 text-xl font-semibold text-foreground">{step.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="costs" className="mx-auto max-w-[1180px] px-4 py-4 md:px-8 md:py-8">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Costs and planning</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">What students usually want to know first about cost</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Germany is cost-conscious compared with many study destinations, but good planning still matters. Public
                tuition, semester contribution, and monthly living costs should all be understood early.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {costCards.map((card, index) => (
                  <motion.article
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...spring, delay: index * 0.04 }}
                    className="rounded-[28px] border border-border/80 bg-white/92 p-5 shadow-card"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">{card.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-foreground">{card.value}</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.note}</p>
                  </motion.article>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Private universities and some specialised programmes may charge tuition fees.
              </p>
            </div>

            <div className="rounded-[32px] border border-border/80 bg-[#14231f] p-6 text-white shadow-card">
              <div className="flex items-center gap-3">
                <Coins className="h-5 w-5 text-[#f2c94c]" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f2c94c]">What to budget for</p>
              </div>
              <div className="mt-6 space-y-3">
                {budgetingItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/8 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#f2c94c]" aria-hidden="true" />
                    <p className="text-sm leading-7 text-white/84">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="eligibility" className="mx-auto max-w-[1180px] px-4 py-14 md:px-8 md:py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={spring}
              className="rounded-[32px] border border-border/80 bg-white/92 p-7 shadow-card"
            >
              <div className="flex items-center gap-3">
                <Languages className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Language</p>
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Language matters</h2>
              <p className="mt-4 text-sm leading-8 text-muted-foreground">
                Most bachelor's and Ausbildung programmes are taught in German, while English-taught options exist but
                are fewer. For master's in engineering and business management pathways, English options are more
                common depending on the field and institution.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/tools#eligibility" className="inline-flex items-center justify-center rounded-full bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115e59]">
                  Check bachelor eligibility
                </Link>
                <Link to="/about-germany/ms" className="inline-flex items-center justify-center rounded-full bg-[#f7f2ea] px-5 py-3 text-sm font-semibold text-foreground ring-1 ring-border transition hover:bg-white">
                  Explore English-taught routes
                </Link>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...spring, delay: 0.05 }}
              className="rounded-[32px] border border-border/80 bg-[#f7f2ea] p-7 shadow-card"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Eligibility</p>
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Eligibility depends on your background</h2>
              <p className="mt-4 text-sm leading-8 text-muted-foreground">
                Your school or university qualification may lead to direct admission, additional requirements, or a
                Studienkolleg pathway. Always verify your route before applying instead of assuming the same path works
                for every student.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  'Some students can apply directly.',
                  'Some need prior study or a Studienkolleg route.',
                  "Bachelor's pathways are usually more recognition-sensitive than postgraduate management or engineering routes.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-white/90 px-4 py-3 text-sm leading-7 text-foreground/86">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#0f766e]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          </div>
        </section>

        <section id="life" className="mx-auto max-w-[1180px] px-4 py-4 md:px-8 md:py-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Life and work in Germany</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Practical reasons Germany feels like a real long-term option</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Germany is not only about the classroom. Students also care about housing, campus support, part-time work,
              and what happens after graduation.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {lifeCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...spring, delay: index * 0.05 }}
                className="rounded-[30px] border border-border/80 bg-white/92 p-6 shadow-card"
              >
                <card.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-2xl font-semibold text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-16 md:px-8 md:py-20">
          <div className="rounded-[38px] border border-border/80 bg-[linear-gradient(135deg,#f0ddbe_0%,#efe8da_48%,#ffffff_100%)] p-7 shadow-card md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Support CTA</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Not sure which Germany path is right for you?</h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                  Start with the right route instead of guessing. Explore your study option, understand your eligibility,
                  and get support for the next step.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:items-start">
                <div className="flex flex-wrap gap-3">
                  <a href="#paths" className="inline-flex items-center justify-center rounded-full bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#115e59]">
                    Find your Germany study path
                  </a>
                  <Link to="/bookings" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground ring-1 ring-border transition hover:bg-[#fbfaf7]">
                    Talk to a mentor
                  </Link>
                </div>
                {whatsappHref ? (<a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 transition hover:text-foreground">
                  Chat on WhatsApp
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>) : null}
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
