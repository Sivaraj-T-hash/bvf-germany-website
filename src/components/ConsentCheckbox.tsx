import { forwardRef, type InputHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type ConsentCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  tone?: 'light' | 'dark';
};

/**
 * Required consent checkbox with a link to the privacy policy.
 * Forwards its ref so it works with react-hook-form's register().
 */
const ConsentCheckbox = forwardRef<HTMLInputElement, ConsentCheckboxProps>(function ConsentCheckbox(
  { error, tone = 'light', className, id = 'consent', ...inputProps },
  ref,
) {
  return (
    <div className={className}>
      <label htmlFor={id} className={cn('flex items-start gap-3 text-xs leading-6', tone === 'dark' ? 'text-white/80' : 'text-muted-foreground')}>
        <input ref={ref} id={id} type="checkbox" className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-[#132033]" {...inputProps} />
        <span>
          I agree that BVF Germany may store my details and contact me about this enquiry, as described in the{' '}
          <Link to="/privacy-policy" target="_blank" className={cn('font-semibold underline', tone === 'dark' ? 'text-white' : 'text-foreground')}>
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error ? <p className={cn('mt-1 text-xs', tone === 'dark' ? 'text-red-200' : 'text-destructive')}>{error}</p> : null}
    </div>
  );
});

export default ConsentCheckbox;
