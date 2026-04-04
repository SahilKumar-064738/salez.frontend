/**
 * src/lib/api.ts — REFACTORED
 *
 * Re-exports the new typed api namespace from @/api/api for consumers
 * that import { api } from '@/api/api'.
 *
 * Also provides a legacy `api` compat shim with .get/.post/.put/.patch/.delete
 * methods for pages that use the old pattern directly (AppSidebar, RecordsPage,
 * WorkflowPage). These delegate to the same Axios client so all requests share
 * token injection and refresh logic.
 */

export { tokenStore, getApiError } from '@/api/api';
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  AuthUser,
  AuthTokens,
  Contact,
  ContactsQuery,
} from '@/api/api';

// Typed api namespace (auth, contacts, messages, etc.)
export { api as typedApi } from '@/api/api';

// Legacy helpers
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL ?? '';

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

// ── Legacy api object (.get / .post / .put / .patch / .delete) ────────────────
// Backed by the same Axios client (via apiClient shim) so auth interceptors apply.
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/apiClient';

function stripV1(path: string): string {
  // apiClient's v1() strips /api/v1 prefix internally — pass the path as-is
  return path;
}

export const api = {
  get<T>(path: string, options?: RequestInit): Promise<T> {
    return apiGet<T>(stripV1(path));
  },
  post<T>(path: string, data?: unknown, options?: RequestInit): Promise<T> {
    return apiPost<T>(stripV1(path), data);
  },
  put<T>(path: string, data?: unknown, options?: RequestInit): Promise<T> {
    return apiPut<T>(stripV1(path), data);
  },
  patch<T>(path: string, data?: unknown, options?: RequestInit): Promise<T> {
    return apiPatch<T>(stripV1(path), data);
  },
  delete<T = void>(path: string, options?: RequestInit): Promise<T> {
    return apiDelete<T>(stripV1(path));
  },
};
