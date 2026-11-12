import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Landmark,
  Send,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { hasNewUserReviewAccess } from '@/lib/authSession';
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_URL, type StructuredData } from '@/lib/seo';
import { getSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { useSeo } from '@/lib/useSeo';
import { createLeadRecord } from '@/lib/leadStore';
import { buildWhatsappHref } from '@/lib/whatsapp';

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const leadSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  website: z.string().optional(),
});

type LeadForm = z.infer<typeof leadSchema>;
type EligibilityStatus = 'Eligible' | 'Conditionally Eligible' | 'Needs More Funds' | 'Missing Documents' | 'Not Eligible';
type CountryRule = {
  name: string;
  currency: string;
  disclaimer: string;
  livingCosts: Record<string, { label: string; amount: number }>;
  courses: Record<string, { minOverall: number; minSection: number; saferOverall: number; note: string }>;
  bank: {
    maintenanceDays: number;
    acceptedInstitutions: string[];
    acceptedDocuments: string[];
    weakDocuments: string[];
  };
};

const countryRules: Record<string, CountryRule> = {
  germany: {
    name: 'Germany',
    currency: 'EUR',
    disclaimer: 'Guidance only. Final outcomes depend on official university, APS, embassy, and immigration rules.',
    livingCosts: {
      metro: { label: 'Berlin / Munich / Hamburg', amount: 13400 },
      standard: { label: 'Standard student city', amount: 12200 },
      value: { label: 'Lower-cost regional city', amount: 11400 },
    },
    courses: {
      "Bachelor's": { minOverall: 6.0, minSection: 5.5, saferOverall: 6.5, note: 'Useful for bachelor admissions and route-screening.' },
      "Master's": { minOverall: 6.5, minSection: 6.0, saferOverall: 7.0, note: 'Common benchmark for English-taught master’s programmes.' },
      MBA: { minOverall: 6.5, minSection: 6.0, saferOverall: 7.0, note: 'MBA routes often expect stronger writing and speaking.' },
      Ausbildung: { minOverall: 5.5, minSection: 5.5, saferOverall: 6.0, note: 'English can help, but German readiness often matters as much.' },
    },
    bank: {
      maintenanceDays: 28,
      acceptedInstitutions: ['Nationalized', 'Private', 'International', 'Cooperative'],
      acceptedDocuments: ['Bank statement', 'Bank letter', 'Fixed deposit certificate', 'Loan sanction letter'],
      weakDocuments: ['Balance certificate'],
    },
  },
  uk: {
    name: 'United Kingdom',
    currency: 'GBP',
    disclaimer: 'Guidance only. UK financial and language rules can change by institution and CAS status.',
    livingCosts: {
      london: { label: 'London', amount: 13347 },
      metro: { label: 'Major city outside London', amount: 11000 },
      standard: { label: 'Standard regional city', amount: 9207 },
    },
    courses: {
      "Bachelor's": { minOverall: 6.0, minSection: 5.5, saferOverall: 6.5, note: 'Typical undergraduate English benchmark.' },
      "Master's": { minOverall: 6.5, minSection: 6.0, saferOverall: 7.0, note: 'Many taught master’s routes use section minimums.' },
      MBA: { minOverall: 6.5, minSection: 6.0, saferOverall: 7.0, note: 'MBA routes reward stronger communication-heavy profiles.' },
      Ausbildung: { minOverall: 5.5, minSection: 5.5, saferOverall: 6.0, note: 'Included for comparison planning only.' },
    },
    bank: {
      maintenanceDays: 28,
      acceptedInstitutions: ['Nationalized', 'Private', 'International'],
      acceptedDocuments: ['Bank statement', 'Bank letter', 'Loan sanction letter'],
      weakDocuments: ['Balance certificate', 'Fixed deposit certificate'],
    },
  },
  canada: {
    name: 'Canada',
    currency: 'CAD',
    disclaimer: 'Guidance only. Study permit funds and language checks vary by institution, province, and document type.',
    livingCosts: {
      metro: { label: 'Toronto / Vancouver', amount: 22000 },
      major: { label: 'Other major metro', amount: 19000 },
      standard: { label: 'Standard student city', amount: 16000 },
    },
    courses: {
      "Bachelor's": { minOverall: 6.0, minSection: 5.5, saferOverall: 6.5, note: 'Common baseline for undergraduate routes.' },
      "Master's": { minOverall: 6.5, minSection: 6.0, saferOverall: 7.0, note: 'Typical benchmark for university master’s programmes.' },
      MBA: { minOverall: 6.5, minSection: 6.0, saferOverall: 7.0, note: 'MBA routes usually prefer stronger writing and speaking.' },
      Ausbildung: { minOverall: 5.5, minSection: 5.5, saferOverall: 6.0, note: 'Included only for route comparison.' },
    },
    bank: {
      maintenanceDays: 120,
      acceptedInstitutions: ['Nationalized', 'Private', 'International'],
      acceptedDocuments: ['Bank statement', 'Bank letter', 'Loan sanction letter', 'Fixed deposit certificate'],
      weakDocuments: ['Balance certificate'],
    },
  },
};

const wizardSteps = ['Profile and destination', 'IELTS score input', 'Tuition and funding', 'Bank and sponsor details', 'Eligibility result and action plan'];
const fundingSources = ['Self-funding', 'Parent sponsorship', 'Guardian sponsorship', 'Third-party sponsor', 'Education loan'];
const accountOwners = ['Self', 'Parent', 'Guardian', 'Sponsor', 'Joint'];
const institutionTypes = ['Nationalized', 'Private', 'International', 'Cooperative', 'Fintech wallet'];
const documentTypes = ['Bank statement', 'Bank letter', 'Balance certificate', 'Fixed deposit certificate', 'Loan sanction letter'];
const ownerRules: Record<string, string[]> = {
  'Self-funding': ['Self', 'Joint'],
  'Parent sponsorship': ['Parent', 'Joint'],
  'Guardian sponsorship': ['Guardian', 'Joint'],
  'Third-party sponsor': ['Sponsor', 'Joint'],
  'Education loan': ['Self', 'Parent', 'Joint'],
};

type ToolVariant = 'hub' | 'cgpa' | 'ielts';
type ToolExplainer = { title: string; body: string };
type ToolFaq = { question: string; answer: string };
type ToolPageContent = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  heroEyebrow: string;
  heroTitle: string;
  heroCopy: string;
  sideTitle: string;
  sideCopy: string;
  explainerTitle: string;
  explainers: ToolExplainer[];
  faqTitle: string;
  faqs: ToolFaq[];
};

const toolDirectoryLinks = [
  { to: '/tools', label: 'All tools hub' },
  { to: '/tools/cgpa-to-german-grade-converter', label: 'CGPA to German Grade Converter' },
  { to: '/tools/ielts-bank-requirements-checker', label: 'IELTS Bank Requirements Checker' },
];

const toolPageContent: Record<ToolVariant, ToolPageContent> = {
  hub: {
    path: '/tools',
    title: 'Free Study Abroad Tools | CGPA to German Grade Converter & IELTS Bank Requirements Checker | BVF Germany',
    description:
      'Use BVF Germany free tools to convert CGPA to German grade, check IELTS and bank fund readiness, and plan your next study-abroad step.',
    keywords: [
      'free study abroad tools',
      'CGPA to German Grade Converter',
      'IELTS Bank Requirements Checker',
      'German grade calculator',
      'study abroad funds checker',
    ],
    heroEyebrow: 'Free Tools',
    heroTitle: 'CGPA to German Grade Converter and IELTS Bank Requirements Checker',
    heroCopy:
      'Use these free BVF Germany tools to estimate your German grade, review IELTS and funding readiness, and move into shortlisting or visa planning with more clarity.',
    sideTitle: 'Built for real planning',
    sideCopy:
      'Students usually use the CGPA to German Grade Converter first, then move into the IELTS Bank Requirements Checker to review language, tuition, funds, and document strength in one flow.',
    explainerTitle: 'Why these tools work well together',
    explainers: [
      {
        title: 'Start with academics',
        body: 'The CGPA to German Grade Converter gives you a fast academic benchmark before you shortlist public universities or compare programme fit.',
      },
      {
        title: 'Then test your funding story',
        body: 'The IELTS Bank Requirements Checker combines IELTS scores, sponsor fit, living-cost estimates, and bank evidence so you can spot gaps early.',
      },
      {
        title: 'Move from score to action',
        body: 'Both tools are designed to push you toward the next move: refine the shortlist, improve language scores, fix fund gaps, or book a counselor review.',
      },
    ],
    faqTitle: 'Common questions about these Germany-study tools',
    faqs: [
      {
        question: 'Which tool should I use first?',
        answer:
          'Most students start with the CGPA to German Grade Converter to benchmark academics, then use the IELTS Bank Requirements Checker to review language and funding readiness.',
      },
      {
        question: 'Are these tools only for Germany?',
        answer:
          'The CGPA converter is Germany-focused, while the IELTS and bank checker currently supports Germany, the UK, and Canada for planning comparisons.',
      },
      {
        question: 'Do these tools guarantee admission or visa approval?',
        answer:
          'No. They are guidance tools that highlight profile, IELTS, funding, and document gaps before you move into expert review.',
      },
      {
        question: 'Can I share these tools with parents or sponsors?',
        answer:
          'Yes. The funding and bank checker is especially useful when students and sponsors need one simple place to review balance, maintenance, and document strength together.',
      },
    ],
  },
  cgpa: {
    path: '/tools/cgpa-to-german-grade-converter',
    title: 'CGPA to German Grade Converter | Bavarian Formula Calculator | BVF Germany',
    description:
      "Convert CGPA to German grade online with BVF Germany's free Bavarian formula calculator for Germany admissions shortlisting and profile evaluation.",
    keywords: ['CGPA to German Grade Converter', 'Bavarian formula calculator', 'German grade calculator', 'convert CGPA to German grade'],
    heroEyebrow: 'CGPA Tool',
    heroTitle: 'CGPA to German Grade Converter',
    heroCopy:
      'Convert your CGPA into an estimated German grade using the modified Bavarian formula that many students use while comparing Germany admissions options.',
    sideTitle: 'Best used for',
    sideCopy:
      'Academic shortlisting, profile verification, and quick comparisons between Indian CGPA systems and the German grading scale before you speak with a counselor.',
    explainerTitle: 'How this CGPA to German Grade Converter helps',
    explainers: [
      {
        title: 'Uses the modified Bavarian formula',
        body: 'The calculator uses a widely referenced conversion approach to estimate how your CGPA may look in the German grading system.',
      },
      {
        title: 'Helps you read the score faster',
        body: 'The result is paired with a simple quality band so you can quickly tell whether the number looks excellent, good, average, or needs more support.',
      },
      {
        title: 'Connects the score to the next step',
        body: 'Once you have the estimate, you can move into shortlist planning, profile verification, or use the funding checker to review the rest of the journey.',
      },
    ],
    faqTitle: 'Questions about the CGPA to German Grade Converter',
    faqs: [
      {
        question: 'What formula does this CGPA to German Grade Converter use?',
        answer:
          'It uses the modified Bavarian formula to estimate a German grade from your CGPA and maximum scale.',
      },
      {
        question: 'Is the converted grade always the final official grade?',
        answer:
          'No. Universities can evaluate transcripts differently, so this tool should be used as a planning estimate rather than a guaranteed official conversion.',
      },
      {
        question: 'Who should use this German grade calculator?',
        answer:
          'Students comparing bachelor, master, MBA, or public university routes in Germany can use it to benchmark academic fit before shortlisting.',
      },
      {
        question: 'Can I use this tool with CGPA scales other than 10?',
        answer:
          'Yes. Enter your CGPA and the maximum CGPA scale so the formula can estimate the corresponding German grade.',
      },
    ],
  },
  ielts: {
    path: '/tools/ielts-bank-requirements-checker',
    title: 'IELTS Bank Requirements Checker | Study Abroad Funds & IELTS Tool | BVF Germany',
    description:
      "Check IELTS scores, tuition, bank balance, sponsor details, and funding readiness with BVF Germany's free IELTS Bank Requirements Checker.",
    keywords: ['IELTS Bank Requirements Checker', 'IELTS bank checker', 'study abroad funds checker', 'IELTS eligibility tool'],
    heroEyebrow: 'IELTS & Funding Tool',
    heroTitle: 'IELTS Bank Requirements Checker',
    heroCopy:
      'Review IELTS score thresholds, tuition balance, sponsor fit, maintenance period, and bank-document strength before you move into admission or visa filing.',
    sideTitle: 'What it reviews',
    sideCopy:
      'The checker combines IELTS readiness with bank-fund planning, sponsor ownership, document quality, and destination-specific rules so you can see the real gap instead of a single score.',
    explainerTitle: 'What the IELTS Bank Requirements Checker reviews',
    explainers: [
      {
        title: 'Language thresholds',
        body: 'The tool compares your IELTS overall and section scores with route-based thresholds so you can see whether the gap is language-based or not.',
      },
      {
        title: 'Tuition and living-cost math',
        body: 'It adds remaining tuition to estimated living costs so you can see the practical fund target before a counselor review.',
      },
      {
        title: 'Banking and document strength',
        body: 'Maintenance days, account owner, institution type, and document selection are checked separately because many students miss the risk in those details.',
      },
    ],
    faqTitle: 'Questions about the IELTS Bank Requirements Checker',
    faqs: [
      {
        question: 'Does the IELTS Bank Requirements Checker guarantee visa approval?',
        answer:
          'No. It is a planning tool that helps you identify score, funds, or document gaps before an official university, embassy, or visa review.',
      },
      {
        question: 'Which countries are supported in the checker right now?',
        answer:
          'The current guided checker supports Germany, the UK, and Canada for first-pass planning.',
      },
      {
        question: 'Can parents or guardians sponsor the funds checked here?',
        answer:
          'Yes. The tool supports self-funding, parent sponsorship, guardian sponsorship, third-party sponsors, and education-loan routes.',
      },
      {
        question: 'What documents are usually stronger for bank proof?',
        answer:
          'Formal bank statements, bank letters, fixed deposit certificates, and loan sanction letters are generally stronger than simple balance certificates.',
      },
    ],
  },
};

function convertToGermanGrade(cgpa: number, max: number, pass = 4) {
  return (1 + (3 * (max - cgpa)) / (max - pass)).toFixed(2);
}

function getGradeMeaning(grade: number) {
  if (grade <= 1.5) return 'Excellent';
  if (grade <= 2.5) return 'Good';
  if (grade <= 3.5) return 'Average';
  return 'Needs stronger support';
}

function clampBand(score: number) {
  return Math.max(0, Math.min(9, score));
}

function calculateOverall(scores: number[]) {
  return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 2) / 2;
}

function money(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Math.max(0, amount));
}

function statusTone(status: EligibilityStatus) {
  if (status === 'Eligible') return 'bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/20';
  if (status === 'Conditionally Eligible') return 'bg-amber-500/12 text-amber-700 ring-1 ring-amber-500/20';
  if (status === 'Needs More Funds') return 'bg-orange-500/12 text-orange-700 ring-1 ring-orange-500/20';
  if (status === 'Missing Documents') return 'bg-sky-500/12 text-sky-700 ring-1 ring-sky-500/20';
  return 'bg-rose-500/12 text-rose-700 ring-1 ring-rose-500/20';
}

function buildToolStructuredData(variant: ToolVariant, page: ToolPageContent): StructuredData[] {
  const pageUrl = `${SITE_URL}${page.path}`;
  const basePage: StructuredData = {
    '@context': 'https://schema.org',
    '@type': variant === 'hub' ? 'CollectionPage' : 'WebPage',
    name: page.heroTitle,
    description: page.description,
    url: pageUrl,
    inLanguage: 'en-IN',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`,
    },
    keywords: page.keywords.join(', '),
  };

  if (variant === 'hub') {
    return [
      {
        ...basePage,
        mainEntity: {
          '@type': 'ItemList',
          name: 'BVF Germany free study abroad tools',
          itemListElement: toolDirectoryLinks.slice(1).map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            url: `${SITE_URL}${item.to}`,
          })),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Free Study Abroad Tools',
            item: pageUrl,
          },
        ],
      },
    ];
  }

  return [
    {
      ...basePage,
      mainEntity: {
        '@type': 'WebApplication',
        name: page.heroTitle,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: 0,
          priceCurrency: 'USD',
        },
        url: pageUrl,
        description: page.description,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Free Study Abroad Tools',
          item: `${SITE_URL}/tools`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.heroTitle,
          item: pageUrl,
        },
      ],
    },
  ];
}

// ─── German Grade Calculator ──────────────────────────────────────────────────
function GermanGradeCalculator() {
  const [score, setScore] = useState('');
  const [max, setMax] = useState('10');
  const [min, setMin] = useState('4');
  const [result, setResult] = useState<{ grade: string; label: string } | null>(null);
  const [error, setError] = useState('');

  function calculate() {
    const s = parseFloat(score);
    const mx = parseFloat(max);
    const mn = parseFloat(min);
    if (isNaN(s) || isNaN(mx) || isNaN(mn)) { setError('Please fill in all fields with valid numbers.'); setResult(null); return; }
    if (mx <= mn) { setError('Max must be greater than Min passing grade.'); setResult(null); return; }
    if (s > mx || s < mn) { setError('Your score must be between Min and Max.'); setResult(null); return; }
    setError('');
    const g = 1 + 3 * (mx - s) / (mx - mn);
    const clamped = Math.max(1, Math.min(4, g));
    const label = clamped <= 1.5 ? 'Sehr gut (Excellent)' : clamped <= 2.5 ? 'Gut (Good)' : clamped <= 3.5 ? 'Befriedigend (Satisfactory)' : 'Ausreichend (Sufficient)';
    setResult({ grade: clamped.toFixed(2), label });
  }

  const inputCls = 'w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white text-slate-900 text-sm placeholder-slate-400';
  const labelCls = 'block text-sm font-semibold text-slate-700 mb-2';

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-3">
          <Calculator className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">German Grade Calculator</h2>
        <p className="text-slate-500 text-sm">Convert GPA / Percentage to German scale (Modified Bavarian)</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-md transition-all flex-1 flex flex-col">
        <div className="space-y-5">
          <div>
            <label className={labelCls}>
              Your Score <span className="font-normal text-slate-400 text-xs">(e.g. 8.0 or 80)</span>
            </label>
            <input id="german-score" type="number" min="0" step="0.1" value={score}
              onChange={(e) => setScore(e.target.value)} className={inputCls} placeholder="e.g. 8.0 or 80" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Max Score <span className="block font-normal text-slate-400 text-xs">Best possible</span></label>
              <input id="german-max" type="number" value={max} onChange={(e) => setMax(e.target.value)} className={inputCls} placeholder="e.g. 10 or 100" />
            </div>
            <div>
              <label className={labelCls}>Min Passing <span className="block font-normal text-slate-400 text-xs">Typically 4/10 in India</span></label>
              <input id="german-min" type="number" value={min} onChange={(e) => setMin(e.target.value)} className={inputCls} placeholder="e.g. 4 or 40" />
            </div>
          </div>
        </div>

        {error ? <div className="mt-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">{error}</div> : null}

        <button id="german-calculate-btn" onClick={calculate}
          className="w-full mt-6 bg-primary hover:opacity-90 text-white font-semibold py-3.5 px-6 rounded-xl shadow-sm transition-all text-sm uppercase tracking-widest">
          Convert to German Grade
        </button>

        {result ? (
          <div className="mt-6 p-6 rounded-2xl bg-[linear-gradient(160deg,rgba(10,18,37,1),rgba(23,42,77,0.96))] text-white">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55 mb-2">Your German Grade</p>
              <p className="text-5xl font-black text-secondary mb-2">{result.grade}</p>
              <p className="text-base font-semibold text-white/90 mb-3">{result.label}</p>
              <p className="text-xs text-white/50">Formula: 1 + 3 × (Max − Score) / (Max − Min)</p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-4 gap-2 text-center">
          {[
            { range: '1.0–1.5', label: 'Sehr gut', color: 'bg-emerald-50 border border-emerald-200 text-emerald-700' },
            { range: '1.6–2.5', label: 'Gut', color: 'bg-blue-50 border border-blue-200 text-blue-700' },
            { range: '2.6–3.5', label: 'Befriedigend', color: 'bg-amber-50 border border-amber-200 text-amber-700' },
            { range: '3.6–4.0', label: 'Ausreichend', color: 'bg-slate-50 border border-slate-200 text-slate-600' },
          ].map((item) => (
            <div key={item.range} className={`rounded-xl p-2 ${item.color}`}>
              <p className="text-[11px] font-bold">{item.range}</p>
              <p className="text-[10px] mt-0.5 opacity-80">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-800">💡 Don&apos;t convert unless required. Use original scale + percentile in your SOP and LORs.</p>
        </div>
      </div>
    </div>
  );
}

// ─── IELTS Overall Band Calculator ────────────────────────────────────────────
const IELTS_DESCS: Record<number, string> = {
  9: 'Expert User', 8.5: 'Very Good User', 8: 'Very Good User', 7.5: 'Good User',
  7: 'Good User', 6.5: 'Competent User', 6: 'Competent User', 5.5: 'Modest User',
  5: 'Modest User', 4.5: 'Limited User', 4: 'Limited User',
};

function computeIELTSOverall(l: number, r: number, w: number, s: number): number {
  const avg = (l + r + w + s) / 4;
  const frac = avg % 1;
  if (frac <= 0.25) return Math.floor(avg);
  if (frac < 0.75) return Math.round(avg * 2) / 2;
  return Math.ceil(avg);
}

function IELTSBandCalculator() {
  const [vals, setVals] = useState({ listening: '', reading: '', writing: '', speaking: '' });
  const [result, setResult] = useState<{ overall: number; avg: number; desc: string } | null>(null);
  const [error, setError] = useState('');

  function calculate() {
    const scores = [parseFloat(vals.listening), parseFloat(vals.reading), parseFloat(vals.writing), parseFloat(vals.speaking)];
    if (scores.some(isNaN)) { setError('Please enter all four band scores.'); setResult(null); return; }
    if (scores.some((v) => v < 0 || v > 9)) { setError('All scores must be between 0 and 9.'); setResult(null); return; }
    setError('');
    const avg = scores.reduce((a, b) => a + b, 0) / 4;
    const overall = computeIELTSOverall(scores[0], scores[1], scores[2], scores[3]);
    const desc = IELTS_DESCS[overall] ?? 'User';
    setResult({ overall, avg, desc });
  }

  const inputCls = 'w-full px-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white text-slate-900 text-sm placeholder-slate-400 text-center font-bold text-lg';
  const modules: Array<{ key: keyof typeof vals; label: string }> = [
    { key: 'listening', label: 'Listening' },
    { key: 'reading', label: 'Reading' },
    { key: 'writing', label: 'Writing' },
    { key: 'speaking', label: 'Speaking' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 mb-3">
          <GraduationCap className="h-6 w-6 text-emerald-600" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">IELTS Overall Band Calculator</h2>
        <p className="text-slate-500 text-sm">Enter your module scores (0–9) for official average</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-md transition-all flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-5">
          {modules.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">{label}</label>
              <input
                id={`ielts-${key}`}
                type="number"
                min="0"
                max="9"
                step="0.5"
                value={vals[key]}
                onChange={(e) => setVals((prev) => ({ ...prev, [key]: e.target.value }))}
                className={inputCls}
                placeholder="0–9"
              />
            </div>
          ))}
        </div>

        {error ? <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">{error}</div> : null}

        <button id="ielts-calculate-btn" onClick={calculate}
          className="w-full bg-gradient-to-r from-emerald-500 to-primary hover:opacity-90 text-white font-semibold py-3.5 px-6 rounded-xl shadow-sm transition-all text-sm uppercase tracking-widest">
          Calculate Overall Band
        </button>

        {result ? (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 mb-2">Overall Band Score</p>
              <p className="text-6xl font-black bg-gradient-to-r from-emerald-600 to-primary bg-clip-text text-transparent mb-2">
                {result.overall.toFixed(1)}
              </p>
              <p className="text-lg font-bold text-slate-800 mb-4">{result.desc}</p>
              <div className="flex justify-center gap-6 text-sm text-slate-500">
                <span>Raw avg: <strong className="text-slate-700">{result.avg.toFixed(3)}</strong></span>
                <span>Rounded: <strong className="text-slate-700">{result.overall.toFixed(1)}</strong></span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <strong className="text-slate-800">6.5 / 6.5 / 5.0 / 7.0</strong><br />Avg 6.25 → <strong className="text-emerald-700">6.5</strong>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <strong className="text-slate-800">6 / 7 / 8 / 8</strong><br />Avg 7.25 → <strong className="text-emerald-700">7.5</strong>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs text-blue-800">📐 <strong>Official rounding:</strong> ≤.25 → round down &nbsp;|&nbsp; .26–.74 → nearest .5 &nbsp;|&nbsp; ≥.75 → round up</p>
        </div>
      </div>
    </div>
  );
}

export default function FreeToolsPage() {
  const location = useLocation();
  const activeTool: ToolVariant = location.pathname.includes('/tools/cgpa-to-german-grade-converter')
    ? 'cgpa'
    : location.pathname.includes('/tools/ielts-bank-requirements-checker')
      ? 'ielts'
      : 'hub';
  const currentPage = toolPageContent[activeTool];

  useSeo({
    title: currentPage.title,
    description: currentPage.description,
    url: `${SITE_URL}${currentPage.path}`,
    image: DEFAULT_OG_IMAGE_PATH,
    keywords: currentPage.keywords,
    structuredData: buildToolStructuredData(activeTool, currentPage),
  });

  const { user } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [cgpa, setCgpa] = useState('8.2');
  const [maxCgpa, setMaxCgpa] = useState('10');
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('germany');
  const [visaType, setVisaType] = useState('Student Visa');
  const [courseLevel, setCourseLevel] = useState("Master's");
  const [intake, setIntake] = useState('Fall 2026');
  const [listening, setListening] = useState('6.5');
  const [reading, setReading] = useState('6.0');
  const [writing, setWriting] = useState('6.0');
  const [speaking, setSpeaking] = useState('6.5');
  const [region, setRegion] = useState('standard');
  const [tuitionFee, setTuitionFee] = useState('12000');
  const [tuitionPaid, setTuitionPaid] = useState('2000');
  const [fundingSource, setFundingSource] = useState('Parent sponsorship');
  const [bankBalance, setBankBalance] = useState('14000');
  const [maintenanceDays, setMaintenanceDays] = useState('30');
  const [accountOwner, setAccountOwner] = useState('Parent');
  const [documentType, setDocumentType] = useState('Bank statement');
  const [institutionType, setInstitutionType] = useState('Nationalized');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadForm>({ resolver: zodResolver(leadSchema) });

  const canViewReviewResult = Boolean(user) && hasNewUserReviewAccess();
  const maxAssessmentStep = canViewReviewResult ? 5 : 4;
  const visibleWizardSteps = canViewReviewResult ? wizardSteps : wizardSteps.slice(0, 4);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const siteSettings = await getSiteSettings();
      if (active) setSettings(siteSettings);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (step > maxAssessmentStep) {
      setStep(maxAssessmentStep);
    }
  }, [maxAssessmentStep, step]);

  const selectedCountry = countryRules[country];
  const selectedCourse = selectedCountry.courses[courseLevel];
  const selectedRegion = selectedCountry.livingCosts[region];

  const germanGrade = useMemo(() => {
    const value = Number(cgpa);
    const maxValue = Number(maxCgpa);
    if (!value || !maxValue || value > maxValue || maxValue <= 4) return null;
    const converted = Number(convertToGermanGrade(value, maxValue, 4));
    return { value: Math.max(1, Math.min(4, converted)), meaning: getGradeMeaning(converted) };
  }, [cgpa, maxCgpa]);

  const report = useMemo(() => {
    const scores = [listening, reading, writing, speaking].map((value) => clampBand(Number(value) || 0));
    const overall = calculateOverall(scores);
    const weakest = Math.min(...scores);
    const tuition = Math.max(0, Number(tuitionFee) || 0);
    const paid = Math.max(0, Math.min(tuition, Number(tuitionPaid) || 0));
    const remainingTuition = Math.max(0, tuition - paid);
    const requiredFunds = remainingTuition + selectedRegion.amount;
    const availableFunds = Math.max(0, Number(bankBalance) || 0);
    const fundsGap = Math.max(0, requiredFunds - availableFunds);
    const maintenance = Math.max(0, Number(maintenanceDays) || 0);
    const maintenanceGap = Math.max(0, selectedCountry.bank.maintenanceDays - maintenance);
    const acceptedOwner = ownerRules[fundingSource]?.includes(accountOwner) ?? false;
    const acceptedInstitution = selectedCountry.bank.acceptedInstitutions.includes(institutionType);
    const acceptedDocument = selectedCountry.bank.acceptedDocuments.includes(documentType);
    const weakDocument = selectedCountry.bank.weakDocuments.includes(documentType);
    const missing: string[] = [];
    const risks: string[] = [];
    const actions: string[] = [];
    const checklist: string[] = [];

    if (overall < selectedCourse.minOverall) {
      missing.push(`Overall IELTS is below the ${selectedCourse.minOverall.toFixed(1)} requirement.`);
      actions.push(`Raise your overall band by ${(selectedCourse.minOverall - overall).toFixed(1)} before treating this route as ready.`);
    } else {
      checklist.push(`Overall IELTS meets the ${selectedCourse.minOverall.toFixed(1)} minimum.`);
    }

    if (weakest < selectedCourse.minSection) {
      missing.push(`At least one IELTS module is below the ${selectedCourse.minSection.toFixed(1)} section minimum.`);
      actions.push(`Retake or improve your weakest module until every section reaches ${selectedCourse.minSection.toFixed(1)}.`);
    } else {
      checklist.push(`All IELTS sections meet the ${selectedCourse.minSection.toFixed(1)} minimum.`);
    }

    if (fundsGap > 0) {
      missing.push(`Available funds are short by ${money(fundsGap, selectedCountry.currency)}.`);
      actions.push(`Add or maintain at least ${money(fundsGap, selectedCountry.currency)} more before final review.`);
    } else {
      checklist.push(`Available balance covers the estimated requirement of ${money(requiredFunds, selectedCountry.currency)}.`);
    }

    if (maintenanceGap > 0) {
      risks.push(`Funds have been maintained for ${maintenance} days instead of ${selectedCountry.bank.maintenanceDays} days.`);
      actions.push(`Maintain funds for at least ${maintenanceGap} more days.`);
    } else {
      checklist.push(`Maintenance period meets the ${selectedCountry.bank.maintenanceDays}-day baseline.`);
    }

    if (!acceptedOwner) {
      missing.push(`Account ownership does not match the selected funding source (${fundingSource}).`);
      actions.push(`Use an account owned by ${ownerRules[fundingSource].join(' or ')} or update the funding source.`);
    } else if (fundingSource !== 'Self-funding' && fundingSource !== 'Education loan') {
      risks.push('Relationship proof and sponsor consent are usually required for this funding route.');
      actions.push('Keep relationship proof and sponsor authorization ready.');
    }

    if (!acceptedInstitution) {
      missing.push(`${institutionType} institutions are weak for primary visa-fund proof.`);
      actions.push('Move funds to a regulated bank account with formal statement history.');
    } else if (institutionType === 'Cooperative') {
      risks.push('Cooperative banks can require extra scrutiny.');
      actions.push('Keep additional bank verification documents ready.');
    } else {
      checklist.push(`${institutionType} banking is acceptable for this first-pass check.`);
    }

    if (!acceptedDocument) {
      missing.push(`${documentType} is not treated as a strong primary evidence format here.`);
      actions.push(`Use one of: ${selectedCountry.bank.acceptedDocuments.join(', ')}.`);
    } else if (weakDocument) {
      risks.push(`${documentType} may need stronger supporting evidence.`);
      actions.push('Pair it with a detailed bank statement or official bank letter.');
    } else {
      checklist.push(`${documentType} is acceptable for this route.`);
    }

    if (fundingSource === 'Education loan' && documentType !== 'Loan sanction letter') {
      missing.push('Loan-based cases usually need a loan sanction letter.');
      actions.push('Upload or collect the formal education-loan sanction letter.');
    }

    let status: EligibilityStatus = 'Eligible';
    const severeLanguage = overall < selectedCourse.minOverall - 1 || weakest < selectedCourse.minSection - 1;
    if (severeLanguage || !acceptedOwner || !acceptedInstitution) status = 'Not Eligible';
    else if (fundsGap > 0) status = 'Needs More Funds';
    else if (!acceptedDocument || (fundingSource === 'Education loan' && documentType !== 'Loan sanction letter')) status = 'Missing Documents';
    else if (missing.length > 0 || risks.length > 0) status = 'Conditionally Eligible';

    if (actions.length === 0) {
      actions.push('Book a counselor review to validate this route and finalize the shortlist and document pack.');
    }

    return { overall, weakest, remainingTuition, requiredFunds, availableFunds, status, missing, risks, actions, checklist };
  }, [
    accountOwner,
    bankBalance,
    documentType,
    fundingSource,
    institutionType,
    listening,
    maintenanceDays,
    reading,
    selectedCountry,
    selectedCourse,
    selectedRegion.amount,
    speaking,
    tuitionFee,
    tuitionPaid,
    writing,
  ]);

  const whatsappHref = buildWhatsappHref(settings);

  const onSubmit = async (data: LeadForm & { website?: string }) => {
    try {
      if (data.website) {
        setSubmitError('Submission failed. Please try again.');
        return;
      }
      await createLeadRecord({
        source: 'tool',
        sourcePage: location.pathname,
        name: 'Tool Lead',
        email: data.email,
        phone: '',
        subject: 'Free profile evaluation request',
        message: 'Requested FREE Profile Evaluation Report from Tools page.',
        metadata: { toolsUsed: 'cgpa-converter,ielts-bank-checker' },
      });
      setSubmitted(true);
      setSubmitError('');
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to save tool lead:', error);
      setSubmitError('Submission failed. Please try again later.');
    }
  };

  return (
    <div className="site-shell home-showcase">
      <Navbar />
      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <div className="poster-grid items-end">
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="col-span-12 lg:col-span-8">
                <p className="eyebrow-chip">{currentPage.heroEyebrow}</p>
                <h1 className="hero-display mt-7">{currentPage.heroTitle}</h1>
                <p className="hero-copy">{currentPage.heroCopy}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {toolDirectoryLinks.map((item) => {
                    const isActive = item.to === currentPage.path;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                          isActive ? 'bg-primary text-white' : 'bg-white text-foreground ring-1 ring-border hover:bg-[#fff8ee]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.06 }} className="col-span-12 lg:col-span-4">
                <div className="surface-panel p-6">
                  <p className="section-kicker">{currentPage.sideTitle}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{currentPage.sideCopy}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center rounded-full bg-primary-50 border border-primary-400/20 px-4 py-1.5 mb-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-500">Free Calculators</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-3">Study Abroad Calculators</h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm">Accurate tools to help you plan your Germany application — no signup needed.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">

              {/* ── German Grade Calculator ─────────────────────────────── */}
              <motion.article
                id="german-grade-calculator"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={spring}
              >
                <GermanGradeCalculator />
              </motion.article>

              {/* ── IELTS Overall Band Calculator ───────────────────────── */}
              <motion.article
                id="ielts-band-calculator"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...spring, delay: 0.06 }}
              >
                <IELTSBandCalculator />
              </motion.article>

            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-24 bg-gradient-to-b from-transparent to-muted/20">
          <div className="container-narrow">
            
            {/* Tool Guide Component */}
            <div className="mb-24">
              <div className="max-w-3xl mb-12">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 border border-primary/20">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Tool Guide</p>
                </div>
                <h2 className="text-[32px] md:text-[44px] font-black tracking-tight text-foreground leading-[1.1]">{currentPage.explainerTitle}</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {currentPage.explainers.map((item, i) => (
                  <motion.div 
                    key={item.title} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...spring, delay: i * 0.1 }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-border/60 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-black/10 hover:shadow-xl"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] bg-muted transition-colors duration-500 group-hover:bg-primary/10">
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <h3 className="text-[20px] font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{item.body}</p>
                    <div className="absolute -bottom-10 -right-10 z-0 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Common Questions Component */}
            <div className="rounded-[40px] border border-border/80 bg-white p-8 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] box-border w-full">
              <div className="max-w-2xl mb-12">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-secondary/10 px-4 py-1.5 border border-secondary/20">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">Knowledge Base</p>
                </div>
                <h2 className="text-[28px] md:text-[38px] font-black tracking-tight text-foreground leading-[1.1]">{currentPage.faqTitle}</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {currentPage.faqs.map((item, i) => (
                  <motion.div 
                    key={item.question} 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ ...spring, delay: i * 0.1 }}
                    className="flex flex-col rounded-[28px] bg-muted/40 p-7 border border-transparent transition-all duration-300 hover:bg-white hover:border-border hover:shadow-md"
                  >
                    <h3 className="text-[17px] font-bold text-foreground leading-tight">{item.question}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{item.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </section>

        <section className="px-4 py-10 md:px-8 md:py-12">
          <div className="container-narrow rounded-[34px] bg-[linear-gradient(135deg,rgba(9,18,39,1),rgba(18,33,70,0.96))] px-6 py-10 text-white shadow-[0_32px_110px_-58px_rgba(3,7,18,0.95)] md:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Lead Capture</p>
                <h2 className="mt-3 font-heading text-3xl font-semibold text-secondary md:text-4xl">Get FREE Profile Evaluation Report</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76">Leave your email and the BVF team can review your route, shortlist options, and funding readiness.</p>
              </div>
              <div>
                {submitted ? (
                  <div className="rounded-[24px] bg-white/10 p-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10"><Send className="h-6 w-6 text-secondary" aria-hidden="true" /></div>
                    <p className="mt-4 text-lg font-semibold text-white">Request sent.</p>
                    <p className="mt-2 text-sm text-white/70">We&apos;ll reach out soon with the next step.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register('website')} />
                    <div>
                      <label htmlFor="tool-email" className="mb-1.5 block text-sm font-semibold text-white">Email</label>
                      <input id="tool-email" type="email" className="input-premium bg-white/95" placeholder="name@example.com" {...register('email')} />
                      {errors.email ? <p className="mt-1 text-xs text-red-200">{errors.email.message}</p> : null}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:opacity-50">{isSubmitting ? 'Sending...' : 'Get Free Profile Evaluation'}</button>
                    <p className={`text-xs ${submitError ? 'text-red-200' : 'text-white/70'}`}>{submitError || 'This is a guided support tool, not a guaranteed admission or visa decision.'}</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 pt-10 md:px-8 md:pb-24">
          <div className="container-narrow grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="surface-panel p-8">
              <p className="section-kicker">SEO Funnel</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">Tool pages work best when they explain the next move, not just the score.</h2>
              <div className="mt-6 space-y-4">
                {[
                  'The wizard explains score gaps, fund gaps, and document risks separately.',
                  'Country rules can be updated without rethinking the page structure.',
                  'Students and counselors both get a readable action plan from the result dashboard.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-sm leading-7 text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] bg-[linear-gradient(160deg,rgba(10,18,37,1),rgba(23,42,77,0.96))] p-8 text-white shadow-[0_30px_100px_-54px_rgba(15,23,42,0.9)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Conversion CTA</p>
              <h3 className="mt-3 font-heading text-3xl font-semibold text-secondary">Use the result. Then act on it.</h3>
              <p className="mt-4 text-sm leading-7 text-white/76">Once you know whether the issue is IELTS, funds, or documents, the next step is a proper counselor review.</p>
              <div className="mt-6 flex flex-col gap-3">
                <Link to="/bookings" className="button-primary">Book Free Consultation</Link>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="button-secondary">Chat on WhatsApp</a>
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
