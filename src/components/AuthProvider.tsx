import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AUTH_INACTIVITY_TIMEOUT_MS, setAuthNotice } from '@/lib/authSession';
import { getPasswordResetStatus } from '@/lib/passwordResetApi';
import { subscribeToStudentProfile, type StudentAccountStatus } from '@/lib/studentStore';
import { subscribeToAdminProfile } from '@/lib/adminStore';

type AuthContextValue = {
  user: User | null;
  /** True until Firebase has restored (or ruled out) a signed-in session. */
  loading: boolean;
  /** True while the signed-in user's student profile has not loaded yet. */
  studentProfileLoading: boolean;
  /** True while the signed-in user's admin record has not loaded yet. */
  adminProfileLoading: boolean;
  studentApproved: boolean;
  studentStatus: StudentAccountStatus | null;
  isAdmin: boolean;
  mustChangePassword: boolean;
  passwordStatusLoading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  studentProfileLoading: false,
  adminProfileLoading: false,
  studentApproved: false,
  studentStatus: null,
  isAdmin: false,
  mustChangePassword: false,
  passwordStatusLoading: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentStatus, setStudentStatus] = useState<StudentAccountStatus | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  // Each value records which user it was loaded for. Comparing it with the current user
  // closes the gap between "user restored" and "profile loaded" that used to bounce
  // signed-in users back to the login page on refresh.
  const [studentLoadedFor, setStudentLoadedFor] = useState<string | null>(null);
  const [adminLoadedFor, setAdminLoadedFor] = useState<string | null>(null);
  const [passwordStatusLoadedFor, setPasswordStatusLoadedFor] = useState<string | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setStudentStatus(null);
      setIsAdmin(false);
      setMustChangePassword(false);
      return;
    }

    const uid = user.uid;
    const unsubscribeStudent = subscribeToStudentProfile(
      uid,
      (profile) => {
        setStudentStatus(profile?.status || null);
        setStudentLoadedFor(uid);
      },
      (error) => {
        console.error('Student profile could not be loaded:', error);
        setStudentStatus(null);
        setStudentLoadedFor(uid);
      },
    );
    const unsubscribeAdmin = subscribeToAdminProfile(
      uid,
      (profile) => {
        setIsAdmin(Boolean(profile?.isAdmin));
        setAdminLoadedFor(uid);
      },
      () => {
        setIsAdmin(false);
        setAdminLoadedFor(uid);
      },
    );

    return () => {
      unsubscribeStudent();
      unsubscribeAdmin();
    };
  }, [user]);

  useEffect(() => {
    let active = true;
    if (!user) return undefined;

    const uid = user.uid;
    const loadPasswordStatus = async () => {
      try {
        const idToken = await user.getIdToken();
        const status = await getPasswordResetStatus(idToken);
        if (!active) return;
        setMustChangePassword(Boolean(status.mustChangePassword));
      } catch (error) {
        console.error('Failed to load password reset status:', error);
        if (!active) return;
        setMustChangePassword(false);
      } finally {
        if (active) setPasswordStatusLoadedFor(uid);
      }
    };

    void loadPasswordStatus();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    const clearInactivityTimer = () => {
      if (inactivityTimerRef.current !== null) {
        window.clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };

    if (!user) {
      clearInactivityTimer();
      return;
    }

    const scheduleInactivityLogout = () => {
      clearInactivityTimer();
      inactivityTimerRef.current = window.setTimeout(async () => {
        setAuthNotice({
          type: 'warning',
          message: 'You were logged out automatically after 30 minutes of inactivity.',
        });
        await signOut(auth);
      }, AUTH_INACTIVITY_TIMEOUT_MS);
    };

    const activityEvents: Array<keyof WindowEventMap> = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, scheduleInactivityLogout, { passive: true }));
    scheduleInactivityLogout();

    return () => {
      clearInactivityTimer();
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, scheduleInactivityLogout));
    };
  }, [user]);

  const uid = user?.uid ?? null;
  const studentProfileLoading = Boolean(uid) && studentLoadedFor !== uid;
  const adminProfileLoading = Boolean(uid) && adminLoadedFor !== uid;
  const passwordStatusLoading = Boolean(uid) && passwordStatusLoadedFor !== uid;
  const currentStudentStatus = studentProfileLoading ? null : studentStatus;

  const value = useMemo(
    () => ({
      user,
      loading,
      studentProfileLoading,
      adminProfileLoading,
      studentApproved: currentStudentStatus === 'approved',
      studentStatus: currentStudentStatus,
      isAdmin: !adminProfileLoading && isAdmin,
      mustChangePassword,
      passwordStatusLoading,
    }),
    [user, loading, studentProfileLoading, adminProfileLoading, currentStudentStatus, isAdmin, mustChangePassword, passwordStatusLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
