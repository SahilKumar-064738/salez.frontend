/**
 * src/services/apiKeysService.ts — REFACTORED
 * Delegates to typed Axios api client in @/api/api.
 */
import { api } from '@/api/api';

export interface ApiKey {
  id: number;
  name: string;
  keyPrefix: string;
  scopes: string[];
  isActive: boolean;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
  created_at?: string;
}

export interface NewApiKeyResponse extends ApiKey {
  key: string;
  warning: string;
}

function normalize(k: any): ApiKey {
  return {
    id: Number(k.id),
    name: k.name ?? '',
    keyPrefix: k.keyPrefix ?? k.key_prefix ?? '',
    scopes: Array.isArray(k.scopes) ? k.scopes : [],
    isActive: Boolean(k.isActive ?? k.is_active ?? true),
    lastUsedAt: k.lastUsedAt ?? k.last_used_at ?? null,
    expiresAt: k.expiresAt ?? k.expires_at ?? null,
    created_at: k.created_at,
  };
}

export const apiKeysService = {
  async list(): Promise<ApiKey[]> {
    const raw = await api.apiKeys.list();
    return (Array.isArray(raw) ? raw : []).map(normalize);
  },

  async create(data: {
    name: string;
    scopes: string[];
    expiresAt?: string | null;
  }): Promise<NewApiKeyResponse> {
    const d = await api.apiKeys.create({
      name: data.name,
      scopes: data.scopes,
      expiresAt: data.expiresAt ?? undefined,
    });
    return {
      ...normalize(d),
      key: (d as any).key ?? '',
      warning: (d as any).warning ?? 'Copy this key now. It will never be shown again.',
    };
  },

  async revoke(id: number): Promise<void> {
    await api.apiKeys.revoke(id);
  },
};
