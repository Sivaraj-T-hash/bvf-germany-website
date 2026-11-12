import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BrandVisual from '@/components/BrandVisual';
import WhatsAppCta from '@/components/WhatsAppCta';
import { useSeo } from '@/lib/useSeo';

type Stat = { value: string; label: string };
/** `image` must be a genuine BVF photograph; leave it out to show the branded graphic. */
type StorySection = { title: string; text: string; image?: string; bullets?: string[] };

type AboutStoryPageProps = {
  title: string;
  subtitle: string;
  heroImage?: string;
  ctaLabel: string;
  ctaTo: string;
  /** Only verified figures. Hidden when empty. */
  stats?: Stat[];
  sections: StorySection[];
  /** Genuine photographs only. Hidden when empty. */
  gallery?: string[];
};

function ReadMore({ text, maxChars = 260 }: { text: string; maxChars?: number }) {
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

export default function AboutStoryPage({
  title,
  subtitle,
  heroImage,
  ctaLabel,
  ctaTo,
  stats = [],
  sections,
  gallery = [],
}: AboutStoryPageProps) {
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
            <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-4">About Us</p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{title}</h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl">{subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={ctaTo}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-95 transition"
              >
                {ctaLabel} <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Student‑first support
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-36 w-36 rounded-[45%_55%_65%_35%] bg-[#f2c94c]/35 blur-[1px]" />
            <div className="absolute -right-8 -bottom-8 h-52 w-52 rounded-[55%_45%_40%_60%] bg-[#f2c94c]/25 blur-[1px]" />
            {heroImage ? (
              <img
                src={heroImage}
                alt=""
                className="relative w-full h-[300px] object-cover rounded-[28px] border border-border shadow-lg"
                loading="lazy"
              />
            ) : (
              <BrandVisual title={title} kicker="About BVF Germany" className="relative h-[300px] w-full rounded-[28px] border border-border shadow-lg" />
            )}
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="py-12">
          <div className="container-narrow px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                <div className="text-2xl font-extrabold text-secondary">{stat.value}</div>
                <p className="mt-2 text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="py-10">
        <div className="container-narrow px-4 md:px-8 space-y-12">
          {sections.map((section, index) =>
            section.image ? (
              <div
                key={section.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <h2 className="text-2xl font-bold text-secondary">{section.title}</h2>
                  <div className="mt-4">
                    <ReadMore text={section.text} />
                  </div>
                  {section.bullets && (
                    <ul className="mt-4 space-y-2 text-sm text-foreground list-disc pl-5">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <img src={section.image} alt="" className="w-full h-[280px] object-cover rounded-2xl border border-border shadow-md" loading="lazy" />
                </div>
              </div>
            ) : (
              <div key={section.title} className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:grid-cols-[72px_1fr] md:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#132033] font-numeric text-xl text-[#facc15]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-secondary">{section.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{section.text}</p>
                  {section.bullets && (
                    <ul className="mt-4 grid gap-2 text-sm text-foreground sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="rounded-xl bg-muted/50 px-3 py-2">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container-narrow px-4 md:px-8">
            <h3 className="text-xl font-bold text-secondary mb-6">Moments & Highlights</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((src) => (
                <div key={src} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                  <img src={src} alt="" className="w-full h-28 object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-14">
        <div className="container-narrow px-4 md:px-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-[#132033] p-6 text-white md:flex-row md:items-center md:p-8">
            <p className="max-w-xl text-lg font-semibold">Have a question about your Germany plan? Talk to the BVF team.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/bookings" className="rounded-full bg-[#facc15] px-5 py-3 text-sm font-semibold text-[#132033]">Book a free consultation</Link>
              <WhatsAppCta message={`Hi BVF Germany, I read the "${title}" page and have a question.`} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
