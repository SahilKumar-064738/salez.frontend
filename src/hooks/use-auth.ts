import { useMutation } from "@tanstack/react-query";
import { setAuthToken } from "@/services/auth";

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

      // save token if backend returns it
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
      // backend might expect companyName instead of businessName
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        business_name: data.businessName,
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

      // save token if backend returns it
      if (json?.token) {
        setAuthToken(json.token);
      }

      return json;
    },
  });
}
