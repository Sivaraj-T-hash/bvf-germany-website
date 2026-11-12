import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CircleDollarSign, FileText, Globe2, GraduationCap, House, Instagram, Languages, PlayCircle, SearchCheck, Send, ShieldCheck, BriefcaseBusiness, PlaneTakeoff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import WhatsAppCta from '@/components/WhatsAppCta';
import BrandVisual from '@/components/BrandVisual';
import StudentStories from '@/components/StudentStories';
import SceneIllustration from '@/components/SceneIllustration';
import ProfileEvaluationForm from '@/components/ProfileEvaluationForm';
import { ComparisonCards, GermanyFactsSection, JourneyStagesSection, PackagePriceCard } from '@/components/OfferSections';
import { founder } from '@/content/team';
import TextType from '@/components/ui/TextType';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSeo } from '@/lib/useSeo';
import { getBlogPosts, type BlogPost } from '@/lib/blogStore';
import { serviceCatalog } from '@/lib/serviceCatalog';
import { type UniversityItem } from '@/lib/siteContentStore';
import { getWebinarCatalog, type WebinarCatalogItem } from '@/lib/webinarCatalogStore';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { externalUrl } from '@/lib/contact';
import { webinarReplays } from '@/content/webinarReplays';
import technicalUniversityOfMunichLogo from '@/assets/Technical University of Munich.png';
import rwthAachenUniversityLogo from '@/assets/RWTH Aachen University .png';
import heidelbergUniversityLogo from '@/assets/Heidelberg University.png';
import universityOfBonnLogo from '@/assets/University of Bonn.png';
import universityOfStuttgartLogo from '@/assets/University of Stuttgart.png';
import karlsruheInstituteOfTechnologyLogo from '@/assets/Karlsruhe Institute of Technology.png';
import tuBerlinLogo from '@/assets/TU Berlin.png';
import lmuMunichLogo from '@/assets/LMU Munich.png';
import universityOfHamburgLogo from '@/assets/University of Hamburg.png';
import universityOfFreiburgLogo from '@/assets/University of Freiburg.png';
import universityOfCologneLogo from '@/assets/University of Cologne.png';
import fauErlangenNurnbergLogo from '@/assets/FAU Erlangen-Nürnberg.png';

const universityLogos = [
  { name: 'Technical University of Munich', logo: technicalUniversityOfMunichLogo },
  { name: 'RWTH Aachen University', logo: rwthAachenUniversityLogo },
  { name: 'Heidelberg University', logo: heidelbergUniversityLogo },
  { name: 'University of Bonn', logo: universityOfBonnLogo },
  { name: 'University of Stuttgart', logo: universityOfStuttgartLogo },
  { name: 'Karlsruhe Institute of Technology', logo: karlsruheInstituteOfTechnologyLogo },
  { name: 'TU Berlin', logo: tuBerlinLogo },
  { name: 'LMU Munich', logo: lmuMunichLogo },
  { name: 'University of Hamburg', logo: universityOfHamburgLogo },
  { name: 'University of Freiburg', logo: universityOfFreiburgLogo },
  { name: 'University of Cologne', logo: universityOfCologneLogo },
  { name: 'FAU Erlangen-Nürnberg', logo: fauErlangenNurnbergLogo },
];
const benefits = [
  { icon: CircleDollarSign, stat: 'EUR 0 Tuition', title: 'Zero Tuition', text: 'Most public universities charge no tuition fee, only a semester contribution.' },
  { icon: Globe2, stat: 'Top 100', title: 'Global Rankings', text: 'Germany is home to globally respected universities across STEM, management, and research.' },
  { icon: Languages, stat: 'In English', title: 'English Programs', text: 'Many master’s programs are taught in English, especially in technical fields.' },
  { icon: BriefcaseBusiness, stat: '20 Hrs/Week', title: 'Student Work Rights', text: 'Students can work part-time while studying and gain practical exposure.' },
  { icon: PlaneTakeoff, stat: '18 Months', title: 'Post-Study Visa', text: 'Graduates get time to stay back, job hunt, and transition into work life.' },
  { icon: ShieldCheck, stat: 'Safe & Stable', title: 'Safe Country', text: 'Germany offers strong infrastructure, public services, and a student-friendly environment.' },
];
const processSteps = [
  { title: 'Profile Check', label: 'Reality Check', desc: 'We map your CGPA, budget, timeline, and Germany readiness before anything else.', outcome: 'Clear starting point' },
  { title: 'University List', label: 'Shortlist Build', desc: 'Your options are narrowed into a smarter public-university list that actually fits.', outcome: 'Targeted shortlist' },
  { title: 'Documents', label: 'Paperwork Stack', desc: 'APS, SOP, LOR, IELTS, and supporting documents get organized without the usual mess.', outcome: 'Submission-ready docs' },
  { title: 'Apply', label: 'Application Push', desc: 'Applications are reviewed and submitted with fewer avoidable mistakes and delays.', outcome: 'Stronger submissions' },
  { title: 'Visa', label: 'Embassy Prep', desc: 'Financial proof, interview prep, and visa readiness are handled with structure.', outcome: 'Visa confidence' },
  { title: 'Germany', label: 'Landing Support', desc: 'Travel, accommodation, and first-week essentials are planned before you fly.', outcome: 'Smooth arrival' },
];
const serviceIconMap = {
  profile: SearchCheck,
  university: GraduationCap,
  application: Send,
  writing: FileText,
  ielts: Languages,
  visa: ShieldCheck,
  departure: PlaneTakeoff,
  accommodation: House,
} as const;
const serviceToneStyles = {
  free: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/80',
  included: 'bg-sky-500/10 text-sky-700 border-sky-200/80',
  premium: 'bg-amber-500/12 text-amber-800 border-amber-200/80',
  paid: 'bg-secondary/10 text-secondary border-secondary/20',
} as const;
const reveal = { hidden: { opacity: 0, y: 28 }, show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const, delay } }) };
const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const estimateReadTime = (content: string) => `${Math.max(1, Math.round(content.replace(/[#*_]/g, '').trim().split(/\s+/).length / 180))} min read`;
const welcomePopupStorageKey = 'bvf_welcome_popup_seen';
const universityPreviewCards: UniversityItem[] = [
  {
    id: 'preview-tu-berlin',
    name: 'TU Berlin',
    location: 'Berlin, Germany',
    category: 'Public University',
    tuition: 'Low semester contribution',
    website: 'https://www.tu.berlin',
    programs: [],
    description: 'Public university option in Berlin.',
    image: tuBerlinLogo,
    published: true,
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'preview-tum',
    name: 'Technical University of Munich',
    location: 'Munich, Germany',
    category: 'Public University',
    tuition: 'Low semester contribution',
    website: 'https://www.tum.de',
    programs: [],
    description: 'Public university option in Munich.',
    image: technicalUniversityOfMunichLogo,
    published: true,
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'preview-rwth',
    name: 'RWTH Aachen University',
    location: 'Aachen, Germany',
    category: 'Public University',
    tuition: 'Low semester contribution',
    website: 'https://www.rwth-aachen.de',
    programs: [],
    description: 'Public university option in Aachen.',
    image: rwthAachenUniversityLogo,
    published: true,
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'preview-hamburg',
    name: 'University of Hamburg',
    location: 'Hamburg, Germany',
    category: 'Public University',
    tuition: 'Low semester contribution',
    website: 'https://www.uni-hamburg.de',
    programs: [],
    description: 'Public university option in Hamburg.',
    image: universityOfHamburgLogo,
    published: true,
    sortOrder: 4,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'preview-cologne',
    name: 'University of Cologne',
    location: 'Cologne, Germany',
    category: 'Public University',
    tuition: 'Low semester contribution',
    website: 'https://www.uni-koeln.de',
    programs: [],
    description: 'Public university option in Cologne.',
    image: universityOfCologneLogo,
    published: true,
    sortOrder: 5,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export default function HomePage() {
  useSeo({ title: 'BVF Germany | Study in Germany', description: 'Public University Experts for Indian Students. Admissions, APS, visa, tools, webinars, and end-to-end Germany guidance.', url: 'https://bvf-student-support.web.app/', image: '/hero-og.png' });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [nextWebinar, setNextWebinar] = useState<WebinarCatalogItem | null>(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const settings = useSiteSettings();
  const youtubeUrl = externalUrl(settings.youtubeUrl);
  const instagramUrl = externalUrl(settings.instagramUrl);
  const featuredReplay = webinarReplays[0];

  useEffect(() => {
    void (async () => {
      const [allPosts, catalog] = await Promise.all([getBlogPosts(), getWebinarCatalog().catch(() => [] as WebinarCatalogItem[])]);
      setPosts(allPosts.filter((post) => post.published).slice(0, 3));
      const now = Date.now();
      const upcoming = catalog
        .filter((item) => (item.status === 'upcoming' || item.status === 'live') && new Date(item.scheduleAt).getTime() > now - 3 * 60 * 60 * 1000)
        .sort((a, b) => a.scheduleAt.localeCompare(b.scheduleAt));
      setNextWebinar(upcoming[0] || null);
    })();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hasSeenWelcomePopup = window.sessionStorage.getItem(welcomePopupStorageKey) === 'true';
    if (!hasSeenWelcomePopup) {
      setIsWelcomeOpen(true);
    }
  }, []);

  const closeWelcomePopup = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(welcomePopupStorageKey, 'true');
    }
    setIsWelcomeOpen(false);
  };

  const repeatedUniversityLogos = [...universityLogos, ...universityLogos];
  const showcaseServices = serviceCatalog.slice(0, 4);
  const universityPreview = useMemo(() => universityPreviewCards, []);
  const repeatedUniversityPreview = [...universityPreview, ...universityPreview];

  return (
    <div className="site-shell home-showcase">
      <Navbar />
      <Dialog open={isWelcomeOpen} onOpenChange={(nextOpen) => (nextOpen ? setIsWelcomeOpen(true) : closeWelcomePopup())}>
        <DialogContent className="max-w-md border-[#f0d9b8] bg-[linear-gradient(145deg,#fffef9,#fff7ea)] p-0 shadow-[0_24px_80px_rgba(15,23,38,0.26)]">
          <div className="rounded-t-lg bg-[#132033] px-6 py-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#facc15]">Welcome to BVF Germany</p>
            <DialogTitle className="mt-2 text-2xl font-extrabold leading-tight text-white">Your Study-in-Germany Journey Starts Here</DialogTitle>
          </div>
          <div className="space-y-5 px-6 py-6">
            <DialogHeader className="space-y-0 text-left">
              <DialogDescription className="text-sm leading-7 text-[#4b5563]">
                Explore public university options, get profile guidance, and book a free consultation with the BVF team.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row justify-end gap-3 sm:space-x-0">
              <Button variant="outline" onClick={closeWelcomePopup}>
                Maybe Later
              </Button>
              <Button asChild onClick={closeWelcomePopup}>
                <Link to="/bookings">Book Free Consultation</Link>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      <main>
        <section className="relative min-h-screen overflow-hidden bg-[#0f1726] text-white">
          {/* Branded background. Replace with a genuine BVF photo or video when available. */}
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(250,204,21,0.16),transparent_38%),radial-gradient(circle_at_12%_85%,rgba(255,153,51,0.12),transparent_40%),linear-gradient(160deg,#0f1726_0%,#16253f_55%,#0f1726_100%)]" />
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1.5"><span className="flex-1 bg-[#1f2937]" /><span className="flex-1 bg-[#dd0000]" /><span className="flex-1 bg-[#ffce00]" /></div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0f1726] to-transparent" />
          <div className="container-narrow relative z-10 grid min-h-screen items-center gap-10 px-4 pb-16 pt-32 md:px-8 md:pt-36 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div initial="hidden" animate="show" variants={reveal} className="max-w-4xl">
              <p className="font-home-accent mb-4 text-xs uppercase tracking-[0.34em] text-[#facc15]">BVF Germany</p>
              <h1 className="sr-only">Study in Germany with free tuition and the right guidance</h1>
              <div aria-hidden="true" className="font-home-heading max-w-5xl text-5xl font-extrabold leading-[0.82] text-white md:text-7xl">
                <TextType
                  text={`Study in Germany\nFree Tuition\nRight Guidance`}
                  as="div"
                  typingSpeed={42}
                  deletingSpeed={0}
                  pauseDuration={6000}
                  loop={false}
                  showCursor
                  cursorClassName="text-[#facc15]"
                />
              </div>
              <p className="font-home-body mt-6 max-w-3xl text-lg leading-8 text-white/76">
                Your German university dream, made simple. 14 services, one honest package price, and one team with you from India to Germany.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/tools" className="font-home-body inline-flex items-center justify-center rounded-full bg-[#facc15] px-6 py-3 text-sm font-bold text-[#0f1726] transition hover:-translate-y-0.5">🚀 Check My Eligibility</Link>
                <WhatsAppCta className="font-home-body" label="Ask on WhatsApp" message="Hi BVF Germany! I would like help with studying in Germany. Please guide me." />
                {youtubeUrl ? (
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="font-home-body inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">Watch Our Story</a>
                ) : null}
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-white/80">
                <Link to="/tools/cgpa-to-german-grade-converter" className="transition hover:text-[#facc15]">CGPA to German Grade Converter</Link>
                <Link to="/tools/ielts-bank-requirements-checker" className="transition hover:text-[#facc15]">IELTS Bank Requirements Checker</Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2 text-xs font-semibold text-white/85">
                {['Free first consultation', '₹59,999 complete package', 'Part 2 paid only after your offer letter', 'A student support system, not a consultancy'].map((item) => (
                  <li key={item} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial="hidden" animate="show" variants={reveal} custom={0.15} className="hidden lg:block">
              <div className="overflow-hidden rounded-[32px] border border-white/15 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.8)]">
                <SceneIllustration scene="journey" label="Illustration: the journey from India to Germany" className="h-[420px]" />
              </div>
            </motion.div>

          </div>
        </section>
        <section id="social-proof" className="border-y border-border/70 bg-[#fff8ee] py-6">
          <div className="container-narrow px-4 md:px-8">
            <div className="mx-auto mt-6 max-w-5xl text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-muted-foreground">Germany&apos;s leading public universities</p>
              <div className="marquee-mask mt-5 overflow-hidden">
                <div className="marquee-track">
                  {repeatedUniversityLogos.map((university, index) => (
                    <div
                      key={`${university.name}-${index}`}
                      className="flex h-[88px] w-[220px] shrink-0 items-center justify-center rounded-[22px] border border-[#f0d9b8] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,245,228,0.94))] px-5 py-4 shadow-[0_12px_30px_rgba(15,23,38,0.05)] backdrop-blur md:w-[250px]"
                    >
                      <img
                        src={university.logo}
                        alt={`${university.name} logo`}
                        loading="lazy"
                        className="h-9 w-full max-w-[150px] object-contain opacity-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-5 text-sm font-medium text-muted-foreground">
                Public universities Indian students often consider. Logos are shown for reference only and do not imply a partnership with BVF Germany.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="text-center"><p className="section-kicker">Why Public Universities</p><h2 className="section-title mx-auto max-w-3xl">The Germany dream works best when the university choice is smart.</h2></div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{benefits.map((benefit, index) => <motion.div key={benefit.title} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={reveal} custom={index * 0.05} className="surface-panel p-6"><benefit.icon className="h-6 w-6 text-secondary" aria-hidden="true" /><p className="mt-5 font-numeric text-4xl leading-none text-foreground">{benefit.stat}</p><h3 className="mt-3 text-lg font-semibold text-foreground">{benefit.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{benefit.text}</p></motion.div>)}</div>
            <div className="mt-8 text-center"><Link to="/tools" className="button-primary">Is a German Public University Right for Me?</Link></div>
          </div>
        </section>

        <GermanyFactsSection className="pt-0 md:pt-0" />

        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow font-showcase">
            <div className="overflow-hidden rounded-[34px] border border-[#eadfcd] bg-white/92 shadow-card">
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[260px] overflow-hidden bg-[linear-gradient(135deg,#f7efe2,#f3e6d2)] p-4 md:min-h-[300px] md:p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_30%)]" aria-hidden="true" />
                  <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-primary/12 blur-2xl" aria-hidden="true" />
                  <div className="absolute bottom-10 right-10 h-28 w-28 rounded-full bg-secondary/10 blur-2xl" aria-hidden="true" />
                  <div className="relative h-full rounded-[24px] border border-[#eadfcd] bg-[linear-gradient(180deg,#fffaf2,#f7efe2)] p-3 shadow-[0_18px_40px_rgba(30,41,59,0.08)] md:p-4">
                    <div className="absolute inset-x-6 top-5 h-8 rounded-full bg-white/70 blur-xl" aria-hidden="true" />
                    <BrandVisual title="Profile, applications, visa and arrival in one guided flow" kicker="BVF Support" icon={GraduationCap} className="h-full min-h-[240px] w-full rounded-[22px]" />
                    <div className="absolute bottom-6 left-6 right-6 hidden rounded-[18px] border border-white/12 bg-white/10 p-3 backdrop-blur md:block">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-white">Support Stack</p>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-bold text-white">
                        <span className="rounded-full bg-white/10 px-3 py-2 text-center">Profile</span>
                        <span className="rounded-full bg-white/10 px-3 py-2 text-center">Apply</span>
                        <span className="rounded-full bg-white/10 px-3 py-2 text-center">Visa</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-7">
                  <div className="flex items-center gap-3">
                    {showcaseServices.slice(0, 3).map((service) => {
                      const ServiceIcon = serviceIconMap[service.icon];
                      return (
                        <div key={service.id} className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-[#efe4d3] bg-[#faf7f1] text-secondary">
                          <ServiceIcon className="h-6 w-6" aria-hidden="true" />
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.3em] text-secondary">Our Services Overview</p>
                  <h2 className="mt-3 max-w-3xl text-[2rem] font-extrabold leading-[1] text-[#111827] md:text-[3.2rem]">
                    Complete support
                    <span className="block">from shortlist to landing.</span>
                  </h2>
                  <p className="mt-4 max-w-xl text-[15px] font-medium leading-7 text-[#5c6678]">
                    Get the core parts of your Germany journey sorted in one guided flow.
                  </p>

                  <div className="mt-5">
                    <Link to="/services" className="inline-flex items-center justify-center rounded-full bg-[#132033] px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5">
                      Explore All Services
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {showcaseServices.map((service, index) => {
                      const ServiceIcon = serviceIconMap[service.icon];
                      const isFeatured = index === 0;

                      return (
                        <Link
                          key={service.id}
                          to={`/services/${service.slug}`}
                          className={`group flex items-start gap-3 rounded-[22px] border p-4 transition hover:-translate-y-0.5 ${isFeatured
                            ? 'border-[#dbe8fb] bg-[#f4f8ff]'
                            : 'border-[#efe4d3] bg-[#fffdf9]'
                            }`}
                        >
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] ${isFeatured ? 'bg-[#1f6fcb] text-white' : 'bg-[#fff4db] text-[#f59e0b]'}`}>
                            <ServiceIcon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-base font-extrabold leading-tight text-[#111827] md:text-[1.05rem]">{service.title}</h3>
                              <ArrowRight className="h-4 w-4 shrink-0 text-[#6b7280] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                            </div>
                            <p className="mt-2 text-[13px] font-medium leading-5 text-[#5c6678]">
                              {isFeatured ? 'Start with clarity on fit, eligibility, and your best next step.' : service.shortDescription}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <JourneyStagesSection />

        <section className="px-4 pb-16 md:px-8 md:pb-20">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">Simple, honest pricing</p>
              <h2 className="section-title">One package covers your whole journey.</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">You pay in two parts, and the second part is due only once you have your offer letter.</p>
            </div>
            <PackagePriceCard className="mt-8" />
            <ComparisonCards className="mt-6" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/pricing" className="button-primary">See pricing and add-ons</Link>
              <Link to="/bookings" className="button-secondary">Book Free Consultation</Link>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-10 md:px-8 md:py-12">
          <div className="container-narrow"><div className="relative overflow-hidden rounded-[38px]"><div aria-hidden="true" className="relative h-[360px] w-full md:h-[460px]"><SceneIllustration scene="city" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,38,0.92)_0%,rgba(15,23,38,0.7)_45%,rgba(15,23,38,0.05)_100%)]" /></div><div className="absolute inset-0 flex items-center"><div className="max-w-2xl p-8 md:p-12"><div className="max-w-[34rem]"><p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#facc15]">Study in Germany</p><h2 className="mt-4 max-w-[28rem] font-heading text-4xl font-semibold leading-[0.95] text-white md:text-5xl">Germany gives ambitious students world-class education without the tuition burden.</h2><p className="mt-5 max-w-[30rem] text-sm leading-7 text-white md:text-base">That only works well when the guidance is aligned with public universities, documentation timing, and the real student journey after admission.</p></div></div></div></div></div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="grid overflow-hidden rounded-[34px] bg-[#1b1714] text-white shadow-card md:grid-cols-[0.8fr_1.2fr]">
              <img src={founder.photo} alt={`${founder.name}, founder of BVF Germany`} className="h-80 w-full object-cover object-top md:h-full" loading="lazy" />
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#facc15]">Founded by someone who has done it</p>
                <h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl">The Vision Behind BVF Germany</h2>
                <p className="mt-2 text-white/80">Real experiences. Honest guidance. Better opportunities.</p>
                <p className="mt-6 text-lg font-bold">{founder.name} | {founder.role}</p>
                <p className="mt-1 text-sm text-white/75">{founder.headline}</p>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/80">
                  Our founder came from India to study Space Engineering at the University of Bremen. We know this journey from the inside, and we built BVF Germany so you never have to figure it out alone.
                </p>
                <Link to="/about" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#facc15] px-5 py-3 text-sm font-semibold text-[#132033]">
                  Meet the people behind BVF <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <StudentStories kicker="Student Success Stories" title="Students choose BVF when they want the process to feel less chaotic." />

        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="flex flex-col items-center gap-4 text-center"><div className="flex flex-col items-center"><p className="section-kicker">Universities Preview</p><h2 className="section-title max-w-3xl">A glimpse at the public universities students ask about most.</h2></div><Link to="/universities" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-secondary">Explore Universities <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
            <div className="marquee-mask mt-10 overflow-hidden">
              <div className="testimonial-track">
                {repeatedUniversityPreview.map((university, index) => (
                  <motion.article
                    key={`${university.id}-${index}`}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={reveal}
                    custom={index * 0.03}
                    className="w-[290px] shrink-0 overflow-hidden rounded-[30px] border border-border/80 bg-white/85 shadow-card"
                  >
                    <div className="flex h-48 items-center justify-center border-b border-border/70 bg-white p-8">
                      <img src={university.image} alt={`${university.name} logo`} className="max-h-24 w-full object-contain" loading="lazy" />
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">{university.category}</p>
                      <h3 className="mt-3 font-heading text-2xl font-semibold text-foreground">{university.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{university.location}</p>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">{university.tuition}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>


        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20">
          <div className={`container-narrow grid gap-6 ${featuredReplay ? 'lg:grid-cols-[0.95fr_1.05fr]' : ''}`}>
            <div className="surface-panel p-7 text-center">
              <p className="section-kicker">Webinars</p>
              <h2 className="section-title mx-auto max-w-xl">The next best place to start if you need clarity fast.</h2>
              <div className="mx-auto mt-7 max-w-2xl rounded-[28px] bg-white/82 p-6 text-left">
                {nextWebinar ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">Upcoming {nextWebinar.accessType === 'paid' ? 'Webinar' : 'Free Webinar'}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-foreground">{nextWebinar.title}</h3>
                    <p className="mt-3 flex items-center gap-2 text-sm leading-7 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      {new Date(nextWebinar.scheduleAt).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                    <Link to="/webinars" className="button-primary mt-6">Register for the Webinar</Link>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">Next Webinar</p>
                    <h3 className="mt-3 text-2xl font-semibold text-foreground">Live sessions on admissions, APS and visas</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">The next date will be announced soon. Register your interest and we will let you know.</p>
                    <Link to="/webinars" className="button-primary mt-6">Get Notified</Link>
                  </>
                )}
              </div>
            </div>
            {featuredReplay ? (
              <div className="surface-panel p-7"><div className="flex items-center gap-3 text-secondary"><PlayCircle className="h-6 w-6" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.25em]">Latest Recording</p></div><h2 className="section-title mt-4 max-w-xl">{featuredReplay.title}</h2><div className="mt-6 overflow-hidden rounded-[28px]"><iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${featuredReplay.youtubeId}`} title={featuredReplay.title} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></div>
            ) : null}
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="flex flex-col items-center gap-4 text-center"><div className="flex flex-col items-center"><p className="section-kicker">Blog Preview</p><h2 className="section-title max-w-3xl">Fresh guides for students planning every stage of Germany.</h2></div><Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-secondary">Read All Guides <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">{posts.map((post, index) => <motion.article key={post.id} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={reveal} custom={index * 0.05} className="overflow-hidden rounded-[30px] border border-border/80 bg-white/86 shadow-card">{post.featuredImage ? <img src={post.featuredImage} alt={post.title} className="h-52 w-full object-cover" loading="lazy" /> : <BrandVisual kicker={post.category} tone="sand" icon={FileText} className="h-40 w-full" />}<div className="p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">{post.category}</p><h3 className="mt-3 font-heading text-2xl font-semibold text-foreground"><Link to={`/blog/${post.slug}`} className="hover:text-secondary">{post.title}</Link></h3><div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground"><span>{estimateReadTime(post.content)}</span><span>{dateFormatter.format(new Date(post.createdAt))}</span></div></div></motion.article>)}</div>
          </div>
        </section>

        {instagramUrl ? (
          <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20">
            <div className="container-narrow">
              <div className="flex flex-col items-center gap-5 rounded-[34px] border border-[#eadfcd] bg-white/90 p-8 text-center shadow-card md:p-12">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#132033]"><Instagram className="h-6 w-6 text-[#facc15]" aria-hidden="true" /></span>
                <p className="section-kicker">Instagram</p>
                <h2 className="section-title mx-auto max-w-3xl">Germany tips, student updates, and practical reminders.</h2>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="button-primary">Follow BVF Germany on Instagram</a>
              </div>
            </div>
          </section>
        ) : null}
        <section id="profile-evaluation" className="scroll-mt-28 px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="section-kicker">Free Profile Evaluation</p>
              <h2 className="section-title">Find out where you can apply, before you spend anything.</h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Share your program interest and current education. We review your profile and tell you honestly which German public universities and courses are realistic for you.
              </p>
            </div>
            <div className="surface-panel card-shadow-lg p-6 md:p-8">
              <ProfileEvaluationForm sourcePage="/" />
            </div>
          </div>
        </section>

        <section className="bg-[#132033] px-4 py-16 text-white md:px-8 md:py-20">
          <div className="container-narrow text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#facc15]">Final CTA</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold text-[#facc15] md:text-5xl">Your Germany Dream Starts Today</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/72 md:text-base">Book your free 30-minute consultation, understand your next step, and move forward with guidance that feels structured from day one.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4"><Link to="/bookings" className="inline-flex items-center justify-center rounded-full bg-[#facc15] px-6 py-3 text-sm font-semibold text-[#132033] transition hover:-translate-y-0.5">Book Free 30-Min Consultation</Link><WhatsAppCta label="Prefer WhatsApp? Chat now" /></div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}


