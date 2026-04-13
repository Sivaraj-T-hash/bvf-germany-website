import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSeo } from '@/lib/useSeo';

const mentorCards = [
  {
    name: 'Dr. Abhishek Kumar',
    role: 'Professor',
    text: 'Professor at German universities with 17+ years in Germany. Expert research scientist at DKFZ.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Mr. Tarun Sharma',
    role: 'Leadership Trainer',
    text: 'CBSE-empanelled trainer with experience across BSF, DRDO, and Steel Authority programs.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Mr. Rajender Kumar',
    role: 'Ex. Director, R&D',
    text: '21 publications and 5 patents in research & development leadership.',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Mrs. Beate Renninger',
    role: 'Career Counselor',
    text: '15+ years in international career counseling and business coaching.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
  },
];

const teamMembers = [
  {
    name: 'Mr. Zail Singh',
    role: 'Senior Consultant',
    text: '10+ years of international automotive experience.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=700&auto=format&fit=crop',
  },
  {
    name: 'Mrs. Shivani Nagpal',
    role: 'Senior Consultant',
    text: 'German Education Expert with 8+ years in the education industry.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=700&auto=format&fit=crop',
  },
  {
    name: 'Ms. Aarti Sethi',
    role: 'Education Counselor',
    text: '8+ years as German Education Counselor and intercultural trainer.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=700&auto=format&fit=crop',
  },
];

const professors = [
  {
    name: 'Dr. Kari Hemminki',
    role: 'Professor',
    text: 'Cancer epidemiology & genomics. Professor at German Cancer Research Center (DKFZ).',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=700&auto=format&fit=crop',
  },
  {
    name: 'Dr. Asta Forsti',
    role: 'Professor',
    text: 'Research scientist in genetic susceptibility of cancer and genome-wide studies.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=700&auto=format&fit=crop',
  },
  {
    name: 'Mr. Stefan Zammit',
    role: 'Head of International Affairs',
    text: 'Programme Director of M.Sc. in General Management at PFH German University.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=700&auto=format&fit=crop',
  },
  {
    name: 'Dr. Jubran Rajub',
    role: 'Professor',
    text: 'Director and Professor of Studienkolleg Germany Magdeburg University.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=700&auto=format&fit=crop',
  },
];

function ReadMore({ text, maxChars = 280, className = '' }: { text: string; maxChars?: number; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTrim = text.length > maxChars;
  const visibleText = expanded || !shouldTrim ? text : `${text.slice(0, maxChars).trim()}…`;
  return (
    <div>
      <p className={`text-sm text-muted-foreground leading-relaxed ${className}`}>{visibleText}</p>
      {shouldTrim && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          {expanded ? 'Read Less' : 'Read More'}
          <span className="text-base">{expanded ? '▴' : '▾'}</span>
        </button>
      )}
    </div>
  );
}

export default function BvfGermanyPage() {
  useSeo({
    title: 'BVF Germany | About',
    description: 'BVF Germany supports Indian students from admission to arrival in Germany.',
  });

  const aboutText =
    'Looking for a consultancy to guide you to the best universities in Germany? You are at the right place. At BVF Germany, we support students at every step — from choosing the right program to admissions, accommodation, and help after arrival. Students are our priority, and we take full responsibility to make the journey smooth, transparent, and stress-free.';

  const missionText =
    'We are committed to integrating world-class educational consulting so that students stay competitive in tomorrow’s world. We guide young minds toward excellence, strengthen their foundation, and equip them with the right strategy to succeed in Germany.';

  const supportText =
    'BVF Germany provides complete, step-by-step support: university shortlisting, admissions, APS, language training, visa, accommodation, and cultural readiness. Even after students arrive in Germany, we remain by their side to ensure they feel secure and supported.';

  const visitText =
    'Our visits to Germany are conducted twice a year. We meet students who reached Germany through us, interact with universities directly, and address student concerns on ground. These visits create a sense of trust, connection, and “home away from home”.';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-28 pb-16 bg-[radial-gradient(circle_at_top_left,#fff4cc,transparent_55%),radial-gradient(circle_at_bottom_right,#ffe59a,transparent_40%)]">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-4">About</p>
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight">
              About <span className="text-secondary">BVF Germany</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              A trusted education support community helping Indian students study and settle in Germany.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-95 transition"
              >
                Talk to Us <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                2006 • Trusted Support
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
            ].map((src, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <img src={src} alt="" className="w-full h-28 md:h-36 object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop"
              alt=""
              className="w-full h-[280px] object-cover rounded-2xl border border-border shadow-md"
              loading="lazy"
            />
          </div>
          <div className="order-1 lg:order-2 text-left">
            <h2 className="text-2xl font-bold text-secondary">About Company</h2>
            <div className="mt-4">
              <ReadMore text={aboutText} maxChars={320} className="text-left" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Our Mission and Our Vision</h2>
            <div className="mt-4">
              <ReadMore text={missionText} maxChars={260} />
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop"
              alt=""
              className="w-full h-[280px] object-cover rounded-2xl border border-border shadow-md"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop"
              alt=""
              className="w-full h-[280px] object-cover rounded-2xl border border-border shadow-md"
              loading="lazy"
            />
          </div>
          <div className="order-1 lg:order-2 text-left">
            <h2 className="text-2xl font-bold text-secondary">Complete Student Support</h2>
            <div className="mt-4">
              <ReadMore text={supportText} maxChars={300} className="text-left" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-muted/30">
        <div className="container-narrow px-4 md:px-8">
          <h3 className="text-2xl font-bold text-center text-secondary mb-10">Supervisory Board / Mentors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentorCards.map((mentor) => (
              <div key={mentor.name} className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm">
                <img
                  src={mentor.image}
                  alt=""
                  className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-background shadow-md"
                  loading="lazy"
                />
                <h4 className="mt-4 text-base font-semibold text-secondary">{mentor.name}</h4>
                <p className="text-xs text-muted-foreground">{mentor.role}</p>
                <p className="mt-3 text-xs text-muted-foreground">{mentor.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-narrow px-4 md:px-8">
          <h3 className="text-2xl font-bold text-center text-secondary mb-10">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm">
                <img
                  src={member.image}
                  alt=""
                  className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-background shadow-md"
                  loading="lazy"
                />
                <h4 className="mt-4 text-base font-semibold text-secondary">{member.name}</h4>
                <p className="text-xs text-muted-foreground">{member.role}</p>
                <p className="mt-3 text-xs text-muted-foreground">{member.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[linear-gradient(120deg,#fff8e1,#fff1b8)]">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div className="grid grid-cols-3 gap-3">
            {[
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
            ].map((src, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <img src={src} alt="" className="w-full h-24 object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Our Visit <span className="text-secondary">To Germany</span>
            </h2>
            <div className="mt-4">
              <ReadMore text={visitText} maxChars={320} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-narrow px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-bold text-secondary">German Professors & Partners</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {professors.map((prof) => (
                <div key={prof.name} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <img src={prof.image} alt="" className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{prof.name}</p>
                      <p className="text-xs text-muted-foreground">{prof.role}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{prof.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop"
              alt=""
              className="w-full h-[320px] object-cover rounded-2xl border border-border shadow-md"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
