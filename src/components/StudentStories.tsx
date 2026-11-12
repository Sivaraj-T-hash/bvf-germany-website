import { ArrowRight, GraduationCap, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publishedStories, storyBackground, storyDestination, storyTypeLabels, type SuccessStory } from '@/content/successStories';

export function StoryCard({ story }: { story: SuccessStory }) {
  const background = storyBackground(story);
  const stats = [
    story.cgpa ? `CGPA ${story.cgpa}` : '',
    story.ieltsScore ? `IELTS ${story.ieltsScore}` : '',
    story.hometown || '',
  ].filter(Boolean);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-border/80 bg-white/90 shadow-card">
      <img src={story.photo} alt={story.fullName} className="h-64 w-full object-cover object-top" loading="lazy" />
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">{storyTypeLabels[story.storyType]}</p>
        <h3 className="mt-2 text-xl font-semibold text-foreground">{story.fullName}</h3>
        <p className="mt-3 flex items-start gap-2 text-sm font-medium text-foreground">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
          {storyDestination(story)}
        </p>
        {background ? <p className="mt-2 text-sm text-muted-foreground">{background}</p> : null}
        {stats.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {stats.map((item) => (
              <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">{item}</span>
            ))}
          </div>
        ) : null}
        <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{story.quote ? `“${story.quote}”` : story.highlight}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link to={`/success-stories/${story.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">
            Read {story.fullName.split(' ')[0]}&apos;s story <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {story.videoUrl ? (
            <a href={story.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <PlayCircle className="h-4 w-4" aria-hidden="true" /> Watch video
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
  limit?: number;
  className?: string;
};

/** Section of genuine, authorised student stories. Renders nothing until at least one story is published. */
export default function StudentStories({
  kicker = 'Student Success Stories',
  title = 'Real students. Real outcomes.',
  limit = 4,
  className = 'px-4 py-16 md:px-8 md:py-20',
}: StudentStoriesProps) {
  if (publishedStories.length === 0) return null;
  const stories = publishedStories.slice(0, limit);

  return (
    <section className={className}>
      <div className="container-narrow">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">{kicker}</p>
            <h2 className="section-title">{title}</h2>
          </div>
          <Link to="/success-stories" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">
            See all success stories <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className={`mt-10 grid gap-6 md:grid-cols-2 ${stories.length >= 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
