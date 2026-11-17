import { ArrowRight, Calendar, Check, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { completePackage } from '@/content/offer';

export interface PricingTeaserSectionProps {
  className?: string;
}

const packageInclusions = [
  'Personalized public university shortlist tailored to your CGPA and field',
  'German-format CV (Lebenslauf) and custom SOP / LOR writing mentorship',
  'Application management across uni-assist and direct university portals',
  'End-to-end APS verification support and document verification checklist',
  'Visa interview file preparation, financial proof review and mock Q&A',
  'Pre-departure briefing and on-arrival settlement orientation in Germany',
];

export default function PricingTeaserSection({ className }: PricingTeaserSectionProps) {
  const [firstPart, secondPart] = completePackage.parts;

  return (
    <section
      id="pricing-teaser"
      aria-labelledby="pricing-teaser-heading"
      className={className || 'border-b border-[#E7E5E0] bg-[#FAF8F5] px-4 py-16 md:px-8 md:py-24'}
    >
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-3.5 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D6A4F]">
              TRANSPARENT, HONEST PRICING
            </span>
          </div>

          <h2
            id="pricing-teaser-heading"
            className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-[42px] leading-tight"
          >
            One Complete Package Covers Your Entire Journey.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#475569] sm:text-lg">
            You pay in two clear parts, and the second installment is due only after you receive your official university admission offer letter.
          </p>
        </div>

        {/* Pricing Layout Grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Main Package Card (Navy) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-[#1E293B] bg-[#132033] p-8 text-white shadow-xl lg:col-span-7 md:p-10">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-[#facc15] backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Full Support from India to Germany
                </span>
                <span className="text-xs uppercase tracking-wider text-white/60">BVF Mentorship</span>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-white/70">Complete Guidance Package</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-heading text-5xl font-extrabold tracking-tight md:text-6xl text-white">
                    {completePackage.price}
                  </span>
                  <span className="text-sm text-white/60">total guidance fee</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
                  {completePackage.summary} Zero agency commission fees. We guide you honestly toward German public universities that match your ambitions.
                </p>
              </div>

              {/* Inclusions list */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#facc15]">
                  What&apos;s Included in Your Package:
                </p>
                <ul className="mt-4 space-y-2.5" aria-label="Package inclusions">
                  {packageInclusions.map((inclusion) => (
                    <li key={inclusion} className="flex items-start gap-2.5 text-xs text-white/90 md:text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#facc15]" aria-hidden="true" />
                      <span>{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-xs text-white/60">
                Optional add-ons (IELTS/GRE preparation, German language A1–C1, and dedicated accommodation help) are priced transparently as separate modules.
              </p>
            </div>
          </div>

          {/* Right Column: Two-Part Installment Breakdown & Actions */}
          <div className="flex flex-col justify-between gap-5 lg:col-span-5">
            {/* Part 1 Box */}
            <div className="rounded-[28px] border border-[#E7E5E0] bg-white p-6 shadow-sm md:p-7">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#FAF8F5] border border-[#E7E5E0] px-3 py-1 text-xs font-bold text-[#0F172A]">
                  {firstPart.label}
                </span>
                <span className="text-xs font-semibold text-[#64748B]">Initial Milestone</span>
              </div>
              <p className="mt-3 font-heading text-3xl font-extrabold text-[#0F172A]">{firstPart.amount}</p>
              <p className="mt-1 text-xs font-medium text-[#2D6A4F]">{firstPart.when}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#475569]">
                Covers your in-depth profile audit, university shortlisting strategy, document preparation, and application setup.
              </p>
            </div>

            {/* Part 2 Box */}
            <div className="rounded-[28px] border-2 border-[#2D6A4F]/30 bg-[#F4F9F6] p-6 shadow-sm md:p-7">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#2D6A4F] px-3 py-1 text-xs font-bold text-white">
                  {secondPart.label}
                </span>
                <span className="text-xs font-bold text-[#2D6A4F]">Success Milestone</span>
              </div>
              <p className="mt-3 font-heading text-3xl font-extrabold text-[#0F172A]">{secondPart.amount}</p>
              <p className="mt-1 text-xs font-bold text-[#1E3A2F]">{secondPart.when}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#334155]">
                <strong className="text-[#0F172A]">Offer-letter guarantee:</strong> Due only after your university admission is secured, followed by full visa guidance and arrival assistance.
              </p>
            </div>

            {/* Actions Card */}
            <div className="rounded-[28px] border border-[#E7E5E0] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Next Step</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                Talk to a mentor before making any commitments.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link
                  to="/bookings"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E293B]"
                >
                  <Calendar className="h-4 w-4 text-[#2D6A4F]" aria-hidden="true" />
                  <span>Book Free Consultation</span>
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E7E5E0] bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#FAF8F5]"
                >
                  <span>View Full Pricing & Inclusions</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Distinction Note for Government & Official Fees */}
        <div className="mt-8 rounded-2xl border border-[#E7E5E0] bg-white p-5 text-center shadow-sm">
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 text-xs font-medium text-[#64748B]">
            <ShieldCheck className="h-4 w-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-[#0F172A]">Official Fees Distinction:</strong> APS certificate verification fees (₹18,000), university semester contributions (€150–€350/sem), blocked account deposits (€11,904), uni-assist processing, and embassy visa application fees are statutory expenses established by German authorities and paid directly to them.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
