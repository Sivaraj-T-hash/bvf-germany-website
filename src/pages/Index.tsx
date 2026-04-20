import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CircleDollarSign, FileText, Globe2, GraduationCap, House, Languages, PlayCircle, SearchCheck, Send, ShieldCheck, Star, BriefcaseBusiness, PlaneTakeoff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import TextType from '@/components/ui/TextType';
import CountUp from '@/components/ui/CountUp';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSeo } from '@/lib/useSeo';
import { getBlogPosts, type BlogPost } from '@/lib/blogStore';
import { serviceCatalog } from '@/lib/serviceCatalog';
import { getPricingPlans, type PricingPlan } from '@/lib/pricingStore';
import { getSiteSettings, getTestimonials, getUniversities, type SiteSettings, type TestimonialItem, type UniversityItem } from '@/lib/siteContentStore';
import germanCampus from '@/assets/german-campus.jpg';
import studentsGroup from '@/assets/students-group.jpg';
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
import tuBerlinPreviewImage from '@/assets/TU-Berlin.png';
import technicalUniversityOfMunichPreviewImage from '@/assets/Technical-University-of-Munich.png';
import rwthAachenPreviewImage from '@/assets/RWTH-Aachen-University.png';
import universityOfHamburgPreviewImage from '@/assets/University-of-Hamburg.png';
import universityOfColognePreviewImage from '@/assets/University-of-Cologne.png';
import instagram1Image from '@/assets/Instagram 1.png';
import instagram2Image from '@/assets/Instagram2.png';
import instagram3Image from '@/assets/Instagram 3.png';
import instagram4Image from '@/assets/Instagram4.png';
import instagram5Image from '@/assets/Instagram5.png';
import instagram6Image from '@/assets/Instagram6.png';
import instagram7Image from '@/assets/Instagram7.png';
import instagram8Image from '@/assets/Instagram8.png';
import instagram9Image from '@/assets/Instagram9.png';

const heroVideoUrl = 'https://videos.pexels.com/video-files/7683400/7683400-hd_1080_1920_25fps.mp4';
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
  { icon: Languages, stat: '1,800+', title: 'English Programs', text: 'Many master’s programs are taught in English, especially in technical fields.' },
  { icon: BriefcaseBusiness, stat: '20 Hrs/Week', title: 'Student Work Rights', text: 'Students can work part-time while studying and gain practical exposure.' },
  { icon: PlaneTakeoff, stat: '18 Months', title: 'Post-Study Visa', text: 'Graduates get time to stay back, job hunt, and transition into work life.' },
  { icon: ShieldCheck, stat: 'Safe & Stable', title: 'Safe Country', text: 'Germany offers strong infrastructure, public services, and a student-friendly environment.' },
];
const germanyStats = [
  {
    value: 'EUR 45,000 – EUR 50,000',
    label: 'Average Income in Germany 💶',
    detail: 'per year',
  },
  {
    value: '70 Lakhs',
    label: 'Skilled Job Vacancies 📈',
    detail: '(7 Million) open positions',
  },
];
const processSteps = [
  { title: 'Profile Check', label: 'Reality Check', desc: 'We map your CGPA, budget, timeline, and Germany readiness before anything else.', outcome: 'Clear starting point' },
  { title: 'University List', label: 'Shortlist Build', desc: 'Your options are narrowed into a smarter public-university list that actually fits.', outcome: 'Targeted shortlist' },
  { title: 'Documents', label: 'Paperwork Stack', desc: 'APS, SOP, LOR, IELTS, and supporting documents get organized without the usual mess.', outcome: 'Submission-ready docs' },
  { title: 'Apply', label: 'Application Push', desc: 'Applications are reviewed and submitted with fewer avoidable mistakes and delays.', outcome: 'Stronger submissions' },
  { title: 'Visa', label: 'Embassy Prep', desc: 'Blocked account, interview prep, and visa readiness are handled with structure.', outcome: 'Visa confidence' },
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
const resourceTeasers = [
  { title: 'SOP Pack', price: 'INR 999', badge: 'Instant Download', desc: 'Templates, winning structure, and real examples for stronger SOP drafts.' },
  { title: 'IELTS Bundle', price: 'INR 1,499', badge: 'Instant Download', desc: 'Score strategy, planner sheets, and Germany-specific band targeting guidance.' },
  { title: 'Complete Bundle', price: 'INR 2,999', badge: 'Best Seller', desc: 'The packed toolkit for SOP, IELTS, profile planning, and Germany readiness.' },
];
const upcomingWebinar = { topic: 'APS + Visa Roadmap for Indian Students', date: 'April 12, 2026', time: '7:30 PM IST', cta: '/webinars' };
const reveal = { hidden: { opacity: 0, y: 28 }, show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut', delay } }) };
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
    image: tuBerlinPreviewImage,
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
    image: technicalUniversityOfMunichPreviewImage,
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
    image: rwthAachenPreviewImage,
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
    image: universityOfHamburgPreviewImage,
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
    image: universityOfColognePreviewImage,
    published: true,
    sortOrder: 5,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export default function HomePage() {
  useSeo({ title: 'BVF Germany | Study in Germany', description: 'Public University Experts for Indian Students. Admissions, APS, visa, tools, webinars, and end-to-end Germany guidance.', url: 'https://bvf-student-support.web.app/', image: '/hero-og.png' });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      const [allPosts, nextSettings, nextTestimonials, nextUniversities, nextPlans] = await Promise.all([getBlogPosts(), getSiteSettings(), getTestimonials(), getUniversities(), getPricingPlans()]);
      setPosts(allPosts.filter((post) => post.published).slice(0, 3));
      setSettings(nextSettings);
      setTestimonials(nextTestimonials.filter((item) => item.published).slice(0, 6));
      setUniversities(nextUniversities.filter((item) => item.published).slice(0, 6));
      setPlans(nextPlans.filter((plan) => plan.published).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).slice(0, 3));
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
  const repeatedTestimonials = [...testimonials, ...testimonials];
  const featuredService = serviceCatalog[0];
  const showcaseServices = serviceCatalog.slice(0, 4);
  const universityPreview = useMemo(() => universityPreviewCards, []);
  const instagramTiles = [
    instagram1Image,
    instagram2Image,
    instagram3Image,
    instagram4Image,
    instagram5Image,
    instagram6Image,
    instagram7Image,
    instagram8Image,
    instagram9Image,
  ];
  const repeatedUniversityPreview = [...universityPreview, ...universityPreview];
  const shopItems = plans.length > 0 ? plans.map((plan) => ({ title: plan.name, price: plan.price, badge: plan.badge || 'Instant Download', desc: plan.description })) : resourceTeasers;

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
          <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline poster={germanCampus} aria-hidden="true"><source src={heroVideoUrl} type="video/mp4" /></video>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,29,0.72)_0%,rgba(10,16,29,0.78)_40%,rgba(10,16,29,0.92)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0f1726] to-transparent" />
          <div className="container-narrow relative z-10 flex min-h-screen flex-col justify-center px-4 pb-16 pt-32 md:px-8 md:pt-36">
            <motion.div initial="hidden" animate="show" variants={reveal} className="max-w-4xl">
              <p className="font-home-accent mb-4 text-xs uppercase tracking-[0.34em] text-[#facc15]">BVF Germany</p>
              <div className="font-home-heading max-w-5xl text-5xl font-extrabold leading-[0.82] text-white md:text-7xl">
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
                Public university experts for Indian students, guiding you from profile review to your first step in Germany.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/tools" className="font-home-body inline-flex items-center justify-center rounded-full bg-[#facc15] px-6 py-3 text-sm font-bold text-[#0f1726] transition hover:-translate-y-0.5">🚀 Check My Eligibility</Link>
                <a href={settings?.youtubeUrl || 'https://youtube.com'} target="_blank" rel="noreferrer" className="font-home-body inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">Watch Our Story</a>
              </div>
            </motion.div>

          </div>
        </section>
        <section id="social-proof" className="border-y border-border/70 bg-[#fff8ee] py-6">
          <div className="container-narrow px-4 md:px-8">
            <div className="mx-auto mt-6 max-w-5xl text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-muted-foreground">Trusted by admits from</p>
              <div className="marquee-mask mt-5 overflow-hidden">
                <div className="marquee-track">
                  {repeatedUniversityLogos.map((university, index) => (
                    <div
                      key={`${university.name}-${index}`}
                      className="flex h-[88px] w-[220px] shrink-0 items-center justify-center rounded-[22px] border border-[#f0d9b8] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,245,228,0.94))] px-5 py-4 shadow-[0_12px_30px_rgba(15,23,38,0.05)] backdrop-blur md:w-[250px]"
                    >
                      {'logo' in university ? (
                        <img
                          src={university.logo}
                          alt={`${university.name} logo`}
                          loading="lazy"
                          className="h-9 w-full max-w-[150px] object-contain opacity-100"
                        />
                      ) : (
                        <span className="text-center text-base font-bold text-[#b45309] md:text-lg">{university.wordmark}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-5 text-sm font-medium text-muted-foreground">
                Germany&apos;s top public universities, with tuition-free pathways and strong student outcomes.
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

        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="max-w-3xl text-center mx-auto">
              <p className="section-kicker">Key Germany Statistics</p>
              <h2 className="section-title">Big-picture numbers students care about before they commit.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {germanyStats.map((item, index) => (
                <motion.article
                  key={item.label}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={reveal}
                  custom={index * 0.05}
                  className="surface-panel p-7 text-center"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary md:text-xs">{item.label}</p>
                  <p className="mt-4 font-numeric text-2xl leading-none text-foreground md:text-3xl">{item.value}</p>
                  <p className="mt-3 text-xs leading-6 text-muted-foreground md:text-sm">{item.detail}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

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
                    <img src={studentsGroup} alt="BVF student support journey preview" className="h-full w-full rounded-[22px] object-cover opacity-95" />
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

        <section className="relative overflow-hidden px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="absolute left-[-4rem] top-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            <div className="absolute right-[-5rem] top-20 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-[40px] border border-white/65 bg-white/70 p-6 shadow-card backdrop-blur-xl md:p-10">
              <div className="flex flex-col gap-8 border-b border-border/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="section-kicker">How It Works</p>
                  <h2 className="section-title max-w-3xl">A six-step process that turns confusion into momentum.</h2>
                  <p className="section-copy max-w-2xl">Every stage has one job: remove guesswork, tighten decisions, and keep you moving toward Germany with fewer wrong turns.</p>
                </div>
                <div className="glass-panel flex max-w-sm items-center gap-4 px-5 py-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-foreground text-white font-numeric text-2xl">6</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">BVF Guided Flow</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">From profile check to landing support, the process stays structured all the way through.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 hidden md:grid md:grid-cols-2 xl:grid-cols-3">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={reveal}
                    custom={index * 0.05}
                    className="group relative p-3"
                  >
                    <div className="absolute left-3 right-3 top-10 hidden h-px bg-border xl:block" aria-hidden="true" />
                    <div className="relative flex h-full flex-col rounded-[30px] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,248,238,0.88))] p-6 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-card">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-numeric text-2xl text-primary">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <span className="rounded-full border border-border/80 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                          {step.label}
                        </span>
                      </div>
                      <h3 className="mt-6 text-[30px] leading-none text-foreground">{step.title}</h3>
                      <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{step.desc}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">{step.outcome}</p>
                        <ArrowRight className="h-4 w-4 text-secondary transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 space-y-4 md:hidden">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={reveal}
                    custom={index * 0.06}
                    className="grid grid-cols-[64px_1fr] gap-4 rounded-[28px] border border-border/80 bg-white/82 p-4 shadow-sm"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-numeric text-2xl text-primary">
                        {index + 1}
                      </div>
                      {index < processSteps.length - 1 ? <div className="mt-3 h-full w-px bg-border" /> : null}
                    </div>
                    <div className="pb-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">{step.label}</p>
                      <h3 className="mt-2 text-2xl text-foreground">{step.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.desc}</p>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">{step.outcome}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-10 md:px-8 md:py-12">
          <div className="container-narrow"><div className="relative overflow-hidden rounded-[38px]"><img src={germanCampus} alt="German university campus banner" className="h-[360px] w-full object-cover md:h-[460px]" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,20,35,0.78)_8%,rgba(13,20,35,0.42)_58%,rgba(13,20,35,0.68)_100%)]" /><div className="absolute inset-0 flex items-center"><div className="max-w-2xl p-8 md:p-12"><div className="max-w-[34rem]"><p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#facc15]">Campus Banner</p><h2 className="mt-4 max-w-[28rem] font-heading text-4xl font-semibold leading-[0.95] text-white md:text-5xl">Germany gives ambitious students world-class education without the tuition burden.</h2><p className="mt-5 max-w-[30rem] text-sm leading-7 text-white md:text-base">That only works well when the guidance is aligned with public universities, documentation timing, and the real student journey after admission.</p></div></div></div></div></div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="text-center"><p className="section-kicker">Student Testimonials</p><h2 className="section-title mx-auto max-w-3xl">Students choose BVF when they want the process to feel less chaotic.</h2></div>
            <div className="testimonial-paused marquee-mask mt-10 overflow-hidden"><div className="testimonial-track">{repeatedTestimonials.map((testimonial, index) => <article key={`${testimonial.id}-${index}`} className="w-[320px] shrink-0 rounded-[30px] border border-border/80 bg-white/86 p-6 shadow-card md:w-[360px]"><div className="flex items-center gap-3"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">{(testimonial.name || 'BV').slice(0, 1)}</div><div><p className="text-base font-semibold text-foreground">{testimonial.name}</p><p className="text-sm text-muted-foreground">{testimonial.university}</p></div></div><div className="mt-4 flex gap-1 text-primary">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} className="h-4 w-4 fill-current" aria-hidden="true" />)}</div><p className="mt-4 text-sm leading-7 text-muted-foreground">"{testimonial.quote}"</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">{testimonial.course}</span><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">{testimonial.result}</span><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">Winter Intake</span></div><a href={settings?.youtubeUrl || 'https://youtube.com'} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary">Watch Full Story <ArrowRight className="h-4 w-4" aria-hidden="true" /></a></article>)}</div></div>
            <div className="mt-8 text-center"><Link to="/bookings" className="button-primary">Join 500+ Students Who Chose BVF Germany</Link></div>
          </div>
        </section>

        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="flex flex-col items-center gap-4 text-center"><div className="flex flex-col items-center"><p className="section-kicker">Universities Preview</p><h2 className="section-title max-w-3xl">A glimpse at the public universities students ask about most.</h2></div><Link to="/universities" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-secondary">View All 50+ Universities <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
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
                    <img src={university.image} alt={university.name} className="h-48 w-full object-cover" loading="lazy" />
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
          <div className="container-narrow grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="surface-panel p-7 text-center"><p className="section-kicker">Free Webinar</p><h2 className="section-title mx-auto max-w-xl">The next best place to start if you need clarity fast.</h2><div className="mt-7 rounded-[28px] bg-white/82 p-6 text-left"><p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">Upcoming Event</p><h3 className="mt-3 text-2xl font-semibold text-foreground">{upcomingWebinar.topic}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{upcomingWebinar.date} | {upcomingWebinar.time}</p><Link to={upcomingWebinar.cta} className="button-primary mt-6">Register for Free Webinar</Link></div></div>
            <div className="surface-panel p-7"><div className="flex items-center gap-3 text-secondary"><PlayCircle className="h-6 w-6" aria-hidden="true" /><p className="text-xs font-semibold uppercase tracking-[0.25em]">Latest Recording</p></div><h2 className="section-title mt-4 max-w-xl">Or start with a founder-led recorded strategy session.</h2><div className="mt-6 overflow-hidden rounded-[28px]"><iframe className="aspect-video w-full" src="https://www.youtube.com/embed/jNQXAC9IVRw" title="BVF Germany webinar replay" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="flex flex-col items-center gap-4 text-center"><div className="flex flex-col items-center"><p className="section-kicker">Blog Preview</p><h2 className="section-title max-w-3xl">Fresh guides for students planning every stage of Germany.</h2></div><Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-secondary">Read All Guides <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">{posts.map((post, index) => <motion.article key={post.id} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={reveal} custom={index * 0.05} className="overflow-hidden rounded-[30px] border border-border/80 bg-white/86 shadow-card"><img src={post.featuredImage} alt={post.title} className="h-52 w-full object-cover" loading="lazy" /><div className="p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">{post.category}</p><h3 className="mt-3 font-heading text-2xl font-semibold text-foreground">{post.title}</h3><div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground"><span>{estimateReadTime(post.content)}</span><span>{dateFormatter.format(new Date(post.createdAt))}</span></div></div></motion.article>)}</div>
          </div>
        </section>

        <section className="bg-[#fff8ee] px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="text-center"><p className="section-kicker">Instagram Feed</p><h2 className="section-title mx-auto max-w-3xl">Daily Germany tips, student wins, and practical reminders.</h2></div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">{instagramTiles.map((image, index) => <a key={`${image}-${index}`} href={settings?.instagramUrl || 'https://instagram.com'} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-[22px]"><img src={image} alt={`BVF Germany Instagram preview ${index + 1}`} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-foreground/10 transition group-hover:bg-foreground/25" /></a>)}</div>
            <div className="mt-8 text-center"><a href={settings?.instagramUrl || 'https://instagram.com'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-secondary">Follow @bvfgermany for daily tips <ArrowRight className="h-4 w-4" aria-hidden="true" /></a></div>
          </div>
        </section>
        <section className="bg-[#132033] px-4 py-16 text-white md:px-8 md:py-20">
          <div className="container-narrow text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#facc15]">Final CTA</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold text-[#facc15] md:text-5xl">Your Germany Dream Starts Today</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/72 md:text-base">Book your free 30-minute consultation, understand your next step, and move forward with guidance that feels structured from day one.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4"><Link to="/bookings" className="inline-flex items-center justify-center rounded-full bg-[#facc15] px-6 py-3 text-sm font-semibold text-[#132033] transition hover:-translate-y-0.5">Book Free 30-Min Consultation</Link><a href={`https://wa.me/${settings?.whatsappNumber || '919999999999'}?text=${encodeURIComponent(settings?.prefilledWhatsappMessage || 'Hi BVF Germany! I want help with studying in Germany.')}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-white/86 transition hover:text-[#facc15]">Prefer WhatsApp? Chat Now →</a></div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}


