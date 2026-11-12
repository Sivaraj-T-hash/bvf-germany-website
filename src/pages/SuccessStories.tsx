import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import WhatsAppCta from '@/components/WhatsAppCta';
import { StoryCard } from '@/components/StudentStories';
import { publishedStories } from '@/content/successStories';
import { useSeo } from '@/lib/useSeo';

export default function SuccessStoriesPage() {
  useSeo({
    title: 'Student Success Stories | BVF Germany',
    description: 'Real BVF Germany students admitted to German public universities, shared with their permission.',
    noindex: publishedStories.length === 0,
  });

  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <p className="eyebrow-chip">Success Stories</p>
            <h1 className="hero-display mt-7 max-w-4xl">Real students. Real outcomes.</h1>
            <p className="hero-copy">
              Every student comes with a different academic background, financial situation and set of challenges. These
              stories are shared with each student’s permission.
            </p>
          </div>
        </section>

        <section className="px-4 pb-20 md:px-8 md:pb-24">
          <div className="container-narrow">
            {publishedStories.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {publishedStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="surface-panel p-8 text-center">
                <h2 className="text-2xl font-semibold text-foreground">Student stories are on their way</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  We publish a student’s story only after they have agreed to share it.
                </p>
              </div>
            )}
            <div className="mt-14 surface-panel p-8 text-center">
              <h2 className="text-2xl font-semibold text-foreground">Your story could be next</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Your first consultation is free. We look at your profile and tell you honestly where you can apply.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/bookings" className="button-primary">Book a free consultation</Link>
                <WhatsAppCta variant="outline" message="Hi BVF Germany, I saw your student success stories and would like guidance for my own application." />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
