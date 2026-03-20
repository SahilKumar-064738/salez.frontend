/**
 * src/services/authService.ts
 * Thin wrapper that delegates to services/auth.ts.
 * Keeps the new version's authService interface intact.
 */

import { loginUser, signupUser, fetchMe, getAuthToken, setAuthToken, removeAuthToken } from "@/services/auth";
import type { AuthUser } from "@/services/auth";

export type { AuthUser };

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  phone?: string;
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
    // loginUser stores token in localStorage and returns user
    const user = await loginUser(payload.email, payload.password);
    const token = getAuthToken();
    if (!token) throw new Error("Token not received from server");
    return { token, user };
  },

  /**
   * Register — returns { token, user }
   */
  async register(payload: RegisterPayload): Promise<{ token: string; user: AuthUser }> {
    const user = await signupUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      companyName: payload.companyName,
      phone: payload.phone,
    });
    const token = getAuthToken();
    if (!token) throw new Error("Token not received from server");
    return { token, user };
  },

  /**
   * Get current user from /api/auth/me
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
