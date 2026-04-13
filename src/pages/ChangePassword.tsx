import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { setAuthNotice } from '@/lib/authSession';
import { changePasswordWithTemporary } from '@/lib/passwordResetApi';
import { useSeo } from '@/lib/useSeo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function ChangePasswordPage() {
  useSeo({
    title: 'Change Password | BVF Germany',
    description: 'Change your temporary BVF student password.',
  });

  const navigate = useNavigate();
  const { user, loading, mustChangePassword, passwordStatusLoading } = useAuth();

  const [form, setForm] = useState({
    temporaryPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading || passwordStatusLoading) {
      return;
    }

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (!mustChangePassword) {
      navigate('/dashboard', { replace: true });
    }
  }, [loading, passwordStatusLoading, user, mustChangePassword, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!user) {
      setError('You must be signed in first.');
      return;
    }

    try {
      setSubmitting(true);
      const idToken = await user.getIdToken(true);

      await changePasswordWithTemporary({
        idToken,
        temporaryPassword: form.temporaryPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      await signOut(auth);
      setAuthNotice({
        type: 'success',
        message: 'Password updated successfully. Please sign in with your new password.',
      });
      navigate('/login', { replace: true });
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unable to change password.';
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
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Student Password Update</p>
            <h1 className="mt-3 text-3xl font-extrabold text-foreground">Set a new password</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Use the temporary password from email, then create your new permanent password.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="temporary-password" className="mb-1.5 block text-sm font-semibold text-foreground">
                  Temporary Password
                </label>
                <input
                  id="temporary-password"
                  type="password"
                  required
                  value={form.temporaryPassword}
                  onChange={(event) => setForm((current) => ({ ...current, temporaryPassword: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter temporary password"
                />
              </div>

              <div>
                <label htmlFor="new-password" className="mb-1.5 block text-sm font-semibold text-foreground">
                  New Password
                </label>
                <input
                  id="new-password"
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
                <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-semibold text-foreground">
                  Re-enter New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Re-enter new password"
                />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-cta px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <p className="mt-5 text-sm text-muted-foreground">
              Need a new temporary password?{' '}
              <Link to="/forgot-password" className="font-semibold text-primary">
                Request again
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
