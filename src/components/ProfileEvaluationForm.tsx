import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
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
export default function ProfileEvaluationForm({ sourcePage = '/', placement = 'homepage-contact-section' }: { sourcePage?: string; placement?: string }) {
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
        message: buildProfileEvaluationLeadMessage({ interestedProgram: data.interestedProgram, currentEducation: data.currentEducation }),
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
          ? 'Thanks. Your free profile evaluation request is in, and we have emailed you a confirmation. Our team will review it within 24 hours.'
          : 'Your free profile evaluation request is saved. Our team can see it and will follow up soon.',
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
      <div className="rounded-[24px] bg-accent/10 p-6 text-center">
        <Send className="mx-auto h-8 w-8 text-accent" aria-hidden="true" />
        <p className="mt-3 text-lg font-semibold text-foreground">Profile evaluation requested.</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{done.message}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button type="button" className="button-secondary" onClick={() => setDone(null)}>Send another request</button>
          <a href={done.whatsappHref} target="_blank" rel="noopener noreferrer" className="button-primary inline-flex items-center gap-2">
            <FaWhatsapp className="h-4 w-4" aria-hidden="true" /> Continue on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website')} />
      <div>
        <label htmlFor="evaluation-name" className="mb-1.5 block text-sm font-semibold text-foreground">Full Name</label>
        <input id="evaluation-name" autoComplete="name" className="input-premium" {...register('name')} />
        {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="evaluation-email" className="mb-1.5 block text-sm font-semibold text-foreground">Email Address</label>
          <input id="evaluation-email" type="email" autoComplete="email" className="input-premium" {...register('email')} />
          {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
        <div>
          <label htmlFor="evaluation-phone" className="mb-1.5 block text-sm font-semibold text-foreground">WhatsApp Number</label>
          <input id="evaluation-phone" type="tel" autoComplete="tel" className="input-premium" {...register('phone')} />
          {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="evaluation-program" className="mb-1.5 block text-sm font-semibold text-foreground">Interested Program</label>
          <select id="evaluation-program" className="input-premium" defaultValue="" {...register('interestedProgram')}>
            <option value="" disabled>Select a program</option>
            {interestedProgramOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.interestedProgram ? <p className="mt-1 text-xs text-destructive">{errors.interestedProgram.message}</p> : null}
        </div>
        <div>
          <label htmlFor="evaluation-education" className="mb-1.5 block text-sm font-semibold text-foreground">Current Education</label>
          <select id="evaluation-education" className="input-premium" defaultValue="" {...register('currentEducation')}>
            <option value="" disabled>Select your current education</option>
            {currentEducationOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.currentEducation ? <p className="mt-1 text-xs text-destructive">{errors.currentEducation.message}</p> : null}
        </div>
      </div>
      <ConsentCheckbox id="evaluation-consent" error={errors.consent?.message} {...register('consent')} />
      <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:opacity-50">
        {isSubmitting ? 'Sending...' : 'Get Free Profile Evaluation'}
      </button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </form>
  );
}
