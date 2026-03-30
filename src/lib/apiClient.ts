/**
 * src/lib/apiClient.ts
 * Token helpers + typed wrappers around the central apiFetch.
 * All paths go through /api/v1 to match the backend mount point.
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

// ── Path helper ───────────────────────────────────────────
// Ensures every service call goes to /api/v1/<path>
// Services pass paths like "/contacts" or "/api/v1/contacts" — both handled.
function v1(path: string): string {
  if (path.startsWith("/api/v1")) return path;
  if (path.startsWith("/api/")) {
    // Old-style /api/contacts → /api/v1/contacts
    return path.replace("/api/", "/api/v1/");
  }
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/api/v1${clean}`;
}

// ── Typed wrappers ───────────────────────────────────────

/** GET — supports optional query params object */
export async function apiGet<T>(
  path: string,
  config?: { params?: Record<string, string> }
): Promise<T> {
  let finalPath = v1(path);
  if (config?.params) {
    const qs = new URLSearchParams(config.params).toString();
    if (qs) finalPath = `${finalPath}?${qs}`;
  }
  return apiFetch<T>(finalPath, { method: "GET" });
}

export async function apiPost<T>(path: string, data?: unknown): Promise<T> {
  return apiFetch<T>(v1(path), {
    method: "POST",
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export async function apiPut<T>(path: string, data?: unknown): Promise<T> {
  return apiFetch<T>(v1(path), {
    method: "PUT",
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export async function apiPatch<T>(path: string, data?: unknown): Promise<T> {
  return apiFetch<T>(v1(path), {
    method: "PATCH",
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete<T = void>(path: string): Promise<T> {
  return apiFetch<T>(v1(path), { method: "DELETE" });
}

export default { get: apiGet, post: apiPost, put: apiPut, patch: apiPatch, delete: apiDelete };

