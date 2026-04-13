import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Landmark,
  Send,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { hasNewUserReviewAccess } from '@/lib/authSession';
import { getSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { useSeo } from '@/lib/useSeo';
import { createLeadRecord } from '@/lib/leadStore';

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

export default function FreeToolsPage() {
  useSeo({
    title: 'Free Tools | BVF Germany',
    description: 'Use free Germany-study tools including a CGPA converter and an IELTS Bank Requirements Checker.',
    url: 'https://bvf-student-support.web.app/tools',
    image: '/hero-og.png',
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

  const whatsappHref = `https://wa.me/${settings?.whatsappNumber || '919999999999'}?text=${encodeURIComponent(
    settings?.prefilledWhatsappMessage || 'Hi BVF Germany! I want help with studying in Germany.',
  )}`;

  const onSubmit = async (data: LeadForm & { website?: string }) => {
    try {
      if (data.website) {
        setSubmitError('Submission failed. Please try again.');
        return;
      }
      await createLeadRecord({
        source: 'tool',
        sourcePage: '/tools',
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
                <p className="eyebrow-chip">Free Tools</p>
                <h1 className="hero-display mt-7">Eligibility and funding tools for study-abroad planning</h1>
                <p className="hero-copy">Check your academic conversion, IELTS readiness, and bank-proof strength before you move into application or visa support.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.06 }} className="col-span-12 lg:col-span-4">
                <div className="surface-panel p-6">
                  <p className="section-kicker">Guided Assessment</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">The IELTS Bank Requirements Checker now works as a step-based assessment with country rules, fund validation, and action-focused results.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 md:px-8 md:pb-16">
          <div className="container-narrow grid gap-6 lg:grid-cols-2">
            <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={spring} className="surface-panel p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Calculator className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="section-kicker">Tool 01</p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">CGPA to German Grade Converter</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">Use the modified Bavarian formula to estimate how your CGPA may look in the German grading system.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Your CGPA</label>
                  <input value={cgpa} onChange={(event) => setCgpa(event.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Maximum CGPA</label>
                  <input value={maxCgpa} onChange={(event) => setMaxCgpa(event.target.value)} className="input-premium" />
                </div>
              </div>
              <div className="mt-6 rounded-[28px] bg-[linear-gradient(160deg,rgba(10,18,37,1),rgba(23,42,77,0.96))] p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Result</p>
                <p className="mt-3 text-4xl font-semibold text-secondary">{germanGrade ? germanGrade.value.toFixed(2) : '--'}</p>
                <p className="mt-2 text-sm text-white/78">{germanGrade ? `Meaning: ${germanGrade.meaning}` : 'Enter valid values to estimate your German grade.'}</p>
              </div>
            </motion.article>

            <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ ...spring, delay: 0.06 }} className="surface-panel p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="section-kicker">Tool 02</p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">IELTS Bank Requirements Checker</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">Collect destination, IELTS, tuition, sponsor, and bank details through a guided flow and get a decision dashboard instead of a raw calculator score.</p>

              <div className="mt-6 rounded-[24px] border border-border bg-muted/30 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">Assessment progress</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Step {step} of {maxAssessmentStep}</p>
                </div>
                <div className="mt-4 h-2 rounded-full bg-border/80">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(step / maxAssessmentStep) * 100}%` }} />
                </div>
                <div className={`mt-4 grid gap-2 ${canViewReviewResult ? 'md:grid-cols-5' : 'md:grid-cols-4'}`}>
                  {visibleWizardSteps.map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setStep(index + 1)}
                      className={`rounded-[18px] px-3 py-3 text-left text-sm transition ${
                        step === index + 1 ? 'bg-primary text-white' : index + 1 < step ? 'bg-emerald-500/10 text-emerald-700' : 'bg-white text-muted-foreground ring-1 ring-border'
                      }`}
                    >
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.16em]">Step {index + 1}</span>
                      <span className="mt-1 block leading-6">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {step === 1 ? (
                <div className="mt-6 rounded-[24px] border border-border bg-background/70 p-6">
                  <p className="text-sm font-semibold text-foreground">Step 1: Profile and destination</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Destination country</label><select value={country} onChange={(event) => { const next = event.target.value; setCountry(next); setRegion(Object.keys(countryRules[next].livingCosts)[0]); }} className="input-premium">{Object.entries(countryRules).map(([value, rule]) => <option key={value} value={value}>{rule.name}</option>)}</select></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Visa category</label><select value={visaType} onChange={(event) => setVisaType(event.target.value)} className="input-premium">{['Student Visa', 'Direct Admission', 'Pathway / Conditional Offer'].map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Course level</label><select value={courseLevel} onChange={(event) => setCourseLevel(event.target.value)} className="input-premium">{Object.keys(selectedCountry.courses).map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Intake</label><select value={intake} onChange={(event) => setIntake(event.target.value)} className="input-premium">{['Spring 2026', 'Summer 2026', 'Fall 2026', 'Winter 2027'].map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                  </div>
                  <div className="mt-5 rounded-[20px] border border-border bg-muted/40 p-4 text-sm leading-7 text-foreground">{selectedCourse.note}</div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="mt-6 rounded-[24px] border border-border bg-background/70 p-6">
                  <p className="text-sm font-semibold text-foreground">Step 2: IELTS score input</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Listening</label><input value={listening} onChange={(event) => setListening(event.target.value)} className="input-premium" /></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Reading</label><input value={reading} onChange={(event) => setReading(event.target.value)} className="input-premium" /></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Writing</label><input value={writing} onChange={(event) => setWriting(event.target.value)} className="input-premium" /></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Speaking</label><input value={speaking} onChange={(event) => setSpeaking(event.target.value)} className="input-premium" /></div>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[20px] border border-border bg-muted/40 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Overall</p><p className="mt-2 text-2xl font-semibold text-foreground">{report.overall.toFixed(1)}</p></div>
                    <div className="rounded-[20px] border border-border bg-muted/40 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Section minimum</p><p className="mt-2 text-2xl font-semibold text-foreground">{selectedCourse.minSection.toFixed(1)}</p></div>
                    <div className="rounded-[20px] border border-border bg-muted/40 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Safer target</p><p className="mt-2 text-2xl font-semibold text-foreground">{selectedCourse.saferOverall.toFixed(1)}</p></div>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="mt-6 rounded-[24px] border border-border bg-background/70 p-6">
                  <p className="text-sm font-semibold text-foreground">Step 3: Tuition and funding</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">City or cost-of-living region</label><select value={region} onChange={(event) => setRegion(event.target.value)} className="input-premium">{Object.entries(selectedCountry.livingCosts).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Funding source</label><select value={fundingSource} onChange={(event) => setFundingSource(event.target.value)} className="input-premium">{fundingSources.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Total tuition fee ({selectedCountry.currency})</label><input value={tuitionFee} onChange={(event) => setTuitionFee(event.target.value)} className="input-premium" /></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Amount paid ({selectedCountry.currency})</label><input value={tuitionPaid} onChange={(event) => setTuitionPaid(event.target.value)} className="input-premium" /></div>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[20px] border border-border bg-muted/40 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Living cost</p><p className="mt-2 text-2xl font-semibold text-foreground">{money(selectedRegion.amount, selectedCountry.currency)}</p></div>
                    <div className="rounded-[20px] border border-border bg-muted/40 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Remaining tuition</p><p className="mt-2 text-2xl font-semibold text-foreground">{money(report.remainingTuition, selectedCountry.currency)}</p></div>
                    <div className="rounded-[20px] border border-border bg-muted/40 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Required funds</p><p className="mt-2 text-2xl font-semibold text-foreground">{money(report.requiredFunds, selectedCountry.currency)}</p></div>
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="mt-6 rounded-[24px] border border-border bg-background/70 p-6">
                  <p className="text-sm font-semibold text-foreground">Step 4: Bank and sponsor details</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Bank balance ({selectedCountry.currency})</label><input value={bankBalance} onChange={(event) => setBankBalance(event.target.value)} className="input-premium" /></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Maintenance period (days)</label><input value={maintenanceDays} onChange={(event) => setMaintenanceDays(event.target.value)} className="input-premium" /></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Account owner</label><select value={accountOwner} onChange={(event) => setAccountOwner(event.target.value)} className="input-premium">{accountOwners.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                    <div><label className="mb-1.5 block text-sm font-semibold text-foreground">Document type</label><select value={documentType} onChange={(event) => setDocumentType(event.target.value)} className="input-premium">{documentTypes.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                    <div className="md:col-span-2"><label className="mb-1.5 block text-sm font-semibold text-foreground">Financial institution type</label><select value={institutionType} onChange={(event) => setInstitutionType(event.target.value)} className="input-premium">{institutionTypes.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                  </div>
                  <div className="mt-5 rounded-[20px] border border-border bg-muted/40 p-4 text-sm leading-7 text-foreground">Why we ask this: the tool checks maintenance history, ownership fit, document strength, and whether the bank type is likely to hold up in a first-pass review.</div>
                </div>
              ) : null}

              {step === 5 && canViewReviewResult ? (
                <div className="mt-6 space-y-5">
                  <div className="rounded-[26px] bg-[linear-gradient(160deg,rgba(10,18,37,1),rgba(23,42,77,0.96))] p-6 text-white">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Decision dashboard</p>
                        <h3 className="mt-3 text-3xl font-semibold text-secondary">{report.status}</h3>
                        <p className="mt-3 text-sm leading-7 text-white/78">{selectedCountry.name} | {visaType} | {courseLevel} | {intake}</p>
                      </div>
                      <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusTone(report.status)}`}>{report.status}</span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/76">{selectedCountry.disclaimer}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[24px] border border-border bg-muted/40 p-5"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">IELTS overall</p><p className="mt-2 text-2xl font-semibold text-foreground">{report.overall.toFixed(1)}</p><p className="mt-1.5 text-xs leading-5 text-muted-foreground">Minimum: {selectedCourse.minOverall.toFixed(1)}</p></div>
                    <div className="rounded-[24px] border border-border bg-muted/40 p-5"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Weakest section</p><p className="mt-2 text-2xl font-semibold text-foreground">{report.weakest.toFixed(1)}</p><p className="mt-1.5 text-xs leading-5 text-muted-foreground">Minimum: {selectedCourse.minSection.toFixed(1)}</p></div>
                    <div className="rounded-[24px] border border-border bg-muted/40 p-5"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Required funds</p><p className="mt-2 text-2xl font-semibold text-foreground">{money(report.requiredFunds, selectedCountry.currency)}</p><p className="mt-1.5 text-xs leading-5 text-muted-foreground">Tuition balance plus living costs.</p></div>
                    <div className="rounded-[24px] border border-border bg-muted/40 p-5"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Available balance</p><p className="mt-2 text-2xl font-semibold text-foreground">{money(report.availableFunds, selectedCountry.currency)}</p><p className="mt-1.5 text-xs leading-5 text-muted-foreground">{documentType}</p></div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[24px] border border-border bg-background/80 p-6">
                      <div className="flex items-center gap-3"><FileCheck2 className="h-5 w-5 text-primary" aria-hidden="true" /><p className="text-sm font-semibold text-foreground">Explanation blocks</p></div>
                      <div className="mt-5 space-y-3">
                        <div className="rounded-[18px] border border-border bg-muted/40 px-4 py-3 text-sm leading-7 text-foreground">Course note: {selectedCourse.note}</div>
                        <div className="rounded-[18px] border border-border bg-muted/40 px-4 py-3 text-sm leading-7 text-foreground">Funding route: {fundingSource} via {accountOwner.toLowerCase()} ownership and {institutionType.toLowerCase()} banking.</div>
                        <div className="rounded-[18px] border border-border bg-muted/40 px-4 py-3 text-sm leading-7 text-foreground">Document strength: {documentType} selected for the current route.</div>
                        <div className="rounded-[18px] border border-border bg-muted/40 px-4 py-3 text-sm leading-7 text-foreground">Evidence is shown as planning guidance, not as a guaranteed visa decision.</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[24px] border border-border bg-background/80 p-6">
                        <div className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-secondary" aria-hidden="true" /><p className="text-sm font-semibold text-foreground">Missing or risky items</p></div>
                        <div className="mt-5 space-y-3">
                          {report.missing.length === 0 && report.risks.length === 0 ? <div className="rounded-[18px] bg-emerald-500/10 px-4 py-3 text-sm leading-7 text-emerald-700">No major gaps were flagged in this first-pass assessment.</div> : null}
                          {report.missing.map((item) => <div key={item} className="rounded-[18px] bg-rose-500/10 px-4 py-3 text-sm leading-7 text-rose-700">{item}</div>)}
                          {report.risks.map((item) => <div key={item} className="rounded-[18px] bg-amber-500/10 px-4 py-3 text-sm leading-7 text-amber-700">{item}</div>)}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-border bg-background/80 p-6">
                        <div className="flex items-center gap-3"><Landmark className="h-5 w-5 text-primary" aria-hidden="true" /><p className="text-sm font-semibold text-foreground">Next-step recommendation panel</p></div>
                        <div className="mt-5 space-y-3">
                          {report.actions.map((item) => (
                            <div key={item} className="flex items-start gap-3 rounded-[18px] border border-border/70 bg-white/80 px-4 py-3 text-sm leading-7 text-muted-foreground">
                              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-border bg-muted/30 p-6">
                    <p className="text-sm font-semibold text-foreground">Validation checklist</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {report.checklist.map((item) => <div key={item} className="rounded-[18px] bg-white px-4 py-3 text-sm leading-7 text-foreground ring-1 ring-border">{item}</div>)}
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 4 && !canViewReviewResult ? (
                <div className="mt-6 rounded-[24px] border border-border bg-muted/30 p-6">
                  <p className="text-sm font-semibold text-foreground">Review result is locked</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    This final review result is only visible for newly registered students after their first successful login.
                  </p>
                  {!user ? (
                    <Link
                      to="/login"
                      state={{ from: '/tools' }}
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                    >
                      Login to unlock review result
                    </Link>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} className="inline-flex items-center justify-center rounded-full bg-[#f7f2ea] px-5 py-3 text-sm font-semibold text-foreground ring-1 ring-border transition hover:bg-white">Previous step</button>
                <button
                  type="button"
                  disabled={step >= maxAssessmentStep}
                  onClick={() => setStep((current) => Math.min(maxAssessmentStep, current + 1))}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {step >= maxAssessmentStep
                    ? canViewReviewResult
                      ? 'Review result'
                      : !user
                        ? 'Login to unlock review result'
                        : 'Review result locked'
                    : 'Next step'}
                </button>
              </div>
            </motion.article>
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
