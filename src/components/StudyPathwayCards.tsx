import { ArrowRight, Award, BookOpen, BriefcaseBusiness, Clock, GraduationCap, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface PathwayCardItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  badgeStyle: string;
  description: string;
  cta: string;
  href?: string;
  isComingSoon?: boolean;
  icon: LucideIcon;
}

export const pathwayCards: PathwayCardItem[] = [
  {
    id: 'masters',
    title: "Master's in Germany",
    category: 'Postgraduate',
    badge: 'Postgraduate',
    badgeStyle: 'border-emerald-200/80 bg-emerald-50 text-[#2D6A4F]',
    description:
      'Explore postgraduate opportunities at German universities and find programmes aligned with your academic background and career goals.',
    cta: "Explore Master's Programmes",
    href: '/study-in-germany/ms',
    isComingSoon: false,
    icon: GraduationCap,
  },
  {
    id: 'bachelor',
    title: "Bachelor's in Germany",
    category: 'Undergraduate',
    badge: 'Undergraduate',
    badgeStyle: 'border-slate-200 bg-slate-50 text-slate-700',
    description:
      'Discover undergraduate study opportunities in Germany and understand the academic requirements and application process.',
    cta: "Explore Bachelor's Programmes",
    href: '/study-in-germany/bachelor',
    isComingSoon: false,
    icon: BookOpen,
  },
  {
    id: 'ausbildung',
    title: 'Ausbildung in Germany',
    category: 'Vocational Training',
    badge: 'Vocational',
    badgeStyle: 'border-amber-200/80 bg-amber-50 text-amber-900',
    description:
      "Learn about Germany's vocational training pathway, combining practical workplace experience with structured professional education.",
    cta: 'Explore Ausbildung',
    href: '/study-in-germany/ausbildung',
    isComingSoon: false,
    icon: BriefcaseBusiness,
  },
  {
    id: 'phd',
    title: 'PhD in Germany',
    category: 'Doctoral Research',
    badge: 'Coming Soon',
    badgeStyle: 'border-amber-300/80 bg-amber-100/70 text-amber-950 font-bold',
    description:
      'Explore doctoral research opportunities, academic pathways and the steps involved in pursuing a PhD in Germany.',
    cta: 'Coming Soon',
    isComingSoon: true,
    icon: Award,
  },
];

const cardMotion = {
  hidden: { opacity: 0, y: 24 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const, delay: index * 0.08 },
  }),
};

export default function StudyPathwayCards() {
  return (
    <section id="study-pathways" className="border-b border-[#E7E5E0] bg-[#FAF8F5] px-4 py-16 md:px-8 md:py-24">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
              EXPLORE YOUR OPTIONS
            </span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[40px] leading-tight">
            Find the Right Pathway to Your Future in Germany.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
            Every student&apos;s journey is different. Explore the available education pathways and find the direction that matches your academic background and goals.
          </p>
        </div>

        {/* 4 Cards Responsive Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pathwayCards.map((card, index) => {
            const Icon = card.icon;

            if (card.isComingSoon || !card.href) {
              return (
                <motion.div
                  key={card.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardMotion}
                  custom={index}
                  className="relative flex flex-col justify-between rounded-2xl border border-[#E7E5E0] bg-white/70 p-6 md:p-7 shadow-sm transition-all"
                >
                  <div>
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E7E5E0] bg-[#FAF8F5] text-[#64748B]">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${card.badgeStyle}`}>
                        {card.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-[#0F172A]">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                      {card.description}
                    </p>
                  </div>

                  {/* Non-clickable Coming Soon CTA */}
                  <div
                    aria-disabled="true"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-slate-100/70 px-4 py-2.5 text-xs md:text-sm font-semibold text-slate-400 cursor-not-allowed select-none"
                  >
                    <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <span>{card.cta}</span>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={card.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardMotion}
                custom={index}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#E7E5E0] bg-white p-6 md:p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-md"
              >
                <div>
                  {/* Top Row: Icon & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E7E5E0] bg-[#FAF8F5] text-[#0F172A] transition-colors group-hover:border-[#2D6A4F]/30 group-hover:bg-[#2D6A4F]/10 group-hover:text-[#2D6A4F]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${card.badgeStyle}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#2D6A4F]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                    {card.description}
                  </p>
                </div>

                {/* Accessible CTA Link */}
                <Link
                  to={card.href}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E7E5E0] bg-[#FAF8F5] px-4 py-2.5 text-xs md:text-sm font-semibold text-[#0F172A] shadow-none transition-all duration-200 hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                  aria-label={`${card.cta} - ${card.title}`}
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
