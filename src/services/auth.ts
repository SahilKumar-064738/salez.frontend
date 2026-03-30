/**
 * src/services/auth.ts
 *
 * All API endpoints updated to match backend contract:
 *   POST /api/v1/auth/register  — field names: displayName, businessName (not name/companyName)
 *   POST /api/v1/auth/login     — response: { data: { accessToken, user: { displayName, ... }, tenant } }
 *   GET  /api/v1/auth/me        — response: { data: { user: { displayName, ... }, tenant } }
 *   POST /api/v1/auth/logout
 *
 * Fixes applied per architecture doc Section 4:
 *   Issue 1: register field names (name→displayName, companyName→businessName)
 *   Issue 2: normalizeUser now reads displayName not name
 *   Issue 8: base URL port fixed in lib/api.ts
 */

import { apiUrl } from "@/lib/api";

export interface AuthUser {
  id: number;
  email: string;
  name: string;         // mapped from backend's displayName
  companyName: string | null;  // mapped from backend tenant.name
  role?: string | null;
  tenantId?: number | null;
  phone?: string | null;
}

// Token storage helpers
const TOKEN_KEY = "auth_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Re-export aliases used by apiClient shim
export { getAuthToken as getToken, setAuthToken as setToken, removeAuthToken as clearToken };

/**
 * FIX (Issue 1 & 2): normalizeUser now reads displayName (not name),
 * and companyName comes from tenant.name (not a root-level field).
 * Handles both login response { data: { user, tenant } }
 * and /me response { data: { user, tenant } }.
 */
function normalizeUser(raw: any): AuthUser {
  // Backend wraps everything in { success, data: { user, tenant } }
  const payload = raw?.data ?? raw;
  const u = payload?.user ?? payload;
  const tenant = payload?.tenant ?? raw?.tenant ?? null;

  return {
    id: Number(u?.id ?? 0),
    email: u?.email ?? "",
    // Backend sends displayName (camelCase), DB stores display_name
    name: u?.displayName ?? u?.display_name ?? u?.name ?? "",
    // Company comes from the tenant object, not the user object
    companyName: tenant?.name ?? u?.businessName ?? u?.companyName ?? null,
    role: u?.role ?? null,
    tenantId: Number(u?.tenantId ?? tenant?.id ?? 0) || null,
    phone: u?.phone ?? null,
  };
}

/**
 * POST /api/v1/auth/login
 * FIX: Correct endpoint path + reads accessToken from data envelope.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(apiUrl("/api/v1/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Login failed");
  }

  // Backend login response: { success: true, data: { accessToken, refreshToken, expiresAt, user, tenant } }
  const token = data?.data?.accessToken ?? data?.accessToken ?? data?.token;
  if (token) setAuthToken(token);

  return normalizeUser(data);
}

/**
 * POST /api/v1/auth/register
 * FIX (Issue 1): Sends displayName + businessName (not name + companyName).
 * phone is not supported by the backend — omitted.
 */
export async function signupUser(data: {
  name: string;            // maps to displayName
  companyName?: string;    // maps to businessName
  businessName?: string;
  email: string;
  password: string;
  phone?: string;          // backend ignores this but we accept it gracefully
}): Promise<AuthUser> {
  const res = await fetch(apiUrl("/api/v1/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      displayName: data.name,                                    // ← renamed
      businessName: data.businessName ?? data.companyName ?? "", // ← renamed
      email: data.email,
      password: data.password,
      // phone intentionally omitted — not in backend RegisterSchema
    }),
  });

  const text = await res.text();
  let responseData: any = null;
  try { responseData = text ? JSON.parse(text) : null; } catch { responseData = null; }

  if (!res.ok) {
    throw new Error(responseData?.error || responseData?.message || "Signup failed");
  }

  // Backend register response: { success: true, data: { accessToken, refreshToken, tenant, user? } }
  const token =
    responseData?.data?.accessToken ??
    responseData?.accessToken ??
    responseData?.token;

  if (token) setAuthToken(token);

  // If register response has no user object, we'll call /me after token is stored
  // (per the architecture doc note on register response)
  if (!responseData?.data?.user) {
    try {
      return await fetchMe() ?? normalizeUser(responseData);
    } catch {
      return normalizeUser(responseData);
    }
  }

  return normalizeUser(responseData);
}

/**
 * GET /api/v1/auth/me
 * FIX: Correct endpoint path + reads from { data: { user, tenant } } envelope.
 */
export async function fetchMe(): Promise<AuthUser | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(apiUrl("/api/v1/auth/me"), {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      removeAuthToken();
      return null;
    }

    if (!res.ok) return null;

    const data = await res.json();
    return normalizeUser(data);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

/**
 * POST /api/v1/auth/logout
 */
export async function logoutUser(): Promise<void> {
  const token = getAuthToken();
  try {
    await fetch(apiUrl("/api/v1/auth/logout"), {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    removeAuthToken();
  }
}

/**
 * POST /api/v1/auth/refresh
 */
export async function refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresAt: number } | null> {
  try {
    const res = await fetch(apiUrl("/api/v1/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const newToken = data?.data?.accessToken ?? data?.accessToken;
    if (newToken) setAuthToken(newToken);

    return data?.data ?? null;
  } catch {
    return null;
  }
}
