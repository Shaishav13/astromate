import {
  OnboardRequest,
  OnboardResponse,
  ChatResponse,
  MessagesResponse,
  MateResponse,
  HealthResponse,
} from '@astromate/shared';

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3001';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${SERVER_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/** Onboard a new user or retrieve existing user data */
export async function onboardUser(data: OnboardRequest): Promise<OnboardResponse> {
  return apiFetch<OnboardResponse>('/api/onboard', {
    method: 'POST',
    body: JSON.stringify(data),
  });
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
