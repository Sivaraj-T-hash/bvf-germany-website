import { ArrowRight, GraduationCap, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  publishedStories,
  storyBackground,
  storyDestination,
  storyTypeLabels,
  type SuccessStory,
} from '@/content/successStories';

export function StoryCard({ story }: { story: SuccessStory }) {
  const background = storyBackground(story);
  const stats = [
    story.cgpa ? `CGPA ${story.cgpa}` : '',
    story.ieltsScore ? `IELTS ${story.ieltsScore}` : '',
    story.hometown || '',
  ].filter(Boolean);

  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E5E0] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-md">
      <div>
        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F2EC]">
          <img
            src={story.photo}
            alt={`${story.fullName}, BVF Germany student`}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-[#0F172A]/10 to-transparent" />

          {/* Floating Status Pill */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full border border-white/40 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] shadow-sm backdrop-blur-md">
              {storyTypeLabels[story.storyType]}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 md:p-6">
          <h3 className="font-heading text-lg font-bold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#2D6A4F] md:text-xl">
            {story.fullName}
          </h3>

          {/* Admitted / Current Institution */}
          <div className="mt-2.5 flex items-start gap-2 text-xs font-semibold text-[#1E3A2F] md:text-sm">
            <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]" aria-hidden="true" />
            <span className="line-clamp-2">{storyDestination(story)}</span>
          </div>

          {/* Academic Background */}
          {background ? (
            <p className="mt-1.5 text-xs text-[#64748B] line-clamp-1">{background}</p>
          ) : null}

          {/* Stats Tags */}
          {stats.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {stats.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-md border border-[#E7E5E0] bg-[#FAF8F5] px-2 py-0.5 font-numeric text-[11px] font-medium text-[#475569]"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}

          {/* Testimonial Quote or Highlight */}
          <p className="mt-3.5 text-xs leading-relaxed text-[#475569] line-clamp-3 md:text-sm">
            {story.quote ? `“${story.quote}”` : story.highlight}
          </p>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="border-t border-[#F1EFEA] p-5 pt-3.5 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/success-stories/${story.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F] transition-colors hover:text-[#1E3A2F] md:text-sm"
            aria-label={`Read ${story.fullName}'s story`}
          >
            <span>Read {story.fullName.split(' ')[0]}&apos;s story</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          {story.videoUrl ? (
            <a
              href={story.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] transition-colors hover:text-[#0F172A]"
            >
              <PlayCircle className="h-3.5 w-3.5 text-[#2D6A4F]" aria-hidden="true" />
              <span>Watch Video</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

type StudentStoriesProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
};

const cardMotion = {
  hidden: { opacity: 0, y: 24 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const, delay: index * 0.08 },
  }),
};

/** Section of genuine, authorised student stories. Renders nothing until at least one story is published. */
export default function StudentStories({
  kicker = 'REAL STUDENT EXPERIENCES',
  title = 'Every Student Journey Has a Story.',
  subtitle = 'Explore genuine experiences from students who have pursued their education journey in Germany with BVF Germany.',
  limit = 4,
  className = 'border-b border-[#E7E5E0] bg-[#FAF8F5] px-4 py-16 md:px-8 md:py-24',
}: StudentStoriesProps) {
  if (publishedStories.length === 0) return null;
  const stories = publishedStories.slice(0, limit);

  return (
    <section id="student-stories" className={className}>
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
              {kicker}
            </span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[42px] leading-tight">
            {title}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardMotion}
              custom={index}
              className="h-full"
            >
              <StoryCard story={story} />
            </motion.div>
          ))}
        </div>

        {/* Section Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/success-stories"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-7 py-3.5 text-sm font-semibold text-[#0F172A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CBD5E1] hover:bg-[#FAF8F5] md:text-base"
          >
            <span>Explore More Student Stories</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
