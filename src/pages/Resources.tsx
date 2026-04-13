import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useSeo } from '@/lib/useSeo';
import { subscribeToResourceCatalog, type ResourcePackage } from '@/lib/resourceCatalogStore';

const formatInr = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

export default function ResourcesPage() {
  useSeo({
    title: 'Resources | BVF Germany',
    description: 'Explore curated Germany study-abroad bundles, data packs, and mentor-ready preparation tools.',
  });

  const navigate = useNavigate();
  const [resources, setResources] = useState<ResourcePackage[]>([]);

  useEffect(() => {
    const stop = subscribeToResourceCatalog((items) => {
      setResources(items.filter((item) => item.published));
    });
    return () => stop();
  }, []);

  const visibleResources = useMemo(
    () => [...resources].sort((a, b) => a.sortOrder - b.sortOrder || b.updatedAt.localeCompare(a.updatedAt)),
    [resources],
  );

  const startCheckout = (resourceId: string) => {
    navigate(`/checkout?itemType=plan&plan=${resourceId}&source=resources&autostart=1`);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-slate-900">
      <Navbar />
      <main className="pt-28">
        <section className="px-4 pb-20 md:px-8">
          <div className="mx-auto max-w-7xl rounded-[34px] border border-[#ddd2c1] bg-white p-6 shadow-[0_16px_50px_rgba(58,46,26,0.06)] md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b67a2b]">More resources</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#15202b]">Build your study stack with focused add-ons</h2>
              </div>
              <Link to="/dashboard" className="text-sm font-semibold text-[#123f3a]">
                Already purchased? Open dashboard
              </Link>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {visibleResources.length ? (
                visibleResources.map((item) => (
                  <article key={item.id} className="group overflow-hidden rounded-[28px] border border-[#e7dac8] bg-[#fbf8f3] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(40,31,19,0.08)]">
                    <img src={item.image} alt={item.title} className="h-52 w-full object-cover" />
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#7a756d]">
                        <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#8f621c]">{item.viewed}</span>
                        <span>{item.rating}</span>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold text-[#15202b]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#5b5853]">{item.description}</p>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div>
                          {item.duration ? <p className="text-xs uppercase tracking-[0.14em] text-[#8b8479]">{item.duration}</p> : null}
                          <p className="mt-1 text-lg font-semibold text-[#123f3a]">{formatInr(item.priceValue)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => startCheckout(item.id)}
                          className="rounded-full bg-[#123f3a] px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#0f3632]"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d8c9b6] bg-[#fbf8f3] p-6 text-sm text-[#5f5a52] lg:col-span-3">
                  No resources are published yet. Admin can publish packages from the dashboard.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
