import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

import CoverImage from '@/components/CoverImage';
import { getBlogPosts, type BlogPost } from '@/lib/blogStore';

export const knowledgeCategories = [
  'Study in Germany',
  'University Admissions',
  'APS & Visa Guidance',
  'Scholarships & Finance',
  'Student Life in Germany',
  'Career & Opportunities',
];

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

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

type KnowledgeHubSectionProps = {
  posts?: BlogPost[];
  className?: string;
};

export default function KnowledgeHubSection({ posts: initialPosts, className }: KnowledgeHubSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts.slice(0, 3));
      return;
    }

    void (async () => {
      try {
        const allPosts = await getBlogPosts();
        const published = allPosts.filter((post) => post.published);
        setPosts(published.slice(0, 3));
      } catch (err) {
        console.error('Failed to load knowledge hub articles:', err);
      }
    })();
  }, [initialPosts]);

  return (
    <section
      id="knowledge-hub"
      aria-labelledby="knowledge-hub-heading"
      className={className || 'border-b border-[#E7E5E0] bg-[#FAF8F5] px-4 py-16 md:px-8 md:py-24'}
    >
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
              THE BVF KNOWLEDGE HUB
            </span>
          </div>

          <h2
            id="knowledge-hub-heading"
            className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[42px] leading-tight"
          >
            Make Informed Decisions About Your Future in Germany.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
            Explore practical guides, useful insights and important information to help you navigate
            your education journey in Germany.
          </p>

          {/* Curated Category Filter Tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {knowledgeCategories.map((cat) => (
              <Link
                key={cat}
                to="/blog"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#475569] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CBD5E1] hover:bg-[#FAF8F5] hover:text-[#0F172A]"
              >
                <span>{cat}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 3-Column Articles Grid */}
        {posts.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const formattedDate = post.createdAt
                ? dateFormatter.format(new Date(post.createdAt))
                : null;

              return (
                <motion.article
                  key={post.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={cardMotion}
                  custom={index}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E7E5E0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-md"
                >
                  <div>
                    {/* Thumbnail Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5F2EC]">
                      <CoverImage
                        src={post.featuredImage}
                        title={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-[#0F172A]/10 to-transparent pointer-events-none" />

                      {/* Category Badge */}
                      <div className="absolute bottom-3.5 left-4 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-white/40 bg-white/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] shadow-sm backdrop-blur-md">
                          {post.category}
                        </span>
                      </div>

                      {/* Read Time Tag */}
                      {post.readTime ? (
                        <div className="absolute top-3.5 right-4">
                          <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-[#0F172A]/75 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {post.readTime}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 md:p-7">
                      {/* Meta: Date & Author */}
                      <div className="flex items-center gap-3 text-xs text-[#64748B]">
                        {formattedDate ? (
                          <span className="inline-flex items-center gap-1.5 font-numeric">
                            <Calendar className="h-3.5 w-3.5 text-[#2D6A4F]" aria-hidden="true" />
                            {formattedDate}
                          </span>
                        ) : null}
                        {post.authorName ? (
                          <span>By {post.authorName}</span>
                        ) : null}
                      </div>

                      {/* Title */}
                      <h3 className="mt-3 font-heading text-xl font-bold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#2D6A4F] leading-snug line-clamp-2">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="mt-3 text-sm leading-relaxed text-[#475569] line-clamp-3">
                        {post.excerpt || post.content.replace(/^#+\s+/gm, '').slice(0, 140) + '...'}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="border-t border-[#F1EFEA] bg-[#FAF8F5]/60 px-6 py-4 md:px-7">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D6A4F] transition-colors hover:text-[#1E3A2F] md:text-sm"
                      aria-label={`Read guide: ${post.title}`}
                    >
                      <span>Read Guide</span>
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
        ) : null}

        {/* Restrained Section CTA */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
          <p className="text-sm font-medium text-[#64748B]">
            Looking for more guidance on applications, finances, and visas?
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CBD5E1] hover:bg-[#FAF8F5]"
          >
            <BookOpen className="h-4 w-4 text-[#2D6A4F]" aria-hidden="true" />
            <span>Explore All Resources</span>
            <ArrowRight className="h-4 w-4 text-[#2D6A4F]" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
