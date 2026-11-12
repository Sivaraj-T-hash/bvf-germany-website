import { CalendarDays, CheckCircle2, ExternalLink, FileCheck2, GraduationCap, HelpCircle, ListChecks, MapPin, Scale, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import WhatsAppCta from '@/components/WhatsAppCta';
import EnquiryForm from '@/components/EnquiryForm';
import { useSeo } from '@/lib/useSeo';

/*
 * Every fact on this page comes from the official sources listed in `sources` and was checked on the date below.
 * Re-check d-mat.de and aps-india.de before each intake and update the date. Do not add fees, dates or
 * eligibility rules from unofficial sources.
 */
const CHECKED_ON = '11 November 2026';

const sources = {
  dmatIndia: 'https://www.d-mat.de/en/dmat-in-india/',
  dmatFaq: 'https://www.d-mat.de/en/faq-graduate-students-india/',
  apsDmat: 'https://aps-india.de/dmat/',
  apsFaq: 'https://aps-india.de/faqs/',
  portal: 'https://www.gast.de/portal/center-search/center-search/dmat/exams/worldwide?lang=en',
  prepPdf: 'https://www.d-mat.de/wp-content/uploads/2026/09/260902_dMAT_General-Academic-Module_Preparatoy-Materials_EN.pdf',
};

const affectedFields = [
  'B.Tech or B.Eng, regardless of specialisation, and all other engineering degrees',
  'Commerce, Accounting, Finance, Economics',
  'Business Administration or Management Studies',
  'Tourism, Travel, Hotel and Hospitality Management',
  'Integrated or dual-degree programmes where any part is in one of these fields',
];

const notAffected = [
  "Applicants for Bachelor's programmes in Germany",
  'PhD applicants',
  'Applicants whose previous degree is outside the fields listed above',
  'Officially confirmed exchange, double-degree or university partnership programmes (submit the confirmation with your APS documents)',
];

const transition = [
  'You completed online APS registration before 29 June 2026: not required, even if you send the hardcopy documents later.',
  'You shipped your APS documents before 29 June 2026: not required.',
  'You already hold an APS certificate: not required for that completed procedure.',
  'You registered and shipped documents on or after 29 June 2026, your degree is in an affected field, and your intake is summer semester 2027 or later: the dMAT certificate is required.',
];

const testCycles = [
  { cycle: 'Cycle 1', deadline: '4 January 2027', test: '16 January 2027', results: '8 February 2027' },
  { cycle: 'Cycle 2', deadline: '1 March 2027', test: '13 March 2027', results: '5 April 2027' },
];

const testCentres = ['Ahmedabad', 'Bengaluru', 'Bhopal', 'Chandigarh', 'Chennai', 'Kolkata', 'Mananthavady', 'Mumbai', 'New Delhi', 'Pune'];

const commonMistakes = [
  'Paying with a debit card: only PayPal or a Mastercard/Visa credit card with 3-D Secure is accepted.',
  'Entering a name that differs from the passport. Use your name exactly as it appears in your passport.',
  'Bringing the wrong ID. Only a valid passport is accepted.',
  'Waiting too long to book. Test centre seats are allocated on a first-come, first-served basis, and APS India cannot reserve seats.',
  'Missing the registration deadline. After it, cancellations are not refunded and absent candidates receive no certificate.',
  'Treating it as pass/fail. There is no pass mark, but universities may use your score in their own selection.',
];

const faqs = [
  {
    q: 'Is the dMAT compulsory for everyone?',
    a: "No. It is required for Indian Master's applicants whose previous degree is in one of the affected fields, for intakes from summer semester 2027, unless a transitional rule or exemption applies. Anyone else may take it voluntarily.",
  },
  {
    q: 'Is it required for all German public universities?',
    a: 'For affected applicants it is part of the APS documentation, and APS India issues the APS certificate only after the dMAT certificate has been checked. How much weight a university gives the score is decided by each university.',
  },
  {
    q: 'Is the dMAT the same as TestAS?',
    a: "No. They are separate tests. TestAS is aimed at international applicants to bachelor's programmes, while the dMAT is for Master's applicants. APS India lists them separately and states that TestAS is currently not a mandatory part of the APS procedure in India.",
  },
  {
    q: 'How many attempts are allowed?',
    a: 'g.a.s.t. states that you may take the dMAT as many times as you wish. The certificate is generally valid indefinitely, though a university you apply to directly may apply its own rules.',
  },
  {
    q: 'When should I take the exam?',
    a: 'Choose a test cycle whose results are released before you need your APS certificate. You may send your other APS documents first and submit the dMAT certificate later.',
  },
  {
    q: 'What happens after the exam?',
    a: 'Results are published in the g.a.s.t. participant portal on the release date. Download your dMAT certificate there and submit it to APS India. The result is shown on your APS certificate.',
  },
];

function SourceNote({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline">
      Source: {label} <ExternalLink className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}

function Section({ id, icon: Icon, kicker, title, children }: { id: string; icon: typeof GraduationCap; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="surface-panel scroll-mt-28 p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#132033]">
          <Icon className="h-5 w-5 text-[#facc15]" aria-hidden="true" />
        </span>
        <p className="section-kicker">{kicker}</p>
      </div>
      <h2 className="mt-4 font-heading text-3xl font-semibold text-foreground">{title}</h2>
      <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="text-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DmatPage() {
  useSeo({
    title: 'dMAT Exam for Indian Master’s Applicants | BVF Germany',
    description:
      'What the dMAT (Digital Master Test) is, who needs it for APS, test structure, scoring, registration, 2027 dates and preparation, based on official g.a.s.t. and APS India information.',
    keywords: ['dMAT exam', 'Digital Master Test', 'dMAT APS India', 'dMAT registration', 'dMAT vs TestAS'],
  });

  return (
    <div className="site-shell home-showcase">
      <Navbar />
      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <div className="poster-grid items-end">
              <div className="col-span-12 lg:col-span-8">
                <p className="eyebrow-chip">dMAT Exam</p>
                <h1 className="hero-display mt-7">The dMAT for Indian Master&apos;s applicants</h1>
                <p className="hero-copy">
                  Who needs the Digital Master Test, how it fits into your APS certificate, what the test looks like, and how to register and prepare.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#dmat-guidance" className="button-primary">Get dMAT Guidance from BVF</a>
                  <WhatsAppCta variant="outline" label="Ask about dMAT on WhatsApp" message="Hi BVF Germany, I need guidance on the dMAT exam." />
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <div className="surface-panel p-6">
                  <p className="section-kicker">Official information</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Checked against g.a.s.t. (d-mat.de) and APS India on {CHECKED_ON}. Rules, fees and dates can change, so
                    always confirm on the official pages before registering.
                  </p>
                  <nav aria-label="On this page" className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                    {[
                      ['#introduction', 'Introduction'],
                      ['#eligibility', 'Eligibility'],
                      ['#structure', 'Structure'],
                      ['#scoring', 'Scoring'],
                      ['#registration', 'Registration'],
                      ['#preparation', 'Preparation'],
                      ['#faqs', 'FAQs'],
                    ].map(([href, label]) => (
                      <a key={href} href={href} className="rounded-full bg-muted px-3 py-1.5 text-foreground hover:bg-white">{label}</a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container-narrow space-y-6 px-4 pb-16 md:px-8">
          <Section id="introduction" icon={GraduationCap} kicker="A. Introduction" title="What is the dMAT, and why is it required?">
            <p>
              The dMAT (Digital Master Test) is a standardised academic aptitude test for graduate students. It is run by g.a.s.t.
              (Gesellschaft für Akademische Studienvorbereitung und Testentwicklung e.V.), developed with the Universities of Ulm
              and Kassel, and its original development was supported by the DAAD.
            </p>
            <p>
              APS India has introduced the dMAT as an additional element of the APS documentation for Indian applicants to
              Master&apos;s programmes in Germany. It does not replace APS document verification. APS India issues the APS
              certificate only after the required dMAT certificate has been submitted and checked, and the dMAT result is shown on
              the APS certificate.
            </p>
            <p>German universities decide independently how they assess the dMAT result.</p>
            <SourceNote href={sources.apsDmat} label="APS India – dMAT" />
          </Section>

          <Section id="eligibility" icon={ListChecks} kicker="B. Eligibility" title="Who needs to take it?">
            <p className="font-semibold text-foreground">
              Indian applicants for Master&apos;s programmes in Germany, for intakes from summer semester 2027 onwards, whose previous degree is in:
            </p>
            <Bullets items={affectedFields} />
            <p className="pt-2 font-semibold text-foreground">Not affected or exempt:</p>
            <Bullets items={notAffected} />
            <p className="pt-2 font-semibold text-foreground">Transition rules (cut-off 29 June 2026):</p>
            <Bullets items={transition} />
            <p>Students outside these groups may take the dMAT voluntarily.</p>
            <SourceNote href={sources.apsDmat} label="APS India – dMAT (last updated 6 November 2026)" />
          </Section>

          <Section id="structure" icon={FileCheck2} kicker="C. Examination structure" title="What does the test look like?">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-border bg-background/70 p-5">
                <p className="font-semibold text-foreground">Core module</p>
                <p className="mt-2">Measures general cognitive and analytical skills in three subtests. The official preparation videos cover figure sequences, mathematical equations and Latin squares.</p>
              </div>
              <div className="rounded-[22px] border border-border bg-background/70 p-5">
                <p className="font-semibold text-foreground">Subject module (General Academic Module)</p>
                <p className="mt-2">Applies cognitive and analytical skills to general academic problems, with about 60 questions on average. Questions may draw on mathematics, computer science, natural sciences, engineering, business administration, economics, social sciences and humanities.</p>
              </div>
            </div>
            <Bullets
              items={[
                'Both modules are compulsory, and all participants receive the same tasks.',
                'All questions are single-choice. Each task describes a problem situation followed by related questions.',
                'The current subject modules are administered in English.',
                'The test is taken digitally at test centres designated by g.a.s.t.',
                'Test-day information is shown in your participant portal about five days before the test.',
              ]}
            />
            <SourceNote href={sources.dmatFaq} label="g.a.s.t. – dMAT FAQ for graduate students in India" />
          </Section>

          <Section id="scoring" icon={Scale} kicker="Scoring" title="How is it scored?">
            <Bullets
              items={[
                'Your certificate shows a percentile rank (the share of participants with a lower or equal result) and a dMAT score.',
                'The dMAT score converts correct answers to a scale from 0 to 200 with a mean of 100. Each module has its own score, and the overall score is the sum of both.',
                'There is no pass mark. The dMAT is not a stand-alone pass/fail test for the APS certificate, and a low score does not automatically lead to refusal of the APS certificate.',
                'Universities decide individually how to use the result.',
                'The certificate is generally valid indefinitely. A university you apply to directly may apply its own rules.',
              ]}
            />
            <SourceNote href={sources.apsFaq} label="APS India – FAQs" />
          </Section>

          <Section id="registration" icon={CalendarDays} kicker="D. Registration" title="How to register">
            <ol className="list-decimal space-y-2 pl-5 text-foreground">
              <li>
                Register online through the{' '}
                <a href={sources.portal} target="_blank" rel="noopener noreferrer" className="font-semibold text-secondary underline">g.a.s.t. dMAT portal</a>{' '}
                and choose your test centre while booking.
              </li>
              <li>Enter your name exactly as it appears in your passport and upload a passport-style photo.</li>
              <li>Pay the fee. Registration is complete only after payment and confirmation by g.a.s.t.</li>
              <li>Bring your valid passport on test day. It is the only accepted proof of identity.</li>
            </ol>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-border bg-background/70 p-5">
                <p className="font-semibold text-foreground">Fee</p>
                <p className="mt-2">€150.00 according to APS India; the exact amount is shown on the booking page.</p>
                <p className="mt-2">Payment by PayPal or Mastercard/Visa credit card with 3-D Secure. Debit cards are not accepted.</p>
              </div>
              <div className="rounded-[22px] border border-border bg-background/70 p-5">
                <p className="font-semibold text-foreground">Cancellation</p>
                <p className="mt-2">You can cancel up to the registration deadline and receive a refund minus an administrative fee of up to 15%. After the deadline there is no refund.</p>
              </div>
            </div>
            <p className="font-semibold text-foreground">2027 test dates (registration opened 28 October 2026)</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="py-2 pr-4">Cycle</th>
                    <th className="py-2 pr-4">Registration deadline</th>
                    <th className="py-2 pr-4">Test date</th>
                    <th className="py-2">Results released</th>
                  </tr>
                </thead>
                <tbody>
                  {testCycles.map((cycle) => (
                    <tr key={cycle.cycle} className="border-b border-border/60 text-foreground">
                      <td className="py-2 pr-4 font-semibold">{cycle.cycle}</td>
                      <td className="py-2 pr-4">{cycle.deadline}</td>
                      <td className="py-2 pr-4">{cycle.test}</td>
                      <td className="py-2">{cycle.results}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                Test centres in India: {testCentres.join(', ')}. Centres also exist in Berlin and Kathmandu. Seats are allocated first come, first served.
              </span>
            </p>
            <SourceNote href={sources.dmatIndia} label="g.a.s.t. – dMAT in India" />
          </Section>

          <Section id="preparation" icon={Timer} kicker="E. Preparation" title="How to prepare">
            <p>
              g.a.s.t. does not publish a syllabus. It recommends using all of its official preparation materials, because no
              further explanations are shown during the exam:
            </p>
            <Bullets
              items={[
                'The official preparation document for the General Academic Module, with sample questions.',
                'Official introduction videos for the test and for each core-module task type.',
                'A demo version in your participant portal under “Exam Preparation”.',
              ]}
            />
            <a href={sources.prepPdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline">
              Download the official preparation materials (PDF) <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <p className="pt-2 font-semibold text-foreground">Common mistakes to avoid</p>
            <Bullets items={commonMistakes} />
          </Section>

          <section id="faqs" className="surface-panel scroll-mt-28 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#132033]">
                <HelpCircle className="h-5 w-5 text-[#facc15]" aria-hidden="true" />
              </span>
              <p className="section-kicker">F. FAQs</p>
            </div>
            <div className="mt-6 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-[22px] border border-border bg-background/70 p-5">
                  <h3 className="text-base font-semibold text-foreground">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-4">
              <SourceNote href={sources.dmatFaq} label="g.a.s.t. FAQ" />
              <SourceNote href={sources.apsFaq} label="APS India FAQs" />
            </div>
          </section>

          <section id="dmat-guidance" className="scroll-mt-28 rounded-[34px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] p-6 text-white md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">BVF Germany</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold text-secondary">Get dMAT Guidance from BVF</h2>
                <p className="mt-4 text-sm leading-7 text-white/76">
                  Not sure whether the dMAT applies to you, or how to fit it into your APS and application timeline? Send us your
                  details and the BVF team will get back to you.
                </p>
                <p className="mt-4 text-sm leading-7 text-white/76">
                  Planning your APS too? See our <Link to="/services/aps-application" className="font-semibold text-white underline">APS Application support</Link>.
                </p>
              </div>
              <div className="rounded-[26px] bg-white p-6 text-foreground">
                <EnquiryForm formKey="dmat" subject="dMAT guidance enquiry" sourcePage="/dmat" messagePlaceholder="Your degree, branch and target intake (optional)" submitLabel="Request dMAT Guidance" />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
