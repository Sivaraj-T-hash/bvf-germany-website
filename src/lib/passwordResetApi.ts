const apiBase = (import.meta.env.VITE_AUTH_API_BASE_URL || '').replace(/\/$/, '');

type PasswordStatusResponse = {
  success: boolean;
  mustChangePassword: boolean;
  isExpired: boolean;
  expiresAt: number | null;
};

type ApiResponse = {
  success: boolean;
  message?: string;
};

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    const message = json?.message || 'Request failed.';
    throw new Error(message);
  }

  return json;
}

export async function requestPasswordResetEmail(email: string): Promise<ApiResponse> {
  return postJson<ApiResponse>('/api/auth/forgot-password', { email });
}

export async function resetPasswordWithOtp(input: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse> {
  return postJson<ApiResponse>('/api/auth/reset-password-with-otp', input);
}

export async function getPasswordResetStatus(idToken: string): Promise<PasswordStatusResponse> {
  return postJson<PasswordStatusResponse>('/api/auth/password-status', { idToken });
}

export async function changePasswordWithTemporary(input: {
  idToken: string;
  temporaryPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse> {
  return postJson<ApiResponse>('/api/auth/change-password', input);
}

export async function sendWelcomeEmailForSignup(input: {
  idToken: string;
  name?: string;
}): Promise<ApiResponse> {
  return postJson<ApiResponse>('/api/auth/send-welcome-email', input);
}
