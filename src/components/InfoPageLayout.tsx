import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSeo } from '@/lib/useSeo';

type InfoSection = {
  title: string;
  text: string;
  image: string;
  bullets?: string[];
};

type InfoPageLayoutProps = {
  title: string;
  subtitle: string;
  breadcrumb?: string;
  heroImage: string;
  cta?: { label: string; to: string };
  sections: InfoSection[];
};

export default function InfoPageLayout({
  title,
  subtitle,
  breadcrumb,
  heroImage,
  cta,
  sections,
}: InfoPageLayoutProps) {
  useSeo({
    title: `${title} | BVF Germany`,
    description: subtitle,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-28 pb-14">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            {breadcrumb && (
              <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-4">{breadcrumb}</p>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{title}</h1>
            <p className="mt-4 text-muted-foreground text-lg">{subtitle}</p>
            {cta && (
              <Link
                to={cta.to}
                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-cta text-primary-foreground hover:opacity-90 transition"
              >
                {cta.label}
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/15 via-transparent to-secondary/15 blur-2xl" />
            <img
              src={heroImage}
              alt=""
              className="relative w-full h-[280px] md:h-[360px] object-cover rounded-3xl border border-border shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-narrow px-4 md:px-8 space-y-12">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <p className="mt-3 text-muted-foreground">{section.text}</p>
                {section.bullets && (
                  <ul className="mt-4 space-y-3 text-sm text-foreground">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <img
                  src={section.image}
                  alt=""
                  className="w-full h-[240px] md:h-[300px] object-cover rounded-2xl border border-border shadow-md"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
