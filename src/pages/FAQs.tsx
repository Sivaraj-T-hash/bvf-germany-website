import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useSeo } from '@/lib/useSeo';

const faqs = [
  { q: 'What is APS?', a: 'APS (Akademische Prüfstelle) is the Academic Evaluation Centre. It verifies the authenticity of your academic certificates and is mandatory for Indian students applying to German universities. The process includes document verification and a personal interview.' },
  { q: 'How long does a Germany student visa take?', a: 'The German student visa processing typically takes 4-8 weeks from the date of your appointment at the German Embassy. However, we recommend starting the process at least 3-4 months before your intended departure date.' },
  { q: 'What documents are required for studying in Germany?', a: 'Key documents include: Academic transcripts, APS certificate, German language proficiency proof (TestDaF/DSH), English language proof (IELTS/TOEFL), blocked account confirmation (€11,904/year), health insurance, passport, admission letter, and motivation letter.' },
  { q: 'When should I apply for universities in Germany?', a: 'For winter semester (October start): Apply by July 15. For summer semester (April start): Apply by January 15. We recommend starting your preparation 8-12 months before the intake.' },
  { q: 'How much money is required in a blocked account?', a: 'As of 2024, you need €11,904 in your blocked account for one year. This amounts to €992 per month that you can withdraw for living expenses. The blocked account proves you can financially support yourself during your studies.' },
  { q: 'Is studying in Germany really free?', a: 'Most public universities in Germany charge no tuition fees for undergraduate and many postgraduate programs. However, you need to pay a semester contribution (€150-350) which covers administrative fees, student union, and often a public transport ticket.' },
  { q: 'Do I need to know German to study in Germany?', a: 'It depends on your program. Many Master\'s programs are taught in English. However, for daily life and many Bachelor\'s programs, German language skills (B1-C1 level) are required. We recommend learning German regardless of your program language.' },
  { q: 'What is BVF Premium Support?', a: 'BVF Premium Support is our all-inclusive package that covers university shortlisting, application support, APS preparation, blocked account setup, visa guidance, SOP/LOR review, and pre-departure orientation — all with a dedicated mentor and 24/7 WhatsApp support.' },
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
  useSeo({
    title: 'FAQs | BVF Germany',
    description: 'Answers to common questions about APS, visas, blocked accounts, and studying in Germany.',
    url: 'https://bvf-student-support.web.app/faqs',
    image: '/hero-og.png',
  });
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
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="bg-background text-foreground px-8 py-4 rounded-[20px] font-bold inline-block hover:opacity-90 transition-opacity">
            Ask on WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
