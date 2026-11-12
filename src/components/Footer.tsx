import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Youtube, Mail, MapPin, Phone, ArrowUpRight, Linkedin } from 'lucide-react';
import { FaWhatsapp, FaFacebookF, FaTiktok } from 'react-icons/fa';
import BrandLogoMark from '@/components/BrandLogoMark';
import { getSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { buildWhatsappHref } from '@/lib/whatsapp';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Study in Germany', to: '/study-in-germany' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Tools', to: '/tools' },
  { label: 'Resources', to: '/resources' },
  { label: 'Webinars', to: '/webinars' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const serviceLinks = [
  { label: 'University Shortlisting', to: '/services/university-shortlist' },
  { label: 'APS Support', to: '/services/aps-application' },
  { label: 'IELTS Preparation', to: '/services/ielts-preparation' },
  { label: 'GRE Preparation', to: '/services/gre-preparation' },
  { label: 'German Language', to: '/services/germany-language' },
  { label: 'Study Loan', to: '/services/study-loan' },
  { label: 'Blocked Account', to: '/services/blocked-account' },
  { label: 'Health Insurance', to: '/services/health-insurance' },
  { label: 'University App Support', to: '/services/university-application' },
  { label: 'Visa Guidance', to: '/services/visa-guidance' },
  { label: 'On Arrival Support', to: '/services/on-arrival-support' },
  { label: 'Accommodation Help', to: '/services/accommodation-help' },
  { label: 'SOP & LOR Writing', to: '/services/sop-lor-writing' },
  { label: 'CV Writing', to: '/services/cv-writing' },
];

export default function Footer() {
  const location = useLocation();
  const isHomePage =
    location.pathname === '/' ||
    location.pathname.startsWith('/about-germany') ||
    location.pathname.startsWith('/study-in-germany');
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

  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/bratlins_view?igsh=OHBzemJpZWhkYnVu&utm_source=qr';
  const youtubeUrl = settings?.youtubeUrl || 'https://youtube.com/@bvfgermany';
  const linkedinUrl = settings?.linkedinUrl || 'https://www.linkedin.com/company/bvfgermany';
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com/bvfgermany';
  const tiktokUrl = settings?.tiktokUrl || 'https://tiktok.com/@bvfgermany';

  return (
    <footer className={`relative overflow-hidden bg-foreground text-background ${isHomePage ? 'font-home-body' : ''}`}>
      <div className="absolute left-[-120px] top-[-80px] h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute right-[-120px] bottom-[-120px] h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

      <div className="container-narrow relative px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-4 rounded-[22px] bg-white/95 p-4 shadow-sm">
              <BrandLogoMark wrapperClassName="h-14 w-14 rounded-[16px]" />
              <div className="min-w-0 flex flex-col justify-center">
                <p className="text-xl font-extrabold uppercase tracking-[0.18em] text-foreground md:text-2xl leading-none">
                  BVF Germany
                </p>
                <p className="mt-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest md:text-[11px]">
                  Public University Experts
                </p>
              </div>
            </div>
            <h2 className={`mt-6 text-2xl font-bold tracking-tight text-white md:text-3xl ${isHomePage ? 'font-home-heading font-extrabold leading-tight' : 'font-heading'}`}>
              Study in Germany with a clearer plan.
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-white/68">
              Tuition-free public university guidance, document support, visa clarity, and student-first help from India to Germany.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/bookings"
                className={`inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 ${isHomePage ? 'font-home-body font-bold' : ''}`}
              >
                Book Free Consultation Now <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>

            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-[0.24em] text-white/45 ${isHomePage ? 'font-home-accent font-normal' : ''}`}>Navigate</h3>
            <div className="mt-5 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-white/68 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-[0.24em] text-white/45 ${isHomePage ? 'font-home-accent font-normal' : ''}`}>Core Services</h3>
            <div className="mt-5 flex flex-col gap-3">
              {serviceLinks.map((service) => (
                <Link key={service.to} to={service.to} className="text-sm text-white/68 transition hover:text-white">
                  {service.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-[0.24em] text-white/45 ${isHomePage ? 'font-home-accent font-normal' : ''}`}>Contact</h3>
            <div className="mt-5 space-y-4">
              <a
                href={`mailto:${settings?.contactEmail || 'hello@bvfgermany.com'}`}
                className="flex items-start gap-3 text-white/72 transition hover:text-white"
              >
                <Mail className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm">{settings?.contactEmail || 'hello@bvfgermany.com'}</span>
              </a>
              <a
                href={`tel:${(settings?.contactPhone || '+91 99999 99999').replace(/\s+/g, '')}`}
                className="flex items-start gap-3 text-white/72 transition hover:text-white"
              >
                <Phone className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm">{settings?.contactPhone || '+91 99999 99999'}</span>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 text-white/72 transition hover:text-white"
              >
                <FaWhatsapp className="mt-1 h-4 w-4 text-[#25D366]" aria-hidden="true" />
                <span className="text-sm">Instant WhatsApp support</span>
              </a>
              <div className="flex items-start gap-3 text-white/72">
                <MapPin className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm">{settings?.address || 'India & Germany'}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit BVF Germany on Instagram"
                className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] border border-white/10 bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#E1306C]/50 hover:bg-white/[0.08] hover:shadow-[0_8px_20px_rgba(225,48,108,0.2)]"
              >
                <Instagram className="h-5 w-5 text-white/70 transition-colors duration-300 group-hover:text-[#E1306C] relative z-10" aria-hidden="true" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit BVF Germany on YouTube"
                className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] border border-white/10 bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#FF0000]/50 hover:bg-white/[0.08] hover:shadow-[0_8px_20px_rgba(255,0,0,0.2)]"
              >
                <Youtube className="h-5 w-5 text-white/70 transition-colors duration-300 group-hover:text-[#FF0000] relative z-10" aria-hidden="true" />
              </a>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit BVF Germany on TikTok"
                className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] border border-white/10 bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#000000]/50 hover:bg-white/[0.08] hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
              >
                <FaTiktok className="h-4 w-4 text-white/70 transition-colors duration-300 group-hover:text-white relative z-10" aria-hidden="true" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit BVF Germany on Facebook"
                className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] border border-white/10 bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#1877F2]/50 hover:bg-white/[0.08] hover:shadow-[0_8px_20px_rgba(24,119,242,0.2)]"
              >
                <FaFacebookF className="h-4 w-4 text-white/70 transition-colors duration-300 group-hover:text-[#1877F2] relative z-10" aria-hidden="true" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit BVF Germany on LinkedIn"
                className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] border border-white/10 bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#0A66C2]/50 hover:bg-white/[0.08] hover:shadow-[0_8px_20px_rgba(10,102,194,0.2)]"
              >
                <Linkedin className="h-5 w-5 text-white/70 transition-colors duration-300 group-hover:text-[#0A66C2] relative z-10" aria-hidden="true" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with BVF Germany on WhatsApp"
                className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] border border-white/10 bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#25D366]/50 hover:bg-white/[0.08] hover:shadow-[0_8px_20px_rgba(37,211,102,0.2)]"
              >
                <FaWhatsapp className="h-5 w-5 text-white/70 transition-colors duration-300 group-hover:text-[#25D366] relative z-10" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-5 text-sm text-white/58">Follow us @bvfgermany for daily tips on studying in Germany</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2025 BVF Germany</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="transition hover:text-white/70">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="transition hover:text-white/70">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
