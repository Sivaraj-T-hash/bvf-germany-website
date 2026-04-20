import { Link, useLocation } from 'react-router-dom';
import { Instagram, Youtube, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import BrandLogoMark from '@/components/BrandLogoMark';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'About Germany', to: '/about-germany' },
  { label: 'Tools', to: '/tools' },
  { label: 'Resources', to: '/resources' },
  { label: 'Webinars', to: '/webinars' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const serviceLinks = [
  'Profile Verification',
  'University Verification',
  'Application Support',
  'SOP & LOR Writing',
  'Visa Guidance',
  'Accommodation Help',
];

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname.startsWith('/about-germany');

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
                <p className="text-xl font-extrabold uppercase tracking-[0.18em] text-foreground md:text-2xl">
                  BVF Germany
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">
                  Public University Experts for Indian Students
                </p>
              </div>
            </div>
            <h2 className={`mt-6 text-4xl font-semibold text-white md:text-5xl ${isHomePage ? 'font-home-heading font-extrabold leading-[0.96]' : 'font-heading'}`}>
              A clearer route from India to Germany.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/68">
              Public-university-first strategy, practical document guidance, and a student experience that feels calm,
              polished, and trustworthy at every step.
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
                <Link key={service} to="/services" className="text-sm text-white/68 transition hover:text-white">
                  {service}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-[0.24em] text-white/45 ${isHomePage ? 'font-home-accent font-normal' : ''}`}>Contact</h3>
            <div className="mt-5 space-y-4">
              <a
                href="mailto:hello@bvfgermany.com"
                className="flex items-start gap-3 text-white/72 transition hover:text-white"
              >
                <Mail className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm">hello@bvfgermany.com</span>
              </a>
              <a
                href="tel:+919999999999"
                className="flex items-start gap-3 text-white/72 transition hover:text-white"
              >
                <Phone className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm">+91 99999 99999</span>
              </a>
              <div className="flex items-start gap-3 text-white/72">
                <MapPin className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm">Serving students across India & Germany</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit BVF Germany on Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit BVF Germany on YouTube"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Youtube className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="mailto:hello@bvfgermany.com"
                aria-label="Email BVF Germany"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>Â© 2026 BVF Germany. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-white/70">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-white/70">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
