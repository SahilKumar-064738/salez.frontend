import * as React from "react";
import { getAuthToken, removeAuthToken, setAuthToken } from "@/services/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  companyName: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

function normalizeUser(data: any): AuthUser {
  const u = data?.user ?? data;
  return {
    id: Number(u?.id ?? 0),
    email: u?.email ?? "",
    name: u?.name ?? "",
    companyName: u?.companyName ?? u?.company_name ?? null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = React.useState<AuthUser | null>(null);
  const [token, setToken]     = React.useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = React.useState(true);

  // ── Session validation on every app load ────────────────────────────────
  // We always call /api/auth/me on mount.
  // - If we have a localStorage token → send it as Bearer header
  // - Always send credentials:include so HTTP-only cookies also work
  // This means the backend can validate the session via EITHER mechanism,
  // making the app resilient to cookie-only or token-only setups.
  React.useEffect(() => {
  const stored = getAuthToken();

  // ✅ STOP request if no token
  if (!stored) {
    setIsLoading(false);
    return;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${stored}`,
  };

  fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers,
    credentials: "include",
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizeUser(data);

        const freshToken =
          data?.token ?? data?.accessToken ?? data?.data?.token ?? stored;

        if (freshToken) {
          setAuthToken(freshToken);
          setToken(freshToken);
        }

        setUser(normalized);
      } else {
        removeAuthToken();
        setToken(null);
        setUser(null);
      }
    })
    .catch(() => {
      if (stored) {
        setToken(stored);
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
}, []);

  const login = React.useCallback((newToken: string, newUser: AuthUser) => {
    setAuthToken(newToken);   // persist to localStorage
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = React.useCallback(() => {
    removeAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
