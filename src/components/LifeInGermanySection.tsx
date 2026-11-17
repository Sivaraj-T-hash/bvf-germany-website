import { ArrowRight, CheckCircle2, Compass, GraduationCap, Landmark, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

import studentLifeImg from '@/assets/hero-student 5.png';
import everydayLivingImg from '@/assets/german-campus.jpg';
import cultureImg from '@/assets/germany-landmark.jpg';
import careerImg from '@/assets/hero-student 4.png';

export interface LifeAspect {
  id: string;
  category: string;
  title: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  icon: typeof GraduationCap;
  linkTo: string;
  linkLabel: string;
}

export const lifeInGermanyAspects: LifeAspect[] = [
  {
    id: 'student-life',
    category: 'CAMPUS & COMMUNITY',
    title: 'Student Life',
    description:
      'Campus experiences, student communities and university activities. German higher education institutions foster vibrant, multicultural student bodies with active student unions (AStA), university sports clubs, and collaborative academic spaces.',
    highlights: [
      'Active Student Unions (AStA) & clubs',
      'Multicultural, welcoming campus networks',
      'Modern research libraries & study centres',
    ],
    image: studentLifeImg,
    imageAlt: 'Diverse international university students collaborating on campus in Germany',
    icon: GraduationCap,
    linkTo: '/about-germany',
    linkLabel: 'Explore Student Life in Germany',
  },
  {
    id: 'everyday-living',
    category: 'INDEPENDENCE & ESSENTIALS',
    title: 'Everyday Living',
    description:
      'Public transportation, accommodation and daily essentials. Benefit from the regional Semesterticket for extensive transit, accessible student housing through the Studentenwerk, world-class healthcare, and safe, walkable cities.',
    highlights: [
      'Subsidised Semesterticket for public transit',
      'Affordable student dormitories & shared flats',
      'Comprehensive student health coverage',
    ],
    image: everydayLivingImg,
    imageAlt: 'Young people and students enjoying public urban spaces in Germany',
    icon: Compass,
    linkTo: '/services/germany',
    linkLabel: 'Learn About On-Ground Essentials',
  },
  {
    id: 'culture-exploration',
    category: 'HERITAGE & DISCOVERY',
    title: 'Culture & Exploration',
    description:
      'German cities, historic places and cultural experiences. Positioned at the geographic centre of Europe, Germany combines centuries of architecture, museums, world-renowned festivals, and easy travel across the Schengen zone with your student residence permit.',
    highlights: [
      'Central Europe location with Schengen travel access',
      'Historic landmarks, arts, museums & seasonal markets',
      'Safe, modern cities with rich cultural heritage',
    ],
    image: cultureImg,
    imageAlt: 'The historic Brandenburg Gate at sunset in Berlin, Germany',
    icon: Landmark,
    linkTo: '/about-germany',
    linkLabel: 'Discover German Culture',
  },
  {
    id: 'career-growth',
    category: 'PROFESSIONAL FUTURE',
    title: 'Career & Growth',
    description:
      'Opportunities to develop skills, gain practical experience and prepare for the future. Take advantage of 140 full days of part-time work rights, paid student employment (Werkstudent), mandatory industry internships, and an 18-month post-study work visa.',
    highlights: [
      '140 full days / 280 half days part-time work allowance',
      'Paid Werkstudent roles in leading industries',
      '18-month post-study job seeker visa',
    ],
    image: careerImg,
    imageAlt: 'Focused student developing technical and professional skills in a modern study environment',
    icon: TrendingUp,
    linkTo: '/services/germany',
    linkLabel: 'Explore Career Opportunities',
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

export default function LifeInGermanySection({ className }: { className?: string }) {
  return (
    <section
      id="life-in-germany"
      aria-labelledby="life-in-germany-heading"
      className={className || 'border-b border-[#E7E5E0] bg-[#FAF8F5] px-4 py-16 md:px-8 md:py-24'}
    >
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
              BEYOND THE CLASSROOM
            </span>
          </div>

          <h2
            id="life-in-germany-heading"
            className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[42px] leading-tight"
          >
            More Than a Degree. A New Life in Germany.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
            Studying in Germany is also about discovering a new culture, building independence and
            creating meaningful experiences beyond the classroom.
          </p>
        </div>

        {/* 2x2 Editorial Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          {lifeInGermanyAspects.map((aspect, index) => {
            const Icon = aspect.icon;
            return (
              <motion.article
                key={aspect.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.05 }}
                variants={cardMotion}
                custom={index}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E7E5E0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-md"
              >
                <div>
                  {/* Image Container with 16:9 Aspect Ratio and Subtle Zoom */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F5F2EC]">
                    <img
                      src={aspect.image}
                      alt={aspect.imageAlt}
                      className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-[#0F172A]/15 to-transparent" />

                    {/* Category Pill Over Image */}
                    <div className="absolute bottom-3.5 left-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1E3A2F] shadow-sm backdrop-blur-md">
                        <Icon className="h-3 w-3 text-[#2D6A4F]" aria-hidden="true" />
                        {aspect.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 md:p-8">
                    <h3 className="font-heading text-2xl font-bold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#2D6A4F]">
                      {aspect.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#475569] md:text-base md:leading-relaxed">
                      {aspect.description}
                    </p>

                    {/* Highlight Points */}
                    <ul className="mt-5 space-y-2" aria-label={`Key features of ${aspect.title}`}>
                      {aspect.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-xs text-[#334155] md:text-sm">
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="border-t border-[#F1EFEA] bg-[#FAF8F5]/60 px-6 py-4 md:px-8">
                  <Link
                    to={aspect.linkTo}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D6A4F] transition-colors hover:text-[#1E3A2F] md:text-sm"
                    aria-label={`${aspect.linkLabel} for ${aspect.title}`}
                  >
                    <span>{aspect.linkLabel}</span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Restrained Bottom Action */}
        <div className="mt-14 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-4">
          <p className="text-sm font-medium text-[#64748B]">
            Want a comprehensive guide to student life, costs, and city living?
          </p>
          <Link
            to="/about-germany"
            className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CBD5E1] hover:bg-[#FAF8F5]"
          >
            <span>Read Life in Germany Guide</span>
            <ArrowRight className="h-4 w-4 text-[#2D6A4F]" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
