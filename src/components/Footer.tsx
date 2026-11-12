import { Link, useLocation } from 'react-router-dom';
import { Instagram, Youtube, Mail, MapPin, Phone, ArrowUpRight, Clock3, MessageCircle } from 'lucide-react';
import BrandLogoMark from '@/components/BrandLogoMark';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { emailLink, externalUrl, phoneLink, whatsappLink } from '@/lib/contact';
import { businessInfo } from '@/config/business';
import { hasRefundPolicy, hasTerms } from '@/content/legal';
import { publishedStories } from '@/content/successStories';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Study in Germany', to: '/about-germany' },
  { label: 'Free Tools', to: '/tools' },
  { label: 'Resources', to: '/resources' },
  { label: 'Webinars', to: '/webinars' },
  { label: 'Blog', to: '/blog' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
  ...(publishedStories.length ? [{ label: 'Success Stories', to: '/success-stories' }] : []),
];

const serviceLinks = [
  { label: 'Profile Verification', to: '/services/profile-verification' },
  { label: 'University Shortlist', to: '/services/university-shortlist' },
  { label: 'APS Application', to: '/services/aps-application' },
  { label: 'dMAT Exam Guidance', to: '/dmat' },
  { label: 'German Language Classes', to: '/german-language' },
  { label: 'Visa Guidance', to: '/services/visa-guidance' },
  { label: 'Accommodation Help', to: '/services/accommodation-help' },
];

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname.startsWith('/about-germany');
  const settings = useSiteSettings();
  const mailHref = emailLink(settings.contactEmail);
  const telHref = phoneLink(settings.contactPhone);
  const waHref = whatsappLink(settings);
  const instagramUrl = externalUrl(settings.instagramUrl);
  const youtubeUrl = externalUrl(settings.youtubeUrl);
  const operatorName = businessInfo.legalName || 'BVF Germany';

  return (
    <footer className={`relative overflow-hidden bg-foreground text-background ${isHomePage ? 'font-home-body' : ''}`}>
      <div className="absolute left-[-120px] top-[-80px] h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute right-[-120px] bottom-[-120px] h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

      <div className="container-narrow relative px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-4 rounded-[22px] bg-white/95 p-4 shadow-sm">
              <BrandLogoMark wrapperClassName="h-16 w-16 rounded-[16px]" />
              <div className="min-w-0">
                <p className="text-xl font-extrabold uppercase tracking-[0.18em] text-foreground md:text-2xl">BVF Germany</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">Public University Experts for Indian Students</p>
              </div>
            </div>
            <h2 className={`mt-6 text-4xl font-semibold text-white md:text-5xl ${isHomePage ? 'font-home-heading font-extrabold leading-[0.96]' : 'font-heading'}`}>
              A clearer route from India to Germany.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/68">
              Public-university-first strategy, practical document guidance, and honest advice at every step.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/bookings"
                className={`inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 ${isHomePage ? 'font-home-body font-bold' : ''}`}
              >
                Book a Call <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/register"
                className={`inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 ${isHomePage ? 'font-home-body font-bold' : ''}`}
              >
                Create Student Account
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
              {waHref ? (
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-white/72 transition hover:text-white">
                  <MessageCircle className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm">WhatsApp</span>
                </a>
              ) : null}
              {mailHref ? (
                <a href={mailHref} className="flex items-start gap-3 text-white/72 transition hover:text-white">
                  <Mail className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="break-all text-sm">{settings.contactEmail}</span>
                </a>
              ) : null}
              {telHref ? (
                <a href={telHref} className="flex items-start gap-3 text-white/72 transition hover:text-white">
                  <Phone className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm">{settings.contactPhone}</span>
                </a>
              ) : null}
              {settings.address ? (
                <div className="flex items-start gap-3 text-white/72">
                  <MapPin className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm">{settings.address}</span>
                </div>
              ) : null}
              {settings.workingHours ? (
                <div className="flex items-start gap-3 text-white/72">
                  <Clock3 className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm">{settings.workingHours}</span>
                </div>
              ) : null}
              <Link to="/contact" className="flex items-start gap-3 text-white/72 transition hover:text-white">
                <ArrowUpRight className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm">Send us a message</span>
              </Link>
            </div>

            {instagramUrl || youtubeUrl ? (
              <div className="mt-6 flex gap-3">
                {instagramUrl ? (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit BVF Germany on Instagram"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                {youtubeUrl ? (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit BVF Germany on YouTube"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <Youtube className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {operatorName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link to="/privacy-policy" className="transition hover:text-white/70">
              Privacy Policy
            </Link>
            {hasTerms ? (
              <Link to="/terms" className="transition hover:text-white/70">
                Terms of Service
              </Link>
            ) : null}
            {hasRefundPolicy ? (
              <Link to="/refund-policy" className="transition hover:text-white/70">
                Refund &amp; Cancellation
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
