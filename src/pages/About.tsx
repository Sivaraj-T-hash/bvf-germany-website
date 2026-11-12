import { useEffect, useState } from 'react';
import { ArrowRight, GraduationCap, Instagram, Target, ShieldCheck, Youtube, CheckCircle2, Globe, Building2, Quote, Landmark, Banknote, Briefcase, Users, LayoutDashboard, FileCheck, Trophy, Home, Check } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import founderImg from '@/assets/founder.jpg';
import studentsGroup from '@/assets/students-group.jpg';
import { getSiteSettings, getTestimonials, type SiteSettings, type TestimonialItem } from '@/lib/siteContentStore';
import { useSeo } from '@/lib/useSeo';
import { buildWhatsappHref } from '@/lib/whatsapp';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const trustSignals = [
  '500+ students guided',
  'Public-university-first guidance',
  '@bvfgermany on Instagram',
  'Student-first support from India to Germany',
];

const whyGermanyStats = [
  { icon: Landmark, title: '426', suffix: ' Public Universities', text: 'tuition-free for all international students', theme: 'from-blue-500/20 to-cyan-500/20' },
  { icon: Banknote, title: 'EUR 0', suffix: ' Tuition', text: 'pay only semester fee (EUR 150-350 per semester)', theme: 'from-emerald-500/20 to-teal-500/20' },
  { icon: Home, title: 'EUR 45k-50k', suffix: '', text: 'average annual living cost (accommodation + food + transport)', theme: 'from-orange-500/20 to-yellow-500/20' },
  { icon: Briefcase, title: '70 Lakh+', suffix: ' Jobs', text: 'skilled job vacancies in Germany', theme: 'from-purple-500/20 to-pink-500/20' },
  { icon: FileCheck, title: '18 Months', suffix: ' Visa', text: 'post-study work visa for job seekers', theme: 'from-indigo-500/20 to-blue-500/20' },
  { icon: Users, title: '42,000+', suffix: ' Indians', text: 'Indian students studying in Germany annually', theme: 'from-rose-500/20 to-red-500/20' },
  { icon: GraduationCap, title: 'DAAD', suffix: ' Grants', text: 'scholarships available for merit students', theme: 'from-amber-500/20 to-orange-500/20' },
];

const differentiators = [
  {
    icon: Landmark,
    title: 'Public University Expert',
    description: 'BVF Germany is built around tuition-free public universities, not random private-college selling.',
  },
  {
    icon: LayoutDashboard,
    title: 'Clarity Through Complexity',
    description: 'We help students move through APS, blocked accounts, SOPs, visa paperwork, and relocation with structure.',
  },
  {
    icon: Target,
    title: 'Student-First Support',
    description: 'The goal is simple: reduce confusion, improve decisions, and make Germany feel accessible from India.',
  },
];

export default function AboutPage() {
  useSeo({
    title: 'About BVF Germany | India\'s #1 Public University Expert',
    description:
      'Learn about BVF Germany, the founder story, mission, trust signals, and why Indian students choose us for tuition-free public university guidance in Germany.',
    keywords: [
      'BVF Germany',
      'study in germany consultant',
      'public university germany',
      'german universities for indian students',
      'APS certificate support',
    ],
    url: '/about',
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
      setTestimonials(testimonialItems.filter((item) => item.published).slice(0, 3));
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const whatsappHref = buildWhatsappHref(settings);

  return (
    <div className="site-shell home-showcase">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="page-hero overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-30 blur-[100px] pointer-events-none">
             <div className="w-[600px] h-[600px] rounded-full bg-primary/40" />
          </div>
          
          <div className="page-hero-inner relative z-10">
            <div className="poster-grid items-center gap-y-10">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={spring}
                className="col-span-12 lg:col-span-7"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">About BVF Germany</p>
                </div>
                
                <h1 className="hero-display mt-7 max-w-4xl tracking-tight leading-[1.1]">
                  India's #1 <span className="bg-gradient-to-r from-primary to-[#f2c94c] bg-clip-text text-transparent">Public University</span> Expert
                </h1>
                
                <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Helping Indian students access tuition-free German universities with reliable, practical support every step of the way.
                </p>
                
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link to="/bookings" className="button-primary group">
                    Book Free Consultation Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="button-secondary">
                    Chat on WhatsApp
                  </a>
                </div>
                
                <div className="mt-12 flex flex-col gap-3">
                  {trustSignals.map((item, i) => (
                    <motion.div 
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...spring, delay: i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
                      </div>
                      <p className="text-[13px] font-bold tracking-wide text-foreground/80">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ ...spring, delay: 0.2 }}
                className="col-span-12 lg:col-span-5"
              >
                <div className="group relative overflow-hidden rounded-[36px] bg-white p-3 shadow-2xl shadow-primary/10 border border-black/5">
                  <div className="relative overflow-hidden rounded-[28px] bg-muted">
                    <img
                      src={studentsGroup}
                      alt="Indian students planning their Germany study journey"
                      className="h-[580px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-md mb-4 border border-white/20">
                        <Target className="h-4 w-4 text-white" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Our Focus</p>
                      </div>
                      <p className="text-[22px] font-bold leading-tight text-white/95">
                        Guiding you through APS, blocked-accounts, and visas to reach the finest public universities.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FOUNDER STORY */}
        <section className="px-4 py-20 md:px-8 md:py-32 relative bg-gradient-to-b from-transparent to-muted/30">
          <div className="container-narrow grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-secondary/10 blur-2xl rounded-[40px] -z-10" />
              <img 
                src={founderImg} 
                alt="Founder of BVF Germany" 
                className="h-[600px] w-full rounded-[40px] object-cover shadow-2xl border-4 border-white" 
              />
              
              {/* Floating Social Block */}
              <div className="absolute -bottom-4 right-4 lg:-right-6 rounded-[20px] border border-white/80 bg-white/90 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl max-w-[210px] text-center md:text-left">
                <p className="text-[16px] font-black tracking-tight text-foreground">Bratlin</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Founder, BVF Germany</p>
                <div className="mt-4 flex flex-col gap-2">
                  <a href={settings?.instagramUrl || 'https://instagram.com/bvfgermany'} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 rounded-[12px] bg-black/[0.03] p-2 transition-colors hover:bg-black/[0.08]">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-[#E1306C] transition-transform group-hover:scale-110" />
                      <span className="text-[11px] font-bold text-foreground">@bvfgermany</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a href={settings?.youtubeUrl || 'https://youtube.com'} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 rounded-[12px] bg-black/[0.03] p-2 transition-colors hover:bg-black/[0.08]">
                    <div className="flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-[#FF0000] transition-transform group-hover:scale-110" />
                      <span className="text-[11px] font-bold text-foreground">YouTube</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 40 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="lg:pl-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-4 py-1.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600">The Origins</p>
              </div>
              <h2 className="mt-6 text-[32px] md:text-[44px] font-black tracking-tight text-foreground leading-[1.1]">
                Built from firsthand experience of <span className="text-primary">how confusing</span> admissions can feel.
              </h2>
              
              <div className="mt-8 space-y-6 text-[16px] leading-[1.8] text-muted-foreground">
                <p className="font-medium text-foreground/80">
                  Bratlin saw firsthand how difficult it can be for Indian students to navigate German university admissions from India.
                </p>
                <div className="pl-4 border-l-2 border-primary/30">
                  <p>
                    The problem was never student ambition. It was the absolute confusion around APS certificates, blocked accounts, language planning, SOPs, and visa paperwork.
                  </p>
                </div>
                <p>
                  BVF Germany was started to make Germany's world-class education accessible. We believe every Indian student deserves a structured route instead of scattered advice.
                </p>
                <p>
                  Based directly in Germany but working closely with students in India, we provide practical, step-by-step guidance that feels honest, actionable, and calm.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* MISSION STATEMENT */}
        <section className="px-4 py-12 md:px-8">
          <div className="container-narrow relative overflow-hidden rounded-[40px] border border-border/60 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-10 md:p-20 shadow-xl shadow-black/5 text-center">
            <Quote className="absolute top-8 left-8 h-24 w-24 text-primary/5 -rotate-6" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                <Globe className="h-8 w-8" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8">Official Mission</p>
              <h3 className="max-w-4xl text-2xl font-black leading-[1.4] tracking-tight text-foreground md:text-[40px]">
                "BVF Germany exists to bridge the gap between Indian students and Germany's tuition-free universities. We cut through the noise so you can <span className="text-primary">focus on your future.</span>"
              </h3>
            </div>
            <Quote className="absolute bottom-8 right-8 h-24 w-24 text-secondary/10 rotate-180" />
          </div>
        </section>

        {/* WHY GERMANY STATS */}
        <section className="px-4 py-20 md:px-8 md:py-32">
          <div className="container-narrow">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-500/10 px-5 py-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Why Germany</p>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground md:text-5xl">
                The data points that make Germany <span className="text-blue-500">stand out.</span>
              </h2>
            </div>
            
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {whyGermanyStats.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...spring, delay: index * 0.05 }}
                    className={`group relative overflow-hidden flex flex-col justify-between rounded-[32px] border border-border/60 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-black/10 ${index === 0 || index === 3 ? 'md:col-span-2' : ''}`}
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 text-gray-100">
                      <Icon className="h-32 w-32" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br transition-transform duration-500 group-hover:scale-110 ${item.theme}`}>
                        <Icon className="h-6 w-6 text-foreground/80" />
                      </div>
                      <h3 className="text-3xl font-black tracking-tight text-foreground">
                        {item.title}
                        <span className="text-lg font-bold text-muted-foreground ml-1">{item.suffix}</span>
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground font-medium">
                        {item.text}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHY BVF GERMANY */}
        <section className="px-4 py-20 md:px-8 md:py-28 relative bg-[#0a0a0a] text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888089456-11f8e87ad620?q=80&w=2070&auto=format&fit=crop')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          <div className="container-narrow position-relative z-10">
            <div className="mx-auto max-w-4xl mb-16 flex flex-col items-center text-center">
              <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 px-5 py-2 backdrop-blur-md">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2c94c]">Our Philosophy</p>
              </div>
              <h2 className="text-[32px] md:text-[54px] leading-[1.1] font-black tracking-tight text-white">
                Guidance built to <span className="text-[#f2c94c]">reduce confusion</span>, not add to it.
              </h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {differentiators.map((item, i) => (
                <motion.article 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: i * 0.1 }}
                  className="group rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md transition-all hover:bg-white/10"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-primary/20 border border-primary/30 transition-transform group-hover:scale-110">
                    <item.icon className="h-7 w-7 text-[#f2c94c]" />
                  </div>
                  <h3 className="mt-8 text-[22px] font-bold tracking-tight text-white">{item.title}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="px-4 py-24 md:px-8 md:py-32 bg-muted/20">
          <div className="container-narrow">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-16">
              <div className="max-w-2xl">
                <div className="mb-6 inline-flex items-center justify-center rounded-full bg-[#E1306C]/10 px-5 py-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E1306C]">Social Proof</p>
                </div>
                <h2 className="text-[32px] md:text-[44px] font-black tracking-tight">
                  Students and families <span className="underline decoration-[#E1306C] decoration-4 underline-offset-4">trust us</span> for honest direction.
                </h2>
              </div>
              <a href={settings?.instagramUrl || 'https://instagram.com/bvfgermany'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-[16px] bg-white px-6 py-4 shadow-sm border border-border/50 transition-all hover:scale-105 hover:shadow-md">
                <Instagram className="h-6 w-6 text-[#E1306C]" />
                <span className="text-[15px] font-bold">Follow @bvfgermany</span>
              </a>
            </div>

            {/* Testimonials Masonry / Grid */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <motion.article 
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: i * 0.1 }}
                  className="group relative flex flex-col justify-between rounded-[32px] border border-border/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:border-border"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-bold text-white text-lg shadow-inner">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-foreground">{testimonial.name}</p>
                          <p className="text-[13px] font-semibold text-primary">{testimonial.university}</p>
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-[15px] leading-relaxed text-muted-foreground">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                  
                  <div className="mt-8 border-t border-border/60 pt-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">{testimonial.result}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Platform Trust Ticker */}
            <div className="mt-20 flex flex-wrap justify-center gap-4 md:grid-cols-3">
              {[
                { icon: Users, text: '500+ students guided' },
                { icon: Instagram, text: 'As seen on Instagram' },
                { icon: Youtube, text: 'YouTube, webinars, & daily tips' },
              ].map((item, j) => (
                <div key={j} className="flex items-center gap-3 rounded-full border border-border/80 bg-white px-6 py-3 shadow-sm">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <p className="text-[13px] font-bold text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 pb-20 pt-6 md:px-8 md:pb-24">
          <div className="container-narrow rounded-[40px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-16 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:px-16 md:py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none">
              <Trophy className="h-96 w-96 text-white" />
            </div>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center relative z-10">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#f2c94c]">Final CTA</p>
                <h2 className="mt-4 font-black tracking-tight text-white text-[32px] md:text-[48px] leading-tight">
                  Start your Germany journey <br className="hidden md:block" /> with the right guidance
                </h2>
                <p className="mt-6 max-w-xl text-[16px] leading-[1.8] text-white/70">
                  If you want a tuition-free public-university path that feels structured from day one, BVF Germany can help you move forward with clarity and confidence.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/bookings" className="button-primary whitespace-nowrap shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform">
                  Book Free Consultation Now
                </Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 text-sm font-semibold text-white transition hover:bg-white hover:text-black">
                  <FaWhatsapp className="h-4 w-4" />
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
