import { ArrowLeft, GraduationCap, PlayCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import WhatsAppCta from '@/components/WhatsAppCta';
import NotFound from '@/pages/NotFound';
import { getPublishedStory, storyDestination, storyTypeLabels } from '@/content/successStories';
import { useSeo } from '@/lib/useSeo';

export default function SuccessStoryPage() {
  const { id = '' } = useParams();
  const story = getPublishedStory(id);

  useSeo({
    title: story ? `${story.fullName} | Success Story | BVF Germany` : 'Success Story | BVF Germany',
    description: story ? story.quote || story.highlight || `${story.fullName}: ${storyDestination(story)}` : 'Student success story from BVF Germany.',
    image: story?.photo,
    noindex: !story,
  });

  if (!story) return <NotFound />;

  const facts: Array<[string, string | undefined]> = [
    ['German university', story.germanUniversity],
    ['Master’s programme', story.admittedCourse],
    ['Intake', story.intake],
    ['Bachelor’s degree', [story.degree, story.branch].filter(Boolean).join(' ')],
    ['Previous college / university', story.indianInstitution],
    ['Bachelor’s CGPA', story.cgpa],
    ['IELTS score', story.ieltsScore],
    ['Year of graduation', story.graduationYear],
    ['From', story.hometown],
  ];

  return (
    <div className="site-shell">
      <Navbar />
      <main className="px-4 pb-20 pt-28 md:px-8">
        <article className="container-narrow max-w-5xl">
          <Link to="/success-stories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All success stories
          </Link>
          <div className="mt-6 grid gap-8 md:grid-cols-[300px_1fr] md:items-start">
            <img src={story.photo} alt={story.fullName} className="h-96 w-full rounded-[28px] object-cover object-top" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{storyTypeLabels[story.storyType]}</p>
              <h1 className="mt-3 text-4xl font-extrabold text-foreground">{story.fullName}</h1>
              <p className="mt-4 flex items-start gap-2 text-lg font-semibold text-foreground">
                <GraduationCap className="mt-1 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                {storyDestination(story)}
              </p>
              {story.quote ? (
                <p className="mt-4 text-lg leading-8 text-muted-foreground">“{story.quote}”</p>
              ) : story.highlight ? (
                <p className="mt-4 text-base leading-8 text-muted-foreground">{story.highlight}</p>
              ) : null}
              {story.videoUrl ? (
                <a href={story.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                  <PlayCircle className="h-4 w-4" aria-hidden="true" /> Watch {story.fullName.split(' ')[0]}&apos;s video
                </a>
              ) : null}

              <dl className="mt-8 grid gap-4 rounded-[28px] border border-border bg-card p-6 sm:grid-cols-2">
                {facts
                  .filter(([, value]) => value && value.trim())
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
                      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
                    </div>
                  ))}
                {story.servicesReceived?.length ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Services received from BVF</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {story.servicesReceived.map((service) => (
                        <span key={service} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">{service}</span>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>

          {story.story ? (
            <div className="mt-10 max-w-3xl space-y-5 text-base leading-8 text-muted-foreground">
              {story.story.split(/\n\s*\n/).map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {story.poster ? (
            <figure className="mt-12">
              <img src={story.poster} alt={`BVF Germany success story poster for ${story.fullName}`} className="mx-auto w-full max-w-xl rounded-[28px] border border-border shadow-card" loading="lazy" />
              <figcaption className="mt-3 text-center text-xs text-muted-foreground">Shared with {story.fullName.split(' ')[0]}&apos;s permission.</figcaption>
            </figure>
          ) : null}

          <div className="mt-12 rounded-[28px] bg-[#132033] p-8 text-white">
            <h2 className="text-2xl font-semibold">Planning your own Germany journey?</h2>
            <p className="mt-2 text-sm text-white/75">Your first consultation is free.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/bookings" className="inline-flex rounded-full bg-[#facc15] px-5 py-3 text-sm font-semibold text-[#132033]">Book a free consultation</Link>
              <WhatsAppCta label="Ask on WhatsApp" message={`Hi BVF Germany, I read ${story.fullName}'s success story and would like guidance for my own application.`} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
