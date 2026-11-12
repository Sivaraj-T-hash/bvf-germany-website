import { BookOpen, Briefcase, CalendarClock, CheckCircle2, GraduationCap, Home, Info, Languages, Laptop, MessageSquare, Users, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import WhatsAppCta from '@/components/WhatsAppCta';
import BrandVisual from '@/components/BrandVisual';
import EnquiryForm from '@/components/EnquiryForm';
import { cefrLevels, germanCourse } from '@/content/germanCourse';
import { useSeo } from '@/lib/useSeo';

const whyIcons = [Home, Briefcase, Wrench, GraduationCap];

export default function GermanLanguagePage() {
  useSeo({
    title: 'German Language Classes A1–C1 | BVF Germany',
    description: 'Live online German classes: A1 (30 classes) and A2 (50 classes) at ₹15,000 per level, with B1, B2 and C1 on request.',
    keywords: ['German language classes', 'learn German A1 A2 B1 B2', 'German course for Germany students', 'German classes online India'],
  });

  const mainLevels = germanCourse.levels.filter((level) => level.summary);
  const higherLevels = germanCourse.levels.filter((level) => !level.summary);
  const facts = [
    { icon: Laptop, label: 'Format', value: germanCourse.format },
    { icon: CalendarClock, label: 'Classes per week', value: germanCourse.classesPerWeek },
    { icon: Users, label: 'Batch size', value: germanCourse.batchSize },
  ].filter((fact) => fact.value.trim());

  return (
    <div className="site-shell home-showcase">
      <Navbar />
      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <div className="poster-grid items-center">
              <div className="col-span-12 lg:col-span-7">
                <p className="eyebrow-chip">German Language Classes · Add-on</p>
                <h1 className="hero-display mt-7">German language classes, A1 to C1</h1>
                <p className="hero-copy">{germanCourse.intro} Live online classes with real tutors, so you can learn from home.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#german-enquiry" className="button-primary">Enquire About Classes</a>
                  <WhatsAppCta variant="outline" label="Ask on WhatsApp" message="Hi BVF Germany, I would like details about your German language classes (levels, batches and fees)." />
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5">
                {germanCourse.classPhotos[0] ? (
                  <img src={germanCourse.classPhotos[0]} alt="BVF German language class" className="h-[340px] w-full rounded-[28px] object-cover" />
                ) : (
                  <BrandVisual title="A1 · A2 · B1 · B2 · C1" kicker="German Language Classes" icon={Languages} className="h-[340px] w-full rounded-[28px]" />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 md:px-8">
          <div className="container-narrow">
            <p className="section-kicker">Levels and fees</p>
            <h2 className="section-title">Learn level by level.</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {mainLevels.map((level) => (
                <article key={level.level} className="surface-panel flex flex-col border-2 border-secondary/40 p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{cefrLevels[level.level].title}</p>
                  <h3 className="mt-1 text-2xl font-bold text-foreground">Level {level.level}</h3>
                  <p className="mt-3 font-numeric text-4xl text-foreground">{level.fee}</p>
                  {level.duration ? (
                    <span className="mt-3 inline-flex w-fit rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">{level.duration}</span>
                  ) : null}
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{level.summary}</p>
                </article>
              ))}
            </div>
            {higherLevels.length ? (
              <>
                <h3 className="mt-10 text-lg font-semibold text-foreground">Continue to higher levels</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {higherLevels.map((level) => (
                    <div key={level.level} className="rounded-2xl bg-muted/60 px-5 py-4">
                      <p className="font-semibold text-foreground">{level.level} <span className="font-normal text-muted-foreground">· {cefrLevels[level.level].title}</span></p>
                      <p className="mt-1 text-sm text-muted-foreground">{level.fee}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
            <p className="mt-6 flex items-start gap-2 rounded-2xl border-l-4 border-secondary bg-secondary/10 px-4 py-3 text-sm leading-7 text-foreground">
              <Info className="mt-1 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
              <span><span className="font-semibold">Good to know:</span> {germanCourse.examFeeNote} {germanCourse.missedClass}</span>
            </p>
          </div>
        </section>

        <section className="px-4 pb-14 md:px-8">
          <div className="container-narrow">
            <p className="section-kicker">Why start German early?</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {germanCourse.whyEarly.map((item, index) => {
                const Icon = whyIcons[index % whyIcons.length];
                return (
                  <div key={item.title} className="surface-panel flex items-start gap-4 p-6">
                    <Icon className="mt-1 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {facts.length || germanCourse.batchTimings.length ? (
          <section className="px-4 pb-14 md:px-8">
            <div className="container-narrow grid gap-5 md:grid-cols-2">
              {facts.length ? (
                <div className="surface-panel space-y-4 p-6">
                  <p className="section-kicker">Course Format</p>
                  {facts.map((fact) => (
                    <p key={fact.label} className="flex items-start gap-3 text-sm leading-7 text-foreground">
                      <fact.icon className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span><span className="font-semibold">{fact.label}:</span> {fact.value}</span>
                    </p>
                  ))}
                </div>
              ) : null}
              {germanCourse.batchTimings.length ? (
                <div className="surface-panel p-6">
                  <p className="section-kicker">Batch Timings</p>
                  <ul className="mt-4 space-y-2 text-sm leading-7 text-foreground">
                    {germanCourse.batchTimings.map((timing) => (
                      <li key={timing} className="flex items-start gap-3"><CalendarClock className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{timing}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {germanCourse.materials.length || germanCourse.speakingPractice || germanCourse.outcomes.length ? (
          <section className="px-4 pb-14 md:px-8">
            <div className="container-narrow grid gap-5 md:grid-cols-3">
              {germanCourse.materials.length ? (
                <div className="surface-panel p-6">
                  <BookOpen className="h-5 w-5 text-secondary" aria-hidden="true" />
                  <p className="mt-3 font-semibold text-foreground">Course materials</p>
                  <ul className="mt-3 space-y-1 text-sm leading-7 text-muted-foreground">{germanCourse.materials.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ) : null}
              {germanCourse.speakingPractice ? (
                <div className="surface-panel p-6">
                  <MessageSquare className="h-5 w-5 text-secondary" aria-hidden="true" />
                  <p className="mt-3 font-semibold text-foreground">Speaking practice</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{germanCourse.speakingPractice}</p>
                </div>
              ) : null}
              {germanCourse.outcomes.length ? (
                <div className="surface-panel p-6">
                  <CheckCircle2 className="h-5 w-5 text-secondary" aria-hidden="true" />
                  <p className="mt-3 font-semibold text-foreground">Learning outcomes</p>
                  <ul className="mt-3 space-y-1 text-sm leading-7 text-muted-foreground">{germanCourse.outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {germanCourse.trainers.length ? (
          <section className="px-4 pb-14 md:px-8">
            <div className="container-narrow">
              <p className="section-kicker">Trainers</p>
              <h2 className="section-title">Learn with experienced trainers.</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {germanCourse.trainers.map((trainer) => (
                  <article key={trainer.name} className="surface-panel overflow-hidden">
                    <img src={trainer.photo} alt={trainer.name} className="h-64 w-full object-cover object-top" loading="lazy" />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-foreground">{trainer.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{trainer.qualifications}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{trainer.experience}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {germanCourse.classPhotos.length > 1 ? (
          <section className="px-4 pb-14 md:px-8">
            <div className="container-narrow grid grid-cols-2 gap-4 md:grid-cols-4">
              {germanCourse.classPhotos.slice(1).map((photo) => (
                <img key={photo} src={photo} alt="BVF German class" className="h-40 w-full rounded-2xl object-cover" loading="lazy" />
              ))}
            </div>
          </section>
        ) : null}

        {germanCourse.feedback.length ? (
          <section className="px-4 pb-14 md:px-8">
            <div className="container-narrow">
              <p className="section-kicker">Student Feedback</p>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {germanCourse.feedback.map((item) => (
                  <blockquote key={`${item.name}-${item.level}`} className="surface-panel p-6 text-sm leading-7 text-muted-foreground">
                    “{item.quote}”
                    <footer className="mt-3 font-semibold text-foreground">{item.name} · {item.level}</footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="german-enquiry" className="scroll-mt-28 px-4 pb-20 md:px-8">
          <div className="container-narrow grid gap-8 rounded-[34px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] p-6 text-white md:p-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Enquiry</p>
              <h2 className="mt-3 font-heading text-4xl font-semibold text-secondary">Ask about the next German batch</h2>
              <p className="mt-4 text-sm leading-7 text-white/76">
                Tell us your current level and when you want to start. The BVF team will send you the next batch dates and timings.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/76">
                Applying to Germany as well? See <Link to="/services" className="font-semibold text-white underline">all BVF services</Link>.
              </p>
            </div>
            <div className="rounded-[26px] bg-white p-6 text-foreground">
              <EnquiryForm formKey="german-course" subject="German language class enquiry" sourcePage="/german-language" messagePlaceholder="Current level and preferred start month (optional)" submitLabel="Send Course Enquiry" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
