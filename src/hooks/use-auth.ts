/**
 * src/hooks/use-auth.ts — REFACTORED
 * Auth hooks using new api client + AuthContext.
 */

import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import type { AuthUser, LoginPayload, RegisterPayload } from '@/services/authService';

export { useAuth };

export function useLogin(onLoggedIn?: () => void) {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginPayload) => authService.login(data),
    onSuccess: async ({ user, token }) => {
      login(token, user);
      await new Promise((resolve) => setTimeout(resolve, 0));
      onLoggedIn?.();
    },
    onError: (error: any) => {
      console.error('Login failed:', error?.message || error);
    },
  });
}

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
    }) =>
      authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        companyName: data.businessName,
        businessType: data.businessType,
        phone: data.phone,
      }),
    onSuccess: async ({ user, token }) => {
      login(token, user);
      await new Promise((resolve) => setTimeout(resolve, 0));
      onSignedUp?.();
    },
    onError: (error: any) => {
      console.error('Signup failed:', error?.message || error);
    },
  });
}

export function useMe() {
  const { user, isLoading } = useAuth();
  return { data: user, isLoading, isError: false };
}
