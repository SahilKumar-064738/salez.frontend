/**
 * src/lib/api.ts — PATCHED
 *
 * WHAT CHANGED vs existing:
 *   1. apiFetch now reads the JWT from localStorage and attaches it as
 *      Authorization: Bearer <token> on every request.
 *      The JWT is what the backend authMiddleware validates; the tenantId
 *      is extracted from the user profile associated with that JWT.
 *      No explicit X-Tenant-ID header is needed — tenant is resolved server-side.
 *
 *   2. 401 responses auto-clear the stored token so the user is redirected
 *      to login rather than getting a stuck state.
 *
 *   3. API_BASE_URL is read from import.meta.env.VITE_API_URL so it works
 *      both in development (localhost:4000) and production.
 *
 * The existing apiClient.ts (apiGet, apiPost, apiPatch, apiDelete) calls this
 * function and is UNCHANGED.
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL ?? '';

const TOKEN_KEY = 'auth_token';

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };

  // Attach JWT — backend resolves tenantId from user profile
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Auto-logout on 401
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    // Trigger re-render by dispatching a storage event
    window.dispatchEvent(new Event('storage'));
  }

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      errorMessage = body?.message ?? body?.error ?? errorMessage;
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMessage);
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return res.json() as Promise<T>;
}