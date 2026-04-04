/**
 * frontend/src/api/api.ts
 *
 * Typed Axios API client for the backend.
 *
 * Features:
 *  - Automatic Bearer token injection from localStorage
 *  - Silent token refresh on 401 (with retry)
 *  - Consistent error typing
 *  - All major API functions typed end-to-end
 *
 * Setup:
 *   import { api } from '@/api/api';
 *   await api.auth.login({ email, password });
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:4000/api/v1';

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

// ── Storage helpers ───────────────────────────────────────────────────────────

export const tokenStore = {
  getAccess: () => localStorage.getItem(TOKEN_KEY) ?? '',
  getRefresh: () => localStorage.getItem(REFRESH_KEY) ?? '',
  set: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  details?: { field: string; message: string }[];
}

// Auth
export interface RegisterPayload {
  businessName: string;
  email: string;
  password: string;
  displayName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  tenantId: number;
  role: string;
}

export interface RegisterResponse extends AuthTokens {
  userId: string;
  tenantId: number;
  tenantSlug: string;
  email: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

// Contacts
export interface Contact {
  id: number;
  tenant_id: number;
  phone: string;
  name: string | null;
  email: string | null;
  stage: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateContactPayload {
  phone: string;
  name?: string;
  email?: string;
  stage?: Contact['stage'];
  notes?: string;
}

export interface UpdateContactPayload {
  name?: string;
  email?: string | null;
  stage?: Contact['stage'];
  notes?: string | null;
}

export interface ContactsQuery {
  cursor?: string;
  limit?: number;
  stage?: Contact['stage'];
  search?: string;
  tag?: string;
}

// Messages
export interface SendMessagePayload {
  contactId: number;
  whatsappAccountId: number;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
}

export interface InboxQuery {
  cursor?: string;
  limit?: number;
  unreadOnly?: boolean;
}

// Campaigns
export interface CreateCampaignPayload {
  name: string;
  templateId: number;
  whatsappAccountId: number;
  contactIds?: number[];
  scheduledAt?: string;
}

export interface CreateTemplatePayload {
  name: string;
  content: string;
  variables?: string[];
  category?: 'marketing' | 'utility' | 'authentication';
}

// API Keys
export interface CreateApiKeyPayload {
  name: string;
  scopes?: string[];
  expiresAt?: string;
}

// ── Axios instance ────────────────────────────────────────────────────────────

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject Bearer token on every request
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Silent 401 refresh
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(newToken: string) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}

client.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenStore.getRefresh();
      if (!refreshToken) {
        tokenStore.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(client(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<ApiResponse<AuthTokens>>(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
        );
        const { accessToken, refreshToken: newRefresh } = data.data;
        tokenStore.set(accessToken, newRefresh);
        processQueue(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch {
        tokenStore.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ── API namespace ─────────────────────────────────────────────────────────────

export const api = {

  // ── Auth ──────────────────────────────────────────────────────────────────

  auth: {
    register: async (payload: RegisterPayload) => {
      const { data } = await client.post<ApiResponse<RegisterResponse>>('/auth/register', payload);
      tokenStore.set(data.data.accessToken, data.data.refreshToken);
      return data.data;
    },

    login: async (payload: LoginPayload) => {
      const { data } = await client.post<ApiResponse<LoginResponse>>('/auth/login', payload);
      tokenStore.set(data.data.accessToken, data.data.refreshToken);
      return data.data;
    },

    refresh: async () => {
      const refreshToken = tokenStore.getRefresh();
      const { data } = await client.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken });
      tokenStore.set(data.data.accessToken, data.data.refreshToken);
      return data.data;
    },

    me: async () => {
      const { data } = await client.get<ApiResponse<AuthUser & { tenant: unknown }>>('/auth/me');
      return data.data;
    },

    changePassword: async (password: string) => {
      const { data } = await client.post<ApiResponse<null>>('/auth/change-password', { password });
      return data;
    },

    logout: async () => {
      await client.post('/auth/logout').catch(() => {});
      tokenStore.clear();
    },
  },

  // ── Contacts ─────────────────────────────────────────────────────────────

  contacts: {
    list: async (query?: ContactsQuery) => {
      const { data } = await client.get<PaginatedResponse<Contact>>('/contacts', { params: query });
      return data;
    },

    getById: async (id: number) => {
      const { data } = await client.get<ApiResponse<Contact>>(`/contacts/${id}`);
      return data.data;
    },

    create: async (payload: CreateContactPayload) => {
      const { data } = await client.post<ApiResponse<Contact>>('/contacts', payload);
      return data.data;
    },

    update: async (id: number, payload: UpdateContactPayload) => {
      const { data } = await client.patch<ApiResponse<Contact>>(`/contacts/${id}`, payload);
      return data.data;
    },

    delete: async (id: number) => {
      const { data } = await client.delete<ApiResponse<null>>(`/contacts/${id}`);
      return data;
    },

    bulkCreate: async (contacts: CreateContactPayload[]) => {
      const { data } = await client.post<ApiResponse<Contact[]>>('/contacts/bulk', { contacts });
      return data.data;
    },

    addTag: async (id: number, tag: string) => {
      const { data } = await client.post<ApiResponse<null>>(`/contacts/${id}/tags`, { tag });
      return data;
    },

    removeTag: async (id: number, tag: string) => {
      const { data } = await client.delete<ApiResponse<null>>(`/contacts/${id}/tags/${tag}`);
      return data;
    },

    getPipelineStats: async () => {
      const { data } = await client.get<ApiResponse<Record<string, number>>>('/contacts/pipeline-stats');
      return data.data;
    },
  },

  // ── Messages ─────────────────────────────────────────────────────────────

  messages: {
    send: async (payload: SendMessagePayload) => {
      const { data } = await client.post<ApiResponse<unknown>>('/messages/send', payload);
      return data.data;
    },

    getInbox: async (query?: InboxQuery) => {
      const { data } = await client.get<PaginatedResponse<unknown>>('/messages/inbox', { params: query });
      return data;
    },

    getConversation: async (contactId: number, query?: { cursor?: string; limit?: number }) => {
      const { data } = await client.get<PaginatedResponse<unknown>>(
        `/messages/conversation/${contactId}`,
        { params: query },
      );
      return data;
    },

    markRead: async (contactId: number) => {
      const { data } = await client.put<ApiResponse<null>>(`/messages/conversation/${contactId}/read`);
      return data;
    },
  },

  // ── Campaigns ────────────────────────────────────────────────────────────

  campaigns: {
    list: async (query?: { cursor?: string; limit?: number; status?: string; search?: string }) => {
      const { data } = await client.get<PaginatedResponse<unknown>>('/campaigns', { params: query });
      return data;
    },

    getById: async (id: number) => {
      const { data } = await client.get<ApiResponse<unknown>>(`/campaigns/${id}`);
      return data.data;
    },

    create: async (payload: CreateCampaignPayload) => {
      const { data } = await client.post<ApiResponse<unknown>>('/campaigns', payload);
      return data.data;
    },

    send: async (id: number) => {
      const { data } = await client.post<ApiResponse<null>>(`/campaigns/${id}/send`);
      return data;
    },

    cancel: async (id: number) => {
      const { data } = await client.post<ApiResponse<null>>(`/campaigns/${id}/cancel`);
      return data;
    },

    // Templates
    listTemplates: async (status?: string) => {
      const { data } = await client.get<ApiResponse<unknown[]>>('/campaigns/templates', {
        params: status ? { status } : undefined,
      });
      return data.data;
    },

    createTemplate: async (payload: CreateTemplatePayload) => {
      const { data } = await client.post<ApiResponse<unknown>>('/campaigns/templates', payload);
      return data.data;
    },

    deleteTemplate: async (id: number) => {
      const { data } = await client.delete<ApiResponse<null>>(`/campaigns/templates/${id}`);
      return data;
    },
  },

  // ── WhatsApp Accounts ────────────────────────────────────────────────────

  whatsapp: {
    list: async () => {
      const { data } = await client.get<ApiResponse<unknown[]>>('/whatsapp-accounts');
      return data.data;
    },

    create: async (payload: { phoneNumber: string; displayName: string; apiToken: string; provider?: string; dailyMessageLimit?: number }) => {
      const { data } = await client.post<ApiResponse<unknown>>('/whatsapp-accounts', payload);
      return data.data;
    },

    update: async (id: number, payload: Partial<{ displayName: string; apiToken: string; status: string; dailyMessageLimit: number }>) => {
      const { data } = await client.put<ApiResponse<unknown>>(`/whatsapp-accounts/${id}`, payload);
      return data.data;
    },

    disconnect: async (id: number) => {
      const { data } = await client.delete<ApiResponse<null>>(`/whatsapp-accounts/${id}`);
      return data;
    },
  },

  // ── API Keys ─────────────────────────────────────────────────────────────

  apiKeys: {
    list: async () => {
      const { data } = await client.get<ApiResponse<unknown[]>>('/api-keys');
      return data.data;
    },

    create: async (payload: CreateApiKeyPayload) => {
      const { data } = await client.post<ApiResponse<{ id: number; key: string; keyPrefix: string; name: string }>>('/api-keys', payload);
      return data.data;
    },

    revoke: async (id: number) => {
      const { data } = await client.delete<ApiResponse<null>>(`/api-keys/${id}`);
      return data;
    },
  },

  // ── Analytics ────────────────────────────────────────────────────────────

  analytics: {
    overview: async (period: '24h' | '7d' | '30d' | '90d' = '7d') => {
      const { data } = await client.get<ApiResponse<unknown>>('/analytics/overview', {
        params: { period },
      });
      return data.data;
    },

    messages: async (params?: { from_date?: string; to_date?: string }) => {
      const { data } = await client.get<ApiResponse<unknown>>('/analytics/messages', { params });
      return data.data;
    },

    campaigns: async (params?: { from_date?: string; to_date?: string }) => {
      const { data } = await client.get<ApiResponse<unknown>>('/analytics/campaigns', { params });
      return data.data;
    },
  },

  // ── Plans ────────────────────────────────────────────────────────────────

  plans: {
    list: async () => {
      const { data } = await client.get<ApiResponse<unknown[]>>('/plans');
      return data.data;
    },
  },
};

// ── Error helper ─────────────────────────────────────────────────────────────

/**
 * Extract a user-friendly message from an API or Axios error.
 *
 * Usage:
 *   try { await api.contacts.create(...) }
 *   catch (err) { toast.error(getApiError(err)) }
 */
export function getApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const apiErr = err.response?.data as ApiError | undefined;
    return apiErr?.message ?? err.message ?? 'An unexpected error occurred';
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}

export default api;
