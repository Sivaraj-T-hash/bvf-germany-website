import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useSeo } from '@/lib/useSeo';

type Feature = { title: string; text: string };
type FaqItem = { q: string; a: string };
type LogoSection = { title: string; logos: string[]; ctaLabel?: string; ctaTo?: string };
type StoryBlock = { title: string; text: string; image: string; align?: 'left' | 'right' };

type ServiceDetailPageProps = {
  title: string;
  subtitle: string;
  heroImage: string;
  ctaLabel: string;
  ctaTo: string;
  introTitle: string;
  introText: string;
  introImage: string;
  features: Feature[];
  checklistTitle: string;
  checklist: string[];
  storyBlocks?: StoryBlock[];
  faqs?: FaqItem[];
  logoSection?: LogoSection;
  banner?: { title: string; subtitle: string; image: string; ctaLabel: string; ctaTo: string };
};

function ReadMore({ text, maxChars = 280 }: { text: string; maxChars?: number }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTrim = text.length > maxChars;
  const visible = expanded || !shouldTrim ? text : `${text.slice(0, maxChars).trim()}…`;
  return (
    <div>
      <p className="text-sm text-muted-foreground leading-relaxed">{visible}</p>
      {shouldTrim && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          {expanded ? 'Read Less' : 'Read More'}
          <span className="text-base">{expanded ? '▴' : '▾'}</span>
        </button>
      )}
    </div>
  );
}

export default function ServiceDetailPage({
  title,
  subtitle,
  heroImage,
  ctaLabel,
  ctaTo,
  introTitle,
  introText,
  introImage,
  features,
  checklistTitle,
  checklist,
  storyBlocks,
  faqs,
  logoSection,
  banner,
}: ServiceDetailPageProps) {
  useSeo({
    title: `${title} | BVF Germany`,
    description: subtitle,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-28 pb-16 bg-[linear-gradient(135deg,#faf7f2_0%,#f5f0ea_55%,#f7f2ea_100%)]">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-4">Services</p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{title}</h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl">{subtitle}</p>
            <div className="mt-6">
              <Link
                to={ctaTo}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-95 transition"
              >
                {ctaLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-36 w-36 rounded-[45%_55%_65%_35%] bg-[#f2c94c]/35 blur-[1px]" />
            <div className="absolute -right-8 -bottom-8 h-52 w-52 rounded-[55%_45%_40%_60%] bg-[#f2c94c]/25 blur-[1px]" />
            <img
              src={heroImage}
              alt=""
              className="relative w-full h-[300px] object-cover rounded-[28px] border border-border shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src={introImage}
              alt=""
              className="w-full h-[280px] object-cover rounded-2xl border border-border shadow-md"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-secondary">{introTitle}</h2>
            <div className="mt-4">
              <ReadMore text={introText} maxChars={320} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container-narrow px-4 md:px-8">
          <h3 className="text-2xl font-bold text-secondary mb-6">What We Provide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-foreground">{feature.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-bold text-secondary">{checklistTitle}</h3>
            <div className="mt-4 space-y-2">
              {checklist.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
              We keep you updated at every step so you feel confident and prepared. Our team stays connected until you
              settle in Germany.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Request a call back <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {storyBlocks && storyBlocks.length > 0 && (
        <section className="py-10">
          <div className="container-narrow px-4 md:px-8 space-y-12">
            {storyBlocks.map((block, index) => (
              <div
                key={block.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  block.align === 'right' || index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={block.align === 'right' || index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <h3 className="text-2xl font-bold text-secondary">{block.title}</h3>
                  <div className="mt-4">
                    <ReadMore text={block.text} maxChars={320} />
                  </div>
                </div>
                <div className={block.align === 'right' || index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <img
                    src={block.image}
                    alt=""
                    className="w-full h-[280px] object-cover rounded-2xl border border-border shadow-md"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {logoSection && (
        <section className="py-12 bg-muted/30">
          <div className="container-narrow px-4 md:px-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">Study in Germany</p>
            <h3 className="text-2xl md:text-3xl font-bold text-secondary">{logoSection.title}</h3>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              {logoSection.logos.map((logo) => (
                <div key={logo} className="bg-card border border-border rounded-xl p-4 flex items-center justify-center">
                  <img src={logo} alt="" className="h-10 object-contain" loading="lazy" />
                </div>
              ))}
            </div>
            {logoSection.ctaLabel && logoSection.ctaTo && (
              <Link
                to={logoSection.ctaTo}
                className="mt-8 inline-flex items-center justify-center bg-secondary text-secondary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold"
              >
                {logoSection.ctaLabel}
              </Link>
            )}
          </div>
        </section>
      )}

      {banner && (
        <section className="py-12">
          <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-[linear-gradient(120deg,#fff8e1,#fff1b8)] rounded-3xl p-8">
            <div>
              <img
                src={banner.image}
                alt=""
                className="w-full h-[220px] object-cover rounded-2xl border border-border shadow-md"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground">{banner.title}</h3>
              <p className="mt-3 text-muted-foreground">{banner.subtitle}</p>
              <Link
                to={banner.ctaTo}
                className="mt-5 inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold"
              >
                {banner.ctaLabel}
              </Link>
            </div>
          </div>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section className="py-12">
          <div className="container-narrow px-4 md:px-8">
            <h3 className="text-2xl font-bold text-secondary mb-6">FAQ</h3>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-5">
                  <p className="text-sm font-semibold text-foreground">{faq.q}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
