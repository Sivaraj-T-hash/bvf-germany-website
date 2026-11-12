import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ChevronRight, BookOpen, Briefcase, FlaskConical, Globe, Code2, Heart, PenTool, Scale, GraduationCap, Languages, FileCheck, Banknote, Home, UserCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
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

const REVIEWS = [
  { name: 'Anjali Mehta', avatar: 'AM', stars: 5, text: 'Thanks to BVF Germany\'s mentorship, I successfully secured admission to my dream university in Germany. Their SOP and LOR services were spot-on.', date: 'March 2025' },
  { name: 'Rohan Desai', avatar: 'RD', stars: 5, text: 'The German language resource made learning so easy. The A1 to B1 program was well-structured and perfect for my needs!', date: 'February 2025' },
  { name: 'Pooja Sharma', avatar: 'PS', stars: 5, text: 'The university shortlisting resource saved me so much time. I couldn\'t have navigated the application process without it.', date: 'January 2025' },
  { name: 'Vikram Iyer', avatar: 'VI', stars: 5, text: 'From drafting my CV to visa application support, BVF Germany handled everything smoothly. Highly recommend their services!', date: 'December 2024' },
  { name: 'Kavya Reddy', avatar: 'KR', stars: 5, text: 'Enrolling in the mentorship program was the best decision. The team guided me through every step, and now I\'m heading to Germany for my master\'s.', date: 'November 2024' },
  { name: 'Aditi Nair', avatar: 'AN', stars: 5, text: 'BVF Germany made the complicated German application process simple and stress-free. Their SOP and LOR writing services are excellent!', date: 'October 2024' },
  { name: 'Harsh Gupta', avatar: 'HG', stars: 5, text: 'I used their Grade Calculator and ECTS tool — it was incredibly helpful in understanding my eligibility for German universities. BVF is a lifesaver!', date: 'September 2024' },
  { name: 'Meera Joshi', avatar: 'MJ', stars: 5, text: 'The mentorship program gave me the confidence and clarity I needed. From shortlisting universities to finalizing my visa, the process was seamless.', date: 'August 2024' },
];

const RATING_DISTRIBUTION = [
  { star: 5, count: 1100 },
  { star: 4, count: 700 },
  { star: 3, count: 102 },
  { star: 2, count: 32 },
  { star: 1, count: 39 },
];
const TOTAL_REVIEWS = RATING_DISTRIBUTION.reduce((sum, r) => sum + r.count, 0);
const AVERAGE_RATING = (
  RATING_DISTRIBUTION.reduce((sum, r) => sum + r.star * r.count, 0) / TOTAL_REVIEWS
).toFixed(1);

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
        />
      ))}
    </div>
  );
}

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
              <h2 className="text-2xl font-bold text-[#15202b] mb-6">Find resources for your study program</h2>
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
                      <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                      {item.badge && (
                        <span className="absolute right-3 top-3 rounded-full bg-[#123f3a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          {item.badge}
                        </span>
                      )}
                      {item.department && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-[#b67a2b] border border-[#e8c87a]/40">
                          {item.department}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#7a756d]">
                        <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#8f621c]">{item.viewed}</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {item.rating}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-[#15202b] leading-tight">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#5b5853] line-clamp-2">{item.description}</p>
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
        <section className="px-4 md:px-8 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[380px_1fr]">

              {/* ── Left: Rating Summary Panel ── */}
              <div className="flex flex-col gap-5">
                {/* Dark score card */}
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#123f3a] to-[#0a2e2a] p-7 text-white shadow-xl">
                  <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/5" />
                  <div className="absolute -bottom-12 -left-12 h-52 w-52 rounded-full bg-amber-400/10" />
                  <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300 mb-4">Student Reviews</p>
                  <div className="relative flex items-end gap-3 mb-3">
                    <span className="text-7xl font-extrabold leading-none">{AVERAGE_RATING}</span>
                    <div className="mb-2">
                      <span className="text-lg text-white/40">/ 5</span>
                      <div className="flex items-center gap-0.5 mt-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="relative text-sm text-white/55 mb-7">{TOTAL_REVIEWS.toLocaleString()}+ verified reviews</p>
                  {/* Rating bars */}
                  <div className="relative space-y-2.5">
                    {RATING_DISTRIBUTION.map((row) => (
                      <div key={row.star} className="flex items-center gap-3">
                        <span className="w-3 shrink-0 text-right text-xs font-semibold text-white/50">{row.star}</span>
                        <div className="flex-1 rounded-full bg-white/10 h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
                            style={{ width: `${(row.count / TOTAL_REVIEWS) * 100}%` }}
                          />
                        </div>
                        <span className="w-10 shrink-0 text-right text-xs text-white/35">{row.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stat chips */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '2K+', label: 'Students' },
                    { value: '98%', label: 'Satisfaction' },
                    { value: '5★', label: 'Avg. Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-[#ddd2c1] bg-white p-4 text-center shadow-sm">
                      <p className="text-xl font-extrabold text-[#123f3a]">{stat.value}</p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="rounded-[22px] border border-[#ddd2c1] bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Trusted by students from</p>
                  <div className="flex flex-wrap gap-2">
                    {['IIT', 'NIT', 'BITS', 'VIT', 'SRM', 'Amity', 'Christ', 'Manipal'].map((inst) => (
                      <span key={inst} className="rounded-full bg-[#f5f0e8] px-3 py-1.5 text-xs font-semibold text-[#123f3a] border border-[#e8d8c0]">{inst}</span>
                    ))}
                  </div>
                </div>

                {/* CTA card */}
                <div className="rounded-[22px] bg-gradient-to-br from-[#fef3dc] to-[#fde0a0] border border-[#e8c87a]/50 p-5 shadow-sm">
                  <p className="text-base font-bold text-[#7a4f0e] mb-1">Ready to get started?</p>
                  <p className="text-sm text-[#9a6520] mb-4 leading-relaxed">Book a free 1-on-1 consultation with our Germany experts today.</p>
                  <a
                    href="/bookings"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#123f3a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f3632] hover:-translate-y-0.5"
                  >
                    Book Free Consultation
                  </a>
                </div>
              </div>

              {/* ── Right: Reviews Grid ── */}
              <div className="rounded-[28px] border border-[#ddd2c1] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xl font-bold text-[#15202b]">What students say</p>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                    ★ {AVERAGE_RATING} / 5
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {REVIEWS.map((review, idx) => (
                    <div
                      key={review.name}
                      className={`relative overflow-hidden rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
                        idx % 3 === 0
                          ? 'border-amber-100 bg-gradient-to-br from-amber-50/80 to-orange-50/40'
                          : idx % 3 === 1
                          ? 'border-teal-100 bg-gradient-to-br from-teal-50/60 to-emerald-50/30'
                          : 'border-slate-100 bg-gradient-to-br from-slate-50/80 to-stone-50/40'
                      }`}
                    >
                      {/* Decorative quote */}
                      <div className="absolute right-3 top-2 text-5xl font-serif leading-none text-slate-100 select-none pointer-events-none">"</div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${
                          idx % 4 === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                          : idx % 4 === 1 ? 'bg-gradient-to-br from-teal-500 to-emerald-600'
                          : idx % 4 === 2 ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                          : 'bg-gradient-to-br from-sky-500 to-blue-600'
                        }`}>
                          {review.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#15202b]">{review.name}</p>
                          <StarRow count={review.stars} />
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
                      <p className="mt-3 text-[11px] font-medium text-slate-400">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
