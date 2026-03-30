/**
 * src/services/authService.ts
 * Thin wrapper that delegates to services/auth.ts.
 * Field names updated to match backend contract (Issue 1).
 */

import { loginUser, signupUser, fetchMe, getAuthToken, setAuthToken, removeAuthToken } from "@/services/auth";
import type { AuthUser } from "@/services/auth";

export type { AuthUser };

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;          // maps to displayName in the API call
  email: string;
  password: string;
  companyName?: string;  // maps to businessName in the API call
  phone?: string;        // accepted here, not forwarded (not in backend schema)
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const authService = {
  /**
   * Login — returns { token, user } so AuthContext can store both
   */
  async login(payload: LoginPayload): Promise<{ token: string; user: AuthUser }> {
    const user = await loginUser(payload.email, payload.password);
    const token = getAuthToken();
    if (!token) throw new Error("Token not received from server");
    return { token, user };
  },

  /**
   * Register — returns { token, user }
   * FIX (Issue 1): passes name as displayName, companyName as businessName
   */
  async register(payload: RegisterPayload): Promise<{ token: string; user: AuthUser }> {
    const user = await signupUser({
      name: payload.name,           // signupUser maps this to displayName
      companyName: payload.companyName,
      email: payload.email,
      password: payload.password,
      // phone intentionally not forwarded — not in backend RegisterSchema
    });
    const token = getAuthToken();
    if (!token) throw new Error("Token not received from server");
    return { token, user };
  },

  /**
   * Get current user from /api/v1/auth/me
   */
  async me(): Promise<AuthUser | null> {
    return fetchMe();
  },

  /**
   * Store token in localStorage
   */
  setAuth(token: string) {
    setAuthToken(token);
  },

  /**
   * Logout — clear token
   */
  logout(): void {
    removeAuthToken();
  },
};
