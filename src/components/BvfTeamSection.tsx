import { ArrowRight, CheckCircle2, GraduationCap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

import { founder, operationalHead } from '@/content/team';

export interface VerifiedTeamLeader {
  id: string;
  name: string;
  role: string;
  headline: string;
  institution: string;
  photo: string;
  summary: string;
  expertise: string[];
  linkTo: string;
  linkLabel: string;
}

export const verifiedLeaders: VerifiedTeamLeader[] = [
  {
    id: founder.id,
    name: founder.name,
    role: 'Founder & Lead Mentor',
    headline: 'Mechanical Engineering · Aerospace Industry Experience',
    institution: 'University of Bremen (Space Engineering)',
    photo: founder.photo,
    summary:
      'From a Mechanical Engineering degree in India and two years as an Aerospace Process Engineer, to Space Engineering research at the University of Bremen. Bratlin built BVF Germany so ambitious students never have to figure out their journey alone.',
    expertise: [
      'German Public University Admissions',
      'APS Verification & Visa Navigation',
      'Aerospace & Mechanical Engineering Mentorship',
    ],
    linkTo: '/about',
    linkLabel: "Read Bratlin's Journey",
  },
  {
    id: operationalHead.id,
    name: operationalHead.name,
    role: 'Operational Head',
    headline: 'Industrial Engineering · Research & Innovation · Student Mentorship',
    institution: 'Technical University of Berlin (TU Berlin)',
    photo: operationalHead.photo,
    summary:
      'Industrial Engineering at the Technical University of Berlin (TU Berlin), with exposure to research in the German academic environment. Srinivasan guides students to understand their options, make informed academic decisions, and approach their future with confidence.',
    expertise: [
      'TU Berlin Academic Network & Mentorship',
      'Industrial Engineering & Process Optimisation',
      'On-Ground Student Support & Guidance Systems',
    ],
    linkTo: '/about',
    linkLabel: "Read Srinivasan's Profile",
  },
];

const cardMotion: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.1,
      ease: 'easeOut',
    },
  }),
};

export default function BvfTeamSection({ className }: { className?: string }) {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className={className || 'border-b border-[#E7E5E0] bg-[#FAF8F5] px-4 py-16 md:px-8 md:py-24'}
    >
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
              THE PEOPLE BEHIND BVF
            </span>
          </div>

          <h2
            id="team-heading"
            className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[42px] leading-tight"
          >
            Guidance Built on People, Experience and Purpose.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
            Behind every student journey is a team committed to helping students make informed decisions about their future in Germany.
          </p>
        </div>

        {/* Featured Founder Spotlight Card */}
        <div className="mt-12 overflow-hidden rounded-[34px] border border-[#1E293B] bg-[#132033] text-white shadow-xl">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative h-80 overflow-hidden bg-[#0F172A] lg:h-auto">
              <img
                src={founder.photo}
                alt={`${founder.name}, founder of BVF Germany`}
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#132033]/80 via-transparent to-transparent lg:hidden" />
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#facc15]">
                Founded by someone who has done it
              </p>

              <h2
                className="mt-3 font-heading text-3xl font-bold text-white !text-white md:text-4xl"
                style={{ color: '#ffffff' }}
              >
                The Vision Behind BVF Germany
              </h2>

              <p className="mt-2 text-sm text-white/80 md:text-base">
                Real experiences. Honest guidance. Better opportunities.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-lg font-bold text-white">{founder.name}</span>
                <span className="text-white/40">|</span>
                <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold text-[#facc15]">
                  {founder.role}
                </span>
              </div>

              <p className="mt-1 text-xs text-white/75 md:text-sm">{founder.headline}</p>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 md:text-base md:leading-relaxed">
                Our founder came from India to study Space Engineering at the University of Bremen.
                Having navigated university admissions, APS verification, and the realities of settling in
                Germany firsthand, we know this journey from the inside and built BVF Germany so you never have to
                figure it out alone.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/90 backdrop-blur-sm">
                  <GraduationCap className="h-3.5 w-3.5 text-[#facc15]" aria-hidden="true" />
                  Space Engineering, Univ. of Bremen
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/90 backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#facc15]" aria-hidden="true" />
                  Aerospace Process Industry Experience
                </span>
              </div>

              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-[#facc15] px-6 py-3 text-sm font-semibold text-[#132033] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eab308]"
                >
                  <span>Meet the people behind BVF</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Leadership Profiles Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {verifiedLeaders.map((member, index) => (
            <motion.article
              key={member.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={cardMotion}
              custom={index}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E7E5E0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-md"
            >
              <div>
                {/* Portrait Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-6 md:p-8 pb-4">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-[#F5F2EC] shadow-md">
                    <img
                      src={member.photo}
                      alt={`${member.name}, ${member.role} at BVF Germany`}
                      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E5E0] bg-[#FAF8F5] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                      {member.role}
                    </span>
                    <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#2D6A4F]">
                      {member.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2F]">
                      <GraduationCap className="h-3.5 w-3.5 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                      <span>{member.institution}</span>
                    </p>
                    <p className="mt-1 text-xs text-[#64748B] line-clamp-1">
                      {member.headline}
                    </p>
                  </div>
                </div>

                {/* Biography */}
                <div className="px-6 md:px-8 pb-6">
                  <p className="text-sm leading-relaxed text-[#475569]">
                    {member.summary}
                  </p>

                  {/* Documented Expertise Points */}
                  <div className="mt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A2F]">
                      Focus Areas & Expertise
                    </p>
                    <ul className="mt-2 space-y-1.5" aria-label={`Expertise of ${member.name}`}>
                      {member.expertise.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-[#334155]">
                          <CheckCircle2
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2D6A4F]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="border-t border-[#F1EFEA] bg-[#FAF8F5]/60 px-6 py-4 md:px-8">
                <Link
                  to={member.linkTo}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D6A4F] transition-colors hover:text-[#1E3A2F] md:text-sm"
                  aria-label={`${member.linkLabel} at BVF Germany`}
                >
                  <span>{member.linkLabel}</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Restrained Bottom Mission Note */}
        <div className="mt-14 rounded-2xl border border-[#E7E5E0] bg-white p-6 md:p-8 text-center shadow-sm">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#475569] md:text-base">
            <strong className="font-semibold text-[#0F172A]">Our Commitment:</strong> We don&apos;t make unrealistic
            guarantees or sell admission promises. We commit to honest profile evaluations, transparent university
            guidance, and dedicated support from mentors who have walked this path themselves.
          </p>
          <div className="mt-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D6A4F] transition-colors hover:text-[#1E3A2F] md:text-sm"
            >
              <span>Explore our complete story and values</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
