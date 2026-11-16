import { ArrowRight, Award, BriefcaseBusiness, FlaskConical, Landmark, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import germanCampus from '@/assets/german-campus.jpg';

export interface GermanyBenefitItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  highlight: string;
  icon: LucideIcon;
}

export const germanyBenefits: GermanyBenefitItem[] = [
  {
    id: 'recognised-education',
    title: 'Recognised Education',
    badge: 'Global Standards',
    description:
      'Explore a wide range of academic programmes and internationally recognised qualifications at German higher education institutions.',
    highlight: 'Bologna ECTS Framework • Worldwide Equivalence',
    icon: Award,
  },
  {
    id: 'public-university-opportunities',
    title: 'Public University Opportunities',
    badge: 'State-Funded Education',
    description:
      'Understand the opportunities available at public universities and the tuition and semester contribution differences between institutions and federal states.',
    highlight: 'Nominal Semester Contributions • Low Tuition Models*',
    icon: Landmark,
  },
  {
    id: 'practical-learning-and-research',
    title: 'Practical Learning and Research',
    badge: 'Applied Innovation',
    description:
      'Discover research-focused education, industry connections and opportunities to gain practical experience.',
    highlight: 'Mandatory Internships • Direct Industry & Fraunhofer Labs',
    icon: FlaskConical,
  },
  {
    id: 'career-opportunities',
    title: 'Career Opportunities',
    badge: 'Post-Study Pathways',
    description:
      'Learn about the employment and post-study pathways available to eligible international graduates.',
    highlight: '18-Month Job Search Visa (§ 20 AufenthG) • EU Blue Card',
    icon: BriefcaseBusiness,
  },
];

const benefitMotion = {
  hidden: { opacity: 0, y: 24 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const, delay: index * 0.08 },
  }),
};

export default function WhyChooseGermanySection() {
  return (
    <section id="why-germany" className="border-b border-[#E7E5E0] bg-[#FAF8F5] px-4 py-16 md:px-8 md:py-24">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
              WHY CHOOSE GERMANY
            </span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[42px] leading-tight">
            A World of Opportunities, Built Around Your Future.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
            Germany combines internationally recognised education, research opportunities and practical career pathways. Discover what makes it an attractive destination for students from around the world.
          </p>
        </div>

        {/* 4 Differentiated Benefit Blocks */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {germanyBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={benefitMotion}
                custom={index}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#E7E5E0] bg-white p-6 md:p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-md"
              >
                <div>
                  {/* Top Row: Icon and Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E7E5E0] bg-[#FAF8F5] text-[#0F172A] transition-colors group-hover:border-[#2D6A4F]/30 group-hover:bg-[#2D6A4F]/10 group-hover:text-[#2D6A4F]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="inline-flex items-center rounded-full border border-[#E7E5E0] bg-[#FAF8F5] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      {benefit.badge}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#2D6A4F]">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                    {benefit.description}
                  </p>
                </div>

                {/* Bottom Highlight Accent */}
                <div className="mt-6 border-t border-[#F1EFEA] pt-4">
                  <p className="text-[11px] font-semibold tracking-wide text-[#2D6A4F]">
                    {benefit.highlight}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Editorial Campus Visual and Contextual Action Banner */}
        <div className="mt-10 overflow-hidden rounded-2xl md:rounded-3xl border border-[#E7E5E0] bg-white shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="relative h-64 lg:h-full lg:min-h-[220px] lg:col-span-5 overflow-hidden">
            <img
              src={germanCampus}
              alt="Historic and modern university campus architecture in Germany"
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0F172A]/20" />
            <span className="absolute bottom-3 left-4 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-[#0F172A] border border-[#E7E5E0] shadow-sm">
              Academic Excellence Across 16 States
            </span>
          </div>

          <div className="p-6 md:p-8 lg:col-span-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="max-w-xl">
              <h4 className="font-heading text-lg md:text-xl font-bold text-[#0F172A]">
                Explore Your Public University Opportunities
              </h4>
              <p className="mt-2 text-xs md:text-sm leading-relaxed text-[#475569]">
                Germany offers over 400 higher education institutions and thousands of English-taught degree programmes. Use our free guidance tools to check your profile eligibility.
              </p>
            </div>

            <Link
              to="/tools"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0F172A] px-6 py-3.5 text-xs md:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E293B] hover:shadow-md"
            >
              <span>Is a German Public University Right for Me?</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Factual Disclaimer */}
        <p className="mt-6 text-center text-xs leading-relaxed text-[#64748B] max-w-4xl mx-auto">
          *Tuition and semester contribution policies vary by federal state (e.g. Baden-Württemberg and select Bavarian programmes charge non-EU fees) and individual higher education institution. Student work rights (up to 140 full days per year) and 18-month post-study residence permits follow federal statutory regulations (§ 16b and § 20 AufenthG).
        </p>
      </div>
    </section>
  );
}
