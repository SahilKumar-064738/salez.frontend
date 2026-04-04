/**
 * src/context/AuthContext.tsx — REFACTORED
 * Uses tokenStore from @/api/api (access_token / refresh_token keys).
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from '@/api/api';
import type { AuthUser as ApiAuthUser } from '@/api/api';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  companyName: string | null;
  role?: string | null;
  tenantId?: number | null;
  phone?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function normalizeUser(u: ApiAuthUser, tenant?: any): AuthUser {
  return {
    id: Number(u.id ?? 0),
    email: u.email ?? '',
    name: u.displayName ?? '',
    companyName: tenant?.name ?? null,
    role: u.role ?? null,
    tenantId: Number(u.tenantId ?? 0) || null,
    phone: null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStore.getAccess();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await api.auth.me();
        setUser(normalizeUser(data, (data as any).tenant));
      } catch {
        tokenStore.clear();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (token: string, userData: AuthUser) => {
    // token is the access token; refresh token is already stored by api.auth.login
    const refresh = tokenStore.getRefresh();
    tokenStore.set(token, refresh);
    setUser(userData);
  };

  const logout = () => {
    api.auth.logout().catch(() => {});
    setUser(null);
  };

  const isAuthenticated = !!tokenStore.getAccess() && !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
