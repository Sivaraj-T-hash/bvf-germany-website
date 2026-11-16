import { useState } from 'react';
import { ArrowRight, BadgeCheck, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Clock, GraduationCap, Languages, Coins, Settings, Briefcase, HeartPulse, Building, FlaskConical, Zap, Truck, Cpu, Box, Banknote, Target, AreaChart, Laptop, HandPlatter, Phone, Code, LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BrandVisual from '@/components/BrandVisual';
import { useSeo } from '@/lib/useSeo';
import { buildFaqStructuredData } from '@/lib/seo';
import technicalUniversityOfMunichLogo from '@/assets/Technical University of Munich.png';
import rwthAachenUniversityLogo from '@/assets/RWTH Aachen University .png';
import heidelbergUniversityLogo from '@/assets/Heidelberg University.png';
import universityOfBonnLogo from '@/assets/University of Bonn.png';
import universityOfStuttgartLogo from '@/assets/University of Stuttgart.png';
import karlsruheInstituteOfTechnologyLogo from '@/assets/Karlsruhe Institute of Technology.png';
import technicalUniversityOfBerlinLogo from '@/assets/Technical University of Berlin.png';
import tuDresdenLogo from '@/assets/TU Dresden.png';
import mannheimBusinessSchoolLogo from '@/assets/Mannheim Business School.png';
import esmtBerlinLogo from '@/assets/ESMT Berlin.png';
import frankfurtSchoolOfFinanceLogo from '@/assets/Frankfurt School of Finance.png';
import whuOttoBeisheimSchoolLogo from '@/assets/WHU - Otto Beisheim School.png';
import hhlLeipzigGraduateSchoolLogo from '@/assets/HHL Leipzig Graduate School.png';

type CTA = {
  label: string;
  to: string;
  external?: boolean;
};

type SummaryFact = {
  label: string;
  value: string;
};

type PathwayCard = {
  title: string;
  audience: string;
  summary: string;
  bullets: string[];
  linkLabel: string;
  linkTo: string;
  external?: boolean;
};

type InfoCard = {
  eyebrow: string;
  title: string;
  text: string;
  bullets?: string[];
  note?: string;
};

type Step = {
  title: string;
  text: string;
};

type ToolLink = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

type TrackCard = {
  title: string;
  text: string;
  icon: string;
};

type FaqItem = {
  q: string;
  a: string;
};

type StudyProgramPageProps = {
  title: string;
  subtitle: string;
  heroBadge?: string;
  /** Genuine photograph only; leave out to show the branded graphic. */
  heroImage?: string;
  heroHighlights: string[];
  primaryCta: CTA;
  secondaryCta?: CTA;
  summaryFacts: SummaryFact[];
  overviewTitle: string;
  overviewText: string;
  overviewBullets: string[];
  checklistTitle: string;
  checklistItems: string[];
  warningText: string;
  pathwaysTitle: string;
  pathwaysIntro: string;
  pathways: PathwayCard[];
  requirementsTitle: string;
  requirementsIntro: string;
  requirements: InfoCard[];
  stepsTitle: string;
  stepsIntro: string;
  steps: Step[];
  planningTitle: string;
  planningIntro: string;
  planningCards: InfoCard[];
  toolsTitle: string;
  tools: ToolLink[];
  tracksTitle: string;
  tracksIntro: string;
  tracks: TrackCard[];
  universitiesTitle: string;
  universities: string[];
  logos: string[];
  faqs: FaqItem[];
  finalCtaTitle: string;
  finalCtaText: string;
  finalPrimaryCta: CTA;
  finalSecondaryCta?: CTA;
};

const universityLogoMap: Record<string, string> = {
  'Technical University of Munich': technicalUniversityOfMunichLogo,
  'RWTH Aachen University': rwthAachenUniversityLogo,
  'Heidelberg University': heidelbergUniversityLogo,
  'University of Bonn': universityOfBonnLogo,
  'University of Stuttgart': universityOfStuttgartLogo,
  'Karlsruhe Institute of Technology': karlsruheInstituteOfTechnologyLogo,
  'Technical University of Berlin': technicalUniversityOfBerlinLogo,
  'TU Berlin': technicalUniversityOfBerlinLogo,
  'TU Dresden': tuDresdenLogo,
  'Mannheim Business School': mannheimBusinessSchoolLogo,
  'ESMT Berlin': esmtBerlinLogo,
  'Frankfurt School of Finance': frankfurtSchoolOfFinanceLogo,
  'Frankfurt School of Finance and Management': frankfurtSchoolOfFinanceLogo,
  'WHU - Otto Beisheim School': whuOttoBeisheimSchoolLogo,
  'WHU - Otto Beisheim School of Management': whuOttoBeisheimSchoolLogo,
  'HHL Leipzig Graduate School': hhlLeipzigGraduateSchoolLogo,
  'HHL Leipzig Graduate School of Management': hhlLeipzigGraduateSchoolLogo,
};

function renderLinkProps(cta: CTA) {
  return cta.external
    ? { href: cta.to, target: '_blank', rel: 'noreferrer' }
    : { href: cta.to };
}

function isExternalLink(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function ActionButton({ cta, variant = 'primary' }: { cta: CTA; variant?: 'primary' | 'secondary' | 'ghost' }) {
  const baseClass =
    variant === 'primary'
      ? 'bg-[#0f766e] text-white hover:bg-[#115e59]'
      : variant === 'secondary'
        ? 'bg-white/92 text-foreground ring-1 ring-border hover:bg-white'
        : 'bg-transparent text-foreground hover:bg-white/70';

  return (
    <a
      {...renderLinkProps(cta)}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${baseClass}`}
    >
      {cta.label}
      {cta.external ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
    </a>
  );
}

function ExpandableAnswer({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const maxChars = 220;
  const shouldTrim = text.length > maxChars;
  const visibleText = expanded || !shouldTrim ? text : `${text.slice(0, maxChars).trim()}...`;

  return (
    <div>
      <p className="text-sm leading-7 text-muted-foreground">{visibleText}</p>
      {shouldTrim ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      ) : null}
    </div>
  );
}

const getIconForFact = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes('duration')) return <Clock className="h-5 w-5" strokeWidth={2} />;
  if (normalized.includes('eligibility')) return <GraduationCap className="h-5 w-5" strokeWidth={2} />;
  if (normalized.includes('language')) return <Languages className="h-5 w-5" strokeWidth={2} />;
  if (normalized.includes('tuition') || normalized.includes('cost')) return <Coins className="h-5 w-5" strokeWidth={2} />;
  return <BadgeCheck className="h-5 w-5" strokeWidth={2} />;
};

const getIconForTrack = (iconCode: string) => {
  const icons: Record<string, LucideIcon> = {
    MECH: Settings,
    CS: Code,
    BIZ: Briefcase,
    MED: HeartPulse,
    ARC: Building,
    SCI: FlaskConical,
    ELEC: Zap,
    CIV: Building,
    AUTO: Truck,
    ROBO: Cpu,
    IB: Briefcase,
    SCM: Box,
    FIN: Banknote,
    MKT: Target,
    DATA: AreaChart,
    STR: AreaChart,
    NUR: HeartPulse,
    IT: Laptop,
    HOSP: HandPlatter,
    LOG: Truck,
    SERV: Phone,
  };
  const IconComponent = icons[iconCode] || Briefcase;
  return <IconComponent className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />;
};

export default function StudyProgramPage({
  title,
  subtitle,
  heroBadge,
  heroImage,
  heroHighlights,
  primaryCta,
  secondaryCta,
  summaryFacts,
  overviewTitle,
  overviewText,
  overviewBullets,
  checklistTitle,
  checklistItems,
  warningText,
  pathwaysTitle,
  pathwaysIntro,
  pathways,
  requirementsTitle,
  requirementsIntro,
  requirements,
  stepsTitle,
  stepsIntro,
  steps,
  planningTitle,
  planningIntro,
  planningCards,
  toolsTitle,
  tools,
  tracksTitle,
  tracksIntro,
  tracks,
  universitiesTitle,
  universities,
  logos,
  faqs,
  finalCtaTitle,
  finalCtaText,
  finalPrimaryCta,
  finalSecondaryCta,
}: StudyProgramPageProps) {
  const location = useLocation();

  useSeo({
    title: `${title} | BVF Germany`,
    description: subtitle,
    breadcrumb: [
      { name: 'Study in Germany', path: '/study-in-germany' },
      { name: title, path: location.pathname },
    ],
    structuredData: buildFaqStructuredData(faqs),
  });

  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-foreground">
      <Navbar />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#13231f_0%,#1e3a33_42%,#f0dcc2_100%)] pb-12 pt-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(242,201,76,0.16),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-[1380px] gap-10 px-4 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-3xl">
            {heroBadge ? (
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#f2c94c]">{heroBadge}</p>
            ) : null}
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[0.96] md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 md:text-lg">{subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ActionButton cta={primaryCta} />
              {secondaryCta ? <ActionButton cta={secondaryCta} variant="secondary" /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {heroHighlights.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90 ring-1 ring-white/15 backdrop-blur"
                >
                  <BadgeCheck className="h-4 w-4 text-[#f2c94c]" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-white/18 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
            {heroImage ? (
              <img src={heroImage} alt="" className="h-[280px] w-full rounded-[28px] object-cover md:h-[420px]" loading="lazy" />
            ) : (
              <BrandVisual title={title} kicker="Study in Germany" className="h-[280px] w-full rounded-[28px] md:h-[420px]" />
            )}
          </div>
        </div>
      </section>

      <section className="py-8 relative z-20">
        <div className="mx-auto grid max-w-[1380px] gap-4 px-4 md:grid-cols-2 md:px-8 lg:grid-cols-4">
          {summaryFacts.map((fact) => (
            <div key={fact.label} className="group flex items-start gap-4 rounded-[28px] border border-[#d5c5af]/50 bg-white/60 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white shadow-sm text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                {getIconForFact(fact.label)}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">{fact.label}</p>
                <p className="mt-1 text-[15px] font-semibold leading-relaxed text-foreground">{fact.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-[1180px] px-4 py-10 md:px-8">
        <div className="space-y-8">
          <section id="summary" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-border/80 bg-white/95 p-7 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Start here</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{overviewTitle}</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">{overviewText}</p>
              <div className="mt-6 grid gap-3">
                {overviewBullets.map((point) => (
                  <div key={point} className="flex gap-3 rounded-2xl bg-muted/45 px-4 py-3">
                    <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-[#0f766e]" />
                    <p className="text-sm leading-7 text-foreground/88">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[32px] border border-border/80 bg-[#14231f] p-6 text-white shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f2c94c]">Checklist</p>
                <h3 className="mt-3 text-2xl font-semibold">{checklistTitle}</h3>
                <div className="mt-5 space-y-3">
                  {checklistItems.map((item, index) => (
                    <div key={item} className="flex gap-3 rounded-2xl bg-white/8 px-4 py-3">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f2c94c] text-sm font-semibold text-[#14231f]">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-7 text-white/88">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#d8b37a] bg-[#fff3de] p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-[#b45309]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#8a4b00]">Important</p>
                    <p className="mt-2 text-sm leading-7 text-[#7b4c16]">{warningText}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="paths" className="rounded-[36px] border border-border/80 bg-white/92 p-7 shadow-card">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Choose your route</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{pathwaysTitle}</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">{pathwaysIntro}</p>
            </div>
            <div className="mt-7 grid gap-4 xl:grid-cols-3">
              {pathways.map((path) => (
                <article key={path.title} className="flex h-full flex-col rounded-[28px] border border-border/80 bg-[linear-gradient(180deg,#fffdf8_0%,#f7f3ec_100%)] p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{path.audience}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-foreground">{path.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{path.summary}</p>
                  <div className="mt-4 space-y-2.5">
                    {path.bullets.map((bullet) => (
                      <div key={bullet} className="flex gap-3 text-sm leading-7 text-foreground/86">
                        <span className="mt-2 h-2 w-2 rounded-full bg-[#0f766e]" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-2">
                    {path.external ?? isExternalLink(path.linkTo) ? (
                      <a
                        href={path.linkTo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                      >
                        {path.linkLabel}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link to={path.linkTo} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        {path.linkLabel}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="requirements" className="rounded-[36px] border border-border/80 bg-[#f7f2ea] p-7 shadow-card">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">What you need</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{requirementsTitle}</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">{requirementsIntro}</p>
            </div>
            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {requirements.map((card) => (
                <article key={card.title} className="rounded-[28px] border border-border/70 bg-white/95 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{card.eyebrow}</p>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.text}</p>
                  {card.bullets?.length ? (
                    <div className="mt-4 space-y-2.5">
                      {card.bullets.map((bullet) => (
                        <div key={bullet} className="flex gap-3 text-sm leading-7 text-foreground/86">
                          <span className="mt-2 h-2 w-2 rounded-full bg-[#c16c2c]" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {card.note ? (
                    <div className="mt-5 rounded-2xl bg-[#fff6e5] px-4 py-3 text-sm leading-7 text-[#8a4b00]">{card.note}</div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section id="steps" className="rounded-[36px] border border-border/80 bg-white/92 p-7 shadow-card">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Application timeline</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{stepsTitle}</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">{stepsIntro}</p>
            </div>
            <div className="mt-7 grid gap-4 lg:grid-cols-2">
              {steps.map((step, index) => (
                <article key={step.title} className="rounded-[28px] border border-border/70 bg-[#fbfaf7] p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="planning" className="rounded-[36px] border border-border/80 bg-[linear-gradient(135deg,#172923_0%,#203a31_52%,#2f5d4d_100%)] p-7 text-white shadow-card">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f2c94c]">Plan ahead</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">{planningTitle}</h2>
              <p className="mt-4 text-base leading-8 text-white/78">{planningIntro}</p>
            </div>
            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {planningCards.map((card) => (
                <article key={card.title} className="rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f2c94c]">{card.eyebrow}</p>
                  <h3 className="mt-3 text-xl font-semibold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/78">{card.text}</p>
                  {card.bullets?.length ? (
                    <div className="mt-4 space-y-2.5">
                      {card.bullets.map((bullet) => (
                        <div key={bullet} className="flex gap-3 text-sm leading-7 text-white/82">
                          <span className="mt-2 h-2 w-2 rounded-full bg-[#f2c94c]" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {card.note ? <p className="mt-4 text-sm font-medium text-[#f6dca6]">{card.note}</p> : null}
                </article>
              ))}
            </div>
          </section>

          <section id="tools" className="rounded-[36px] border border-border/80 bg-white/92 p-7 shadow-card">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Verify with official sources</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{toolsTitle}</h2>
            </div>
            <div className="mt-7 grid gap-4 lg:grid-cols-2">
              {tools.map((tool) => (
                tool.external ?? isExternalLink(tool.href) ? (
                  <a
                    key={tool.title}
                    href={tool.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-[28px] border border-border/70 bg-[#fbfaf7] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{tool.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{tool.description}</p>
                      </div>
                      <ExternalLink className="mt-1 h-5 w-5 text-muted-foreground transition group-hover:text-primary" aria-hidden="true" />
                    </div>
                  </a>
                ) : (
                  <Link
                    key={tool.title}
                    to={tool.href}
                    className="group rounded-[28px] border border-border/70 bg-[#fbfaf7] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{tool.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{tool.description}</p>
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 text-muted-foreground transition group-hover:text-primary" aria-hidden="true" />
                    </div>
                  </Link>
                )
              ))}
            </div>
          </section>

          <section id="tracks" className="relative overflow-hidden rounded-[40px] border border-border/50 bg-[#fffdf9] shadow-card">
            <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
              <BadgeCheck className="w-96 h-96" />
            </div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Program options</p>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{tracksTitle}</h2>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">{tracksIntro}</p>
              </div>
              
              <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {tracks.map((track) => (
                  <article key={track.title} className="group relative flex flex-col items-start rounded-[32px] border border-border/60 bg-white p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f8f9fa] shadow-inner transition-colors duration-300 group-hover:bg-primary/5">
                      {getIconForTrack(track.icon)}
                    </div>
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">{track.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground/90">{track.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="rounded-[36px] border border-border/80 bg-white/92 p-7 shadow-card">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Answers students usually need before applying</h2>
            </div>
            <div className="mt-7 overflow-hidden rounded-[28px] border border-border/70 bg-[#fbfaf7]">
              {faqs.map((faq, idx) => (
                <div key={faq.q} className="border-b border-border/70 last:border-b-0">
                  <button
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    type="button"
                  >
                    <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="h-4 w-4 text-primary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === idx ? (
                    <div className="px-5 pb-5">
                      <ExpandableAnswer text={faq.a} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section id="universities" className="rounded-[36px] border border-border/80 bg-white/92 p-7 shadow-card">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">University examples</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{universitiesTitle}</h2>
                <ol className="mt-5 space-y-2 pl-5 text-sm leading-7 text-foreground/86 list-decimal">
                  {universities.map((university) => (
                    <li key={university}>{university}</li>
                  ))}
                </ol>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {logos.map((logo) => (
                  <div key={logo} className="flex min-h-[92px] items-center justify-center rounded-[24px] border border-border/70 bg-[#fbfaf7] px-5 py-4 text-center text-sm font-semibold text-foreground shadow-sm">
                    {universityLogoMap[logo] ? (
                      <img
                        src={universityLogoMap[logo]}
                        alt={`${logo} logo`}
                        className="h-10 w-full max-w-[180px] object-contain"
                        loading="lazy"
                      />
                    ) : (
                      logo
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <section className="mt-8 rounded-[38px] border border-border/80 bg-[linear-gradient(135deg,#f0ddbe_0%,#efe8da_48%,#ffffff_100%)] p-7 shadow-card">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Next step</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{finalCtaTitle}</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{finalCtaText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ActionButton cta={finalPrimaryCta} />
              {finalSecondaryCta ? <ActionButton cta={finalSecondaryCta} variant="secondary" /> : null}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
