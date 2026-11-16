import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  X,
  Calendar,
  GraduationCap,
  BookOpen,
  Briefcase,
  Compass,
  Cpu,
  TrendingUp,
  Layers,
  FileCheck2,
  ShieldCheck,
  FileText,
  Landmark,
  Languages,
  Home,
  Calculator,
  Video,
  Newspaper,
  Building2,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { getStudentProfile } from '@/lib/studentStore';
import BrandLogoMark from '@/components/BrandLogoMark';

type PathwayItem = {
  label: string;
  to: string;
  description: string;
  icon: typeof GraduationCap;
};

const studyPathways: PathwayItem[] = [
  {
    label: "Master's in Germany",
    to: '/study-in-germany/ms',
    description: 'Free-tuition MS programs at top TU9 and public universities',
    icon: GraduationCap,
  },
  {
    label: "Bachelor's in Germany",
    to: '/study-in-germany/bachelor',
    description: 'Undergraduate degree programs & Studienkolleg guidance',
    icon: BookOpen,
  },
  {
    label: 'Ausbildung in Germany',
    to: '/study-in-germany/ausbildung',
    description: 'Dual vocational training with monthly stipend & career start',
    icon: Briefcase,
  },
  {
    label: "Master's Engineering",
    to: '/study-in-germany/engineering',
    description: 'Mechanical, Automotive, Robotics & Electrical specializations',
    icon: Cpu,
  },
  {
    label: "Master's Business / MBA",
    to: '/study-in-germany/mba',
    description: 'International Business, Management & Finance degrees',
    icon: TrendingUp,
  },
  {
    label: 'Explore All Pathways',
    to: '/study-in-germany',
    description: 'Compare admission requirements, eligibility & timeline',
    icon: Compass,
  },
];

type ServiceItem = {
  label: string;
  to: string;
  description: string;
  icon: typeof Layers;
};

const servicesList: ServiceItem[] = [
  {
    label: 'All Services Overview',
    to: '/services',
    description: 'End-to-end guidance from application to enrollment',
    icon: Layers,
  },
  {
    label: 'University Shortlisting',
    to: '/services/university-shortlist',
    description: 'Data-driven university & course selection for admission success',
    icon: FileCheck2,
  },
  {
    label: 'APS Application Support',
    to: '/services/aps-application',
    description: 'Documentation verification & fast-track certificate assistance',
    icon: ShieldCheck,
  },
  {
    label: 'Visa Guidance & Slot Booking',
    to: '/services/visa-guidance',
    description: 'Complete visa documentation, blocked account & interview prep',
    icon: FileText,
  },
  {
    label: 'German Blocked Account',
    to: '/services/blocked-account',
    description: 'Fast account opening with trusted German financial partners',
    icon: Landmark,
  },
  {
    label: 'German Language Courses',
    to: '/german-language',
    description: 'A1 to B2 live interactive training for admissions & life in Germany',
    icon: Languages,
  },
  {
    label: 'Student Accommodation',
    to: '/services/accommodation-help',
    description: 'Verified student housing assistance in major German cities',
    icon: Home,
  },
];

type ResourceItem = {
  label: string;
  to: string;
  description: string;
  icon: typeof Calculator;
};

const resourcesList: ResourceItem[] = [
  {
    label: 'Free Assessment Tools',
    to: '/tools',
    description: 'CGPA to German Bavarian grade calculator & IELTS requirements checker',
    icon: Calculator,
  },
  {
    label: 'Live & Recorded Webinars',
    to: '/webinars',
    description: 'Interactive expert sessions on university admissions and visa guidance',
    icon: Video,
  },
  {
    label: 'Educational Blog & Guides',
    to: '/blog',
    description: 'In-depth articles on cost of living, blocked accounts & student visas',
    icon: Newspaper,
  },
  {
    label: 'Universities Directory',
    to: '/universities',
    description: 'Explore TU9 and premier German public research universities',
    icon: Building2,
  },
  {
    label: 'Resources Hub',
    to: '/resources',
    description: 'Curated downloads, application checklists and document templates',
    icon: BookOpen,
  },
];

export default function Navbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'pathways' | 'services' | 'resources' | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<'pathways' | 'services' | 'resources' | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentPhoto, setStudentPhoto] = useState('');
  const location = useLocation();
  const navRef = useRef<HTMLDivElement | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
    setAccountOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Handle escape key to close open menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setOpenDropdown(null);
        setAccountOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load student profile for authenticated users
  useEffect(() => {
    const loadStudentName = async () => {
      if (!user) {
        setStudentName('');
        setStudentPhoto('');
        return;
      }

      const profile = await getStudentProfile(user.uid);
      setStudentName(profile?.name || user.email || '');
      setStudentPhoto(profile?.profilePhoto || '');
    };

    void loadStudentName();
  }, [user]);

  const initials = useMemo(() => {
    const normalized = studentName.trim();
    if (!normalized) return 'BV';

    const parts = normalized.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    const compact = parts[0];
    if (compact.length >= 2) {
      return `${compact[0]}${compact[compact.length - 1]}`.toUpperCase();
    }

    return compact[0].toUpperCase();
  }, [studentName]);

  const handleLogout = async () => {
    await signOut(auth);
    setAccountOpen(false);
    setMobileOpen(false);
  };

  const handleMouseEnter = (name: 'pathways' | 'services' | 'resources') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const isPathwaysActive =
    location.pathname.startsWith('/study-in-germany') ||
    location.pathname.startsWith('/about-germany');

  const isServicesActive =
    location.pathname.startsWith('/services') ||
    location.pathname === '/german-language';

  const isResourcesActive =
    location.pathname.startsWith('/resources') ||
    location.pathname.startsWith('/tools') ||
    location.pathname.startsWith('/webinars') ||
    location.pathname.startsWith('/blog') ||
    location.pathname.startsWith('/universities');

  const isAboutActive =
    location.pathname.startsWith('/about') && !location.pathname.startsWith('/about-germany');

  const handleProfileEvaluationClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileOpen(false);
    setOpenDropdown(null);
    if (location.pathname === '/') {
      const el = document.getElementById('profile-evaluation');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E7E5E0] bg-white/95 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] backdrop-blur-md transition-shadow">
      <div ref={navRef} className="container-narrow flex h-[74px] items-center justify-between gap-2 xl:gap-3 px-3 sm:px-4 md:px-6">
        {/* Left: Brand Logo */}
        <Link to="/" className="group flex shrink-0 items-center gap-2.5 lg:gap-3" aria-label="BVF Germany Home">
          <BrandLogoMark wrapperClassName="h-10 w-10 md:h-11 md:w-11 rounded-xl border-[#E7E5E0] shadow-none transition-colors group-hover:border-[#CBD5E1]" />
          <div className="flex flex-col">
            <span className="font-heading text-base font-extrabold tracking-tight text-[#0F172A] leading-tight md:text-lg whitespace-nowrap">
              BVF Germany
            </span>
            <span className="hidden text-[10px] font-medium text-[#64748B] leading-none tracking-normal xl:inline-block whitespace-nowrap">
              Public University Experts
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {/* Home */}
          <Link
            to="/"
            className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
              location.pathname === '/'
                ? 'bg-[#FAF8F5] font-semibold text-[#0F172A]'
                : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            Home
          </Link>

          {/* Study Pathways Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('pathways')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => (prev === 'pathways' ? null : 'pathways'))}
              className={`whitespace-nowrap inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                isPathwaysActive || openDropdown === 'pathways'
                  ? 'bg-[#FAF8F5] font-semibold text-[#0F172A]'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
              aria-expanded={openDropdown === 'pathways'}
              aria-haspopup="menu"
              aria-label="Study Pathways menu"
            >
              <span>Study Pathways</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#64748B] transition-transform duration-200 ${
                  openDropdown === 'pathways' ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'pathways' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full pt-2 w-[420px] z-50"
                  role="menu"
                >
                  <div className="rounded-2xl border border-[#E7E5E0] bg-white p-3 shadow-lg">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                      Germany Study Pathways
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {studyPathways.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setOpenDropdown(null)}
                            className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                              active ? 'bg-[#FAF8F5]' : 'hover:bg-[#FAF8F5]'
                            }`}
                            role="menuitem"
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#2D6A4F] transition-colors group-hover:bg-[#0F172A] group-hover:text-white">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-[#0F172A] transition-colors group-hover:text-[#2D6A4F]">
                                {item.label}
                              </div>
                              <p className="text-xs text-[#64748B] line-clamp-1 leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => (prev === 'services' ? null : 'services'))}
              className={`whitespace-nowrap inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                isServicesActive || openDropdown === 'services'
                  ? 'bg-[#FAF8F5] font-semibold text-[#0F172A]'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
              aria-expanded={openDropdown === 'services'}
              aria-haspopup="menu"
              aria-label="Services menu"
            >
              <span>Services</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#64748B] transition-transform duration-200 ${
                  openDropdown === 'services' ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'services' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full pt-2 w-[420px] z-50"
                  role="menu"
                >
                  <div className="rounded-2xl border border-[#E7E5E0] bg-white p-3 shadow-lg">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                      BVF Support Services
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {servicesList.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setOpenDropdown(null)}
                            className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                              active ? 'bg-[#FAF8F5]' : 'hover:bg-[#FAF8F5]'
                            }`}
                            role="menuitem"
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#2D6A4F] transition-colors group-hover:bg-[#0F172A] group-hover:text-white">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-[#0F172A] transition-colors group-hover:text-[#2D6A4F]">
                                {item.label}
                              </div>
                              <p className="text-xs text-[#64748B] line-clamp-1 leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Student Stories */}
          <Link
            to="/success-stories"
            className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
              location.pathname.startsWith('/success-stories')
                ? 'bg-[#FAF8F5] font-semibold text-[#0F172A]'
                : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            Student Stories
          </Link>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('resources')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => (prev === 'resources' ? null : 'resources'))}
              className={`whitespace-nowrap inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                isResourcesActive || openDropdown === 'resources'
                  ? 'bg-[#FAF8F5] font-semibold text-[#0F172A]'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
              aria-expanded={openDropdown === 'resources'}
              aria-haspopup="menu"
              aria-label="Resources menu"
            >
              <span>Resources</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#64748B] transition-transform duration-200 ${
                  openDropdown === 'resources' ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'resources' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full pt-2 w-[400px] z-50"
                  role="menu"
                >
                  <div className="rounded-2xl border border-[#E7E5E0] bg-white p-3 shadow-lg">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                      Free Student Resources
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {resourcesList.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setOpenDropdown(null)}
                            className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                              active ? 'bg-[#FAF8F5]' : 'hover:bg-[#FAF8F5]'
                            }`}
                            role="menuitem"
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF8F5] text-[#2D6A4F] transition-colors group-hover:bg-[#0F172A] group-hover:text-white">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-[#0F172A] transition-colors group-hover:text-[#2D6A4F]">
                                {item.label}
                              </div>
                              <p className="text-xs text-[#64748B] line-clamp-1 leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* About */}
          <Link
            to="/about"
            className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
              isAboutActive
                ? 'bg-[#FAF8F5] font-semibold text-[#0F172A]'
                : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            About
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
              location.pathname === '/contact'
                ? 'bg-[#FAF8F5] font-semibold text-[#0F172A]'
                : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right: Actions (CTA, Account, Mobile toggle) */}
        <div className="flex shrink-0 items-center gap-2 xl:gap-2.5">
          {/* Primary CTA: Free Profile Evaluation */}
          <Link
            to="/#profile-evaluation"
            onClick={handleProfileEvaluationClick}
            className="whitespace-nowrap inline-flex items-center justify-center rounded-full bg-[#0F172A] px-3.5 py-2 xl:px-4 xl:py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E293B] hover:shadow-md"
          >
            Free Profile Evaluation
          </Link>

          {/* Secondary Quick Action: Book Consultation (large desktop only) */}
          <Link
            to="/bookings"
            title="Book Free Consultation"
            aria-label="Book Free Consultation"
            className="hidden 2xl:inline-flex whitespace-nowrap items-center gap-1.5 rounded-full border border-[#E7E5E0] bg-white px-3 py-2 text-xs font-semibold text-[#0F172A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FAF8F5] hover:border-[#CBD5E1]"
          >
            <Calendar className="h-3.5 w-3.5 text-[#2D6A4F]" aria-hidden="true" />
            <span>Book Call</span>
          </Link>

          {/* Student Account Access */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((current) => !current)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#E7E5E0] bg-white text-xs font-bold text-[#0F172A] shadow-sm transition hover:border-[#CBD5E1]"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                aria-label="Open student account menu"
              >
                {studentPhoto ? (
                  <img
                    src={studentPhoto}
                    alt={`${studentName || 'Student'} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </button>
              {accountOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-[#E7E5E0] bg-white p-2 shadow-lg z-50"
                  role="menu"
                >
                  <div className="rounded-xl bg-[#FAF8F5] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F]">Student Portal</p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-[#0F172A]">{studentName || user.email}</p>
                    <p className="truncate text-xs text-[#64748B]">{user.email}</p>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <Link
                      to="/dashboard"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#FAF8F5]"
                      role="menuitem"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#64748B]" aria-hidden="true" />
                      <span>My Dashboard</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Student Portal Login"
              title="Student Portal Login"
              className="whitespace-nowrap inline-flex items-center gap-1.5 rounded-full border border-[#E7E5E0] bg-white px-2.5 py-2 xl:px-3 text-xs font-semibold text-[#0F172A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FAF8F5] hover:border-[#CBD5E1]"
            >
              <LogIn className="h-3.5 w-3.5 text-[#2D6A4F]" aria-hidden="true" />
              <span className="hidden xl:inline whitespace-nowrap">Student Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E5E0] bg-white text-[#0F172A] shadow-sm transition hover:bg-[#FAF8F5] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-[#E7E5E0] bg-white lg:hidden overflow-hidden"
          >
            <div className="max-h-[calc(100vh-74px)] overflow-y-auto px-4 py-5">
              <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
                {/* Home */}
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    location.pathname === '/' ? 'bg-[#FAF8F5] text-[#0F172A]' : 'text-[#475569] hover:bg-[#FAF8F5]'
                  }`}
                >
                  Home
                </Link>

                {/* Study Pathways (Accordion) */}
                <div className="rounded-xl border border-[#E7E5E0] bg-[#FAF8F5]/60 overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded((prev) => (prev === 'pathways' ? null : 'pathways'))
                    }
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#0F172A]"
                    aria-expanded={mobileExpanded === 'pathways'}
                    aria-label="Toggle Study Pathways section"
                  >
                    <span>Study Pathways</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#64748B] transition-transform duration-200 ${
                        mobileExpanded === 'pathways' ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {mobileExpanded === 'pathways' && (
                    <div className="space-y-1 border-t border-[#E7E5E0] bg-white p-2">
                      {studyPathways.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#475569] transition-colors hover:bg-[#FAF8F5] hover:text-[#0F172A]"
                          >
                            <Icon className="h-4 w-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Services (Accordion) */}
                <div className="rounded-xl border border-[#E7E5E0] bg-[#FAF8F5]/60 overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded((prev) => (prev === 'services' ? null : 'services'))
                    }
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#0F172A]"
                    aria-expanded={mobileExpanded === 'services'}
                    aria-label="Toggle Services section"
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#64748B] transition-transform duration-200 ${
                        mobileExpanded === 'services' ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {mobileExpanded === 'services' && (
                    <div className="space-y-1 border-t border-[#E7E5E0] bg-white p-2">
                      {servicesList.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#475569] transition-colors hover:bg-[#FAF8F5] hover:text-[#0F172A]"
                          >
                            <Icon className="h-4 w-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Student Stories */}
                <Link
                  to="/success-stories"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    location.pathname.startsWith('/success-stories')
                      ? 'bg-[#FAF8F5] text-[#0F172A]'
                      : 'text-[#475569] hover:bg-[#FAF8F5]'
                  }`}
                >
                  Student Stories
                </Link>

                {/* Resources (Accordion) */}
                <div className="rounded-xl border border-[#E7E5E0] bg-[#FAF8F5]/60 overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded((prev) => (prev === 'resources' ? null : 'resources'))
                    }
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#0F172A]"
                    aria-expanded={mobileExpanded === 'resources'}
                    aria-label="Toggle Resources section"
                  >
                    <span>Resources</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#64748B] transition-transform duration-200 ${
                        mobileExpanded === 'resources' ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {mobileExpanded === 'resources' && (
                    <div className="space-y-1 border-t border-[#E7E5E0] bg-white p-2">
                      {resourcesList.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#475569] transition-colors hover:bg-[#FAF8F5] hover:text-[#0F172A]"
                          >
                            <Icon className="h-4 w-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* About */}
                <Link
                  to="/about"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isAboutActive ? 'bg-[#FAF8F5] text-[#0F172A]' : 'text-[#475569] hover:bg-[#FAF8F5]'
                  }`}
                >
                  About
                </Link>

                {/* Contact */}
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    location.pathname === '/contact'
                      ? 'bg-[#FAF8F5] text-[#0F172A]'
                      : 'text-[#475569] hover:bg-[#FAF8F5]'
                  }`}
                >
                  Contact
                </Link>

                {/* Mobile CTAs & Account Actions */}
                <div className="mt-4 pt-4 border-t border-[#E7E5E0] flex flex-col gap-2.5">
                  <Link
                    to="/#profile-evaluation"
                    onClick={handleProfileEvaluationClick}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E293B]"
                  >
                    Free Profile Evaluation
                  </Link>

                  <Link
                    to="/bookings"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:bg-[#FAF8F5]"
                  >
                    <Calendar className="h-4 w-4 text-[#2D6A4F]" aria-hidden="true" />
                    <span>Book Free Consultation</span>
                  </Link>

                  {user ? (
                    <div className="mt-2 space-y-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E7E5E0] bg-[#FAF8F5] px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition"
                      >
                        <LayoutDashboard className="h-4 w-4 text-[#2D6A4F]" aria-hidden="true" />
                        <span>My Dashboard ({studentName || 'Student'})</span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-5 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/15"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E7E5E0] bg-[#FAF8F5] px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F1ECE1]"
                    >
                      <LogIn className="h-4 w-4 text-[#2D6A4F]" aria-hidden="true" />
                      <span>Student Portal Login</span>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
