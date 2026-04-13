import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AUTH_INACTIVITY_TIMEOUT_MS, setAuthNotice } from '@/lib/authSession';
import { getPasswordResetStatus } from '@/lib/passwordResetApi';
import { subscribeToStudentProfile, type StudentAccountStatus } from '@/lib/studentStore';
import { subscribeToAdminProfile } from '@/lib/adminStore';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  studentApproved: boolean;
  studentStatus: StudentAccountStatus | null;
  isAdmin: boolean;
  mustChangePassword: boolean;
  passwordStatusLoading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  studentApproved: false,
  studentStatus: null,
  isAdmin: false,
  mustChangePassword: false,
  passwordStatusLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentApproved, setStudentApproved] = useState(false);
  const [studentStatus, setStudentStatus] = useState<StudentAccountStatus | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [passwordStatusLoading, setPasswordStatusLoading] = useState(true);
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
      setStudentApproved(false);
      setStudentStatus(null);
      setIsAdmin(false);
      setMustChangePassword(false);
      setPasswordStatusLoading(false);
      return;
    }

    const unsubscribeStudent = subscribeToStudentProfile(user.uid, (profile) => {
      setStudentApproved(profile?.status === 'approved' || profile?.status === 'pending_approval');
      setStudentStatus(profile?.status || null);
    });
    const unsubscribeAdmin = subscribeToAdminProfile(user.uid, (profile) => {
      setIsAdmin(Boolean(profile?.isAdmin));
    });

    return () => {
      unsubscribeStudent();
      unsubscribeAdmin();
    };
  }, [user]);

  useEffect(() => {
    let active = true;

    const loadPasswordStatus = async () => {
      if (!user) {
        return;
      }

      try {
        setPasswordStatusLoading(true);
        const idToken = await user.getIdToken();
        const status = await getPasswordResetStatus(idToken);
        if (!active) return;
        setMustChangePassword(Boolean(status.mustChangePassword));
      } catch (error) {
        console.error('Failed to load password reset status:', error);
        if (!active) return;
        setMustChangePassword(false);
      } finally {
        if (active) {
          setPasswordStatusLoading(false);
        }
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

  const value = useMemo(
    () => ({ user, loading, studentApproved, studentStatus, isAdmin, mustChangePassword, passwordStatusLoading }),
    [user, loading, studentApproved, studentStatus, isAdmin, mustChangePassword, passwordStatusLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
