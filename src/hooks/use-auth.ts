import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function normalizeUser(data: any): AuthUser {
  const u = data?.user ?? data;
  return {
    id: Number(u?.id ?? 0),
    email: u?.email ?? "",
    name: u?.name ?? "",
    companyName: u?.companyName ?? u?.company_name ?? null,
  };
}

// useLogin — accepts an optional onSuccess callback that fires AFTER
// auth context is updated (token stored, user set), so navigation
// never races with auth state.
export function useLogin(onLoggedIn?: () => void) {
  const { login } = useAuth();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Login failed");
      return json;
    },
    onSuccess: (data) => {
      const token = data?.token ?? data?.accessToken ?? data?.data?.token;
      if (token) {
        // 1. Update auth context (sets localStorage + React state)
        login(token, normalizeUser(data));
        // 2. Only now navigate — state is guaranteed to be updated
        onLoggedIn?.();
      }
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
    }) => {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          businessName: data.businessName,
          businessType: data.businessType || undefined,
          phone: data.phone || undefined,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Signup failed");
      return json;
    },
    onSuccess: (data) => {
      const token = data?.token ?? data?.accessToken ?? data?.data?.token;
      if (token) {
        login(token, normalizeUser(data));
        onSignedUp?.();
      }
    },
  });
}

export { useAuth };

export function useMe() {
  const { user, isLoading } = useAuth();
  return { data: user, isLoading, isError: false };
}
