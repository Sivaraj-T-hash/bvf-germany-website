import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestTemporaryPassword } from '@/lib/passwordResetApi';
import { useSeo } from '@/lib/useSeo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function ForgotPasswordPage() {
  useSeo({
    title: 'Forgot Password | BVF Germany',
    description: 'Request a temporary BVF student login password by email.',
  });

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);
      await requestTemporaryPassword(email.trim().toLowerCase());
      setSuccess('If your student account exists, a temporary password has been sent to your email.');
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unable to request a temporary password.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container-narrow px-4 md:px-8">
          <div className="mx-auto max-w-2xl rounded-[32px] border border-border bg-card p-8 shadow-card md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Student Password Help</p>
            <h1 className="mt-3 text-3xl font-extrabold text-foreground">Forgot your password?</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Enter your student email address. We will send a temporary password you can use to sign in.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-semibold text-foreground">
                  Email
                </label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="you@example.com"
                />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              {success ? <p className="text-sm text-[#059669]">{success}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-cta px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send Temporary Password'}
              </button>
            </form>

            <p className="mt-5 text-sm text-muted-foreground">
              Remembered it?{' '}
              <Link to="/login" className="font-semibold text-primary">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
