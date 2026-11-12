import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import WhatsAppCta from '@/components/WhatsAppCta';
import { Link } from 'react-router-dom';
import { useSeo } from '@/lib/useSeo';
import { subscribeToSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { buildWhatsappHref } from '@/lib/whatsapp';

const faqs = [
  { q: 'What is APS?', a: 'APS (Akademische Prüfstelle) is the Academic Evaluation Centre. It verifies the authenticity of your academic certificates and is mandatory for Indian students applying to German universities. The process includes document verification and a personal interview.' },
  { q: 'How long does a Germany student visa take?', a: 'The German student visa processing typically takes 4-8 weeks from the date of your appointment at the German Embassy. However, we recommend starting the process at least 3-4 months before your intended departure date.' },
  { q: 'What documents are required for studying in Germany?', a: 'Key documents include: Academic transcripts, APS certificate, German language proficiency proof (TestDaF/DSH), English language proof (IELTS/TOEFL), blocked account confirmation (€11,904/year), health insurance, passport, admission letter, and motivation letter.' },
  { q: 'When should I apply for universities in Germany?', a: 'Many universities use 15 July for the winter semester (October start) and 15 January for the summer semester (April start), but every programme sets its own deadline, so always check the programme page. We recommend starting your preparation 8-12 months before the intake.' },
  { q: 'What is the dMAT, and do I need it?', a: 'The dMAT (Digital Master Test) is an academic aptitude test run by g.a.s.t. It is becoming part of the APS documentation for many Indian Master\'s applicants, starting with intakes from summer semester 2027. See our dMAT page for who needs it and how to register.' },
  { q: 'How much money is required in a blocked account?', a: 'As of 2024, you need €11,904 in your blocked account for one year. This amounts to €992 per month that you can withdraw for living expenses. The blocked account proves you can financially support yourself during your studies.' },
  { q: 'Is studying in Germany really free?', a: 'Most public universities in Germany charge no tuition fees for undergraduate and many postgraduate programs. However, you need to pay a semester contribution (€150-350) which covers administrative fees, student union, and often a public transport ticket.' },
  { q: 'Do I need to know German to study in Germany?', a: 'It depends on your program. Many Master\'s programs are taught in English. However, for daily life and many Bachelor\'s programs, German language skills (B1-C1 level) are required. We recommend learning German regardless of your program language.' },
  { q: 'What does the Full Consultation Package include?', a: 'It covers university verification and shortlisting, applications (uni-assist and direct), SOP and LOR writing, visa guidance, pre-departure support, accommodation assistance, and one-to-one expert consultation. Pricing depends on your profile; see the Pricing page or book a free consultation.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors">
        <span className="font-semibold text-foreground text-sm md:text-base pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
}

export default function FAQsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  useSeo({
    title: 'FAQs | BVF Germany',
    description: 'Answers to common questions about APS, visas, blocked accounts, and studying in Germany.',
    url: '/faqs',
    image: '/hero-og.png',
  });

  useEffect(() => {
    const unsubscribe = subscribeToSiteSettings(setSettings);
    return unsubscribe;
  }, []);

  const whatsappHref = buildWhatsappHref(settings);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-hero">
        <div className="container-narrow px-4 md:px-8 text-center">
          <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">FAQs</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-4">
            Got <span className="text-gradient-primary">Questions?</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Find answers to the most common questions about studying in Germany.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow px-4 md:px-8 max-w-3xl mx-auto">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-cta">
        <div className="container-narrow px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-primary-foreground mb-4">Still Have Questions?</h2>
          <p className="text-primary-foreground/80 mb-6">Our team is here to help. Reach out to us anytime.</p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="bg-background text-foreground px-8 py-4 rounded-[20px] font-bold inline-block hover:opacity-90 transition-opacity">
            Ask on WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
