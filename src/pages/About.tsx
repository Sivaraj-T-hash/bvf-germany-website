import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Eye, GraduationCap, Instagram, MessageCircle, ShieldCheck, Target, Users, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CountUp from '@/components/ui/CountUp';
import founderImg from '@/assets/founder.jpg';
import coFounderImg from '@/assets/hero-student 2.png';
import studentsGroup from '@/assets/students-group.jpg';
import { getSiteSettings, getTestimonials, type SiteSettings, type TestimonialItem } from '@/lib/siteContentStore';
import { useSeo } from '@/lib/useSeo';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const storyTimeline = [
  {
    label: 'The Dream',
    title: 'Thousands of students want Germany, but do not know where to begin.',
    body: 'Every year, ambitious Indian students look at public universities in Germany and see world-class education with very low tuition.',
  },
  {
    label: 'The Confusion',
    title: 'APS, blocked accounts, SOPs, deadlines, and university choices create friction fast.',
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
    title: 'Proven Results',
    description: '500+ students have already moved forward with BVF Germany support.',
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

const stats = [
  { value: 500, suffix: '+', label: 'Students Placed' },
  { value: 50, suffix: '+', label: 'Universities Covered' },
  { value: 110, suffix: 'K+', label: 'Instagram Community' },
  { value: 60, suffix: 'K+', label: 'YouTube Subscribers' },
];

export default function AboutPage() {
  useSeo({
    title: 'About BVF Germany',
    description: 'Discover the BVF Germany story, founder mission, student impact, and why Indian students trust us for public university admissions in Germany.',
    url: 'https://bvf-student-support.web.app/about',
    image: '/hero-og.png',
  });

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [siteSettings, testimonialItems] = await Promise.all([getSiteSettings(), getTestimonials()]);
      if (!active) return;
      setSettings(siteSettings);
      setTestimonials(testimonialItems.filter((item) => item.published).slice(0, 4));
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const whatsappHref = `https://wa.me/${settings?.whatsappNumber || '919999999999'}?text=${encodeURIComponent(
    settings?.prefilledWhatsappMessage || 'Hi BVF Germany! I want help with studying in Germany.',
  )}`;

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
                  BVF Germany is India&apos;s trusted partner for public university admissions, helping students move
                  from confusion to confident landing in Germany.
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
                  {[
                    'Honest guidance over empty promises',
                    'Public-university focused process',
                    'Trusted by students and families across India',
                  ].map((item) => (
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
                  <img
                    src={studentsGroup}
                    alt="BVF Germany students preparing for their education journey"
                    className="h-[520px] w-full rounded-[28px] object-cover"
                  />
                  <div className="absolute inset-x-8 bottom-8 rounded-[28px] border border-white/20 bg-slate-950/74 p-6 text-white backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Brand Promise</p>
                    <p className="mt-3 text-lg font-semibold leading-8">
                      Clarity, credibility, and step-by-step support for students targeting Germany&apos;s best public
                      universities.
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
                  Every year, thousands of Indian students dream of studying in Germany. Most of them are capable. Many
                  of them are serious. But they still get stuck.
                </p>
                <p>
                  APS confusion, blocked accounts, SOP stress, deadlines, and weak university choices create a process
                  that feels more overwhelming than it should.
                </p>
                <p>
                  Wrong guidance leads to rejections, delays, and lost intakes. That is where BVF Germany started.
                </p>
                <p className="font-semibold text-foreground">
                  Today, 500+ students have successfully made their move with zero tuition public universities.
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
              <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-900">Become India&apos;s most trusted pathway.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                To become India&apos;s most trusted pathway to global education, starting with Germany&apos;s public
                universities and growing through trust, clarity, and results.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="container-narrow space-y-16">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={spring}
              >
                <div className="surface-panel p-4">
                  <img src={founderImg} alt="Founder of BVF Germany" className="h-[560px] w-full rounded-[30px] object-cover" />
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
                  <p>
                    BVF Germany was founded with a simple belief: students deserve honest, clear, and practical guidance.
                  </p>
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
                  <p className="text-lg font-semibold text-foreground">Bratlin</p>
                  <p className="mt-1 text-sm text-muted-foreground">Founder, BVF Germany</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={spring}
            >
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div className="order-2 lg:order-1">
                  <p className="section-kicker">Co-Founder Profile</p>
                  <h2 className="section-title max-w-2xl">A second voice in the mission, focused on student-first execution.</h2>
                  <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground md:text-base">
                    <p>
                      The co-founder profile section is now ready to sit alongside the founder story so the About page
                      reflects the broader leadership behind BVF Germany.
                    </p>
                    <p>
                      This placeholder version is designed to make room for the full co-founder introduction, including
                      their experience, role in the company, and the perspective they bring to student guidance.
                    </p>
                    <p>
                      Once the final profile is shared, this section can be updated with the exact name, title,
                      background, and achievements without needing to redesign the page again.
                    </p>
                    <p>
                      For now, the structure is in place so the About page no longer feels like it tells only one side of
                      the BVF Germany story.
                    </p>
                  </div>
                  <div className="mt-8 rounded-[26px] border border-border bg-card p-6">
                    <p className="text-lg font-semibold text-foreground">Co-Founder Name</p>
                    <p className="mt-1 text-sm text-muted-foreground">Co-Founder, BVF Germany</p>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      Placeholder profile ready to be replaced with the co-founder&apos;s real background, student-support
                      focus, and leadership story.
                    </p>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <div className="surface-panel p-4">
                    <img src={coFounderImg} alt="Co-Founder of BVF Germany" className="h-[560px] w-full rounded-[30px] object-cover" />
                  </div>
                </div>
              </div>
            </motion.div>
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

        <section className="px-4 py-8 md:px-8 md:py-12">
          <div className="container-narrow rounded-[34px] bg-slate-950 px-6 py-10 text-white shadow-[0_30px_100px_-52px_rgba(2,6,23,0.9)] md:px-10">
            <div className="grid gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  className="text-center"
                >
                  <div className="text-4xl font-semibold text-secondary">
                    <CountUp to={stat.value} duration={2.2} separator="," />
                    {stat.suffix}
                  </div>
                  <p className="mt-3 text-sm text-white/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="container-narrow">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="section-kicker">Student Success Snapshot</p>
                <h2 className="section-title">Real students. Real admits. Real confidence in the process.</h2>
              </div>
              <Link to="/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition hover:text-primary">
                See All Success Stories
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {testimonials.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  className="surface-panel p-6"
                >
                  <div className="flex items-center gap-3">
                    {item.photo ? (
                      <img src={item.photo} alt={item.name} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {item.name.slice(0, 1)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.university}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">&quot;{item.quote}&quot;</p>
                  <div className="mt-5 rounded-[22px] bg-muted/60 px-4 py-4">
                    <p className="text-sm font-medium text-foreground">{item.course}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.result}</p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/bookings" className="button-secondary">
                Join 500+ Students Who Chose BVF Germany
              </Link>
            </div>
          </div>
        </section>

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
              <h2 className="section-title max-w-2xl">We are more than a consultancy. We educate students daily.</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                Through Instagram, YouTube, and webinars, BVF Germany helps thousands of students make smarter decisions
                before they apply, before they spend, and before they miss important steps.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <a
                  href={settings?.instagramUrl || 'https://instagram.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[24px] border border-border bg-background/70 p-5 transition hover:-translate-y-1 hover:border-primary/30"
                >
                  <Instagram className="h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="mt-4 text-lg font-semibold text-foreground">110K+</p>
                  <p className="text-sm text-muted-foreground">Instagram learners</p>
                </a>
                <a
                  href={settings?.youtubeUrl || 'https://youtube.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[24px] border border-border bg-background/70 p-5 transition hover:-translate-y-1 hover:border-primary/30"
                >
                  <Youtube className="h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="mt-4 text-lg font-semibold text-foreground">60K+</p>
                  <p className="text-sm text-muted-foreground">YouTube subscribers</p>
                </a>
                <Link
                  to="/webinars"
                  className="rounded-[24px] border border-border bg-background/70 p-5 transition hover:-translate-y-1 hover:border-primary/30"
                >
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
              className="rounded-[34px] bg-[linear-gradient(160deg,rgba(15,23,42,1),rgba(30,41,59,0.94))] p-8 text-white shadow-[0_30px_100px_-54px_rgba(15,23,42,0.9)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Why It Matters</p>
              <h3 className="mt-3 font-heading text-3xl font-semibold">Students do better when they learn before they apply.</h3>
              <div className="mt-6 space-y-4 text-sm leading-7 text-white/74">
                <p>Daily content builds awareness. Webinars answer real questions. Community proof reduces doubt.</p>
                <p>
                  That combination helps families trust the process and helps students make clearer, faster, and smarter
                  admission decisions.
                </p>
              </div>
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
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="button-secondary">
                  Chat on WhatsApp
                </a>
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
