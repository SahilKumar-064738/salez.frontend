/**
 * src/context/AuthContext.tsx
 * Session restore on load via /api/auth/me.
 * login() stores token in localStorage via setAuthToken.
 */

import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, setAuthToken, removeAuthToken, getAuthToken } from "@/services/auth";
import type { AuthUser } from "@/services/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── SESSION RESTORE ON APP LOAD ──────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken(); // reads "auth_token" from localStorage

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await fetchMe(); // GET /api/auth/me with Bearer token
        if (me) {
          setUser(me);
        } else {
          removeAuthToken();
        }
      } catch {
        removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ── LOGIN: store token + set user in state ───────────────
  const login = (token: string, userData: AuthUser) => {
    setAuthToken(token); // writes to localStorage under "auth_token"
    setUser(userData);
  };

  // ── LOGOUT: clear token + user ───────────────────────────
  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  // Authenticated = token in localStorage AND user loaded
  const isAuthenticated = !!getAuthToken() && !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
