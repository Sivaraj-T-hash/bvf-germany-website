import { useState } from 'react';
import { ArrowRight, ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface HomepageFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const homepageFaqs: HomepageFaqItem[] = [
  {
    id: 'faq-tuition',
    category: 'Tuition & Fees',
    question: 'Is higher education at German public universities really tuition-free?',
    answer:
      'Yes. Most public universities in Germany charge no tuition fees for Bachelor’s and Master’s degree programs, for both domestic and international students. Instead, students pay an official semester contribution (Semesterbeitrag) typically ranging between €150 and €350 per semester. This administrative fee covers student union services, campus facilities, and in most federal states, an unlimited regional public transportation ticket (Semesterticket).',
  },
  {
    id: 'faq-aps',
    category: 'APS & Verification',
    question: 'What is the APS Certificate, and why is it mandatory for Indian students?',
    answer:
      'The APS (Akademische Prüfstelle) certificate verifies the authenticity of your Indian educational documents and confirms your eligibility for German higher education. Issued by the German Embassy in New Delhi, an APS certificate is legally mandatory for both university applications and the German student visa appointment. Because verification timelines can take several weeks, we recommend initiating APS documentation 8 to 12 months before your intended intake.',
  },
  {
    id: 'faq-services-guidance',
    category: 'Services & Guidance',
    question: 'How does BVF Germany guide students through the admissions process?',
    answer:
      'BVF Germany provides structured mentorship across 14 specialized services in six stages—from your initial profile evaluation and university shortlist to German-format CV/SOP writing, APS guidance, visa interview file preparation, and German arrival assistance. To view complete guidance inclusions and optional add-ons, explore our dedicated Services and Pricing pages, or book a free profile consultation.',
  },
  {
    id: 'faq-language',
    category: 'Language Requirements',
    question: 'Do I need to speak fluent German to study in Germany?',
    answer:
      'Not necessarily. Germany offers hundreds of internationally recognized Master’s degree programs taught 100% in English. For these programs, proof of English proficiency (such as IELTS 6.5+ or TOEFL 90+) is sufficient for admission. However, learning conversational German (A1–B1 level) is strongly recommended for daily life, integrating into the community, and securing student working-student (Werkstudent) jobs.',
  },
  {
    id: 'faq-blocked-account',
    category: 'Finances & Visa',
    question: 'What is a Blocked Account (Sperrkonto), and how much is required?',
    answer:
      'A Blocked Account (Sperrkonto) is a special bank account required by German immigration to prove financial self-sufficiency for your student visa. As of current regulations, international students must deposit €11,904 per year (allowing a monthly withdrawal of €992 to cover rent, food, and living expenses). BVF Germany assists you in setting up approved accounts with official providers such as Expatrio or Fintiba.',
  },
  {
    id: 'faq-timeline',
    category: 'Admissions & Intakes',
    question: 'When should I start preparing for my target semester in Germany?',
    answer:
      'Germany has two primary intakes: Winter Semester (starts October, applications typically close 15 July) and Summer Semester (starts April, applications typically close 15 January). Because APS verification, document preparation (SOP, LOR, Lebenslauf CV), and university shortlisting require careful review, we recommend starting your journey 8 to 12 months ahead of your target intake.',
  },
];

export default function HomepageFaqSection({ className }: { className?: string }) {
  const [openId, setOpenId] = useState<string | null>('faq-tuition');

  const toggleAccordion = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      id="faqs"
      aria-labelledby="homepage-faqs-heading"
      className={className || 'border-b border-[#E7E5E0] bg-[#FAF8F5] px-4 py-16 md:px-8 md:py-24'}
    >
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
            <HelpCircle className="h-3.5 w-3.5 text-[#2D6A4F]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </div>

          <h2
            id="homepage-faqs-heading"
            className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[42px] leading-tight"
          >
            Clear Answers for Your Journey to Germany.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
            Practical, straightforward answers to help you understand public university admissions, APS verification, costs, timelines, and how BVF guides you.
          </p>
        </div>

        {/* Accessible Accordion List */}
        <div className="mx-auto mt-12 max-w-3xl space-y-3.5">
          {homepageFaqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const headingId = `faq-title-${faq.id}`;
            const panelId = `faq-content-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? 'border-[#2D6A4F]/40 bg-white shadow-sm'
                    : 'border-[#E7E5E0] bg-white/80 hover:border-[#CBD5E1] hover:bg-white'
                }`}
              >
                <button
                  type="button"
                  id={headingId}
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] text-xs font-bold text-[#2D6A4F] border border-[#E7E5E0]">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                        {faq.category}
                      </span>
                      <h3 className="mt-0.5 text-base font-bold text-[#0F172A] md:text-lg">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#2D6A4F] text-white' : 'bg-[#FAF8F5] text-[#64748B]'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#F1EFEA] px-5 pb-6 pt-4 md:px-6 md:pb-6">
                        <p className="text-sm leading-relaxed text-[#475569] md:text-base md:leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Statutory Note & Link to Full FAQ Hub */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#E7E5E0] bg-white p-5 md:p-6 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#64748B]">
            <ShieldCheck className="h-4 w-4 text-[#2D6A4F]" aria-hidden="true" />
            <span>Official visa requirements, blocked account minimums, and university deadlines are established by German authorities.</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-[#475569]">Have more specific questions about your background?</span>
            <Link
              to="/faqs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D6A4F] transition-colors hover:text-[#1E3A2F]"
            >
              <span>Explore all FAQs</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
