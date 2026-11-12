import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, ChevronRight, BookOpen, Briefcase, FlaskConical, Globe, Code2, Heart, PenTool, Scale, GraduationCap, Languages, FileCheck, Banknote, Home, UserCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import BrandVisual from '@/components/BrandVisual';
import { useSeo } from '@/lib/useSeo';
import { subscribeToResourceCatalog, type ResourcePackage } from '@/lib/resourceCatalogStore';
import { RESOURCE_DEPARTMENTS } from '@/lib/resourceCatalog';

const formatInr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const DEPT_ICONS: Record<string, React.ElementType> = {
  'Masters in Engineering': BookOpen,
  'Masters in Business & Management': Briefcase,
  'Natural Sciences': FlaskConical,
  'Humanities & Social Sciences': Globe,
  'IT & Computer Science': Code2,
  'Health & Medicine': Heart,
  'Architecture & Design': PenTool,
  'Law & Economics': Scale,
  'Studienkolleg': GraduationCap,
  'Language & Test Prep': Languages,
  'Visa & Documentation': FileCheck,
  'Scholarships & Finance': Banknote,
  'Accommodation & Arrival': Home,
  'Career & CV': UserCheck,
};


export default function ResourcesPage() {
  useSeo({
    title: 'Resources | BVF Germany',
    description: 'Explore curated Germany study-abroad bundles by department — Engineering, Business, Natural Sciences, Visa Guidance, and more.',
  });

  const navigate = useNavigate();
  const [resources, setResources] = useState<ResourcePackage[]>([]);
  const [activeDept, setActiveDept] = useState<string>('All');

  useEffect(() => {
    const stop = subscribeToResourceCatalog((items) => {
      setResources(items.filter((item) => item.published));
    });
    return () => stop();
  }, []);

  const sortedResources = useMemo(
    () => [...resources].sort((a, b) => a.sortOrder - b.sortOrder || b.updatedAt.localeCompare(a.updatedAt)),
    [resources],
  );

  const filteredResources = useMemo(
    () => activeDept === 'All' ? sortedResources : sortedResources.filter((r) => r.department === activeDept),
    [sortedResources, activeDept],
  );

  const startCheckout = (resourceId: string) => {
    navigate(`/checkout?itemType=plan&plan=${resourceId}&source=resources&autostart=1`);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-slate-900">
      <Navbar />
      <main className="pt-28">

        {/* ─── Department Categories Panel ─────────────────────────────────── */}
        <section className="px-4 md:px-8 pb-6">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[28px] border border-[#ddd2c1] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b67a2b] mb-1">Browse by Department</p>
              <h1 className="text-2xl font-bold text-[#15202b] mb-6">Find resources for your study program</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-3">
                {RESOURCE_DEPARTMENTS.map((dept) => {
                  const Icon = DEPT_ICONS[dept] || BookOpen;
                  const count = sortedResources.filter((r) => r.department === dept).length;
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setActiveDept(dept === activeDept ? 'All' : dept)}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[#f5f0e8] ${activeDept === dept ? 'bg-[#fef3dc] ring-1 ring-[#e8a53e]' : ''}`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${activeDept === dept ? 'bg-[#e8a53e]/20 text-[#b67a2b]' : 'bg-slate-100 text-slate-500 group-hover:bg-[#e8a53e]/15 group-hover:text-[#b67a2b]'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{dept}</p>
                        {count > 0 && <p className="text-[11px] text-slate-400">{count} resource{count !== 1 ? 's' : ''}</p>}
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 text-slate-300 transition ${activeDept === dept ? 'text-[#b67a2b]' : 'group-hover:text-slate-500'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Filter Bar + Resources Grid ─────────────────────────────────── */}
        <section className="px-4 md:px-8 pb-14">
          <div className="mx-auto max-w-7xl rounded-[34px] border border-[#ddd2c1] bg-white p-6 shadow-[0_16px_50px_rgba(58,46,26,0.06)] md:p-8">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <button
                type="button"
                onClick={() => setActiveDept('All')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${activeDept === 'All' ? 'bg-[#123f3a] text-white' : 'border border-[#ddd2c1] text-slate-600 hover:bg-[#f5f0e8]'}`}
              >
                All Resources
              </button>
              {RESOURCE_DEPARTMENTS.filter((d) => sortedResources.some((r) => r.department === d)).map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setActiveDept(dept)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${activeDept === dept ? 'bg-[#123f3a] text-white' : 'border border-[#ddd2c1] text-slate-600 hover:bg-[#f5f0e8]'}`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b67a2b]">
                  {activeDept === 'All' ? 'All Resources' : activeDept}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-[#15202b]">
                  {filteredResources.length} package{filteredResources.length !== 1 ? 's' : ''} available
                </h2>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.length ? (
                filteredResources.map((item) => (
                  <article key={item.id} className="group overflow-hidden rounded-[28px] border border-[#e7dac8] bg-[#fbf8f3] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(40,31,19,0.08)]">
                    <div className="relative">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                      ) : (
                        <BrandVisual title={item.title} kicker={item.shortLabel} icon={ShoppingBag} className="h-48 w-full" />
                      )}
                      {item.badge && (
                        <span className="absolute right-3 top-3 rounded-full bg-[#123f3a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          {item.badge}
                        </span>
                      )}
                      {item.department && (
                        <span className="absolute left-3 top-3 rounded-full border border-[#e8c87a]/40 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#b67a2b] backdrop-blur-sm">
                          {item.department}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      {item.viewed || item.rating ? (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#7a756d]">
                          {item.viewed ? <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#8f621c]">{item.viewed}</span> : null}
                          {item.rating ? <span>{item.rating}</span> : null}
                        </div>
                      ) : null}
                      <h3 className="mt-3 text-lg font-semibold leading-tight text-[#15202b]">{item.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5b5853]">{item.description}</p>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div>
                          {item.originalPriceValue > item.priceValue && (
                            <p className="text-xs text-stone-400 line-through">{formatInr(item.originalPriceValue)}</p>
                          )}
                          <p className="text-lg font-bold text-[#123f3a]">{formatInr(item.priceValue)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => startCheckout(item.id)}
                          className="flex items-center gap-1.5 rounded-full bg-[#123f3a] px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#0f3632]"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> Buy Now
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d8c9b6] bg-[#fbf8f3] p-8 text-sm text-[#5f5a52] sm:col-span-2 lg:col-span-3 text-center">
                  {activeDept === 'All'
                    ? 'No resources are published yet.'
                    : `No resources in "${activeDept}" yet. Check back soon!`}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── Reviews Section ──────────────────────────────────────────────── */}

      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
