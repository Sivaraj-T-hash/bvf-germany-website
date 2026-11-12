import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { BlogPost, getBlogPosts } from '@/lib/blogStore';
import { useSeo } from '@/lib/useSeo';

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export default function BlogPage() {
  useSeo({
    title: 'Blog | BVF Germany',
    description: 'Guides, tips, and updates for Indian students planning to study in Germany.',
    url: '/blog',
    image: '/hero-og.png',
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    let active = true;
    (async () => {
      const allPosts = (await getBlogPosts()).filter((post) => post.published);
      if (active) setPosts(allPosts);
    })();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => ['All', ...new Set(posts.map((post) => post.category))], [posts]);
  const filtered = selectedCategory === 'All' ? posts : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="site-shell home-showcase">
      <Navbar />

      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <div className="poster-grid items-end">
              <div className="col-span-12 lg:col-span-8">
                <p className="eyebrow-chip">Journal</p>
                <h1 className="hero-display mt-7">
                  Insights for <span className="text-gradient-primary">Germany-bound</span> students.
                </h1>
                <p className="hero-copy">
                  Practical guides, clearer explanations, and real planning notes for students preparing admissions,
                  APS, visas, and life in Germany.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <div className="surface-panel p-6">
                  <p className="section-kicker">Browse by Category</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          selectedCategory === category
                            ? 'bg-foreground text-white'
                            : 'bg-muted text-muted-foreground hover:bg-white hover:text-foreground'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 md:px-8 md:pb-24">
          <div className="container-narrow">
            {filtered.length === 0 ? (
              <div className="surface-panel py-20 text-center">
                <p className="text-lg text-muted-foreground">No blog posts yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group block overflow-hidden rounded-[30px] border border-border/90 bg-white/82 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      {post.featuredImage ? (
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            <Tag className="h-3 w-3" aria-hidden="true" />
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" aria-hidden="true" />
                            {dateFormatter.format(new Date(post.createdAt))}
                          </span>
                        </div>
                        <h2 className="mt-4 font-heading text-3xl font-semibold text-foreground transition group-hover:text-secondary">
                          {post.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
                          {post.content.replace(/[#*_]/g, '').slice(0, 170)}…
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition group-hover:text-secondary">
                          Read More <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
