export const AUTH_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

const AUTH_NOTICE_KEY = 'bvf_auth_notice';
const AUTH_REMEMBER_ME_KEY = 'bvf_auth_remember_me';
const NEW_USER_REVIEW_ACCESS_KEY = 'bvf_new_user_review_access';

export type AuthNotice = {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
};

export function setAuthNotice(notice: AuthNotice) {
  sessionStorage.setItem(AUTH_NOTICE_KEY, JSON.stringify(notice));
}

export function consumeAuthNotice(): AuthNotice | null {
  const raw = sessionStorage.getItem(AUTH_NOTICE_KEY);
  if (!raw) return null;

  sessionStorage.removeItem(AUTH_NOTICE_KEY);

  try {
    return JSON.parse(raw) as AuthNotice;
  } catch {
    return null;
  }
}

export function setRememberMePreference(value: boolean) {
  localStorage.setItem(AUTH_REMEMBER_ME_KEY, JSON.stringify(value));
}

export function getRememberMePreference(defaultValue = true): boolean {
  const raw = localStorage.getItem(AUTH_REMEMBER_ME_KEY);
  if (!raw) return defaultValue;

  try {
    return JSON.parse(raw) as boolean;
  } catch {
    return defaultValue;
  }
}

export function grantNewUserReviewAccess() {
  sessionStorage.setItem(NEW_USER_REVIEW_ACCESS_KEY, '1');
}

export function clearNewUserReviewAccess() {
  sessionStorage.removeItem(NEW_USER_REVIEW_ACCESS_KEY);
}

export function hasNewUserReviewAccess() {
  return sessionStorage.getItem(NEW_USER_REVIEW_ACCESS_KEY) === '1';
}
