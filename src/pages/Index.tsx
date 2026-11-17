import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, CircleDollarSign, FileText, GraduationCap, House, Instagram, Languages, PlayCircle, SearchCheck, Send, ShieldCheck, BriefcaseBusiness, PlaneTakeoff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import WhatsAppCta from '@/components/WhatsAppCta';
import BrandVisual from '@/components/BrandVisual';
import StudentStories from '@/components/StudentStories';
import StudyPathwayCards from '@/components/StudyPathwayCards';
import WhyChooseGermanySection from '@/components/WhyChooseGermanySection';
import StudentJourneySection from '@/components/StudentJourneySection';
import LifeInGermanySection from '@/components/LifeInGermanySection';
import BvfTeamSection from '@/components/BvfTeamSection';
import KnowledgeHubSection from '@/components/KnowledgeHubSection';
import HomepageFaqSection from '@/components/HomepageFaqSection';
import SceneIllustration, { sceneFor } from '@/components/SceneIllustration';
import ProfileEvaluationForm from '@/components/ProfileEvaluationForm';
import { GermanyFactsSection } from '@/components/OfferSections';
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
import studentsGroup from '@/assets/students-group.jpg';

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

const serviceIconMap = {
  profile: SearchCheck,
  university: GraduationCap,
  application: Send,
  writing: FileText,
  ielts: Languages,
  visa: ShieldCheck,
  departure: PlaneTakeoff,
  accommodation: House,
  gre: FileText,
  gmat: FileText,
  language: Languages,
  arrival: PlaneTakeoff,
  sop: FileText,
  cv: FileText,
  loan: CircleDollarSign,
  insurance: ShieldCheck,
  'uni-application': Send,
} as const;

const reveal = { hidden: { opacity: 0, y: 28 }, show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const, delay } }) };
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
  useSeo({
    title: 'BVF Germany | Study in Germany',
    description: 'Public University Experts for Indian Students. Admissions, APS, visa, tools, webinars, and end-to-end Germany guidance.',
    url: 'https://bvf-student-support.web.app/',
    image: '/hero-og.png',
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [nextWebinar, setNextWebinar] = useState<WebinarCatalogItem | null>(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const settings = useSiteSettings();
  const instagramUrl = externalUrl(settings.instagramUrl);
  const featuredReplay = webinarReplays[0];

  useEffect(() => {
    void (async () => {
      const [allPosts, catalog] = await Promise.all([
        getBlogPosts().catch(() => [] as BlogPost[]),
        getWebinarCatalog().catch(() => [] as WebinarCatalogItem[]),
      ]);
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

  const handleEvaluationClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('profile-evaluation');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="site-shell home-showcase">
      <Navbar />

      {/* Welcome Popup Dialog */}
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
        {/* 1. Hero Section */}
        <section id="hero" className="relative overflow-hidden bg-[#FAF8F5] pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#2D6A4F]/5 blur-3xl" />
            <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-[#0F172A]/5 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.015] [background-image:linear-gradient(#0F172A_1px,transparent_1px),linear-gradient(90deg,#0F172A_1px,transparent_1px)] [background-size:56px_56px]" />
          </div>

          <div className="container-narrow relative z-10 px-4 md:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
              {/* Left Column: Editorial Headline & Actions */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={reveal}
                className="lg:col-span-7 max-w-2xl"
              >
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
                    YOUR JOURNEY TO GERMANY STARTS HERE
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[46px] xl:text-[52px] leading-[1.12]">
                  Your Future in Germany Starts With the Right Guidance.
                </h1>

                {/* Supporting Paragraph */}
                <p className="mt-6 text-base leading-relaxed text-[#475569] sm:text-lg md:leading-8">
                  From choosing the right university and navigating applications to preparing for life in Germany, BVF Germany supports you through every step of your study-abroad journey.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/#profile-evaluation"
                    onClick={handleEvaluationClick}
                    className="inline-flex items-center justify-center rounded-full bg-[#0F172A] px-7 py-3.5 text-sm md:text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E293B] hover:shadow-md"
                  >
                    Free Profile Evaluation
                  </Link>
                  <Link
                    to="/study-in-germany"
                    className="inline-flex items-center justify-center rounded-full border border-[#E7E5E0] bg-white px-7 py-3.5 text-sm md:text-base font-semibold text-[#0F172A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FAF8F5] hover:border-[#CBD5E1]"
                  >
                    Explore Study Pathways
                  </Link>
                </div>

                {/* Small Trust Message */}
                <div className="mt-8 flex items-center gap-2 text-xs md:text-sm font-medium text-[#64748B]">
                  <ShieldCheck className="h-4 w-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                  <span>Personal guidance. Clear direction. Support at every step.</span>
                </div>
              </motion.div>

              {/* Right Column: Editorial University & Student Photography */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={reveal}
                custom={0.15}
                className="lg:col-span-5"
              >
                <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                  <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#E7E5E0] bg-white p-2.5 md:p-3 shadow-xl shadow-slate-900/5">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl md:rounded-2xl bg-[#F5F2EC]">
                      <img
                        src={studentsGroup}
                        alt="University students collaborating in an authentic academic environment"
                        className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                        loading="eager"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 via-transparent to-transparent pointer-events-none" />

                      {/* Subtle floating badge */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/95 px-3.5 py-2.5 backdrop-blur-md border border-[#E7E5E0]/80 shadow-sm">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F]">German Public Universities</p>
                          <p className="truncate text-xs font-semibold text-[#0F172A]">Explore World-Class Degree Programs</p>
                        </div>
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] text-[#2D6A4F]">
                          <GraduationCap className="h-4 w-4" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. University Logos Marquee */}
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

        {/* 3. Study Pathways */}
        <StudyPathwayCards />

        {/* 4. Why Study in Germany */}
        <WhyChooseGermanySection />
        <GermanyFactsSection className="pt-0 md:pt-0" />

        {/* 5. Student Journey Section */}
        <StudentJourneySection />

        {/* 6. Student Success Stories */}
        <StudentStories
          kicker="REAL STUDENT EXPERIENCES"
          title="Every Student Journey Has a Story."
          subtitle="Explore genuine experiences from students who have pursued their education journey in Germany with BVF Germany."
        />

        {/* 7. Life in Germany Section */}
        <LifeInGermanySection />

        {/* 8. Founder & BVF Germany Team */}
        <BvfTeamSection />

        {/* 9. Knowledge Hub */}
        <KnowledgeHubSection posts={posts} />

        {/* 10. Services Overview */}
        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20 border-b border-[#eadfcd]">
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
                  </div>
                </div>

                <div className="p-5 md:p-7">
                  <div className="flex items-center gap-3">
                    {showcaseServices.slice(0, 3).map((service) => {
                      const ServiceIcon = serviceIconMap[service.icon as keyof typeof serviceIconMap] || GraduationCap;
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
                      const ServiceIcon = serviceIconMap[service.icon as keyof typeof serviceIconMap] || GraduationCap;
                      const isFeatured = index === 0;

                      return (
                        <Link
                          key={service.id}
                          to={`/services/${service.slug}`}
                          className={`group flex flex-col overflow-hidden rounded-[22px] border transition hover:-translate-y-0.5 ${
                            isFeatured
                              ? 'border-[#dbe8fb] bg-[#f4f8ff]'
                              : 'border-[#efe4d3] bg-[#fffdf9]'
                          }`}
                        >
                          <div className="h-28 w-full overflow-hidden">
                            <SceneIllustration scene={sceneFor(`${service.title} ${service.slug}`)} className="transition-transform duration-500 group-hover:scale-105" />
                          </div>
                          <div className="flex items-start gap-3 p-4">
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] ${isFeatured ? 'bg-[#1f6fcb] text-white' : 'bg-[#fff4db] text-[#f59e0b]'}`}>
                              <ServiceIcon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center justify-between gap-3">
                                <h3 className="text-base font-extrabold leading-tight text-[#111827] md:text-[1.05rem]">{service.title}</h3>
                                <ArrowRight className="h-4 w-4 shrink-0 text-[#6b7280] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                              </div>
                              <p className="mt-2 text-[13px] font-medium leading-5 text-[#5c6678]">
                                {service.shortDescription}
                              </p>
                            </div>
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

        {/* 11. Universities Preview & Webinars Showcase */}
        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20 border-b border-[#eadfcd]">
          <div className="container-narrow">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex flex-col items-center">
                <p className="section-kicker">Universities Preview</p>
                <h2 className="section-title max-w-3xl">A glimpse at the public universities students ask about most.</h2>
              </div>
              <Link to="/universities" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-secondary">
                Explore Universities <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
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

        {/* Webinars Section */}
        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20 border-b border-[#eadfcd]">
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
              <div className="surface-panel p-7">
                <div className="flex items-center gap-3 text-secondary">
                  <PlayCircle className="h-6 w-6" aria-hidden="true" />
                  <p className="text-xs font-semibold uppercase tracking-[0.25em]">Latest Recording</p>
                </div>
                <h2 className="section-title mt-4 max-w-xl">{featuredReplay.title}</h2>
                <div className="mt-6 overflow-hidden rounded-[28px]">
                  <iframe
                    className="aspect-video w-full"
                    src={`https://www.youtube-nocookie.com/embed/${featuredReplay.youtubeId}`}
                    title={featuredReplay.title}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Instagram Connection */}
        {instagramUrl ? (
          <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20 border-b border-[#eadfcd]">
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

        {/* 12. Homepage Frequently Asked Questions */}
        <HomepageFaqSection />

        {/* 13. Free Profile Evaluation Section */}
        <section
          id="profile-evaluation"
          aria-labelledby="profile-evaluation-heading"
          className="scroll-mt-28 border-b border-[#E7E5E0] bg-[#FAF8F5] px-4 py-16 md:px-8 md:py-24"
        >
          <div className="container-narrow">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
                    FREE PROFILE EVALUATION
                  </span>
                </div>

                <h2
                  id="profile-evaluation-heading"
                  className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[40px] leading-tight"
                >
                  Find Out Where You Can Apply, Before You Spend Anything.
                </h2>

                <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
                  Share your academic background and target degree. We evaluate your profile against public university criteria and tell you honestly which German universities and programs are realistic for you.
                </p>

                <div className="mt-8 space-y-3.5">
                  <div className="flex items-start gap-3 rounded-2xl border border-[#E7E5E0] bg-white p-4 shadow-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">Public University Eligibility Assessment</p>
                      <p className="mt-0.5 text-xs text-[#64748B]">CGPA, subject match and degree recognition evaluated against German standards.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-[#E7E5E0] bg-white p-4 shadow-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">APS & Language Readiness Mapping</p>
                      <p className="mt-0.5 text-xs text-[#64748B]">Timeline planning for English (IELTS) or German requirements with zero guesswork.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-[#E7E5E0] bg-white p-4 shadow-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">100% Free First Consultation</p>
                      <p className="mt-0.5 text-xs text-[#64748B]">Clear answers and realistic options before you commit to any application fees.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-[#E7E5E0] bg-white p-6 md:p-8 shadow-xl shadow-slate-900/5">
                <ProfileEvaluationForm sourcePage="/" />
              </div>
            </div>
          </div>
        </section>

        {/* 14. Final Call to Action */}
        <section className="bg-[#132033] px-4 py-16 text-white md:px-8 md:py-20">
          <div className="container-narrow text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#facc15]">BEGIN YOUR JOURNEY</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold text-[#facc15] md:text-5xl">Your Germany Dream Starts Today</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
              Book your free 30-minute consultation, understand your next step, and move forward with guidance that feels structured from day one.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center rounded-full bg-[#facc15] px-7 py-3.5 text-sm font-bold text-[#132033] shadow-md transition hover:-translate-y-0.5 hover:bg-[#ebd024]"
              >
                Book Free 30-Min Consultation
              </Link>
              <WhatsAppCta label="Prefer WhatsApp? Chat now" />
            </div>
          </div>
        </section>
      </main>

      {/* 15. Footer */}
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
