import { ArrowRight, BookOpenCheck, FileCheck2, Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppCta from '@/components/WhatsAppCta';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { teamMembers } from '@/content/team';
import { useSeo } from '@/lib/useSeo';

const supportAreas = [
  { icon: BookOpenCheck, name: 'Admissions guidance', focus: 'Shortlisting, SOP, LOR, CV and university applications' },
  { icon: FileCheck2, name: 'Documents and visa', focus: 'APS, blocked account, health insurance and visa preparation' },
  { icon: Languages, name: 'Test preparation', focus: 'IELTS, GRE, GMAT and German classes, all with the same team' },
  { icon: Home, name: 'Settling in', focus: 'Accommodation search and your first weeks in Germany' },
];

const anchors: Record<string, string> = { bratlin: '/about#founder', 'srinivasan-sivakumar': '/about#operational-head' };

export default function ExpertTeamPage() {
  useSeo({
    title: 'Our Team | BVF Germany',
    description: 'Meet Bratlin, founder of BVF Germany, and Srinivasan Sivakumar, Operational Head.',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="bg-[linear-gradient(135deg,#faf7f2_0%,#f5f0ea_55%,#f7f2ea_100%)] pb-12 pt-28">
        <div className="container-narrow px-4 md:px-8">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-secondary">About Us</p>
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">The people behind BVF Germany</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A journey built on experience. Both of us studied in Germany, so we know the system from the inside.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-narrow grid gap-8 px-4 md:grid-cols-2 md:px-8">
          {teamMembers.map((member) => (
            <article key={member.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <img src={member.photo} alt={member.name} className="h-96 w-full object-cover object-top" loading="lazy" />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{member.role}</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">{member.name}</h2>
                <p className="mt-2 text-sm font-medium text-primary">{member.headline}</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{member.summary}</p>
                <Link to={anchors[member.id] || '/about'} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                  Read more <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-14">
        <div className="container-narrow px-4 md:px-8">
          <h2 className="mb-6 text-2xl font-bold text-secondary">How we support you</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {supportAreas.map((area) => (
              <div key={area.name} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4db]">
                  <area.icon className="h-6 w-6 text-secondary" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-secondary">{area.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{area.focus}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/bookings" className="button-primary">Book a free consultation</Link>
            <WhatsAppCta variant="outline" message="Hi BVF Germany, I would like to speak with your team." />
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
