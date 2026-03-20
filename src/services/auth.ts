import { apiUrl } from "@/lib/api";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  companyName: string | null;
  phone?: string | null;
}

// Token storage helpers — key MUST match "auth_token"
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

// Helper to safely normalize user object from backend
function normalizeUser(data: any): AuthUser {
  const user = data?.user ?? data?.data?.user ?? data;

  return {
    id: Number(user?.id ?? 0),
    email: user?.email ?? "",
    name: user?.name ?? "",
    companyName: user?.companyName ?? user?.company_name ?? user?.businessName ?? null,
    phone: user?.phone ?? null,
  };
}

/**
 * POST /api/auth/login
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  const token = data?.token ?? data?.accessToken ?? data?.data?.token;
  if (token) setAuthToken(token);

  return normalizeUser(data);
}

/**
 * POST /api/auth/register
 */
export async function signupUser(data: {
  name: string;
  companyName?: string;
  businessName?: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<AuthUser> {
  const res = await fetch(apiUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: data.name,
      companyName: data.companyName || data.businessName || null,
      email: data.email,
      password: data.password,
      phone: data.phone || null,
    }),
  });

  const text = await res.text();
  let responseData: any = null;
  try { responseData = text ? JSON.parse(text) : null; } catch { responseData = null; }

  if (!res.ok) {
    throw new Error(responseData?.message || "Signup failed");
  }

  const token =
    responseData?.token ??
    responseData?.accessToken ??
    responseData?.data?.token;

  if (token) setAuthToken(token);

  return normalizeUser(responseData);
}

/**
 * GET /api/auth/me
 */
export async function fetchMe(): Promise<AuthUser | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(apiUrl("/api/auth/me"), {
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
 * POST /api/auth/logout
 */
export async function logoutUser(): Promise<void> {
  const token = getAuthToken();
  try {
    await fetch(apiUrl("/api/auth/logout"), {
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
