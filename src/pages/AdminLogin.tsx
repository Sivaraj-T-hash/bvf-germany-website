import { useEffect, useState } from 'react';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  type AuthError,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { getAdminProfile, touchAdminLogin } from '@/lib/adminStore';
import { getRememberMePreference, setRememberMePreference } from '@/lib/authSession';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(getRememberMePreference());
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const routeState = location.state as { unauthorized?: boolean } | null;
    if (routeState?.unauthorized) {
      setNotice('This account is not marked as an admin in Firebase Realtime Database.');
    }
  }, [location.state]);

  const getAuthErrorMessage = (caughtError: unknown) => {
    const code = (caughtError as AuthError | null)?.code || '';

    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-email':
        return 'Invalid admin email or password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Try again later or reset the password in Firebase Authentication.';
      case 'auth/operation-not-allowed':
        return 'Email/password sign-in is disabled in Firebase Authentication.';
      case 'auth/user-disabled':
        return 'This Firebase admin user has been disabled.';
      case 'auth/network-request-failed':
        return 'Network error while contacting Firebase. If you use Firefox strict tracking, VPN/proxy, or ad blockers, allow *.googleapis.com and *.firebaseio.com, then retry. If this fails only on localhost, also verify API key origin restrictions include this dev URL.';
      default:
        return `Unable to sign in to the admin panel right now.${code ? ` Firebase says: ${code}.` : ''}`;
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');

    try {
      setSubmitting(true);
      setRememberMePreference(rememberMe);
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const adminProfile = await getAdminProfile(credential.user.uid);

      if (!adminProfile?.isAdmin) {
        await signOut(auth);
        setError('This Firebase account is not authorized for admin access.');
        return;
      }

      await touchAdminLogin(credential.user.uid);
      navigate('/admin/dashboard', { replace: true });
    } catch (caughtError) {
      console.error('Admin login failed:', caughtError);
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="site-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute left-[-4rem] top-[10%] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-[-4rem] bottom-[10%] h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="surface-panel relative z-10 w-full max-w-[980px] overflow-hidden p-3 md:p-4">
        <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] bg-gradient-dark p-8 text-white md:p-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck className="h-7 w-7 text-[#FFCE00]" aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#FFCE00]">BVF Admin</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold md:text-5xl">Secure founder access for the operations team.</h1>
            <p className="mt-4 text-sm leading-7 text-white/72">
              Use this sign-in only for internal admin management. Sessions are backed by Firebase Authentication and
              checked against your admin profile before dashboard access is granted.
            </p>
          </div>

          <div className="rounded-[30px] bg-white/88 p-8 md:p-10">
            <p className="section-kicker">Sign In</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-foreground">Admin Login</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Founder access via Firebase Authentication.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold text-foreground">
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError('');
                  }}
                  placeholder="founder@bvfgermany.com…"
                  className="input-premium"
                  required
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-foreground">
                  Password
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  placeholder="Enter admin password…"
                  className="input-premium"
                  required
                />
              </div>

              <label className="flex items-center gap-3 rounded-[20px] bg-muted/65 px-4 py-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Remember this admin session
              </label>

              <p aria-live="polite" className={`text-xs ${notice ? 'text-primary' : error ? 'text-destructive' : 'text-muted-foreground'}`}>
                {notice || error || 'Only Firebase accounts marked as admins can enter the dashboard.'}
              </p>

              <button type="submit" disabled={submitting} className="button-primary w-full disabled:opacity-60">
                {submitting ? 'Signing In…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
