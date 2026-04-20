import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, signOut, type AuthError, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createLeadRecord } from '@/lib/leadStore';
import { sendWelcomeEmailForSignup } from '@/lib/passwordResetApi';
import { createDefaultStudentProfile, createStudentProfile, getStudentProfile, markStudentLoginSeen } from '@/lib/studentStore';
import { grantNewUserReviewAccess } from '@/lib/authSession';
import { useSeo } from '@/lib/useSeo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function RegisterPage() {
  useSeo({
    title: 'Register | BVF Germany',
    description: 'Create your BVF Germany student account to track bookings, service progress, and your study journey.',
    noindex: true,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const getBlockedStatusMessage = (status: string | undefined) =>
    status === 'rejected'
      ? 'Your registration was not approved. Contact admin for support.'
      : status === 'suspended'
        ? 'Your account is suspended. Please contact admin.'
        : 'Your account is not allowed to sign in right now.';

  const isBlockedStatus = (status: string | undefined) => status === 'rejected' || status === 'suspended';

  const finishStudentAccess = async (uid: string) => {
    const isFirstLogin = await markStudentLoginSeen(uid);
    if (isFirstLogin) {
      grantNewUserReviewAccess();
    }

    const nextPath = (location.state as { from?: string } | null)?.from || '/dashboard';
    navigate(nextPath, { replace: true });
  };

  const sendWelcomeEmail = async (name: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return;
    }

    try {
      const idToken = await currentUser.getIdToken(true);
      await sendWelcomeEmailForSignup({ idToken, name });
    } catch (mailError) {
      console.error('Welcome email could not be sent:', mailError);
    }
  };

  const finalizeSignup = async (uid: string, name: string) => {
    setSuccessMessage('Successfully registered. Welcome email is being delivered to your inbox.');
    await sendWelcomeEmail(name);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    await finishStudentAccess(uid);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const normalizedEmail = form.email.trim().toLowerCase();
      const normalizedName = form.name.trim();
      const normalizedPhone = form.phone.trim();
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, form.password);
      await updateProfile(credential.user, {
        displayName: normalizedName,
      });

      const profile = createDefaultStudentProfile({
        uid: credential.user.uid,
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
      });

      await createLeadRecord({
        source: 'tool',
        sourcePage: '/register',
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
        subject: 'New student signup',
        message: 'Student created an account with email/password.',
        userId: credential.user.uid,
        metadata: {
          stage: 'signup',
        },
      });

      await createStudentProfile(
        profile,
      );

      const savedProfile = await getStudentProfile(credential.user.uid);
      if (!savedProfile) {
        throw new Error('Student profile could not be created in the database. Please check Firebase rules and try again.');
      }

      await finalizeSignup(credential.user.uid, normalizedName);
    } catch (caughtError) {
      const message = (caughtError as { message?: string }).message || 'Could not create your account.';
      if (message.includes('email-already-in-use')) {
        setError('An account with this email already exists.');
      } else if (message.includes('operation-not-allowed')) {
        setError('Email/password sign-up is disabled in Firebase. Enable Email/Password under Firebase Authentication > Sign-in method.');
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setSuccessMessage('');

    try {
      setGoogleSubmitting(true);
      const credential = await signInWithPopup(auth, googleProvider);
      const normalizedEmail = credential.user.email?.trim().toLowerCase();
      if (!normalizedEmail) {
        throw new Error('Google account does not provide an email address.');
      }

      const existingProfile = await getStudentProfile(credential.user.uid);
      if (existingProfile) {
        if (isBlockedStatus(existingProfile.status)) {
          await signOut(auth);
          setError(getBlockedStatusMessage(existingProfile.status));
          return;
        }

        await finishStudentAccess(credential.user.uid);
        return;
      }

      const normalizedName = credential.user.displayName?.trim() || normalizedEmail.split('@')[0] || 'Student';
      const profile = createDefaultStudentProfile({
        uid: credential.user.uid,
        name: normalizedName,
        email: normalizedEmail,
        phone: '',
      });

      await createLeadRecord({
        source: 'tool',
        sourcePage: '/register',
        name: normalizedName,
        email: normalizedEmail,
        phone: '',
        subject: 'New student signup (Google)',
        message: 'Student created an account with Google.',
        userId: credential.user.uid,
        metadata: {
          stage: 'signup_google',
        },
      });

      await createStudentProfile(profile);
      const savedProfile = await getStudentProfile(credential.user.uid);
      if (!savedProfile) {
        throw new Error('Student profile could not be created in the database. Please check Firebase rules and try again.');
      }

      await finalizeSignup(credential.user.uid, normalizedName);
    } catch (caughtError) {
      const authCode = (caughtError as AuthError | null)?.code || '';
      if (authCode === 'auth/popup-closed-by-user' || authCode === 'auth/cancelled-popup-request') {
        setError('Google sign-up was cancelled.');
      } else if (authCode === 'auth/popup-blocked') {
        setError('Popup was blocked by the browser. Please allow popups and try again.');
      } else if (authCode === 'auth/operation-not-allowed') {
        setError('Google sign-up is disabled in Firebase Authentication. Enable Google provider and try again.');
      } else if (authCode === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method.');
      } else {
        const message = (caughtError as { message?: string }).message || 'Could not sign up with Google right now.';
        setError(message);
      }
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container-narrow px-4 md:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 overflow-hidden rounded-[32px] border border-border bg-card shadow-card lg:grid-cols-[1fr_0.9fr]">
            <div className="bg-gradient-dark p-8 text-white md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Student Access</p>
              <h1 className="mt-4 font-heading text-4xl font-bold leading-tight">Create your BVF Germany dashboard</h1>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                Register once and keep track of your consultations, service progress, and profile details from one place.
              </p>
              <div className="mt-8 space-y-3 text-sm text-white/80">
                {['Instant access after signup', 'Booking visibility in your dashboard', 'Profile and preference management'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#059669]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Register</p>
              <h2 className="mt-3 text-3xl font-extrabold text-foreground">Start your account</h2>
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label htmlFor="student-register-name" className="mb-1.5 block text-sm font-semibold text-foreground">Full Name</label>
                  <input
                    id="student-register-name"
                    name="name"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="student-register-email" className="mb-1.5 block text-sm font-semibold text-foreground">Email</label>
                    <input
                      id="student-register-email"
                      name="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      type="email"
                      required
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="student-register-phone" className="mb-1.5 block text-sm font-semibold text-foreground">Phone</label>
                    <input
                      id="student-register-phone"
                      name="phone"
                      value={form.phone}
                      onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                      type="tel"
                      required
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="+91 99999 99999"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="student-register-password" className="mb-1.5 block text-sm font-semibold text-foreground">Password</label>
                    <input
                      id="student-register-password"
                      name="password"
                      value={form.password}
                      onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                      type="password"
                      required
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                  <div>
                    <label htmlFor="student-register-confirm-password" className="mb-1.5 block text-sm font-semibold text-foreground">Confirm Password</label>
                    <input
                      id="student-register-confirm-password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                      type="password"
                      required
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {successMessage && <p className="text-sm text-[#059669]">{successMessage}</p>}
                <button
                  type="submit"
                  disabled={submitting || googleSubmitting}
                  className="w-full rounded-xl bg-gradient-cta px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? 'Creating account...' : 'Create Account'}
                </button>
                <div className="flex items-center gap-3 py-1">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">or</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={submitting || googleSubmitting}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/40 disabled:opacity-60"
                >
                  {googleSubmitting ? 'Connecting Google...' : 'Continue with Google'}
                </button>
              </form>

              <p className="mt-5 text-sm text-muted-foreground">
                Already registered?{' '}
                <Link to="/login" className="font-semibold text-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
