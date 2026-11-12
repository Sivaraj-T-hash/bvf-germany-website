import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, LogIn, Menu, X, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { getStudentProfile } from '@/lib/studentStore';
import BrandLogoMark from '@/components/BrandLogoMark';

const dropdowns = [
  {
    label: 'Study in Germany',
    to: '/study-in-germany',
    matchPrefixes: ['/study-in-germany', '/about-germany'],
    items: [
      { label: "Bachelor's", to: '/study-in-germany/bachelor' },
      { label: "Master's (MS)", to: '/study-in-germany/ms' },
      { label: "Master's Engineering", to: '/study-in-germany/engineering' },
      { label: "Master's Business", to: '/study-in-germany/mba' },
      { label: 'Ausbildung', to: '/study-in-germany/ausbildung' },
      { label: 'dMAT Exam (Master’s applicants)', to: '/dmat' },
    ],
  },
  {
    label: 'Services',
    to: '/services',
    matchPrefixes: ['/services', '/german-language', '/dmat'],
    panelClassName: 'w-80',
    items: [
      { label: 'University Shortlisting', to: '/services/university-shortlist' },
      { label: 'SOP & LOR Writing', to: '/services/sop-lor-writing' },
      { label: 'CV Writing', to: '/services/cv-writing' },
      { label: 'APS Support', to: '/services/aps-application' },
      { label: 'IELTS Prep (add-on)', to: '/services/ielts-preparation' },
      { label: 'GRE Prep (add-on)', to: '/services/gre-preparation' },
      { label: 'GMAT Prep (add-on)', to: '/services/gmat-preparation' },
      { label: 'German Classes (add-on)', to: '/german-language' },
      { label: 'University Application', to: '/services/university-application' },
      { label: 'Study Loan', to: '/services/study-loan' },
      { label: 'Blocked Account', to: '/services/blocked-account' },
      { label: 'Health Insurance', to: '/services/health-insurance' },
      { label: 'Visa Guidance', to: '/services/visa-guidance' },
      { label: 'Accommodation (add-on)', to: '/services/accommodation-help' },
      { label: 'On Arrival', to: '/services/on-arrival-support' },
      { label: 'dMAT Exam Guidance', to: '/dmat' },
    ],
  },
];

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Success Stories', to: '/success-stories' },
  { label: 'Tools', to: '/tools' },
  { label: 'Resources', to: '/resources' },
  { label: 'Webinars', to: '/webinars' },
  { label: 'Blog', to: '/blog' },
];

const linkClass = (active: boolean) =>
  `rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${active ? 'bg-foreground text-white' : 'text-muted-foreground hover:text-foreground'
  }`;

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentPhoto, setStudentPhoto] = useState('');
  const location = useLocation();
  const navRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    setOpen(false);
    setMobileOpenSection(null);
    setOpenDropdown(null);
    setAccountOpen(false);
  }, [location.pathname]);

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
  };

  const isDropdownActive = (dropdown: (typeof dropdowns)[number]) =>
    dropdown.matchPrefixes.some((prefix) => location.pathname.startsWith(prefix));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5">
      <div
        ref={navRef}
        className="container-narrow glass-panel flex min-h-[68px] items-center justify-between gap-3 border-[#e6ddcf] bg-white/90 px-4 py-2.5 md:px-5"
      >
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2.5 md:gap-3">
          <BrandLogoMark wrapperClassName="h-14 w-14 md:h-16 md:w-16" />
          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold uppercase tracking-[0.16em] text-foreground md:text-lg">
              BVF Germany
            </p>
            <p className="truncate text-[9px] font-medium text-muted-foreground md:text-[11px]">
              Public University Experts for Indian Students
            </p>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden min-w-0 flex-1 items-center justify-end gap-4 xl:flex">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
            <Link to="/" className={`${linkClass(location.pathname === '/')} font-home-body text-[12px] font-bold normal-case tracking-normal`}>
              Home
            </Link>
            {dropdowns.map((dropdown) => (
              <div key={dropdown.label} className="relative flex items-center">
                <div className={`${linkClass(isDropdownActive(dropdown))} font-home-body inline-flex items-center gap-0.5 text-[12px] font-bold normal-case tracking-normal`}>
                  <Link to={dropdown.to} onClick={() => setOpenDropdown(null)} className="px-0.5">
                    {dropdown.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={openDropdown === dropdown.label}
                    aria-haspopup="menu"
                    aria-label={`Toggle ${dropdown.label} menu`}
                    onClick={() => setOpenDropdown((prev) => (prev === dropdown.label ? null : dropdown.label))}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-black/5"
                  >
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 transition-transform ${openDropdown === dropdown.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
                <div
                  className={`absolute left-0 top-full mt-3 ${dropdown.panelClassName ?? 'w-72'} max-h-[70vh] overflow-y-auto rounded-[24px] border border-white/70 bg-white/90 p-2 shadow-card backdrop-blur transition ${openDropdown === dropdown.label ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                  role="menu"
                >
                  {dropdown.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpenDropdown(null)}
                      className="block rounded-2xl px-4 py-3 text-sm font-home-body text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`${linkClass(location.pathname === link.to)} font-home-body text-[12px] font-bold normal-case tracking-normal`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            to="/bookings"
            aria-label="Book Free Consultation"
            title="Book Free Consultation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-white text-xs font-bold uppercase tracking-[0.06em] text-foreground shadow-sm transition hover:-translate-y-0.5"
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
              <div
                className={`absolute right-0 top-full mt-3 w-56 rounded-[24px] border border-white/70 bg-white/95 p-2 shadow-card backdrop-blur transition ${accountOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                role="menu"
              >
                <div className="rounded-2xl bg-muted/70 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Student</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{studentName || user.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setAccountOpen(false)}
                  className="mt-2 block rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                  role="menuitem"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:bg-muted"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Student login"
              title="Student login"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white text-foreground shadow-sm transition hover:-translate-y-0.5"
            >
              <LogIn className="h-4.5 w-4.5" aria-hidden="true" />
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/75 bg-white/80 text-foreground shadow-sm xl:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="container-narrow mt-3 xl:hidden"
          >
            <div className="glass-panel overflow-hidden px-4 py-4">
              <nav aria-label="Mobile" className="flex max-h-[75vh] flex-col gap-2 overflow-y-auto">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${location.pathname === '/' ? 'bg-foreground text-white' : 'text-foreground hover:bg-muted'}`}
                >
                  Home
                </Link>
                {dropdowns.map((dropdown) => {
                  const isOpen = mobileOpenSection === dropdown.label;
                  return (
                    <div key={dropdown.label} className="rounded-[24px] border border-border/70 bg-white/65">
                      <button
                        type="button"
                        onClick={() => setMobileOpenSection(isOpen ? null : dropdown.label)}
                        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-foreground"
                        aria-expanded={isOpen}
                        aria-label={`Toggle ${dropdown.label} section`}
                      >
                        <span>{dropdown.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      {isOpen ? (
                        <div className="space-y-1 border-t border-border/70 px-2 py-2">
                          <Link
                            to={dropdown.to}
                            onClick={() => setOpen(false)}
                            className="block rounded-2xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                          >
                            {dropdown.label}
                          </Link>
                          {dropdown.items.map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setOpen(false)}
                              className="block rounded-2xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold ${location.pathname === link.to ? 'bg-foreground text-white' : 'text-foreground hover:bg-muted'}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 grid gap-2">
                  <Link to="/bookings" onClick={() => setOpen(false)} className="button-primary w-full text-center flex items-center justify-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Book Free Consultation Now
                  </Link>
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setOpen(false)} className="button-secondary w-full">
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          await handleLogout();
                          setOpen(false);
                        }}
                        className="button-secondary w-full"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setOpen(false)} className="button-secondary w-full">
                      Student Login
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
