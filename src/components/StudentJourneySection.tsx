import { ArrowRight, Compass, FileText, GraduationCap, LucideIcon, PlaneTakeoff, SearchCheck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface JourneyStageItem {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  serviceLink?: {
    label: string;
    href: string;
  };
}

export const journeyStages: JourneyStageItem[] = [
  {
    number: '01',
    title: 'Profile Evaluation',
    description: "Understand the student's academic background, interests and future goals.",
    icon: SearchCheck,
    badge: 'Initial Assessment',
    serviceLink: {
      label: 'Free Profile Check',
      href: '/#profile-evaluation',
    },
  },
  {
    number: '02',
    title: 'University & Programme Shortlisting',
    description: "Explore suitable universities and programmes based on the student's profile and preferences.",
    icon: GraduationCap,
    badge: 'Curated Options',
    serviceLink: {
      label: 'Explore Shortlisting',
      href: '/services/university-shortlist',
    },
  },
  {
    number: '03',
    title: 'Application Preparation',
    description: 'Guide students through application requirements, documentation and submission procedures.',
    icon: FileText,
    badge: 'Document Readiness',
    serviceLink: {
      label: 'Application Support',
      href: '/services/university-application',
    },
  },
  {
    number: '04',
    title: 'Admission & APS Guidance',
    description: 'Provide relevant support with admission-related steps and APS procedures where applicable.',
    icon: ShieldCheck,
    badge: 'Verification & Offers',
    serviceLink: {
      label: 'APS Procedures',
      href: '/services/aps-application',
    },
  },
  {
    number: '05',
    title: 'Visa & Pre-Departure Preparation',
    description: 'Guide students through visa documentation, preparation and important arrangements before departure.',
    icon: PlaneTakeoff,
    badge: 'VFS & Travel Prep',
    serviceLink: {
      label: 'Visa Guidance',
      href: '/services/visa-guidance',
    },
  },
  {
    number: '06',
    title: 'Preparing for Life in Germany',
    description: "Help students understand the next steps involved in preparing for their studies and settling into life in Germany, within BVF's actual service scope.",
    icon: Compass,
    badge: 'Arrival & Settling',
    serviceLink: {
      label: 'On-Arrival Support',
      href: '/services/on-arrival-support',
    },
  },
];

const stageMotion = {
  hidden: { opacity: 0, y: 24 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const, delay: index * 0.08 },
  }),
};

export default function StudentJourneySection() {
  const handleEvaluationClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('profile-evaluation');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="student-journey" className="border-b border-[#E7E5E0] bg-[#FAF8F5] px-4 py-16 md:px-8 md:py-24">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
              HOW WE GUIDE YOU
            </span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[42px] leading-tight">
            Your Journey to Germany, Step by Step.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
            From your first profile evaluation to preparing for your new life in Germany, understand the key stages of your journey with BVF Germany.
          </p>
        </div>

        {/* Six Stages Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {journeyStages.map((stage, index) => {
            const Icon = stage.icon;
            const isExternalOrAnchor = stage.serviceLink?.href.startsWith('/#') || stage.serviceLink?.href.startsWith('#');

            return (
              <motion.div
                key={stage.number}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={stageMotion}
                custom={index}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#E7E5E0] bg-white p-6 md:p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-md"
              >
                <div>
                  {/* Top Bar: Stage Number & Icon */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full border border-[#2D6A4F]/20 bg-[#2D6A4F]/10 px-3 py-1 font-numeric text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                      Stage {stage.number}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E7E5E0] bg-[#FAF8F5] text-[#0F172A] transition-colors group-hover:border-[#2D6A4F]/30 group-hover:bg-[#2D6A4F]/10 group-hover:text-[#2D6A4F]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 font-heading text-lg font-bold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#2D6A4F] md:text-xl">
                    {stage.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                    {stage.description}
                  </p>
                </div>

                {/* Bottom Action / Link */}
                {stage.serviceLink ? (
                  <div className="mt-6 border-t border-[#F1EFEA] pt-4">
                    {isExternalOrAnchor ? (
                      <a
                        href={stage.serviceLink.href}
                        onClick={handleEvaluationClick}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F] transition-colors hover:text-[#1E3A2F]"
                      >
                        <span>{stage.serviceLink.label}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        to={stage.serviceLink.href}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F] transition-colors hover:text-[#1E3A2F]"
                      >
                        <span>{stage.serviceLink.label}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>

        {/* Section Bottom CTA */}
        <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-[#E7E5E0] bg-white p-8 text-center shadow-sm md:rounded-3xl md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
            START YOUR ADMISSIONS JOURNEY
          </p>
          <h3 className="mt-2 font-heading text-xl font-extrabold text-[#0F172A] sm:text-2xl">
            Every journey starts with the right direction.
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#475569]">
            Share your academic profile with our experts for an initial assessment of your public university eligibility.
          </p>
          <div className="mt-6">
            <a
              href="#profile-evaluation"
              onClick={handleEvaluationClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F172A] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E293B] hover:shadow-md md:text-base"
            >
              <span>Get Your Free Profile Evaluation</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Compliance Note */}
        <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-relaxed text-[#64748B]">
          *BVF Germany provides structured guidance through verified university entry requirements and official procedures. Admissions, APS certificate issuance, and visa grants remain subject to the sole jurisdiction of German academic institutions, the Academic Evaluation Centre (APS India), and the German Embassy/Consulate.
        </p>
      </div>
    </section>
  );
}
