import { Link, useLocation } from 'react-router-dom';
import { Instagram, Youtube, Mail, MapPin, Phone, ArrowUpRight, Linkedin, Clock, ShieldCheck } from 'lucide-react';
import { FaWhatsapp, FaFacebookF, FaTiktok } from 'react-icons/fa';
import BrandLogoMark from '@/components/BrandLogoMark';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { buildWhatsappHref } from '@/lib/whatsapp';
import { emailLink, externalUrl, phoneLink } from '@/lib/contact';
import { businessInfo } from '@/config/business';
import { allJourneyServices } from '@/content/offer';
import { hasRefundPolicy } from '@/content/legal';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Study in Germany', to: '/study-in-germany' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'German Classes', to: '/german-language' },
  { label: 'dMAT Exam Guide', to: '/dmat' },
  { label: 'Success Stories', to: '/success-stories' },
  { label: 'About', to: '/about' },
  { label: 'Tools', to: '/tools' },
  { label: 'Resources', to: '/resources' },
  { label: 'Webinars', to: '/webinars' },
  { label: 'Blog', to: '/blog' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
];

const socialClass =
  'group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] border border-white/15 bg-white/[0.06] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12] hover:border-white/30';

export default function Footer() {
  const location = useLocation();
  const isHomePage =
    location.pathname === '/' ||
    location.pathname.startsWith('/about-germany') ||
    location.pathname.startsWith('/study-in-germany');
  const settings = useSiteSettings();

  const whatsappHref = buildWhatsappHref(settings);
  const email = settings.contactEmail;
  const mailHref = emailLink(email);
  const phone = settings.contactPhone;
  const telHref = phoneLink(phone);
  const socials = [
    { label: 'Instagram', href: externalUrl(settings.instagramUrl), icon: <Instagram className="relative z-10 h-5 w-5 text-white/80 group-hover:text-[#E1306C]" aria-hidden="true" /> },
    { label: 'YouTube', href: externalUrl(settings.youtubeUrl), icon: <Youtube className="relative z-10 h-5 w-5 text-white/80 group-hover:text-[#FF0000]" aria-hidden="true" /> },
    { label: 'TikTok', href: externalUrl(settings.tiktokUrl), icon: <FaTiktok className="relative z-10 h-4 w-4 text-white/80 group-hover:text-white" aria-hidden="true" /> },
    { label: 'Facebook', href: externalUrl(settings.facebookUrl), icon: <FaFacebookF className="relative z-10 h-4 w-4 text-white/80 group-hover:text-[#1877F2]" aria-hidden="true" /> },
    { label: 'LinkedIn', href: externalUrl(settings.linkedinUrl), icon: <Linkedin className="relative z-10 h-5 w-5 text-white/80 group-hover:text-[#0A66C2]" aria-hidden="true" /> },
  ].filter((social) => social.href);
  const year = new Date().getFullYear();
  const operator = businessInfo.legalName || 'BVF Germany';

  return (
    <footer className={`relative overflow-hidden bg-[#0F172A] text-white ${isHomePage ? 'font-home-body' : ''}`}>
      <div className="absolute left-[-120px] top-[-80px] h-64 w-64 rounded-full bg-[#2D6A4F]/20 blur-3xl" />
      <div className="absolute right-[-120px] bottom-[-120px] h-72 w-72 rounded-full bg-[#132033]/40 blur-3xl" />

      <div className="container-narrow relative px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
          {/* Brand Column */}
          <div className="max-w-md">
            <div className="flex items-center gap-4 rounded-[22px] bg-white p-4 shadow-sm">
              <BrandLogoMark wrapperClassName="h-14 w-14 rounded-[16px]" />
              <div className="flex min-w-0 flex-col justify-center">
                <p className="text-xl font-extrabold uppercase leading-none tracking-[0.18em] text-[#0F172A] md:text-2xl">BVF Germany</p>
                <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-[#2D6A4F] md:text-[11px]">Public University Experts</p>
              </div>
            </div>
            <h2 className={`mt-6 text-2xl font-bold tracking-tight text-white md:text-3xl ${isHomePage ? 'font-home-heading font-extrabold leading-tight' : 'font-heading'}`}>
              Your bridge to higher education in Germany.
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-white/80">
              {businessInfo.positioning}. Free first consultation, one transparent package price, and a dedicated team guiding you from India to Germany.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/bookings"
                className={`inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FAF8F5] ${isHomePage ? 'font-home-body font-bold' : ''}`}
              >
                <span>Book Free Consultation</span>
                <ArrowUpRight className="h-4 w-4 text-[#2D6A4F]" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-[0.24em] text-white/60 ${isHomePage ? 'font-home-accent font-normal' : ''}`}>Navigate</h3>
            <div className="mt-5 flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-white/80 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-[0.24em] text-white/60 ${isHomePage ? 'font-home-accent font-normal' : ''}`}>14 Services</h3>
            <div className="mt-5 flex flex-col gap-2.5">
              {allJourneyServices.map((service) => (
                <Link key={service.path} to={service.path} className="text-sm text-white/80 transition hover:text-white">
                  {service.title}
                </Link>
              ))}
              <Link to="/services/gmat-preparation" className="text-sm text-white/80 transition hover:text-white">GMAT Preparation</Link>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-[0.24em] text-white/60 ${isHomePage ? 'font-home-accent font-normal' : ''}`}>Contact</h3>
            <div className="mt-5 space-y-3.5">
              {mailHref ? (
                <a href={mailHref} className="flex items-start gap-3 text-white/85 transition hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                  <span className="text-sm">{email}</span>
                </a>
              ) : null}
              {telHref ? (
                <a href={telHref} className="flex items-start gap-3 text-white/85 transition hover:text-white">
                  <Phone className="mt-0.5 h-4 w-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                  <span className="text-sm">{phone}</span>
                </a>
              ) : null}
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-white/85 transition hover:text-white">
                <FaWhatsapp className="mt-0.5 h-4 w-4 text-[#25D366] shrink-0" aria-hidden="true" />
                <span className="text-sm">WhatsApp us</span>
              </a>
              {settings.address ? (
                <div className="flex items-start gap-3 text-white/85">
                  <MapPin className="mt-0.5 h-4 w-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                  <span className="text-sm">{settings.address}</span>
                </div>
              ) : null}
              {settings.workingHours ? (
                <div className="flex items-start gap-3 text-white/85">
                  <Clock className="mt-0.5 h-4 w-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                  <span className="text-sm">{settings.workingHours}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {socials.map((social) => (
                <a key={social.label} href={social.href as string} target="_blank" rel="noopener noreferrer" aria-label={`Visit BVF Germany on ${social.label}`} className={socialClass}>
                  {social.icon}
                </a>
              ))}
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Chat with BVF Germany on WhatsApp" className={socialClass}>
                <FaWhatsapp className="relative z-10 h-5 w-5 text-white/80 group-hover:text-[#25D366]" aria-hidden="true" />
              </a>
            </div>
            {externalUrl(settings.instagramUrl) ? (
              <p className="mt-4 text-xs text-white/60">Follow us @bvfgermany for German admissions updates</p>
            ) : null}
          </div>
        </div>

        {/* Legal & Regulatory Bottom Row */}
        <div className="flex flex-col gap-4 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#2D6A4F]" aria-hidden="true" />
            <p>&copy; {year} {operator}. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link to="/privacy-policy" className="transition hover:text-white">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="transition hover:text-white">Terms and Conditions</Link>
            {hasRefundPolicy ? (
              <Link to="/refund-policy" className="transition hover:text-white">Refund Policy</Link>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
