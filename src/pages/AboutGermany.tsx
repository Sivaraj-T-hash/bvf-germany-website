import { useEffect, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Languages, ShieldCheck, Clock, GraduationCap, Coins, Building2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { useSeo } from '@/lib/useSeo';
import { buildWhatsappHref } from '@/lib/whatsapp';
import SceneIllustration from '@/components/SceneIllustration';

const studyPrograms = [
  {
    title: "Bachelor's Degree",
    to: '/study-in-germany/bachelor',
    scene: 'city' as const,
    duration: '3-4 years',
    eligibility: 'A-Levels / 12th Grade (PCM/PCB/Commerce)',
    language: 'IELTS 6.0-6.5 or German B2',
    tuition: 'Free (Semester fee EUR 150-350)',
    universities: 'TU Munich, RWTH Aachen, Heidelberg, FU Berlin, KIT',
    fields: 'Mechanical Eng, CS, Business, Medicine, Architecture',
  },
  {
    title: "Master's in Engineering",
    to: '/study-in-germany/engineering',
    scene: 'campus' as const,
    duration: '2 years (4 semesters)',
    eligibility: 'B.Tech / B.E. in relevant field (min 55-60%)',
    language: 'IELTS 6.5-7.0 or German B2/C1',
    tuition: 'Free (Semester fee EUR 150-350)',
    universities: 'TU Munich, TU Berlin, Stuttgart, Darmstadt, Hamburg',
    fields: 'Mechanical, Electrical, Civil, CS, Automotive, Robotics',
  },
  {
    title: "Master's in Business Management",
    to: '/study-in-germany/mba',
    scene: 'finance' as const,
    duration: '1.5-2 years',
    eligibility: 'BBA / B.Com / MBA-equivalent (min 55%)',
    language: 'IELTS 6.5-7.0, sometimes GMAT',
    tuition: 'Free (Semester fee EUR 150-350)',
    universities: 'Mannheim, Frankfurt, Cologne, HHL Leipzig, WHU',
    fields: 'International Business, Supply Chain, Finance, Marketing',
  },
  {
    title: 'Ausbildung',
    to: '/study-in-germany/ausbildung',
    scene: 'study' as const,
    duration: '2-3 years',
    eligibility: '10th-12th Grade, no degree required',
    language: 'German B1-B2 (mandatory)',
    tuition: 'Paid apprenticeship - EUR 600-EUR 1,200/month stipend',
    universities: 'Germany-wide - all states',
    fields: 'Nursing, IT, Mechatronics, Hospitality, Logistics',
  },
];

const whyGermanyStats = [
  {
    value: '€0',
    scene: 'campus' as const,
    label: 'Tuition at most public universities',
    detail: 'You pay only a small semester contribution. Some states, such as Baden-Württemberg, charge non-EU students tuition.',
  },
  {
    value: '€992',
    scene: 'finance' as const,
    label: 'A month in your blocked account',
    detail: '€11,904 for a year (rules as of 2026). This is your own money for living costs.',
  },
  {
    value: '20 hrs',
    scene: 'study' as const,
    label: 'Part-time work a week',
    detail: 'Allowed during the semester to support yourself.',
  },
  {
    value: '18 months',
    scene: 'graduation' as const,
    label: 'Post-study job search',
    detail: 'Stay after graduating to look for a job in Germany. Rules can change; we share the latest in your consultation.',
  },
];

const supportHighlights = [
  'University shortlisting based on your profile',
  'APS, language, SOP, CV, and visa support in the right order',
  'Public-university-first strategy built for Indian students',
  'Guidance before departure and after landing in Germany',
];

const jobsPoints = [
  '18-month post-study job seeker visa after graduation',
  'In-demand sectors: IT and Software, Mechanical Engineering, Healthcare, Automotive, Finance',
  'Average salaries for fresh graduates: EUR 35,000-EUR 60,000 per year',
  'German Skilled Immigration Act (2023) creates a simpler route for non-EU workers',
];

export default function AboutGermanyPage() {
  useSeo({
    title: 'Study in Germany | Tuition-Free Public Universities | BVF Germany',
    description:
      "BVF Germany helps Indian students apply to tuition-free German public universities. Expert guidance for Bachelor's, Master's, and Ausbildung programs.",
    keywords: [
      'study in germany',
      'german universities for indian students',
      'free education germany',
      'ausbildung india',
      'masters in germany',
      'APS certificate',
    ],
    url: '/study-in-germany',
    image: '/hero-og.png',
  });

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      const siteSettings = await getSiteSettings();
      if (active) {
        setSettings(siteSettings);
      }
    };

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const whatsappHref = buildWhatsappHref(settings);

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-foreground">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#13231f_0%,#1d3a31_46%,#f0dcc2_100%)] pb-16 pt-28 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,201,76,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-[1280px] gap-10 px-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#f2c94c]">Study in Germany</p>
              <h1 className="mt-4 text-5xl font-semibold leading-[0.95] md:text-7xl">
                Tuition-free public universities, clear routes, and expert support from India.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                Explore the four routes students ask about most: Bachelor's Degree, Master's in Engineering,
                Master's in Business Management, and Ausbildung. Then build the right plan for APS, language,
                applications, visa, and life in Germany.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/bookings" className="inline-flex items-center justify-center rounded-full bg-[#f2c94c] px-6 py-3 text-sm font-semibold text-[#13231f] transition hover:-translate-y-0.5">
                  Book Free Consultation Now
                </Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-white/92 px-6 py-3 text-sm font-semibold text-foreground ring-1 ring-white/30 transition hover:bg-white">
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-[34px] border border-white/18 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
              <div className="mb-4 h-48 overflow-hidden rounded-[28px]">
                <SceneIllustration scene="city" label="Illustration of a German city skyline" />
              </div>
              <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,242,232,0.96))] p-6 text-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">What BVF Germany helps with</p>
                <div className="mt-6 space-y-3">
                  {supportHighlights.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-[22px] border border-border/70 bg-white/80 px-4 py-4 shadow-sm">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                      <p className="text-sm leading-7 text-foreground/88">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d5c5af] bg-[#f0dfc9] py-5">
          <div className="mx-auto grid max-w-[1280px] gap-4 px-4 md:grid-cols-2 md:px-8 lg:grid-cols-4">
            {[
              'Bachelor\'s Degree',
              "Master's in Engineering",
              "Master's in Business Management",
              'Ausbildung',
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-black/5 bg-white/72 px-4 py-4 text-sm font-medium text-foreground shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Study Programs Section Redesigned */}
        <section className="relative mx-auto max-w-[1280px] px-4 py-20 md:px-8 md:py-32">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 px-5 py-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Study Programs</p>
            </div>
            <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-5xl">
              Choose the Germany route that <span className="bg-gradient-to-r from-primary to-[#f2c94c] bg-clip-text text-transparent">matches your stage</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Each route below shows the usual duration, eligibility, language requirement, costs, example universities and key fields, so you can compare them side by side.
            </p>
          </div>

          {/* Programs Grid */}
          <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-10">
            {studyPrograms.map((program) => (
              <article 
                key={program.title} 
                className="group relative flex flex-col overflow-hidden rounded-[40px] border border-border/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
              >
                {/* Image Header wrapper */}
                <div className="relative h-[280px] w-full overflow-hidden sm:h-[320px]">
                  <div className="absolute inset-0 z-10 bg-black/10 transition-opacity duration-300 group-hover:bg-black/0" />
                  <SceneIllustration scene={program.scene} className="transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Floating Title Card */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 overflow-hidden rounded-[24px] border border-white/20 bg-[#132033]/75 p-5 backdrop-blur-xl transition-all duration-300 group-hover:bg-[#132033]/85">
                    <h3 className="text-2xl font-bold text-white drop-shadow-sm md:text-3xl">{program.title}</h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { label: 'Duration', value: program.duration, icon: Clock },
                      { label: 'Eligibility', value: program.eligibility, icon: GraduationCap },
                      { label: 'Language Req', value: program.language, icon: Languages },
                      { label: 'Tuition / Cost', value: program.tuition, icon: Coins },
                      { label: 'Top Universities', value: program.universities, icon: Building2 },
                      { label: 'Key Fields', value: program.fields, icon: BookOpen },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="group/item flex items-start gap-4 rounded-[24px] border border-transparent bg-[#f8f9fa] p-4 transition-colors hover:border-primary/10 hover:bg-primary/5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-primary shadow-sm transition-transform group-hover/item:scale-110">
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{label}</p>
                          <p className="text-sm font-medium leading-[1.6] text-foreground/90">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 border-t border-border/50 pt-6 mt-auto">
                    <Link 
                      to={program.to} 
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-primary/25"
                    >
                      Explore {program.title}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">Why Germany</p>
              <h2 className="section-title">The public-university opportunity that makes Germany stand out</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Germany combines tuition-free public universities, long-term career opportunity, and a cleaner post-study route for international students.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {whyGermanyStats.map((stat) => (
                <article key={stat.label} className="surface-panel overflow-hidden p-0">
                  <div className="h-36 overflow-hidden">
                    <SceneIllustration scene={stat.scene} />
                  </div>
                  <div className="p-6">
                    <p className="text-3xl font-semibold text-secondary">{stat.value}</p>
                    <h3 className="mt-3 text-xl font-semibold text-foreground">{stat.label}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{stat.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[32px] border border-border/80 bg-white/92 p-8 shadow-card">
              <div className="-mx-8 -mt-8 mb-8 h-48 overflow-hidden">
                <SceneIllustration scene="documents" label="Illustration of application documents and a passport" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Languages className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Application Journey</p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground">What students usually need after choosing the route</h2>
              <div className="mt-6 space-y-3">
                {[
                  'University shortlisting based on profile and target field',
                  'APS certificate planning for Indian applicants',
                  'IELTS, German, or GRE support where required',
                  'SOP, LOR, and CV support before applications go out',
                  'Visa guidance, blocked account planning, and on-arrival support',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[22px] border border-border/70 bg-background/70 px-4 py-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-border/80 bg-[#132033] p-8 text-white shadow-card">
              <div className="-mx-8 -mt-8 mb-8 h-48 overflow-hidden">
                <SceneIllustration scene="journey" label="Illustration of the journey from India to Germany" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f2c94c]">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Student Support</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#f2c94c]">Built for Indian students navigating Germany from scratch</h2>
              <p className="mt-4 text-sm leading-7 text-white/78">
                BVF Germany exists to simplify the path from India to Germany by connecting study-route decisions with APS, language prep, blocked accounts, visa work, and landing support.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/services" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5">
                  Explore Services
                </Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Start on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow rounded-[36px] border border-border/70 bg-white/86 p-8 shadow-card md:p-10">
            <div className="max-w-3xl">
              <p className="section-kicker">Germany Jobs / Career</p>
              <h2 className="section-title">Skilled workers are in demand in Germany</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Germany remains attractive not only for study, but also for the long-term career path that comes after graduation.
              </p>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="space-y-4">
                {jobsPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[22px] border border-border/70 bg-background/70 px-4 py-4">
                    <BriefcaseBusiness className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm leading-7 text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] p-6 text-white shadow-[0_28px_90px_-52px_rgba(3,7,18,0.9)]">
                <div className="-mx-6 -mt-6 mb-6 h-44 overflow-hidden">
                  <SceneIllustration scene="city" label="Illustration of a German city where graduates work" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Official Resource</p>
                <h3 className="mt-3 text-2xl font-semibold text-[#f2c94c]">Explore jobs and career guidance from the official Germany portal</h3>
                <p className="mt-4 text-sm leading-7 text-white/76">
                  Use Make it in Germany to understand job sectors, skilled-worker pathways, and post-study opportunities in the German market.
                </p>
                <a
                  href="https://www.make-it-in-germany.com/en"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
                >
                  Visit make-it-in-germany.com
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/88 transition hover:text-[#f2c94c]">
                  Start your Germany journey today
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 pt-6 md:px-8 md:pb-24">
          <div className="container-narrow rounded-[36px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-12 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:px-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Final CTA</p>
                <h2 className="mt-3 text-4xl font-semibold text-[#f2c94c] md:text-5xl">Study in Germany with the right route from day one</h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
                  Whether you are planning a bachelor's degree, engineering master's, business-management route, or Ausbildung, BVF Germany can help you map the next step with more clarity.
                </p>
              </div>
              <div className="space-y-4 lg:justify-self-end">
                <Link to="/bookings" className="button-primary w-full text-center lg:min-w-[220px]">
                  Book Free Consultation Now
                </Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="button-secondary w-full text-center lg:min-w-[220px]">
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
