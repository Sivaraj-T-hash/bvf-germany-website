import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import { legalContent, type LegalSection } from '@/content/legal';
import { useSeo } from '@/lib/useSeo';

type LegalPageProps = { kind: 'terms' | 'refund' };

const titles = {
  terms: 'Terms of Service',
  refund: 'Refund & Cancellation Policy',
};

/** Renders BVF-approved legal text from src/content/legal.ts. Shows the 404 page until the text is supplied. */
export default function LegalPage({ kind }: LegalPageProps) {
  const sections: LegalSection[] = kind === 'terms' ? legalContent.terms : legalContent.refundPolicy;
  const title = titles[kind];
  useSeo({ title: `${title} | BVF Germany`, description: `${title} for BVF Germany services.`, noindex: sections.length === 0 });

  if (sections.length === 0) return <NotFound />;

  return (
    <div className="site-shell">
      <Navbar />
      <main className="px-4 pb-20 pt-28 md:px-8">
        <article className="container-narrow max-w-3xl space-y-8 text-sm leading-7 text-muted-foreground md:text-base">
          <header>
            <p className="section-kicker">Legal</p>
            <h1 className="mt-3 text-4xl font-extrabold text-foreground">{title}</h1>
            {legalContent.lastUpdated ? <p className="mt-3">Last updated: {legalContent.lastUpdated}</p> : null}
          </header>
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-foreground">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-2">{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
}
