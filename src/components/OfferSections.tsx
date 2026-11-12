import { ArrowRight, Check, CheckCircle2, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  addOnIntro,
  addOnNote,
  addOns,
  comparison,
  completePackage,
  documentsToKeepReady,
  germanyFacts,
  germanyFactsNote,
  journeyStages,
  officialFees,
  timeline,
  timelineNote,
} from '@/content/offer';
import { cn } from '@/lib/utils';

const stageColors = ['bg-[#f59e0b]', 'bg-[#132033]', 'bg-[#15803d]', 'bg-[#eab308]', 'bg-[#dc2626]', 'bg-[#111827]'];

function AddOnBadge() {
  return <span className="rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[11px] font-semibold text-[#92400e]">Add-on</span>;
}

/** The 14 services in six stages. */
export function JourneyStagesSection({ className, showHeading = true }: { className?: string; showHeading?: boolean }) {
  return (
    <section className={cn('px-4 py-16 md:px-8 md:py-20', className)}>
      <div className="container-narrow">
        {showHeading ? (
          <div className="max-w-3xl">
            <p className="section-kicker">14 services, one journey</p>
            <h2 className="section-title">Six stages, one team.</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Items marked <AddOnBadge /> are optional, so you pay only for what you need.
            </p>
          </div>
        ) : null}
        <div className="mt-10 space-y-6">
          {journeyStages.map((stage, index) => (
            <div key={stage.id} className="grid gap-4 border-t border-border pt-6 md:grid-cols-[200px_1fr]">
              <div className="flex items-start gap-3 md:block">
                <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white', stageColors[index % stageColors.length])}>
                  {stage.number}
                </span>
                <div className="md:mt-3">
                  <h3 className="text-xl font-bold text-foreground">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground">{stage.subtitle}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {stage.services.map((service) => (
                  <Link
                    key={service.title}
                    to={service.path}
                    className={cn(
                      'group rounded-[22px] bg-muted/60 p-5 transition hover:-translate-y-0.5 hover:bg-muted',
                      stage.services.length === 1 || (stage.services.length === 3 && service === stage.services[0]) ? 'sm:col-span-2' : '',
                    )}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-foreground">{service.title}</span>
                      {service.addOn ? <AddOnBadge /> : null}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">{service.description}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
                      Learn more <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** ₹59,999 package with the two payment parts. */
export function PackagePriceCard({ className }: { className?: string }) {
  const [first, second] = completePackage.parts;
  return (
    <div className={cn('grid gap-4 lg:grid-cols-[1.2fr_0.8fr]', className)}>
      <div className="rounded-[30px] bg-[#132033] p-8 text-white">
        <p className="text-sm text-white/70">Complete package</p>
        <p className="mt-2 font-heading text-6xl font-bold tracking-tight">{completePackage.price}</p>
        <p className="mt-4 max-w-md text-sm leading-7 text-white/80">{completePackage.summary}</p>
        <p className="mt-2 text-xs text-white/60">IELTS, GRE, GMAT, German classes and accommodation help are optional add-ons, priced separately.</p>
      </div>
      <div className="grid gap-4">
        <div className="rounded-[26px] border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">{first.label}, {first.when.toLowerCase()}</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{first.amount}</p>
        </div>
        <div className="rounded-[26px] border border-[#15803d]/50 bg-[#f0fdf4] p-6">
          <p className="text-sm text-slate-600">{second.label}, {second.when.toLowerCase()}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{second.amount}</p>
          {second.note ? <p className="mt-1 text-sm font-medium text-[#15803d]">{second.note}</p> : null}
        </div>
      </div>
    </div>
  );
}

export function NoHiddenCharges({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-start gap-4 rounded-[26px] border border-[#15803d]/40 bg-[#f0fdf4] p-6', className)}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#15803d] text-white">
        <Check className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-[#166534]">No hidden charges, ever</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">{completePackage.noHiddenCharges}</p>
      </div>
    </div>
  );
}

/** "Add-ons at a glance" table. */
export function AddOnsTable({ className, showIntro = true }: { className?: string; showIntro?: boolean }) {
  return (
    <div className={className}>
      {showIntro ? <p className="text-base leading-8 text-muted-foreground">{addOnIntro}</p> : null}
      <div className="mt-6 overflow-hidden rounded-[24px] border border-border bg-card">
        {addOns.map((addOn) => (
          <Link
            key={addOn.id}
            to={addOn.path}
            className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-border/70 px-5 py-4 transition last:border-b-0 hover:bg-muted/50 sm:grid-cols-[1.1fr_1fr_auto]"
          >
            <span className="font-semibold text-foreground">{addOn.title}</span>
            <span className="order-3 col-span-2 text-sm text-muted-foreground sm:order-none sm:col-span-1">{addOn.detail}</span>
            <span className="text-right font-bold text-foreground">{addOn.price}</span>
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{addOnNote}</p>
    </div>
  );
}

/** Costs paid directly to official bodies. */
export function OfficialFeesTable({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-xl font-bold text-foreground">Paid directly to official bodies, not to us</h3>
      <p className="mt-1 text-sm text-muted-foreground">These are standard costs every student pays. We guide you through each one.</p>
      <dl className="mt-5 overflow-hidden rounded-[24px] border border-border bg-card">
        {officialFees.map((fee) => (
          <div key={fee.item} className="grid gap-1 border-b border-border/70 px-5 py-3 last:border-b-0 sm:grid-cols-2">
            <dt className="text-sm font-semibold text-foreground">{fee.item}</dt>
            <dd className="text-sm text-muted-foreground">{fee.paidTo}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** "Why Germany is within your reach" facts. */
export function GermanyFactsSection({ className }: { className?: string }) {
  return (
    <section className={cn('px-4 py-16 md:px-8 md:py-20', className)}>
      <div className="container-narrow">
        <div className="max-w-3xl">
          <p className="section-kicker">Why Germany is within your reach</p>
          <h2 className="section-title">A world-class degree, for far less than you think.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {germanyFacts.map((fact) => (
            <div key={fact.value} className="surface-panel p-6">
              <p className="font-heading text-4xl font-bold text-foreground">{fact.value}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{fact.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">{germanyFactsNote}</p>
      </div>
    </section>
  );
}

/** Typical consultancy vs BVF Germany. */
export function ComparisonCards({ className }: { className?: string }) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2', className)}>
      <div className="rounded-[26px] border border-border bg-card p-6">
        <p className="font-semibold text-muted-foreground">A typical consultancy</p>
        <ul className="mt-4 space-y-3">
          {comparison.typical.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[26px] border border-[#15803d]/50 bg-[#f0fdf4] p-6">
        <p className="font-semibold text-slate-900">BVF Germany</p>
        <ul className="mt-4 space-y-3">
          {comparison.bvf.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-slate-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803d]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Typical timeline and documents to keep ready. */
export function TimelineSection({ className }: { className?: string }) {
  return (
    <section className={cn('px-4 py-16 md:px-8 md:py-20', className)}>
      <div className="container-narrow grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="section-kicker">Planning</p>
          <h2 className="section-title">What a typical timeline looks like</h2>
          <dl className="mt-8 overflow-hidden rounded-[24px] border border-border bg-card">
            {timeline.map((row) => (
              <div key={row.when} className="grid gap-1 border-b border-border/70 px-5 py-4 last:border-b-0 sm:grid-cols-[0.9fr_1.1fr]">
                <dt className="text-sm font-semibold text-foreground">{row.when}</dt>
                <dd className="text-sm text-muted-foreground">{row.what}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">{timelineNote}</p>
        </div>
        <div className="surface-panel h-fit p-6">
          <h3 className="text-lg font-bold text-foreground">Keep these ready for your first session</h3>
          <p className="mt-1 text-sm text-muted-foreground">Do not worry if something is missing. We will tell you exactly what to get.</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {documentsToKeepReady.map((doc) => (
              <li key={doc} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground">
                <Check className="h-3.5 w-3.5 text-[#15803d]" aria-hidden="true" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
