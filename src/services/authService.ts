/**
 * src/services/authService.ts — REFACTORED
 * Thin wrapper delegating to services/auth.ts which now uses @/api/api.
 */

import { loginUser, signupUser, fetchMe, getAuthToken, setAuthToken, removeAuthToken } from '@/services/auth';
import type { AuthUser } from '@/services/auth';

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
  businessType?: string;
  phone?: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ token: string; user: AuthUser }> {
    const user = await loginUser(payload.email, payload.password);
    const token = getAuthToken();
    if (!token) throw new Error('Token not received from server');
    return { token, user };
  },

  async register(payload: RegisterPayload): Promise<{ token: string; user: AuthUser }> {
    removeAuthToken();
    const user = await signupUser({
      name: payload.name,
      companyName: payload.companyName,
      email: payload.email,
      password: payload.password,
    });
    const token = getAuthToken();
    if (!token) throw new Error('Token not generated. Please try logging in.');
    return { token, user };
  },

  async me(): Promise<AuthUser | null> {
    return fetchMe();
  },

  setAuth(token: string) {
    setAuthToken(token);
  },

  logout(): void {
    removeAuthToken();
  },
};
