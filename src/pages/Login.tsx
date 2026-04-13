import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  type AuthError,
  type User,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import {
  clearNewUserReviewAccess,
  consumeAuthNotice,
  getRememberMePreference,
  grantNewUserReviewAccess,
  setAuthNotice,
  setRememberMePreference,
  type AuthNotice,
} from '@/lib/authSession';
import { getPasswordResetStatus } from '@/lib/passwordResetApi';
import {
  getStudentProfile,
  markStudentLoginSeen,
  type StudentAccountStatus,
} from '@/lib/studentStore';
import { useSeo } from '@/lib/useSeo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function LoginPage() {
  useSeo({
    title: 'Login | BVF Germany',
    description: 'Sign in to your BVF Germany student dashboard to view bookings, service progress, and your profile.',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: getRememberMePreference(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<AuthNotice | null>(null);

  useEffect(() => {
    const sessionNotice = consumeAuthNotice();
    if (sessionNotice) {
      setNotice(sessionNotice);
      return;
    }

    const routeState = location.state as {
      requiresApproval?: boolean;
      verificationNotice?: boolean;
      studentStatus?: StudentAccountStatus | null;
    } | null;
    if (routeState?.requiresApproval && (routeState.studentStatus === 'rejected' || routeState.studentStatus === 'suspended')) {
      setNotice({
        type: 'warning',
        message:
          routeState.studentStatus === 'rejected'
            ? 'Your registration was not approved. Contact admin for support.'
            : routeState.studentStatus === 'suspended'
              ? 'Your account is suspended. Please contact admin.'
              : '',
      });
      return;
    }

    if (routeState?.verificationNotice) {
      setNotice({
        type: 'info',
        message: 'Account created successfully. You can now sign in.',
      });
    }
  }, [location.state]);

  const getLoginErrorMessage = (caughtError: unknown) => {
    const authError = caughtError as AuthError & { message?: string };
    const code = authError.code || '';
    const message = authError.message || '';

    if (code === 'auth/invalid-credential' || message.includes('invalid-credential')) {
      return 'Invalid email or password.';
    }

    if (code === 'auth/user-disabled') {
      return 'This account has been disabled. Please contact BVF support.';
    }

    if (code === 'auth/too-many-requests') {
      return 'Too many login attempts. Please wait a few minutes and try again.';
    }

    if (code === 'auth/network-request-failed') {
      return 'Network error while contacting Firebase. If you use Firefox strict tracking, VPN/proxy, or ad blockers, allow *.googleapis.com and *.firebaseio.com, then retry. If this fails only on localhost, also verify API key origin restrictions include this dev URL.';
    }

    if (code === 'auth/invalid-email') {
      return 'Enter a valid email address.';
    }

    if (code === 'auth/operation-not-allowed' || message.includes('operation-not-allowed')) {
      return 'Email/password sign-in is disabled in Firebase. Enable Email/Password in the Firebase console.';
    }

    if (code === 'auth/invalid-api-key') {
      return 'Firebase configuration is invalid. Please check the API key setup.';
    }

    if (code === 'auth/app-deleted' || code === 'auth/invalid-app-credential') {
      return 'Authentication app configuration is invalid. Please verify the Firebase setup.';
    }

    return 'Unable to sign you in right now.';
  };

  const getBlockedStatusMessage = (status: StudentAccountStatus | null | undefined) =>
    status === 'rejected'
      ? 'Your registration was not approved. Contact admin for support.'
      : status === 'suspended'
        ? 'Your account is suspended. Please contact admin.'
        : 'Your account is not allowed to sign in right now.';

  const isBlockedStatus = (status: StudentAccountStatus | null | undefined) =>
    status === 'rejected' || status === 'suspended';

  const finishStudentLogin = async (uid: string) => {
    const isFirstApprovedLogin = await markStudentLoginSeen(uid);
    if (isFirstApprovedLogin) {
      grantNewUserReviewAccess();
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        const status = await getPasswordResetStatus(idToken);
        if (status.mustChangePassword) {
          navigate('/change-password', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Password reset status lookup failed:', error);
      }
    }

    const nextPath = (location.state as { from?: string } | null)?.from || '/dashboard';
    navigate(nextPath, { replace: true });
  };

  const getLoginProfileOrThrow = async (user: User) => {
    const profile = await getStudentProfile(user.uid);
    if (!profile) {
      throw new Error('No student account found for this user. Please register first.');
    }
    return profile;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice(null);
    clearNewUserReviewAccess();

    try {
      setSubmitting(true);
      setRememberMePreference(form.rememberMe);
      await setPersistence(auth, form.rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      const profile = await getLoginProfileOrThrow(credential.user);
      if (isBlockedStatus(profile?.status)) {
        await signOut(auth);
        setAuthNotice({
          type: 'warning',
          message: getBlockedStatusMessage(profile?.status),
        });
        navigate('/login', {
          replace: true,
          state: { requiresApproval: true, studentStatus: profile?.status || null },
        });
        return;
      }

      await finishStudentLogin(credential.user.uid);
    } catch (caughtError) {
      const message = (caughtError as { message?: string } | null)?.message || '';
      if (message.includes('No student account found')) {
        await signOut(auth);
        setError('No student account found. Please create your account from the Register page first.');
        return;
      }

      console.error('Student login failed:', caughtError);
      setError(getLoginErrorMessage(caughtError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setNotice(null);
    clearNewUserReviewAccess();

    try {
      setGoogleSubmitting(true);
      setRememberMePreference(form.rememberMe);
      await setPersistence(auth, form.rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithPopup(auth, googleProvider);
      const profile = await getLoginProfileOrThrow(credential.user);

      if (isBlockedStatus(profile?.status)) {
        await signOut(auth);
        setAuthNotice({
          type: 'warning',
          message: getBlockedStatusMessage(profile?.status || null),
        });
        navigate('/login', {
          replace: true,
          state: { requiresApproval: true, studentStatus: profile?.status || null },
        });
        return;
      }

      await finishStudentLogin(credential.user.uid);
    } catch (caughtError) {
      const currentUser = auth.currentUser;
      const message = (caughtError as { message?: string } | null)?.message || '';
      if (currentUser && message.includes('No student account found')) {
        try {
          await currentUser.delete();
        } catch (deleteError) {
          console.warn('Could not delete unexpected sign-in user:', deleteError);
        }
        await signOut(auth);
        setError('No student account found. Please create your account from the Register page first.');
        setGoogleSubmitting(false);
        return;
      }

      const code = (caughtError as AuthError | null)?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setError('Google sign-in was cancelled.');
      } else if (code === 'auth/popup-blocked') {
        setError('Popup was blocked by the browser. Please allow popups and try again.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Google sign-in is disabled in Firebase Authentication. Enable Google provider and try again.');
      } else if (code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method.');
      } else {
        setError(getLoginErrorMessage(caughtError));
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
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 overflow-hidden rounded-[32px] border border-border bg-card shadow-card lg:grid-cols-[0.95fr_1fr]">
            <div className="p-8 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-secondary">Student Login</p>
              <h1 className="mt-3 text-3xl font-extrabold text-foreground">Welcome back</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Sign in to access your bookings, active services, and personal study dashboard.
              </p>
              {notice ? (
                <div
                  className={`mt-4 rounded-2xl border p-4 text-sm ${
                    notice.type === 'warning'
                      ? 'border-secondary/20 bg-secondary/10 text-foreground'
                      : notice.type === 'success'
                        ? 'border-accent/20 bg-accent/10 text-foreground'
                        : 'border-primary/15 bg-primary/10 text-foreground'
                  }`}
                >
                  {notice.message}
                </div>
              ) : null}
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label htmlFor="student-login-email" className="mb-1.5 block text-sm font-semibold text-foreground">Email</label>
                  <input
                    id="student-login-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="student-login-password" className="mb-1.5 block text-sm font-semibold text-foreground">Password</label>
                  <input
                    id="student-login-password"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your password"
                  />
                  <div className="mt-2 text-right">
                    <Link to="/forgot-password" className="text-sm font-semibold text-primary">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
                <label className="flex items-center gap-3 text-sm text-muted-foreground">
                  <input
                    id="student-login-remember"
                    name="rememberMe"
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={(event) => setForm((current) => ({ ...current, rememberMe: event.target.checked }))}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  Remember me on this device
                </label>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting || googleSubmitting}
                  className="w-full rounded-xl bg-gradient-cta px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? 'Signing in...' : 'Sign In'}
                </button>
                <div className="flex items-center gap-3 py-1">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">or</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={submitting || googleSubmitting}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/40 disabled:opacity-60"
                >
                  {googleSubmitting ? 'Connecting Google...' : 'Continue with Google'}
                </button>
              </form>
              <p className="mt-5 text-sm text-muted-foreground">
                New here?{' '}
                <Link to="/register" className="font-semibold text-primary">
                  Create your account
                </Link>
              </p>
            </div>

            <div className="bg-gradient-dark p-8 text-white md:p-10">
              <h2 className="font-heading text-4xl font-bold leading-tight">One dashboard for your Germany journey</h2>
              <div className="mt-8 space-y-4 text-sm text-white/80">
                {[ 
                  'Instant access after account creation',
                  'Track consultation bookings',
                  'View service progress updated by the BVF team',
                  'Manage your student profile and preference details',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#059669]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
