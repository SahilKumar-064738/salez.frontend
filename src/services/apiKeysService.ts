/**
 * src/services/apiKeysService.ts
 *
 * Backend contract (all under /api/v1 — handled by apiClient):
 *   GET    /api-keys        list keys (never returns raw key)
 *   POST   /api-keys        generate new key (raw key shown ONCE in response)
 *   DELETE /api-keys/:id    revoke key (owner/admin only)
 */

import { apiGet, apiPost, apiDelete } from "@/lib/apiClient";

export interface ApiKey {
  id: number;
  name: string;
  keyPrefix: string;         // e.g. "sk_live_a3f2"
  scopes: string[];
  isActive: boolean;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
  created_at?: string;
}

export interface NewApiKeyResponse extends ApiKey {
  key: string;               // raw key — shown ONCE, never again
  warning: string;
}

function normalize(k: any): ApiKey {
  return {
    id: Number(k.id),
    name: k.name ?? "",
    keyPrefix: k.keyPrefix ?? k.key_prefix ?? "",
    scopes: Array.isArray(k.scopes) ? k.scopes : [],
    isActive: Boolean(k.isActive ?? k.is_active ?? true),
    lastUsedAt: k.lastUsedAt ?? k.last_used_at ?? null,
    expiresAt: k.expiresAt ?? k.expires_at ?? null,
    created_at: k.created_at,
  };
}

export const apiKeysService = {
  async list(): Promise<ApiKey[]> {
    const raw = await apiGet<any>("/api-keys");
    const list = raw?.data ?? raw ?? [];
    return (Array.isArray(list) ? list : []).map(normalize);
  },

  /**
   * POST /api-keys
   * Returns the raw key in the response — copy it now, it won't be shown again.
   */
  async create(data: {
    name: string;
    scopes: string[];
    expiresAt?: string | null;
  }): Promise<NewApiKeyResponse> {
    const raw = await apiPost<any>("/api-keys", {
      name: data.name,
      scopes: data.scopes,
      expiresAt: data.expiresAt ?? null,
    });
    const d = raw?.data ?? raw;
    return {
      ...normalize(d),
      key: d?.key ?? "",
      warning: d?.warning ?? "Copy this key now. It will never be shown again.",
    };
  },

  async revoke(id: number): Promise<void> {
    await apiDelete(`/api-keys/${id}`);
  },
};
