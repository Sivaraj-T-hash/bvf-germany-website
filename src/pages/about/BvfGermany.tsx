import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BrandVisual from '@/components/BrandVisual';
import WhatsAppCta from '@/components/WhatsAppCta';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { businessInfo } from '@/config/business';
import { teamMembers, everyStudent, whatWeStandFor } from '@/content/team';
import { comparison, journeyStages } from '@/content/offer';
import welcomePhoto from '@/assets/students/ramana.jpg';
import { useSeo } from '@/lib/useSeo';

// Only people who have agreed to appear on the website are listed (src/content/team.ts).
export default function BvfGermanyPage() {
  useSeo({
    title: 'BVF Germany | About',
    description: 'BVF Germany is a student support system, not a consultancy: public university experts for Indian students, from shortlisting to settling in.',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="bg-[radial-gradient(circle_at_top_left,#fff4cc,transparent_55%),radial-gradient(circle_at_bottom_right,#ffe59a,transparent_40%)] pb-16 pt-28">
        <div className="container-narrow grid grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-secondary">About</p>
            <h1 className="text-4xl font-extrabold uppercase leading-tight md:text-5xl">
              About <span className="text-secondary">BVF Germany</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{businessInfo.tagline}. {businessInfo.positioning}.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition hover:brightness-95">
                Talk to Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Free first consultation
              </span>
            </div>
          </div>
          <BrandVisual title="From your first shortlist to your first week in Germany" kicker="BVF Germany" scene="campus" className="h-[300px] w-full rounded-[28px] border border-border shadow-lg" />
        </div>
      </section>

      <section className="py-12">
        <div className="container-narrow grid grid-cols-1 items-start gap-10 px-4 md:px-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Who we are</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Moving abroad is a big step. We make it a simple one. Our founder, Bratlin, came from India to study a Master’s in Space Engineering at the University of Bremen, and our Operational Head, Srinivasan Sivakumar, studied Industrial Engineering at TU Berlin. We know this journey from the inside, and we built BVF Germany so you never have to figure it out alone.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              We are a student support system: we plan with you, prepare with you, and stay with you after you land.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-semibold text-muted-foreground">A typical consultancy</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {comparison.typical.map((item) => <li key={item}>– {item}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#15803d]/40 bg-[#f0fdf4] p-5">
              <p className="font-semibold text-slate-900">BVF Germany</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-800">
                {comparison.bvf.map((item) => (
                  <li key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803d]" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-14">
        <div className="container-narrow px-4 md:px-8">
          <h2 className="text-2xl font-bold text-secondary">Our team</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center">
                <img src={member.photo} alt={member.name} className="h-32 w-32 shrink-0 rounded-2xl object-cover object-top" loading="lazy" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{member.role}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{member.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{member.headline}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
            Read our full story <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="py-14">
        <div className="container-narrow px-4 md:px-8">
          <h2 className="text-2xl font-bold text-secondary">Complete student support</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">14 services in six stages, from shortlisting to settling in. Items marked add-on are optional.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journeyStages.map((stage) => (
              <div key={stage.id} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-bold text-foreground">{stage.number}. {stage.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stage.subtitle}</p>
                <ul className="mt-3 space-y-1 text-sm text-foreground">
                  {stage.services.map((service) => (
                    <li key={service.title}>
                      <Link to={service.path} className="hover:underline">{service.title}</Link>
                      {service.addOn ? <span className="ml-1 text-xs text-[#92400e]">(add-on)</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(120deg,#fff8e1,#fff1b8)] py-12">
        <div className="container-narrow grid grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <figure>
            <img src={welcomePhoto} alt="The BVF team welcoming our first student, Ramana, in Germany" className="h-[300px] w-full rounded-2xl object-cover shadow-md" loading="lazy" />
            <figcaption className="mt-2 text-xs text-muted-foreground">Welcoming our first student, Ramana, in Germany.</figcaption>
          </figure>
          <div>
            <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">
              With you <span className="text-secondary">in Germany</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{everyStudent.paragraphs[4]}</p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{whatWeStandFor.disclaimer}</p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-narrow flex flex-wrap gap-3 px-4 md:px-8">
          <Link to="/bookings" className="button-primary">Book a free consultation</Link>
          <WhatsAppCta variant="outline" message="Hi BVF Germany, I would like to know more about your support." />
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
