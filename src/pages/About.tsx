import { motion } from 'framer-motion';
import { CheckCircle2, Eye, GraduationCap, Instagram, MessageCircle, ShieldCheck, Target, Users, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import WhatsAppCta from '@/components/WhatsAppCta';
import BrandVisual from '@/components/BrandVisual';
import StudentStories from '@/components/StudentStories';
import founderPhoto from '@/assets/adharsh-bratlin.jpg';
import { founderProfile } from '@/config/business';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { externalUrl } from '@/lib/contact';
import { useSeo } from '@/lib/useSeo';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const storyTimeline = [
  {
    label: 'The Dream',
    title: 'Many students want Germany, but do not know where to begin.',
    body: 'Every year, ambitious Indian students look at public universities in Germany and see world-class education with very low tuition.',
  },
  {
    label: 'The Confusion',
    title: 'APS, finances, SOPs, deadlines, and university choices create friction fast.',
    body: 'Without clear guidance, students lose time, make weak decisions, and miss intakes they were actually capable of securing.',
  },
  {
    label: 'The Shift',
    title: 'BVF Germany was built to replace confusion with a practical system.',
    body: 'We simplify the move from profile evaluation to landing in Germany so students can act with clarity instead of anxiety.',
  },
];

const differentiators = [
  {
    icon: GraduationCap,
    title: 'Public University Specialists',
    description: 'We focus on tuition-free public universities, not random private college pushes.',
  },
  {
    icon: Target,
    title: 'End-to-End Support',
    description: 'From profile check to admission, visa, and landing guidance, the path stays connected.',
  },
  {
    icon: CheckCircle2,
    title: 'Honest Advice',
    description: 'We never guarantee admissions or visas. We help you make the strongest application you can.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Process',
    description: 'No vague promises, no hidden steps, and no pressure-filled shortcuts.',
  },
  {
    icon: Users,
    title: 'Student-First Approach',
    description: 'Advice is tailored to the student profile, not copied from a generic script.',
  },
  {
    icon: MessageCircle,
    title: 'Community And Support',
    description: 'Students keep getting guidance even after they reach Germany and start settling in.',
  },
];

export default function AboutPage() {
  useSeo({
    title: 'About BVF Germany',
    description: 'The BVF Germany story, our founder Adharsh Bratlin, and how we guide Indian students to public universities in Germany.',
    url: 'https://bvf-student-support.web.app/about',
    image: '/hero-og.png',
  });

  const settings = useSiteSettings();
  const instagramUrl = externalUrl(settings.instagramUrl);
  const youtubeUrl = externalUrl(settings.youtubeUrl);

  return (
    <div className="site-shell home-showcase">
      <Navbar />

      <main>
        <section className="page-hero overflow-hidden">
          <div className="page-hero-inner">
            <div className="poster-grid items-center gap-y-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="col-span-12 lg:col-span-7"
              >
                <p className="eyebrow-chip">About BVF Germany</p>
                <h1 className="hero-display mt-7 max-w-4xl">
                  We Do Not Just Send Students to Germany.
                  <span className="block text-gradient-primary">We Build Their Future.</span>
                </h1>
                <p className="hero-copy max-w-2xl">
                  BVF Germany helps Indian students with public university admissions in Germany, from the first profile
                  check to a confident landing.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/bookings" className="button-primary">
                    Book Free Consultation
                  </Link>
                  <Link to="/tools" className="button-secondary">
                    Check Eligibility
                  </Link>
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {['Honest guidance over empty promises', 'Public-university focused process', 'Support from shortlist to arrival'].map((item) => (
                    <div key={item} className="rounded-[24px] border border-white/20 bg-white/10 px-4 py-4 backdrop-blur-sm">
                      <p className="text-sm font-medium text-white/88">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: 0.08 }}
                className="col-span-12 lg:col-span-5"
              >
                <div className="surface-panel relative overflow-hidden p-4">
                  <img src={founderPhoto} alt={`${founderProfile.name}, founder of BVF Germany`} className="h-[520px] w-full rounded-[28px] object-cover object-top" />
                  <div className="absolute inset-x-8 bottom-8 rounded-[28px] border border-white/20 bg-slate-950/74 p-6 text-white backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Founder</p>
                    <p className="mt-2 text-lg font-semibold">{founderProfile.name}</p>
                    <p className="mt-1 text-sm text-white/75">
                      {founderProfile.education}, {founderProfile.university}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="container-narrow grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={spring}
              className="surface-panel p-8"
            >
              <p className="section-kicker">Brand Story</p>
              <h2 className="section-title max-w-xl">The problem was never student potential. It was a lack of clear guidance.</h2>
              <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground md:text-base">
                <p>
                  Every year, many Indian students dream of studying in Germany. Most of them are capable. Many of them
                  are serious. But they still get stuck.
                </p>
                <p>
                  APS confusion, financial proof, SOP stress, deadlines, and weak university choices create a process
                  that feels more overwhelming than it should.
                </p>
                <p>Wrong guidance leads to rejections, delays, and lost intakes. That is where BVF Germany started.</p>
                <p className="font-semibold text-foreground">
                  Today, BVF Germany supports students at every stage, from the first profile check to their arrival in Germany.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...spring, delay: 0.06 }}
              className="surface-panel p-8"
            >
              <div className="space-y-7">
                {storyTimeline.map((item, index) => (
                  <div key={item.label} className="grid gap-4 md:grid-cols-[88px_1fr]">
                    <div className="flex items-start gap-4 md:block">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        0{index + 1}
                      </div>
                      {index < storyTimeline.length - 1 ? <div className="ml-7 mt-3 hidden h-16 w-px bg-border md:block" /> : null}
                    </div>
                    <div className="rounded-[24px] border border-border/70 bg-background/70 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{item.label}</p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-6 md:px-8 md:py-8">
          <div className="container-narrow grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={spring}
              className="rounded-[32px] border border-white/10 bg-[linear-gradient(160deg,rgba(12,26,56,1),rgba(29,52,94,0.92))] p-8 text-white shadow-[0_26px_80px_-42px_rgba(11,23,51,0.85)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <Target className="h-6 w-6 text-secondary" aria-hidden="true" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Mission</p>
              <h2 className="mt-2 font-heading text-3xl font-semibold">Make world-class German education accessible.</h2>
              <p className="mt-4 text-sm leading-7 text-white/78">
                To make world-class German education accessible to every deserving Indian student without financial
                barriers and without the noise that usually slows them down.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...spring, delay: 0.06 }}
              className="rounded-[32px] border border-secondary/20 bg-[linear-gradient(160deg,rgba(245,235,204,0.92),rgba(255,247,227,1))] p-8 shadow-[0_26px_80px_-42px_rgba(163,118,20,0.28)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/18">
                <Eye className="h-6 w-6 text-amber-900" aria-hidden="true" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-amber-900/65">Vision</p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-900">A trusted pathway to global education.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                To build a trusted pathway to global education for Indian students, starting with Germany&apos;s public
                universities and growing through trust, clarity, and honest results.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="container-narrow">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={spring}
              >
                <div className="surface-panel p-4">
                  <img src={founderPhoto} alt={`${founderProfile.name}, founder of BVF Germany`} className="h-[560px] w-full rounded-[30px] object-cover object-top" loading="lazy" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ ...spring, delay: 0.06 }}
              >
                <p className="section-kicker">Founder Story</p>
                <h2 className="section-title max-w-2xl">Information is everywhere. Clarity is not.</h2>
                <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground md:text-base">
                  <p>BVF Germany was founded with a simple belief: students deserve honest, clear, and practical guidance.</p>
                  <p>
                    After seeing how many students were getting lost in the German admission process, our founder realized
                    that the real gap was not ambition. It was direction.
                  </p>
                  <p>
                    That is why BVF Germany focuses not only on what to do, but how to do it right, step by step. The aim
                    is to remove panic, improve decisions, and help students move with confidence.
                  </p>
                  <p>
                    Today, BVF is more than a consultancy. It is a support system for students chasing global dreams
                    through Germany&apos;s tuition-free public universities.
                  </p>
                </div>
                <div className="mt-8 rounded-[26px] border border-border bg-card p-6">
                  <p className="text-lg font-semibold text-foreground">{founderProfile.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{founderProfile.role}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
                    <GraduationCap className="h-4 w-4 text-secondary" aria-hidden="true" />
                    {founderProfile.education}, {founderProfile.university}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="container-narrow">
            <div className="max-w-3xl">
              <p className="section-kicker">Why BVF Germany</p>
              <h2 className="section-title">Built for students who want the right path, not just more information.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {differentiators.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  className="surface-panel group p-6"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:-translate-y-1">
                    <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <StudentStories kicker="Student Success Snapshot" title="Real students. Real admits. Shared with their permission." />

        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="container-narrow grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={spring}
              className="surface-panel p-8"
            >
              <p className="section-kicker">Community And Content</p>
              <h2 className="section-title max-w-2xl">We are more than a consultancy. We educate students regularly.</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                Through our online channels and webinars, BVF Germany helps students make smarter decisions before they
                apply, before they spend, and before they miss important steps.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {instagramUrl ? (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-[24px] border border-border bg-background/70 p-5 transition hover:-translate-y-1 hover:border-primary/30">
                    <Instagram className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="mt-4 text-lg font-semibold text-foreground">Instagram</p>
                    <p className="text-sm text-muted-foreground">Germany tips and updates</p>
                  </a>
                ) : null}
                {youtubeUrl ? (
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="rounded-[24px] border border-border bg-background/70 p-5 transition hover:-translate-y-1 hover:border-primary/30">
                    <Youtube className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="mt-4 text-lg font-semibold text-foreground">YouTube</p>
                    <p className="text-sm text-muted-foreground">Guides and recorded sessions</p>
                  </a>
                ) : null}
                <Link to="/webinars" className="rounded-[24px] border border-border bg-background/70 p-5 transition hover:-translate-y-1 hover:border-primary/30">
                  <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="mt-4 text-lg font-semibold text-foreground">Live Sessions</p>
                  <p className="text-sm text-muted-foreground">Webinars and practical Q&amp;A</p>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ ...spring, delay: 0.05 }}
              className="overflow-hidden rounded-[34px] shadow-[0_30px_100px_-54px_rgba(15,23,42,0.9)]"
            >
              <BrandVisual title="Students do better when they learn before they apply." kicker="Why It Matters" icon={Users} className="h-full min-h-[320px] w-full" />
            </motion.div>
          </div>
        </section>

        <section className="px-4 pb-20 pt-6 md:px-8 md:pb-24">
          <div className="container-narrow overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-12 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:px-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Start Your Journey</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold text-secondary md:text-5xl">
                  Your Germany Journey Starts With the Right Guidance
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 md:text-base">
                  If you are serious about Germany, let&apos;s turn your profile into a plan with the right university
                  strategy, the right process, and the right support.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:items-start">
                <Link to="/bookings" className="button-primary">
                  Book Free Consultation
                </Link>
                <WhatsAppCta label="Chat on WhatsApp" />
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
