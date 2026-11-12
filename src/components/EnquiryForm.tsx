import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import { useAuth } from '@/components/AuthProvider';
import { createLeadRecord } from '@/lib/leadStore';
import { sendSubmissionEmails } from '@/lib/submissionEmailApi';
import { useFormGuard } from '@/lib/formGuard';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(10, 'Enter a valid phone number').max(15),
  message: z.string().trim().max(1000).optional(),
  consent: z.boolean().refine((value) => value, 'Please agree so we can respond to your enquiry.'),
  website: z.string().optional(),
});

type EnquiryValues = z.infer<typeof schema>;

type EnquiryFormProps = {
  /** Short key stored with the lead, e.g. 'german-course' or 'dmat'. */
  formKey: string;
  subject: string;
  sourcePage: string;
  messagePlaceholder?: string;
  submitLabel?: string;
};

/** Short enquiry form used on service pages. Saves a lead and emails BVF and the visitor. */
export default function EnquiryForm({ formKey, subject, sourcePage, messagePlaceholder = 'Your question (optional)', submitLabel = 'Send Enquiry' }: EnquiryFormProps) {
  const { user } = useAuth();
  const guard = useFormGuard(formKey);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({ resolver: zodResolver(schema), defaultValues: { consent: false, email: user?.email || '' } });

  const onSubmit = async (data: EnquiryValues) => {
    const guardError = guard.check(data.website);
    if (guardError) {
      setError(guardError);
      return;
    }
    try {
      const message = data.message?.trim() || `${subject} (no message)`;
      await createLeadRecord({
        source: 'contact',
        sourcePage,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject,
        message,
        userId: user?.uid || null,
        metadata: { enquiryType: formKey },
        consentAt: new Date().toISOString(),
      });
      try {
        await sendSubmissionEmails({ formType: 'contact', name: data.name, email: data.email, phone: data.phone, message: `${subject}: ${message}` });
      } catch (mailError) {
        console.warn('Enquiry email notifications skipped', mailError);
      }
      guard.markSubmitted();
      setSent(true);
      setError('');
      reset({ name: '', email: '', phone: '', message: '', consent: false });
    } catch (caughtError) {
      console.error('Enquiry failed', caughtError);
      setError('Submission failed. Please try again later.');
    }
  };

  if (sent) {
    return (
      <div className="rounded-[24px] bg-accent/10 p-6 text-center">
        <Send className="mx-auto h-8 w-8 text-accent" aria-hidden="true" />
        <p className="mt-3 text-lg font-semibold text-foreground">Enquiry sent.</p>
        <p className="mt-1 text-sm text-muted-foreground">The BVF team will get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website')} />
      <div>
        <label htmlFor={`${formKey}-name`} className="mb-1.5 block text-sm font-semibold text-foreground">Full Name</label>
        <input id={`${formKey}-name`} autoComplete="name" className="input-premium" {...register('name')} />
        {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${formKey}-email`} className="mb-1.5 block text-sm font-semibold text-foreground">Email</label>
          <input id={`${formKey}-email`} type="email" autoComplete="email" className="input-premium" {...register('email')} />
          {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
        <div>
          <label htmlFor={`${formKey}-phone`} className="mb-1.5 block text-sm font-semibold text-foreground">Phone</label>
          <input id={`${formKey}-phone`} type="tel" autoComplete="tel" className="input-premium" {...register('phone')} />
          {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
        </div>
      </div>
      <div>
        <label htmlFor={`${formKey}-message`} className="mb-1.5 block text-sm font-semibold text-foreground">Message</label>
        <textarea id={`${formKey}-message`} rows={3} className="input-premium resize-none" placeholder={messagePlaceholder} {...register('message')} />
      </div>
      <ConsentCheckbox id={`${formKey}-consent`} error={errors.consent?.message} {...register('consent')} />
      <button type="submit" disabled={isSubmitting} className="button-primary w-full disabled:opacity-50">
        {isSubmitting ? 'Sending...' : submitLabel}
      </button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </form>
  );
}
