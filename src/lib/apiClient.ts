/**
 * src/lib/apiClient.ts
 * Token helpers + typed wrappers around the central apiFetch.
 * Uses TOKEN_KEY="auth_token" — same as working version.
 */

import { apiFetch } from "@/lib/api";

const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(t: string): void {
  localStorage.setItem(TOKEN_KEY, t);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Typed wrappers ───────────────────────────────────────

/** GET — supports optional query params object */
export async function apiGet<T>(
  path: string,
  config?: { params?: Record<string, string> }
): Promise<T> {
  let finalPath = path;
  if (config?.params) {
    const qs = new URLSearchParams(config.params).toString();
    if (qs) finalPath = `${path}?${qs}`;
  }
  return apiFetch<T>(finalPath, { method: "GET" });
}

export async function apiPost<T>(path: string, data?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export async function apiPut<T>(path: string, data?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "PUT",
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export async function apiPatch<T>(path: string, data?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "PATCH",
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete<T = void>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: "DELETE" });
}

export default { get: apiGet, post: apiPost, put: apiPut, patch: apiPatch, delete: apiDelete };
