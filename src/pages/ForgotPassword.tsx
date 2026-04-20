import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthNotice } from '@/lib/authSession';
import { requestPasswordResetEmail, resetPasswordWithOtp } from '@/lib/passwordResetApi';
import { useSeo } from '@/lib/useSeo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  useSeo({
    title: 'Forgot Password | BVF Germany',
    description: 'Request a BVF Germany one-time password reset code by email.',
    noindex: true,
  });

  const [form, setForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [otpRequested, setOtpRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);
      await requestPasswordResetEmail(form.email.trim().toLowerCase());
      setOtpRequested(true);
      setSuccess('If your student account exists, a 6-digit reset code has been sent to your email. Enter it below to set a new password.');
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unable to request a password reset code.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);
      await resetPasswordWithOtp({
        email: form.email.trim().toLowerCase(),
        otp: form.otp.trim(),
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setAuthNotice({
        type: 'success',
        message: 'Password updated successfully. Please sign in with your new password.',
      });
      navigate('/login', { replace: true });
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unable to reset password.';
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
              Enter your student email address. We will send a one-time reset code through email so you can set a new password directly.
            </p>

            <form onSubmit={otpRequested ? handleResetPassword : handleRequestOtp} className="mt-8 space-y-4">
              <div>
                <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-semibold text-foreground">
                  Email
                </label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="you@example.com"
                />
              </div>

              {otpRequested ? (
                <>
                  <div>
                    <label htmlFor="forgot-otp" className="mb-1.5 block text-sm font-semibold text-foreground">
                      6-Digit Reset Code
                    </label>
                    <input
                      id="forgot-otp"
                      name="otp"
                      type="text"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={form.otp}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, otp: event.target.value.replace(/\D/g, '').slice(0, 6) }))
                      }
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm tracking-[0.4em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="123456"
                    />
                  </div>

                  <div>
                    <label htmlFor="forgot-new-password" className="mb-1.5 block text-sm font-semibold text-foreground">
                      New Password
                    </label>
                    <input
                      id="forgot-new-password"
                      name="newPassword"
                      type="password"
                      required
                      minLength={6}
                      value={form.newPassword}
                      onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label htmlFor="forgot-confirm-password" className="mb-1.5 block text-sm font-semibold text-foreground">
                      Confirm New Password
                    </label>
                    <input
                      id="forgot-confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      minLength={6}
                      value={form.confirmPassword}
                      onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Re-enter new password"
                    />
                  </div>
                </>
              ) : null}

              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              {success ? <p className="text-sm text-[#059669]">{success}</p> : null}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-gradient-cta px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? (otpRequested ? 'Resetting...' : 'Sending...') : otpRequested ? 'Set New Password' : 'Send Reset Code'}
                </button>

                {otpRequested ? (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      setOtpRequested(false);
                      setSuccess('');
                      setError('');
                      setForm((current) => ({ ...current, otp: '', newPassword: '', confirmPassword: '' }));
                    }}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/40 disabled:opacity-60"
                  >
                    Use a different email
                  </button>
                ) : null}
              </div>
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
