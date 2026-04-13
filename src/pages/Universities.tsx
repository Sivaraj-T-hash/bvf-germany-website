import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useSeo } from '@/lib/useSeo';
import { getUniversities, type UniversityItem } from '@/lib/siteContentStore';

export default function UniversitiesPage() {
  useSeo({
    title: 'Universities | BVF Germany',
    description: 'Explore public university options in Germany for Indian students.',
    url: 'https://bvf-student-support.web.app/universities',
    image: '/hero-og.png',
  });

  const [universities, setUniversities] = useState<UniversityItem[]>([]);

  useEffect(() => {
    void (async () => {
      const items = await getUniversities();
      setUniversities(items.filter((item) => item.published));
    })();
  }, []);

  return (
    <div className="site-shell">
      <Navbar />

      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <p className="eyebrow-chip">Universities</p>
            <h1 className="hero-display mt-7 max-w-4xl">Public university examples students ask BVF about most.</h1>
            <p className="hero-copy">
              Use this preview as a starting point. The right university shortlist still depends on your profile, course fit,
              budget, and application strategy.
            </p>
          </div>
        </section>

        <section className="px-4 pb-20 md:px-8 md:pb-24">
          <div className="container-narrow grid gap-6 lg:grid-cols-3">
            {universities.map((university) => (
              <article
                key={university.id}
                className="overflow-hidden rounded-[30px] border border-border/80 bg-white/86 shadow-card"
              >
                <img src={university.image} alt={university.name} className="h-56 w-full object-cover" loading="lazy" />
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">{university.category}</p>
                  <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">{university.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{university.location}</p>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{university.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {university.programs.map((program) => (
                      <span key={program} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                        {program}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{university.tuition}</p>
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-secondary"
                    >
                      Visit Site <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
