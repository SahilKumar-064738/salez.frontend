/**
 * src/services/contactsService.ts
 *
 * Backend contract (all under /api/v1 — handled by apiClient):
 *   GET    /contacts                  list + filter (cursor pagination)
 *   GET    /contacts/stats/pipeline   pipeline counts per stage
 *   GET    /contacts/:id              single contact + tags
 *   POST   /contacts                  create
 *   PUT    /contacts/:id              update (no phone field)
 *   DELETE /contacts/:id              soft delete
 *   POST   /contacts/:id/tags         add tag
 *   DELETE /contacts/:id/tags/:tag    remove tag
 *
 * Fixes applied:
 *   - Response unwrapping: backend returns { success, data: [...] }
 *   - stats endpoint: /contacts/stats/pipeline (not /contacts/stats)
 *   - update payload: phone excluded (Issue per Section 4)
 *   - Pipeline stats response shape: { new, contacted, qualified, converted, lost }
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

export interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  stage?: string | null;
  notes?: string | null;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  last_active?: string | null;
}

export interface PipelineStats {
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
}

export interface ContactFilters {
  search?: string;
  stage?: string;
  tag?: string;
  cursor?: string;
  limit?: number;
}

export interface ContactListResult {
  contacts: Contact[];
  nextCursor?: string | null;
  hasMore: boolean;
}

function normalize(c: any): Contact {
  return {
    id: Number(c.id),
    name: c.name ?? "Unnamed",
    phone: c.phone ?? "",
    email: c.email ?? null,
    stage: c.stage ?? null,
    notes: c.notes ?? null,
    tags: Array.isArray(c.tags) ? c.tags : [],
    created_at: c.created_at,
    updated_at: c.updated_at,
    last_active: c.last_active ?? null,
  };
}

export const contactsService = {
  /**
   * GET /contacts — cursor-paginated list
   * Backend response: { success, data: [...], meta: { nextCursor, hasMore } }
   */
  async list(filters?: ContactFilters): Promise<ContactListResult> {
    const params: Record<string, string> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.stage) params.stage = filters.stage;
    if (filters?.tag) params.tag = filters.tag;
    if (filters?.cursor) params.cursor = filters.cursor;
    if (filters?.limit) params.limit = String(filters.limit);

    const raw = await apiGet<any>("/contacts", { params });

    // Backend: { success: true, data: [...], meta: { nextCursor, hasMore } }
    const list = raw?.data ?? raw ?? [];
    return {
      contacts: (Array.isArray(list) ? list : []).map(normalize),
      nextCursor: raw?.meta?.nextCursor ?? null,
      hasMore: raw?.meta?.hasMore ?? false,
    };
  },

  /**
   * GET /contacts/stats/pipeline
   * Returns per-stage counts: { new, contacted, qualified, converted, lost }
   */
  async pipelineStats(): Promise<PipelineStats> {
    try {
      const raw = await apiGet<any>("/contacts/stats/pipeline");
      const d = raw?.data ?? raw ?? {};
      return {
        new: Number(d.new ?? 0),
        contacted: Number(d.contacted ?? 0),
        qualified: Number(d.qualified ?? 0),
        converted: Number(d.converted ?? 0),
        lost: Number(d.lost ?? 0),
      };
    } catch {
      return { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 };
    }
  },

  async get(id: number): Promise<Contact> {
    const raw = await apiGet<any>(`/contacts/${id}`);
    return normalize(raw?.data ?? raw);
  },

  async create(data: {
    phone: string;
    name?: string;
    email?: string;
    stage?: string;
    notes?: string;
  }): Promise<Contact> {
    const raw = await apiPost<any>("/contacts", data);
    return normalize(raw?.data ?? raw);
  },

  /**
   * PUT /contacts/:id
   * FIX: phone is NOT sent — backend does not allow phone updates (identity field).
   */
  async update(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      stage: string;
      notes: string;
      // phone intentionally excluded
    }>
  ): Promise<Contact> {
    const { ...safeData } = data as any;
    delete safeData.phone; // Defensive: strip phone even if caller passes it
    const raw = await apiPut<any>(`/contacts/${id}`, safeData);
    return normalize(raw?.data ?? raw);
  },

  async delete(id: number): Promise<void> {
    await apiDelete(`/contacts/${id}`);
  },

  async addTag(contactId: number, tag: string): Promise<Contact> {
    const raw = await apiPost<any>(`/contacts/${contactId}/tags`, { tag });
    return normalize(raw?.data ?? raw);
  },

  async removeTag(contactId: number, tag: string): Promise<void> {
    await apiDelete(`/contacts/${contactId}/tags/${encodeURIComponent(tag)}`);
  },
};
