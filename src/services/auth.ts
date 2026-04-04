/**
 * src/services/auth.ts — REFACTORED
 * Delegates to the typed Axios api client in @/api/api.
 * tokenStore now uses 'access_token' / 'refresh_token' keys.
 */

import { api, tokenStore } from '@/api/api';
import type { AuthUser as ApiAuthUser } from '@/api/api';

export interface AuthUser {
  id: number;
  email: string;
  name: string;          // mapped from backend's displayName
  companyName: string | null;  // mapped from tenant.name
  role?: string | null;
  tenantId?: number | null;
  phone?: string | null;
}

// Token storage helpers — delegates to tokenStore
export function getAuthToken(): string | null {
  const t = tokenStore.getAccess();
  return t || null;
}
export function setAuthToken(token: string): void {
  const refresh = tokenStore.getRefresh();
  tokenStore.set(token, refresh);
}
export function removeAuthToken(): void {
  tokenStore.clear();
}

// Aliases for backward compat
export { getAuthToken as getToken, setAuthToken as setToken, removeAuthToken as clearToken };

function normalizeApiUser(u: ApiAuthUser, tenant?: any): AuthUser {
  return {
    id: Number(u.id ?? 0),
    email: u.email ?? '',
    name: u.displayName ?? '',
    companyName: tenant?.name ?? null,
    role: u.role ?? null,
    tenantId: Number(u.tenantId ?? 0) || null,
    phone: null,
  };
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const data = await api.auth.login({ email, password });
  // tokenStore.set() already called by api.auth.login
  return normalizeApiUser(data.user, (data as any).tenant);
}

export async function signupUser(data: {
  name: string;
  companyName?: string;
  businessName?: string;
  businessType?: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<AuthUser> {
  const resp = await api.auth.register({
    displayName: data.name,
    businessName: data.businessName ?? data.companyName ?? '',
    email: data.email,
    password: data.password,
  });
  // tokenStore.set() already called by api.auth.register
  // Register response may not include user object — call /me
  try {
    return await fetchMe() ?? {
      id: 0,
      email: data.email,
      name: data.name,
      companyName: data.companyName ?? null,
      role: null,
      tenantId: Number((resp as any).tenantId ?? 0) || null,
      phone: null,
    };
  } catch {
    return {
      id: 0,
      email: data.email,
      name: data.name,
      companyName: data.companyName ?? null,
      role: null,
      tenantId: Number((resp as any).tenantId ?? 0) || null,
      phone: null,
    };
  }
}

export async function fetchMe(): Promise<AuthUser | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const data = await api.auth.me();
    return normalizeApiUser(data, (data as any).tenant);
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.auth.logout();
  } catch {
    tokenStore.clear();
  }
}

export async function refreshToken(rt: string): Promise<{ accessToken: string; refreshToken: string; expiresAt: number } | null> {
  try {
    const data = await api.auth.refresh();
    return data;
  } catch {
    return null;
  }
}
