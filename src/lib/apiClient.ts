/**
 * src/lib/apiClient.ts — REFACTORED
 *
 * All HTTP calls now go through a shared Axios instance that mirrors
 * the interceptors in @/api/api (Bearer token injection, 401 redirect).
 * The old fetch-based helpers are preserved as typed wrappers so existing
 * imports continue to work without changes.
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "@/api/api";

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:4000/api/v1";

const _client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

_client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

_client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      window.location.href = "/login";
    }

    // ✅ ADD THIS — prints the exact Zod/Joi field errors causing 422
    if (error.response?.status === 422) {
      console.error(
        "🔴 422 VALIDATION DETAIL:",
        JSON.stringify(error.response.data, null, 2),
      );
    }

    return Promise.reject(error);
  },
);

/**
 * Strips common path prefixes so callers can pass either:
 *   /api/v1/contacts   → /contacts   (baseURL already has /api/v1)
 *   /api/contacts      → /contacts
 *   /contacts          → /contacts
 */
function normalise(path: string): string {
  if (path.startsWith("/api/v1")) return path.replace("/api/v1", "");
  if (path.startsWith("/api/")) return path.replace("/api/", "/");
  return path.startsWith("/") ? path : `/${path}`;
}

// ── Token helpers ─────────────────────────────────────────────────────────────
export function getToken(): string | null {
  return tokenStore.getAccess() || null;
}
export function setToken(access: string, refresh?: string): void {
  tokenStore.set(access, refresh ?? tokenStore.getRefresh());
}
export function clearToken(): void {
  tokenStore.clear();
}

// ── Request helpers ───────────────────────────────────────────────────────────
export async function apiGet<T>(
  path: string,
  config?: { params?: Record<string, string> },
): Promise<T> {
  const res = await _client.get<T>(normalise(path), { params: config?.params });
  return res.data;
}

export async function apiPost<T>(path: string, data?: unknown): Promise<T> {
  const res = await _client.post<T>(normalise(path), data);
  return res.data;
}

export async function apiPut<T>(path: string, data?: unknown): Promise<T> {
  const res = await _client.put<T>(normalise(path), data);
  return res.data;
}

export async function apiPatch<T>(path: string, data?: unknown): Promise<T> {
  const res = await _client.patch<T>(normalise(path), data);
  return res.data;
}

export async function apiDelete<T = void>(path: string): Promise<T> {
  const res = await _client.delete<T>(normalise(path));
  return res.data;
}

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
};
