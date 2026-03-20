/**
 * src/hooks/use-auth.ts
 * Auth hooks — use AuthContext for state, authService for API calls.
 */

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/services/authService";

export { useAuth };

// ─────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────
export function useLogin(onLoggedIn?: () => void) {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      return await authService.login(data);
    },

    onSuccess: async ({ user, token }) => {
      // Store token + user in context (also writes to localStorage)
      login(token, user);
      // Give React one tick to flush state before navigating
      await new Promise((resolve) => setTimeout(resolve, 0));
      onLoggedIn?.();
    },

    onError: (error: any) => {
      console.error("Login failed:", error?.message || error);
    },
  });
}

// ─────────────────────────────────────────────────────────
// SIGNUP
// ─────────────────────────────────────────────────────────
export function useSignup(onSignedUp?: () => void) {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      businessName: string;
      businessType?: string;
      phone?: string;
    }) => {
      return await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        companyName: data.businessName,
        phone: data.phone,
      });
    },

    onSuccess: async ({ user, token }) => {
      login(token, user);
      await new Promise((resolve) => setTimeout(resolve, 0));
      onSignedUp?.();
    },

    onError: (error: any) => {
      console.error("Signup failed:", error?.message || error);
    },
  });
}

// ─────────────────────────────────────────────────────────
// CURRENT USER — reads from AuthContext (no extra API call)
// ─────────────────────────────────────────────────────────
export function useMe() {
  const { user, isLoading } = useAuth();
  return {
    data: user,
    isLoading,
    isError: false,
  };
}
