import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSeo } from '@/lib/useSeo';

const leaders = [
  {
    name: 'Senior Counselors',
    role: 'Admissions & Profile Strategy',
    text: 'Personalized guidance to align profiles with the best universities.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'APS & Visa Experts',
    role: 'Documentation & Interview Support',
    text: 'Mock interviews, document verification, and visa readiness.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Germany Mentors',
    role: 'On‑Ground Support',
    text: 'Accommodation guidance, city onboarding, and cultural readiness.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
  },
];

const members = [
  {
    name: 'Academic Counselors',
    focus: 'Program fit & SOP review',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Visa Specialists',
    focus: 'Checklist & appointment support',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Language Coaches',
    focus: 'German language prep',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop',
  },
  {
    name: 'Accommodation Advisors',
    focus: 'Housing & move‑in support',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
  },
];

export default function ExpertTeamPage() {
  useSeo({
    title: 'Expert Team | BVF Germany',
    description: 'Meet the counselors, mentors, and specialists guiding your Germany journey.',
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
              Meet the counselors, mentors, and specialists guiding your Germany journey.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-95 transition"
              >
                Meet the Team <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5" />
                Student‑first guidance
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-36 w-36 rounded-[45%_55%_65%_35%] bg-[#f2c94c]/35 blur-[1px]" />
            <div className="absolute -right-8 -bottom-8 h-52 w-52 rounded-[55%_45%_40%_60%] bg-[#f2c94c]/25 blur-[1px]" />
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop"
              alt=""
              className="relative w-full h-[300px] object-cover rounded-[28px] border border-border shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-narrow px-4 md:px-8">
          <h2 className="text-2xl font-bold text-secondary mb-6">Leadership & Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.map((leader) => (
              <div key={leader.name} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48">
                  <img src={leader.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground">{leader.name}</h3>
                  <p className="text-xs text-primary font-semibold mt-1">{leader.role}</p>
                  <p className="text-sm text-muted-foreground mt-3">{leader.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-muted/30">
        <div className="container-narrow px-4 md:px-8">
          <div className="flex items-center justify-center gap-6 mb-8">
            <span className="h-px w-16 bg-secondary/30" />
            <h2 className="text-2xl font-bold text-secondary uppercase tracking-wide">Team Member</h2>
            <span className="h-px w-16 bg-secondary/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {members.map((member) => (
              <div key={member.name} className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                <img
                  src={member.image}
                  alt=""
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-background shadow-md"
                  loading="lazy"
                />
                <h3 className="mt-4 text-base font-semibold text-secondary">{member.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{member.focus}</p>
                <span className="mt-4 block h-px w-24 bg-border mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
