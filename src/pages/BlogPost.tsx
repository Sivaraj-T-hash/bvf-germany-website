import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollReveal from '@/components/ScrollReveal';
import { BlogPost, getBlogPosts } from '@/lib/blogStore';
import { useSeo } from '@/lib/useSeo';

/** Renders **bold** and [links](url) inside a line without injecting HTML. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${index++}`;
    if (match[1] !== undefined) {
      nodes.push(<strong key={key} className="font-semibold text-foreground">{match[1]}</strong>);
    } else {
      const [label, href] = [match[2], match[3]];
      nodes.push(
        href.startsWith('/') ? (
          <Link key={key} to={href} className="font-semibold text-primary underline underline-offset-2">{label}</Link>
        ) : /^https?:\/\//.test(href) ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2">{label}</a>
        ) : (
          label
        ),
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderMarkdown(md: string) {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const image = /^!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)\s*$/.exec(line.trim());
    if (image) {
      elements.push(<img key={i} src={image[2]} alt={image[1]} className="my-6 w-full rounded-xl object-cover" loading="lazy" />);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-bold text-foreground mt-6 mb-3">{renderInline(line.slice(4), `h3-${i}`)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-foreground mt-8 mb-4">{renderInline(line.slice(3), `h2-${i}`)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h2 key={i} className="text-3xl font-extrabold text-foreground mt-8 mb-4">{renderInline(line.slice(2), `h1-${i}`)}</h2>);
    } else if (line.startsWith('- ')) {
      elements.push(<li key={i} className="text-muted-foreground ml-4 mb-1 list-none">• {renderInline(line.slice(2), `li-${i}`)}</li>);
    } else if (line.trim() === '') {
      elements.push(<br key={i} />);
    } else {
      elements.push(<p key={i} className="text-muted-foreground leading-relaxed mb-2">{renderInline(line, `p-${i}`)}</p>);
    }
  });

  return elements;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const posts = await getBlogPosts();
      const found = posts.find((p) => p.slug === slug && p.published);
      if (active) setPost(found || null);
    })();
    return () => { active = false; };
  }, [slug]);

  useSeo({
    title: post ? `${post.title} | BVF Germany` : 'Blog | BVF Germany',
    description: post ? post.content.replace(/[#*_]/g, '').slice(0, 140) : 'Guides and updates for studying in Germany.',
    url: post ? `/blog/${post.slug}` : '/blog',
    image: post?.featuredImage || '/hero-og.png',
    type: post ? 'article' : 'website',
    keywords: post?.keywords,
    author: post?.authorName || 'BVF Germany',
    publishedTime: post?.createdAt,
    modifiedTime: post?.updatedAt || post?.createdAt,
    section: post?.category,
    breadcrumb: post
      ? [
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]
      : [{ name: 'Blog', path: '/blog' }],
  });

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary font-semibold">← Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <article className="pt-24 md:pt-32 pb-16">
        <div className="container-narrow px-4 md:px-8 max-w-3xl mx-auto">
          <ScrollReveal>
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </ScrollReveal>

          {post.featuredImage && (
            <ScrollReveal delay={0.05}>
              <img src={post.featuredImage} alt={post.title} className="w-full aspect-video object-cover rounded-xl mb-8" />
            </ScrollReveal>
          )}

          <ScrollReveal delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <Tag className="w-3 h-3" /> {post.category}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString()}
              </span>
              {post.tags.length > 0 && (
                <div className="flex gap-1">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-8">{post.title}</h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="prose-custom">
              {renderMarkdown(post.content)}
            </div>
          </ScrollReveal>
        </div>
      </article>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
