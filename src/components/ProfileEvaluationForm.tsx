import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Lock, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useFormGuard } from '@/lib/formGuard';
import { submitPublicLeadRequest } from '@/lib/submissionEmailApi';
import { buildWhatsappHref } from '@/lib/whatsapp';
import {
  buildProfileEvaluationLeadMessage,
  buildProfileEvaluationWhatsappMessage,
  currentEducationOptions,
  interestedProgramOptions,
} from '@/lib/profileEvaluation';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(10, 'Enter a valid WhatsApp number').max(20),
  interestedProgram: z.enum(interestedProgramOptions, { required_error: 'Select an interested program' }),
  currentEducation: z.enum(currentEducationOptions, { required_error: 'Select your current education' }),
  consent: z.boolean().refine((value) => value, 'Please agree so we can respond to your request.'),
  website: z.string().optional(),
});

type Values = z.infer<typeof schema>;

/** "Free Profile Evaluation" form: saves a lead (through the API, or directly if the API is down) and emails BVF. */
export default function ProfileEvaluationForm({
  sourcePage = '/',
  placement = 'homepage-contact-section',
}: {
  sourcePage?: string;
  placement?: string;
}) {
  const settings = useSiteSettings();
  const guard = useFormGuard('profile-evaluation');
  const [done, setDone] = useState<{ message: string; whatsappHref: string } | null>(null);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { consent: false } });

  const onSubmit = async (data: Values) => {
    const guardError = guard.check(data.website);
    if (guardError) {
      setError(guardError);
      return;
    }
    try {
      const result = await submitPublicLeadRequest({
        formType: 'profile_evaluation',
        source: 'contact',
        sourcePage,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: 'Free Profile Evaluation',
        message: buildProfileEvaluationLeadMessage({
          interestedProgram: data.interestedProgram,
          currentEducation: data.currentEducation,
        }),
        interestedProgram: data.interestedProgram,
        currentEducation: data.currentEducation,
        metadata: { placement, interestedProgram: data.interestedProgram, currentEducation: data.currentEducation },
        website: data.website,
        consentAt: new Date().toISOString(),
      });
      guard.markSubmitted();
      setError('');
      setDone({
        message: result.emailSent
          ? 'Your free profile evaluation request is in, and we have sent a confirmation email. A mentor will evaluate your background against public university criteria within 24 hours.'
          : 'Your free profile evaluation request is saved. Our mentoring team can see it and will follow up with you within 24 hours.',
        whatsappHref: buildWhatsappHref(
          settings,
          buildProfileEvaluationWhatsappMessage({
            name: data.name,
            phone: data.phone,
            email: data.email,
            interestedProgram: data.interestedProgram,
            currentEducation: data.currentEducation,
          }),
        ),
      });
      reset({ consent: false });
    } catch (caughtError) {
      console.error('Profile evaluation request failed', caughtError);
      setError('We could not submit your request right now. Please try again in a moment.');
    }
  };

  if (done) {
    return (
      <div className="rounded-[28px] border border-[#2D6A4F]/20 bg-[#F4F9F6] p-7 md:p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2D6A4F] text-white shadow-md">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mt-4 font-heading text-xl font-bold text-[#0F172A] md:text-2xl">
          Profile Evaluation Requested
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#475569] md:text-base">
          {done.message}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="rounded-full border border-[#E7E5E0] bg-white px-5 py-2.5 text-xs font-semibold text-[#0F172A] shadow-sm transition hover:bg-[#FAF8F5] md:text-sm"
            onClick={() => setDone(null)}
          >
            Submit Another Profile
          </button>
          <a
            href={done.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#2D6A4F] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E3A2F] md:text-sm"
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
            <span>Continue on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website')} />

      {/* Full Name */}
      <div>
        <label htmlFor="evaluation-name" className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0F172A]">
          <span>Full Name <span className="text-[#2D6A4F]" aria-hidden="true">*</span></span>
        </label>
        <input
          id="evaluation-name"
          type="text"
          placeholder="e.g. Rahul Sharma"
          autoComplete="name"
          className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] shadow-sm transition focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
          {...register('name')}
        />
        {errors.name ? (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-destructive" role="alert">
            <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>{errors.name.message}</span>
          </p>
        ) : null}
      </div>

      {/* Email & Phone Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="evaluation-email" className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0F172A]">
            <span>Email Address <span className="text-[#2D6A4F]" aria-hidden="true">*</span></span>
          </label>
          <input
            id="evaluation-email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] shadow-sm transition focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
            {...register('email')}
          />
          {errors.email ? (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-destructive" role="alert">
              <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{errors.email.message}</span>
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="evaluation-phone" className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0F172A]">
            <span>WhatsApp Number <span className="text-[#2D6A4F]" aria-hidden="true">*</span></span>
          </label>
          <input
            id="evaluation-phone"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            autoComplete="tel"
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] shadow-sm transition focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
            {...register('phone')}
          />
          {errors.phone ? (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-destructive" role="alert">
              <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{errors.phone.message}</span>
            </p>
          ) : null}
        </div>
      </div>

      {/* Interested Program & Current Education */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="evaluation-program" className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0F172A]">
            <span>Target Program <span className="text-[#2D6A4F]" aria-hidden="true">*</span></span>
          </label>
          <select
            id="evaluation-program"
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#0F172A] shadow-sm transition focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
            defaultValue=""
            {...register('interestedProgram')}
          >
            <option value="" disabled>Select target degree</option>
            {interestedProgramOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.interestedProgram ? (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-destructive" role="alert">
              <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{errors.interestedProgram.message}</span>
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="evaluation-education" className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0F172A]">
            <span>Current Education <span className="text-[#2D6A4F]" aria-hidden="true">*</span></span>
          </label>
          <select
            id="evaluation-education"
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#0F172A] shadow-sm transition focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
            defaultValue=""
            {...register('currentEducation')}>
            <option value="" disabled>Select your qualification</option>
            {currentEducationOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.currentEducation ? (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-destructive" role="alert">
              <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{errors.currentEducation.message}</span>
            </p>
          ) : null}
        </div>
      </div>

      {/* Consent Checkbox */}
      <ConsentCheckbox id="evaluation-consent" error={errors.consent?.message} {...register('consent')} />

      {/* Submit CTA */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F172A] px-7 py-3.5 text-sm md:text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E293B] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
        <span>{isSubmitting ? 'Evaluating & Submitting...' : 'Get Free Profile Evaluation'}</span>
      </button>

      {/* Form Error Message */}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}

      {/* Privacy Reassurance Note */}
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#64748B]">
        <Lock className="h-3 w-3 text-[#2D6A4F]" aria-hidden="true" />
        <span>Your profile details remain strictly private. No spam, no sales pressure.</span>
      </p>
    </form>
  );
}
