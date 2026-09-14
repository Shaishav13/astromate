import {
  ChatResponse,
  MessagesResponse,
  MateResponse,
  HealthResponse,
} from '@astromate/shared';

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3001';

/** Gets the stored auth token from localStorage */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('astromate_token');
}

/** Stores auth data after login/signup */
export function storeAuthData(data: {
  token: string;
  userId: string;
  userName: string;
  mateName: string;
  zodiacSign: string;
  country: string;
}) {
  localStorage.setItem('astromate_token', data.token);
  localStorage.setItem('astromate_user_id', data.userId);
  localStorage.setItem('astromate_user_name', data.userName);
  localStorage.setItem('astromate_mate_name', data.mateName);
  localStorage.setItem('astromate_zodiac', data.zodiacSign);
  localStorage.setItem('astromate_country', data.country);
}

/** Clears all auth data (logout) */
export function clearAuthData() {
  ['astromate_token', 'astromate_user_id', 'astromate_user_name',
   'astromate_mate_name', 'astromate_zodiac', 'astromate_country',
   'astromate_wallpaper'].forEach((k) => localStorage.removeItem(k));
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${SERVER_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/** Sign up a new user */
export async function signup(data: {
  name: string;
  email: string;
  password: string;
  birthdate: string;
  country: string;
}): Promise<any> {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Log in an existing user */
export async function login(data: {
  email: string;
  password: string;
}): Promise<any> {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Log out */
export async function logout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  clearAuthData();
}

/** Send a message and get AI response */
export async function sendMessage(
  userId: string,
  message: string
): Promise<ChatResponse> {
  return apiFetch<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ userId, message }),
  });
}

/** Fetch paginated message history */
export async function getMessages(
  userId: string,
  page = 1
): Promise<MessagesResponse> {
  return apiFetch<MessagesResponse>(`/api/messages/${userId}?page=${page}`);
}

/** Get the AstroMate profile */
export async function getMateProfile(userId: string): Promise<MateResponse> {
  return apiFetch<MateResponse>(`/api/mate/${userId}`);
}

/** Check server health */
export async function checkHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>('/api/health');
}
