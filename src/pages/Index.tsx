import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from 'react';
import { Activity, ArrowRight, ArrowUpRight, BookOpenCheck, CheckCircle2, CircleDollarSign, Clock3, FileText, Globe2, GraduationCap, HeartPulse, House, Languages, Mail, PhoneCall, PlayCircle, SearchCheck, Send, ShieldCheck, Sparkles, Star, BriefcaseBusiness, PlaneTakeoff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaYoutube, FaTiktok, FaFacebook, FaLinkedin } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSeo } from '@/lib/useSeo';
import { getBlogPosts, type BlogPost } from '@/lib/blogStore';
import { serviceCatalog } from '@/lib/serviceCatalog';
import { getPricingPlans, type PricingPlan } from '@/lib/pricingStore';
import { getSiteSettings, getTestimonials, type SiteSettings, type TestimonialItem, type UniversityItem } from '@/lib/siteContentStore';
import { getPublicLeadCooldownMessage, markPublicLeadSubmitted, submitPublicLead } from '@/lib/publicLeadSubmission';
import {
  buildProfileEvaluationLeadMessage,
  buildProfileEvaluationWhatsappMessage,
  currentEducationOptions,
  interestedProgramOptions,
  type CurrentEducation,
  type InterestedProgram,
} from '@/lib/profileEvaluation';
import { submitPublicLeadRequest } from '@/lib/submissionEmailApi';
import { buildWhatsappHref } from '@/lib/whatsapp';
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
import fintibaBlockedAccountImage from '@/assets/fintiba-blocked-account.png';

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
  { icon: Languages, stat: '1,800+', title: 'English Programs', text: 'Many master\'s programs are taught in English, especially in technical fields.' },
  { icon: BriefcaseBusiness, stat: '20 Hrs/Week', title: 'Student Work Rights', text: 'Students can work part-time while studying and gain practical exposure.' },
  { icon: PlaneTakeoff, stat: '18 Months', title: 'Post-Study Visa', text: 'Graduates get time to stay back, job hunt, and transition into work life.' },
  { icon: ShieldCheck, stat: 'Safe & Stable', title: 'Safe Country', text: 'Germany offers strong infrastructure, public services, and a student-friendly environment.' },
];
const germanyStats = [
  {
    value: '€45,000 – €50,000',
    label: 'Average Annual Living Cost in Germany',
  },
  {
    value: '70 Lakh+',
    label: 'Skilled Job Vacancies in Germany (official figure)',
  },
  {
    value: '426',
    label: 'Public Universities',
  },
  {
    value: '42,000+',
    label: 'Indian Students',
  },
];
const processSteps = [
  { title: 'Profile Check', label: 'Reality Check', desc: 'We map your CGPA, budget, timeline, and Germany readiness before anything else.', outcome: 'Clear starting point' },
  { title: 'University List', label: 'Shortlist Build', desc: 'Your options are narrowed into a smarter public-university list that actually fits.', outcome: 'Targeted shortlist' },
  { title: 'Documents', label: 'Paperwork Stack', desc: 'APS, SOP, LOR, IELTS, and supporting documents get organized without the usual mess.', outcome: 'Submission-ready docs' },
  { title: 'Apply', label: 'Application Push', desc: 'We review every application carefully and submit it in the right order so you move forward with fewer avoidable errors and delays.', outcome: 'Stronger submissions' },
  { title: 'Visa', label: 'Embassy Prep', desc: 'Blocked account, interview prep, and visa readiness are handled with structure.', outcome: 'Visa confidence' },
  { title: 'Germany', label: 'Landing Support', desc: 'Travel, accommodation, and first-week essentials are planned before you fly.', outcome: 'Smooth arrival' },
];
const serviceIconMap = {
  university: GraduationCap,
  application: Send,
  ielts: Languages,
  gre: BookOpenCheck,
  language: Languages,
  visa: ShieldCheck,
  arrival: PlaneTakeoff,
  accommodation: House,
  sop: FileText,
  cv: SearchCheck,
  loan: CircleDollarSign,
  insurance: HeartPulse,
  'uni-application': Activity,
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
const contactSectionId = 'contact-section';
const defaultPopupLeadForm = {
  name: '',
  phone: '',
  email: '',
  website: '',
};
type HomeContactFormState = {
  name: string;
  email: string;
  phone: string;
  interestedProgram: InterestedProgram | '';
  currentEducation: CurrentEducation | '';
  website: string;
};

const defaultHomeContactForm: HomeContactFormState = {
  name: '',
  email: '',
  phone: '',
  interestedProgram: '',
  currentEducation: '',
  website: '',
};
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
    url: '/',
    image: '/hero-og.png',
  });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [popupForm, setPopupForm] = useState(defaultPopupLeadForm);
  const [homeContactForm, setHomeContactForm] = useState(defaultHomeContactForm);
  const [isPopupSubmitting, setIsPopupSubmitting] = useState(false);
  const [isHomeContactSubmitting, setIsHomeContactSubmitting] = useState(false);
  const [popupSubmitted, setPopupSubmitted] = useState(false);
  const [homeContactSubmitted, setHomeContactSubmitted] = useState(false);
  const [popupFeedback, setPopupFeedback] = useState('');
  const [homeContactFeedback, setHomeContactFeedback] = useState('');
  const [popupError, setPopupError] = useState('');
  const [homeContactError, setHomeContactError] = useState('');
  const [homeContactWhatsappHref, setHomeContactWhatsappHref] = useState('');

  useEffect(() => {
    void (async () => {
      const [allPosts, nextSettings, nextTestimonials, nextPlans] = await Promise.all([getBlogPosts(), getSiteSettings(), getTestimonials(), getPricingPlans()]);
      setPosts(allPosts.filter((post) => post.published).slice(0, 3));
      setSettings(nextSettings);
      setTestimonials(nextTestimonials.filter((item) => item.published).slice(0, 6));
      setPlans(nextPlans.filter((plan) => plan.published).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).slice(0, 3));
    })();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const welcomeTimeout = window.setTimeout(() => {
      setIsWelcomeOpen(true);
    }, 6000);

    return () => window.clearTimeout(welcomeTimeout);
  }, []);

  const closeWelcomePopup = () => {
    setIsWelcomeOpen(false);
    setPopupError('');
  };

  const repeatedUniversityLogos = [...universityLogos, ...universityLogos];
  const repeatedTestimonials = [...testimonials, ...testimonials];
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
  const whatsappHref = buildWhatsappHref(settings);
  const contactEmail = settings?.contactEmail || 'support@bvfgermany.com';
  const contactPhone = settings?.contactPhone || '+91 99999 99999';

  const scrollToContactSection = () => {
    if (typeof document === 'undefined') {
      return;
    }

    document.getElementById(contactSectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleApplyNowClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    scrollToContactSection();
  };

  const handlePopupLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (popupForm.website) {
      setPopupError('Submission failed. Please try again.');
      return;
    }

    const cooldownMessage = getPublicLeadCooldownMessage();
    if (cooldownMessage) {
      setPopupError(cooldownMessage);
      return;
    }

    setIsPopupSubmitting(true);
    setPopupError('');
    setPopupFeedback('');

    try {
      const result = await submitPublicLead({
        source: 'contact',
        sourcePage: '/',
        name: popupForm.name.trim(),
        email: popupForm.email.trim(),
        phone: popupForm.phone.trim(),
        subject: 'Homepage popup inquiry',
        message:
          'Requested the Germany Admission Starter Pack from the homepage popup. Interested in shortlist guidance, application planning, and next-step support.',
        metadata: {
          placement: 'homepage-popup',
          offer: 'germany-admission-starter-pack',
        },
      });

      markPublicLeadSubmitted();
      setPopupSubmitted(true);
      setPopupFeedback(
        result.emailSent
          ? 'Our team will reach out within 24 hours with the best next step for your Germany plan.'
          : 'Your request is saved and visible to our team. We will follow up with you shortly.',
      );
      setPopupForm(defaultPopupLeadForm);
      setIsWelcomeOpen(false);
    } catch (error) {
      console.error('Failed to submit popup lead:', error);
      setPopupError('We could not submit your request right now. Please try again in a moment.');
    } finally {
      setIsPopupSubmitting(false);
    }
  };

  const handleHomeContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (homeContactForm.website) {
      setHomeContactError('Submission failed. Please try again.');
      return;
    }

    if (!homeContactForm.interestedProgram || !homeContactForm.currentEducation) {
      setHomeContactError('Please complete all required fields.');
      return;
    }

    const cooldownMessage = getPublicLeadCooldownMessage();
    if (cooldownMessage) {
      setHomeContactError(cooldownMessage);
      return;
    }

    setIsHomeContactSubmitting(true);
    setHomeContactError('');
    setHomeContactFeedback('');

    try {
      const interestedProgram = homeContactForm.interestedProgram;
      const currentEducation = homeContactForm.currentEducation;
      const profileEvaluationWhatsappHref = buildWhatsappHref(
        settings,
        buildProfileEvaluationWhatsappMessage({
          name: homeContactForm.name.trim(),
          phone: homeContactForm.phone.trim(),
          email: homeContactForm.email.trim(),
          interestedProgram,
          currentEducation,
        }),
      );

      const result = await submitPublicLeadRequest({
        formType: 'profile_evaluation',
        source: 'contact',
        sourcePage: '/',
        name: homeContactForm.name.trim(),
        email: homeContactForm.email.trim(),
        phone: homeContactForm.phone.trim(),
        subject: 'Free Profile Evaluation',
        message: buildProfileEvaluationLeadMessage({
          interestedProgram,
          currentEducation,
        }),
        interestedProgram,
        currentEducation,
        metadata: {
          placement: 'homepage-contact-section',
          interestedProgram,
          currentEducation,
        },
        website: homeContactForm.website,
      });

      markPublicLeadSubmitted();
      setHomeContactSubmitted(true);
      setHomeContactWhatsappHref(profileEvaluationWhatsappHref);
      setHomeContactFeedback(
        result.emailSent
          ? 'Thanks. Your Free Profile Evaluation request is in, and we have emailed you a confirmation. Our team will review it within 24 hours.'
          : 'Your Free Profile Evaluation request is saved successfully. Our team can already see it and will follow up soon.',
      );
      setHomeContactForm(defaultHomeContactForm);
    } catch (error) {
      console.error('Failed to submit homepage contact form:', error);
      setHomeContactError('We could not submit your request right now. Please try again in a moment.');
    } finally {
      setIsHomeContactSubmitting(false);
    }
  };

  return (
    <div className="site-shell home-showcase">
      <Navbar />
      <Dialog open={isWelcomeOpen} onOpenChange={(nextOpen) => (nextOpen ? setIsWelcomeOpen(true) : closeWelcomePopup())}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[430px] overflow-hidden border-[#243753] bg-[linear-gradient(180deg,#10203a,#0b1524)] p-0 text-white shadow-[0_24px_72px_rgba(7,12,21,0.52)] [&>button]:text-white/75 [&>button]:hover:text-white">
          <div className="border-b border-white/10 px-6 pb-5 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#facc15]">Free Strategy Offer</p>
            <DialogHeader className="mt-3 space-y-2 text-left">
              <DialogTitle className="text-[2rem] font-extrabold leading-tight text-white">Get your Germany admission starter plan</DialogTitle>
              <DialogDescription className="text-sm leading-6 text-white/74">
                Shortlist guidance, APS and visa direction, plus the smartest next step for your intake.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="space-y-3 px-6 pb-6 pt-5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsWelcomeOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-extrabold text-[#0f1726] transition hover:-translate-y-0.5 hover:bg-[#20bf5a]"
            >
              <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </DialogContent>
      </Dialog>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8f2e8_0%,#fff8ee_56%,#ffffff_100%)] text-[#132033]">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#facc15]/15 blur-3xl" aria-hidden="true" />
          <div className="absolute right-0 top-8 h-72 w-72 rounded-full bg-[#f59e0b]/12 blur-3xl" aria-hidden="true" />
          <div className="container-narrow relative z-10 px-4 pb-14 pt-28 md:px-8 md:pb-20 md:pt-36">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <motion.div initial="hidden" animate="show" variants={reveal} className="max-w-3xl">
                <p className="font-home-accent mb-4 text-xs uppercase tracking-[0.34em] text-[#b45309]">BVF Germany</p>
                <h1 className="font-home-heading max-w-4xl text-[2.8rem] font-extrabold leading-tight text-[#132033] sm:text-[3.4rem] md:text-[4.2rem]">
                  Study in Germany
                </h1>
                <p className="font-home-body mt-5 max-w-2xl text-base leading-7 text-[#475467] md:text-lg md:leading-8">
                  Public Universities in Germany (Tuition-Free)
                  <span className="block mt-1 text-[#b45309] font-semibold">Expert Guidance from India to Germany</span>
                </p>
                
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {germanyStats.slice(2, 4).map((item) => (
                    <div key={item.label} className="rounded-[24px] border border-[#e6ddcf] bg-white px-5 py-5 shadow-[0_18px_45px_rgba(15,23,38,0.08)]">
                      <p className="font-home-heading text-3xl font-bold leading-none text-[#132033]">{item.value}</p>
                      <p className="mt-2 text-sm font-semibold text-[#5c6678]">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleApplyNowClick}
                    className="font-home-body inline-flex items-center justify-center rounded-full bg-[#132033] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1726]"
                  >
                    Book Free Consultation Now
                  </button>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="font-home-body inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#20bf5a]"
                  >
                    <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                </div>

                <div className="mt-8 flex items-center gap-5 pl-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#475467]/70">Connect With Us</p>
                  <div className="flex items-center gap-4">
                    <a href="https://www.instagram.com/bratlins_view?igsh=OHBzemJpZWhkYnVu&utm_source=qr" target="_blank" rel="noreferrer" className="text-[#E1306C] transition hover:scale-110" aria-label="Instagram">
                      <FaInstagram className="h-5 w-5" />
                    </a>
                    <a href={settings?.youtubeUrl || "https://www.youtube.com/@bvfgermany"} target="_blank" rel="noreferrer" className="text-[#FF0000] transition hover:scale-110" aria-label="YouTube">
                      <FaYoutube className="h-5 w-5" />
                    </a>
                    <a href={settings?.tiktokUrl || "https://www.tiktok.com/@bvfgermany"} target="_blank" rel="noreferrer" className="text-[#000000] transition hover:scale-110" aria-label="TikTok">
                      <FaTiktok className="h-5 w-5" />
                    </a>
                    <a href={settings?.facebookUrl || "https://www.facebook.com/bvfgermany"} target="_blank" rel="noreferrer" className="text-[#1877F2] transition hover:scale-110" aria-label="Facebook">
                      <FaFacebook className="h-5 w-5" />
                    </a>
                    <a href={settings?.linkedinUrl || "https://www.linkedin.com/company/bvf-germany"} target="_blank" rel="noreferrer" className="text-[#0A66C2] transition hover:scale-110" aria-label="LinkedIn">
                      <FaLinkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative hidden lg:block"
              >
                <div className="relative overflow-hidden rounded-[48px] border-[12px] border-white bg-white shadow-2xl">
                  <img 
                    src={germanCampus} 
                    alt="German University Campus" 
                    className="aspect-[4/5] w-full object-cover grayscale-[0.1] transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#132033]/40 via-transparent to-transparent" />
                  
                  {/* Floating Trust Badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/95 p-4 backdrop-blur-sm shadow-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#facc15] text-[#132033]">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#132033]">Certified Guidance</p>
                        <p className="text-[10px] text-[#5c6678]">100% Public University Focus</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Blur */}
                <div className="absolute -right-6 -top-6 -z-10 h-64 w-64 rounded-full bg-[#facc15]/10 blur-3xl" />
              </motion.div>
            </div>
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
        <section className="bg-white px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="text-center">
              <p className="section-kicker">Essentials By BVF Germany</p>
              <h2 className="section-title mx-auto max-w-3xl">Blocked Account — By BVF Germany</h2>
              <p className="section-copy mx-auto">
                A blocked account (Sperrkonto) is a mandatory requirement for your German student visa,
                proving you have the funds to support yourself for one year.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {/* Expatrio Card */}
              <div className="group relative overflow-hidden rounded-[32px] border border-border/80 bg-white shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                <div className="flex flex-col md:flex-row">
                  <div className="h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-2/5">
                    <img
                      src="https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=600&auto=format&fit=crop"
                      alt="Expatrio Blocked Account"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#00a88e]">Essentials by BVF Germany</p>
                    <h3 className="mt-2 text-2xl font-extrabold text-foreground">Expatrio</h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">Open a blocked account in minutes with Expatrio. Digitally verified and accepted by German authorities worldwide.</p>
                    <a
                      href="https://www.expatrio.com/?customer_number=BVFGERMANY"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#00a88e] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#008f79]"
                    >
                      Open Your Blocked Account <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Fintiba Card */}
              <div className="group relative overflow-hidden rounded-[32px] border border-border/80 bg-white shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                <div className="flex flex-col md:flex-row">
                  <div className="h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-2/5">
                    <img
                      src={fintibaBlockedAccountImage}
                      alt="Fintiba Blocked Account"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#1e6fcb]">Essentials by BVF Germany</p>
                    <h3 className="mt-2 text-2xl font-extrabold text-foreground">Fintiba</h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">The most experienced blocked account provider. Trusted by thousands of students for secure fund transfers.</p>
                    <a
                      href="https://www.fintiba.com/?customer_number=BVFGERMANY"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#1e6fcb] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1858a1]"
                    >
                      Open Your Account Now <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 rounded-[40px] border border-border/50 bg-[#fffcf8] p-8 md:p-12">
              <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                <div>
                  <h3 className="text-2xl font-extrabold text-foreground">Why it&apos;s required?</h3>
                  <p className="mt-4 text-[15px] font-medium leading-7 text-muted-foreground">
                    To obtain a German student visa, you must prove financial resources for your stay. For 2024, the mandate is <strong>11,208 EUR</strong> per year.
                  </p>

                  <div className="mt-8 space-y-4">
                    {[
                      { title: 'Official Mandate', text: 'Required for almost all non-EU students.' },
                      { title: 'Self-Support Proof', text: 'Covers rent, food, and semester fees.' },
                      { title: 'Secure Transfer', text: 'Money remains in your name throughout.' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/10 text-[#C9A84C]">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{item.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground leading-5">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-[#efe4d3] bg-white p-6 md:p-8">
                  <h3 className="text-2xl font-extrabold text-foreground">Step-by-step process</h3>
                  <div className="mt-8 space-y-8">
                    {[
                      { step: '01', title: 'Choose provider', desc: 'Select Fintiba or Expatrio based on your needs.' },
                      { step: '02', title: 'Register online', desc: 'Complete application with passport and admission details.' },
                      { step: '03', title: 'Transfer 11,208 EUR', desc: 'Safe transfer from India to your own blocked account.' },
                      { step: '04', title: 'Receive Confirmation', desc: 'Get the letter needed for your visa appointment.' },
                      { step: '05', title: 'Monthly Release', desc: 'Funds released (934 EUR/month) after arrival.' },
                    ].map((step) => (
                      <div key={step.step} className="flex gap-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground font-numeric text-xl font-bold text-white">
                          {step.step}
                        </div>
                        <div>
                          <p className="text-base font-extrabold text-foreground">{step.title}</p>
                          <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative overflow-hidden bg-[#0D1F3C] px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="absolute left-[-4rem] top-10 h-48 w-48 rounded-full bg-[#C9A84C]/10 blur-3xl" aria-hidden="true" />
            <div className="absolute right-[-5rem] top-20 h-56 w-56 rounded-full bg-[#C9A84C]/10 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-[40px] border border-[#C9A84C]/30 bg-[#0D1F3C] p-6 shadow-card md:p-10">
              <div className="flex flex-col gap-8 border-b border-[#C9A84C]/30 pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#C9A84C]">How It Works</p>
                  <h2 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[0.95] text-[#FFFFFF] md:text-5xl">A six-step process that turns confusion into momentum.</h2>
                  <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-[#E0E0E0]">Every stage has one job: remove guesswork, tighten decisions, and keep you moving toward Germany with fewer wrong turns.</p>
                </div>
                <div className="flex max-w-sm items-center gap-4 rounded-3xl border border-[#C9A84C]/30 bg-[#0D1F3C] px-5 py-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#C9A84C] text-[#0D1F3C] font-numeric text-2xl font-bold">6</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">BVF Guided Flow</p>
                    <p className="mt-1 text-sm leading-6 text-[#E0E0E0]">From profile check to landing support, the process stays structured all the way through.</p>
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
                    <div className="absolute left-3 right-3 top-10 hidden h-px bg-[#C9A84C]/30 xl:block" aria-hidden="true" />
                    <div className="relative flex h-full flex-col rounded-[30px] border border-[#C9A84C]/30 bg-[#0D1F3C] p-6 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-[#C9A84C]/60">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A84C]/50 bg-[#C9A84C]/10 font-numeric text-2xl text-[#C9A84C] font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <span className="rounded-full border border-[#C9A84C]/30 bg-[#0D1F3C] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
                          {step.label}
                        </span>
                      </div>
                      <h3 className="mt-6 text-[30px] font-semibold leading-none text-[#FFFFFF]">{step.title}</h3>
                      <p className="mt-4 flex-1 text-sm leading-7 text-[#E0E0E0]">{step.desc}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-[#C9A84C]/30 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E0E0E0]">{step.outcome}</p>
                        <ArrowRight className="h-4 w-4 text-[#C9A84C] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
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
                    className="grid grid-cols-[64px_1fr] gap-4 rounded-[28px] border border-[#C9A84C]/30 bg-[#0D1F3C] p-4 shadow-sm"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A84C]/50 bg-[#C9A84C]/10 font-numeric text-2xl text-[#C9A84C] font-bold">
                        {index + 1}
                      </div>
                      {index < processSteps.length - 1 ? <div className="mt-3 h-full w-px bg-[#C9A84C]/30" /> : null}
                    </div>
                    <div className="pb-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">{step.label}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-[#FFFFFF]">{step.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#E0E0E0]">{step.desc}</p>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#E0E0E0]">{step.outcome}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-10 md:px-8 md:py-12">
          <div className="container-narrow">
            <div className="relative overflow-hidden rounded-[38px]">
              <img
                src={germanCampus}
                alt="German university campus banner"
                className="h-[360px] w-full object-cover md:h-[460px]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,20,35,0.78)_8%,rgba(13,20,35,0.42)_58%,rgba(13,20,35,0.68)_100%)]" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-2xl p-8 md:p-12">
                  <div className="max-w-[34rem]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#facc15]">Campus Banner</p>
                    <h2 className="mt-4 max-w-[28rem] font-heading text-4xl font-semibold leading-[0.95] text-white md:text-5xl">
                      Germany gives ambitious students world-class education without the tuition burden.
                    </h2>
                    <p className="mt-5 max-w-[30rem] text-sm leading-7 text-white md:text-base">
                      That only works well when the guidance is aligned with public universities,
                      documentation timing, and the real student journey after admission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-20">
          <div className="container-narrow">
            <div className="text-center"><p className="section-kicker">Student Testimonials</p><h2 className="section-title mx-auto max-w-3xl">Students choose BVF when they want the process to feel less chaotic.</h2></div>
            <div className="testimonial-paused marquee-mask mt-10 overflow-hidden"><div className="testimonial-track">{repeatedTestimonials.map((testimonial, index) => <article key={`${testimonial.id}-${index}`} className="w-[320px] shrink-0 rounded-[30px] border border-border/80 bg-white/86 p-6 shadow-card md:w-[360px]"><div className="flex items-center gap-3"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">{(testimonial.name || 'BV').slice(0, 1)}</div><div><p className="text-base font-semibold text-foreground">{testimonial.name}</p><p className="text-sm text-muted-foreground">{testimonial.university}</p></div></div><div className="mt-4 flex gap-1 text-primary">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} className="h-4 w-4 fill-current" aria-hidden="true" />)}</div><p className="mt-4 text-sm leading-7 text-muted-foreground">"{testimonial.quote}"</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">{testimonial.course}</span><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">{testimonial.result}</span><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">Winter Intake</span></div><a href={settings?.youtubeUrl || 'https://youtube.com'} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary">Watch Full Story <ArrowRight className="h-4 w-4" aria-hidden="true" /></a></article>)}</div></div>
            <div className="mt-8 text-center"><Link to="/bookings" className="button-primary">Get Free Profile Evaluation</Link></div>
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
        <section id={contactSectionId} className="bg-[#132033] px-4 py-16 text-white md:px-8 md:py-20">
          <div className="container-narrow grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#facc15]">Contact BVF Germany</p>
                <h2 className="mt-4 max-w-xl font-heading text-4xl font-semibold text-white md:text-5xl">
                  Talk to our team about your Germany plan.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 md:text-base">
                  Share your course, intake, budget, or current challenge and we will guide you on the right next step, shortlist direction, and service fit.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[26px] border border-white/10 bg-white/6 p-5">
                  <Clock3 className="h-5 w-5 text-[#facc15]" aria-hidden="true" />
                  <p className="mt-4 text-sm font-semibold text-white">Fast response</p>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    Most inquiries get a response within 24 hours. WhatsApp is usually faster.
                  </p>
                </div>
                <div className="rounded-[26px] border border-white/10 bg-white/6 p-5">
                  <Sparkles className="h-5 w-5 text-[#facc15]" aria-hidden="true" />
                  <p className="mt-4 text-sm font-semibold text-white">Commercial guidance</p>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    Get clarity on admissions support, documents, visa planning, and the right package for your journey.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={`mailto:${contactEmail}`}
                  className="rounded-[26px] border border-white/10 bg-white/6 p-5 transition hover:bg-white/10"
                >
                  <Mail className="h-5 w-5 text-[#facc15]" aria-hidden="true" />
                  <p className="mt-4 text-sm font-semibold text-white">Email</p>
                  <p className="mt-2 text-sm leading-6 text-white/68">{contactEmail}</p>
                </a>
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                  className="rounded-[26px] border border-white/10 bg-white/6 p-5 transition hover:bg-white/10"
                >
                  <PhoneCall className="h-5 w-5 text-[#facc15]" aria-hidden="true" />
                  <p className="mt-4 text-sm font-semibold text-white">Phone</p>
                  <p className="mt-2 text-sm leading-6 text-white/68">{contactPhone}</p>
                </a>
              </div>


            </div>

            <div className="rounded-[34px] bg-[#fff8ee] p-6 text-[#132033] shadow-[0_28px_90px_rgba(7,12,21,0.28)] md:p-8">
              {homeContactSubmitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#132033] text-white">
                    <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-3xl font-semibold text-[#132033]">Profile evaluation requested.</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#5c6678]">{homeContactFeedback}</p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setHomeContactSubmitted(false);
                        setHomeContactFeedback('');
                        setHomeContactError('');
                        setHomeContactWhatsappHref('');
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-[#d8cfc0] px-5 py-3 text-sm font-semibold text-[#132033] transition hover:bg-white"
                    >
                      Send another request
                    </button>
                    <a
                      href={homeContactWhatsappHref || whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#0f1726] transition hover:-translate-y-0.5 hover:bg-[#20bf5a]"
                    >
                      Continue on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleHomeContactSubmit} className="space-y-5">
                  <div>
                    <h3 className="mt-3 text-3xl font-semibold text-[#132033] md:text-[2.2rem]">
                      Get Your Free Profile Evaluation
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#5c6678]">
                      Tell us your target program and current education level so we can review the right next step for your Germany journey.
                    </p>
                  </div>

                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    value={homeContactForm.website}
                    onChange={(event) => setHomeContactForm((current) => ({ ...current, website: event.target.value }))}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#132033]">Full Name</span>
                      <input
                        type="text"
                        required
                        value={homeContactForm.name}
                        onChange={(event) => setHomeContactForm((current) => ({ ...current, name: event.target.value }))}
                        className="w-full rounded-[20px] border border-[#e4d6c3] bg-white px-4 py-3 text-sm text-[#132033] outline-none transition focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/12"
                        placeholder="Enter your full name"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#132033]">WhatsApp Number</span>
                      <input
                        type="tel"
                        required
                        value={homeContactForm.phone}
                        onChange={(event) => setHomeContactForm((current) => ({ ...current, phone: event.target.value }))}
                        className="w-full rounded-[20px] border border-[#e4d6c3] bg-white px-4 py-3 text-sm text-[#132033] outline-none transition focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/12"
                        placeholder="+91 98765 43210"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#132033]">Email Address</span>
                      <input
                        type="email"
                        required
                        value={homeContactForm.email}
                        onChange={(event) => setHomeContactForm((current) => ({ ...current, email: event.target.value }))}
                        className="w-full rounded-[20px] border border-[#e4d6c3] bg-white px-4 py-3 text-sm text-[#132033] outline-none transition focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/12"
                        placeholder="name@example.com"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#132033]">Interested Program</span>
                      <select
                        required
                        value={homeContactForm.interestedProgram}
                        onChange={(event) =>
                          setHomeContactForm((current) => ({
                            ...current,
                            interestedProgram: event.target.value as InterestedProgram | '',
                          }))
                        }
                        className="w-full rounded-[20px] border border-[#e4d6c3] bg-white px-4 py-3 text-sm text-[#132033] outline-none transition focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/12"
                      >
                        <option value="">Select a program</option>
                        {interestedProgramOptions.map((program) => (
                          <option key={program} value={program}>
                            {program}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#132033]">Current Education</span>
                    <select
                      required
                      value={homeContactForm.currentEducation}
                      onChange={(event) =>
                        setHomeContactForm((current) => ({
                          ...current,
                          currentEducation: event.target.value as CurrentEducation | '',
                        }))
                      }
                      className="w-full rounded-[20px] border border-[#e4d6c3] bg-white px-4 py-3 text-sm text-[#132033] outline-none transition focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/12"
                    >
                      <option value="">Select your current education</option>
                      {currentEducationOptions.map((education) => (
                        <option key={education} value={education}>
                          {education}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="submit"
                    disabled={isHomeContactSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#132033] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1726] disabled:translate-y-0 disabled:opacity-70"
                  >
                    {isHomeContactSubmitting ? 'Submitting...' : 'Get Free Evaluation'}
                  </button>
                  <p aria-live="polite" className={`text-xs leading-5 ${homeContactError ? 'text-[#b42318]' : 'text-[#5c6678]'}`}>
                    {homeContactError || 'Your request is saved to the BVF lead system and emailed to the team. We usually respond within 24 hours.'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
        <section className="bg-[#132033] px-4 py-16 text-white md:px-8 md:py-20">
          <div className="container-narrow text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#facc15]">Final CTA</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold text-[#facc15] md:text-5xl">Your Germany Dream Starts Today</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/72 md:text-base">Book your free 30-minute consultation, understand your next step, and move forward with guidance that feels structured from day one.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center rounded-full bg-[#facc15] px-6 py-3 text-sm font-semibold text-[#132033] transition hover:-translate-y-0.5"
              >
                Book Free Consultation Now
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-white/86 transition hover:text-[#facc15]"
              >
                Prefer WhatsApp? Chat Now →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
