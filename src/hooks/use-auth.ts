import { useMutation, useQuery } from "@tanstack/react-query";
import { setAuthToken, getAuthToken } from "@/services/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || "Login failed");
      }

      if (json?.token) {
        setAuthToken(json.token);
      }

      return json;
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      businessName: string;
    }) => {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        businessName: data.businessName,
      };

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || "Signup failed");
      }

      if (json?.token) {
        setAuthToken(json.token);
      }

      return json;
    },
  });
}

// ✅ Get current logged-in user
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const token = getAuthToken();

      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || "Failed to fetch user");
      }

      return json;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}