import { ArrowRight, BookOpenCheck, FileCheck2, GraduationCap, Home, Languages, Plane, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BrandVisual from '@/components/BrandVisual';
import WhatsAppCta from '@/components/WhatsAppCta';
import { useSeo } from '@/lib/useSeo';
import { founderProfile } from '@/config/business';
import founderPhoto from '@/assets/adharsh-bratlin.jpg';

const leaders = [
  {
    icon: GraduationCap,
    name: 'Senior Counselors',
    role: 'Admissions & Profile Strategy',
    text: 'Personalized guidance to align profiles with the right universities.',
  },
  {
    icon: FileCheck2,
    name: 'APS & Visa Experts',
    role: 'Documentation & Interview Support',
    text: 'Mock interviews, document checks, and visa readiness.',
  },
  {
    icon: Plane,
    name: 'Germany Mentors',
    role: 'On‑Ground Support',
    text: 'Accommodation guidance, city onboarding, and cultural readiness.',
  },
];

const members = [
  { icon: BookOpenCheck, name: 'Academic Counselors', focus: 'Programme fit & SOP review' },
  { icon: FileCheck2, name: 'Visa Specialists', focus: 'Checklist & appointment support' },
  { icon: Languages, name: 'Language Coaches', focus: 'German language preparation' },
  { icon: Home, name: 'Accommodation Advisors', focus: 'Housing & move‑in support' },
];

export default function ExpertTeamPage() {
  useSeo({
    title: 'Expert Team | BVF Germany',
    description: 'Meet the founder, counselors, mentors, and specialists guiding your Germany journey.',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-28 pb-16 bg-[linear-gradient(135deg,#faf7f2_0%,#f5f0ea_55%,#f7f2ea_100%)]">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-4">About Us</p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Expert Team</h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl">
              Meet the founder, counselors, mentors, and specialists guiding your Germany journey.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/about/bvf-germany"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-95 transition"
              >
                Meet the People <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5" />
                Student‑first guidance
              </div>
            </div>
          </div>
          <BrandVisual title="The people behind your Germany plan" kicker="BVF Germany Team" icon={Users} className="h-[300px] w-full rounded-[28px] border border-border shadow-lg" />
        </div>
      </section>

      <section className="py-14">
        <div className="container-narrow px-4 md:px-8">
          <h2 className="text-2xl font-bold text-secondary mb-6">Founder</h2>
          <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:grid-cols-[220px_1fr] md:items-center">
            <img src={founderPhoto} alt={founderProfile.name} className="h-64 w-full rounded-2xl object-cover object-top md:h-72" loading="lazy" />
            <div>
              <h3 className="text-2xl font-semibold text-foreground">{founderProfile.name}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{founderProfile.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {founderProfile.education}, {founderProfile.university}
              </p>
              <Link to="/about" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                Read the founder story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-muted/30">
        <div className="container-narrow px-4 md:px-8">
          <h2 className="text-2xl font-bold text-secondary mb-6">Leadership & Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.map((leader) => (
              <div key={leader.name} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#132033]">
                  <leader.icon className="h-6 w-6 text-[#facc15]" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{leader.name}</h3>
                <p className="text-xs text-primary font-semibold mt-1">{leader.role}</p>
                <p className="text-sm text-muted-foreground mt-3">{leader.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-narrow px-4 md:px-8">
          <h2 className="text-2xl font-bold text-secondary mb-6">Specialist Support</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member) => (
              <div key={member.name} className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4db]">
                  <member.icon className="h-6 w-6 text-secondary" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-secondary">{member.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{member.focus}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/bookings" className="button-primary">Book a free consultation</Link>
            <WhatsAppCta variant="outline" message="Hi BVF Germany, I would like to speak with a counselor." />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
