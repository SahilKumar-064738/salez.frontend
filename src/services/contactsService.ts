/**
 * src/services/contactsService.ts - REFACTORED
 * Backend: GET /contacts/pipeline-stats (not /stats/pipeline)
 * PATCH /contacts/:id (not PUT)
 * limit ≤ 100 enforced
 * pagination key is "pagination" not "meta"
 */
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/apiClient";

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
  async list(filters?: ContactFilters): Promise<ContactListResult> {
    const params: Record<string, string> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.stage) params.stage = filters.stage;
    if (filters?.tag) params.tag = filters.tag;
    if (filters?.cursor) params.cursor = filters.cursor;
    params.limit = String(Math.min(filters?.limit ?? 50, 100));

    const raw = await apiGet<any>("/contacts", { params });
    const list = raw?.data ?? raw ?? [];
    const pagination = raw?.pagination ?? raw?.meta ?? {};
    return {
      contacts: (Array.isArray(list) ? list : []).map(normalize),
      nextCursor: pagination?.nextCursor ?? null,
      hasMore: pagination?.hasMore ?? false,
    };
  },

  async pipelineStats(): Promise<PipelineStats> {
    try {
      const raw = await apiGet<any>("/contacts/pipeline-stats");
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

  async update(
    id: number,
    data: Partial<{ name: string; email: string; stage: string; notes: string }>
  ): Promise<Contact> {
    const safeData = { ...data } as any;
    delete safeData.phone;
    const raw = await apiPatch<any>(`/contacts/${id}`, safeData);
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

  async bulkCreate(contacts: { name: string; phone: string }[]): Promise<{ created: number; failed: number; errors: string[] }> {
    try {
      // Send a single bulk upsert request — backend does INSERT ... ON CONFLICT DO UPDATE
      const raw = await apiPost<any>("/contacts/bulk", { contacts });
      const d = raw?.data ?? raw ?? {};
      return {
        created: Number(d.created ?? contacts.length),
        failed: 0,
        errors: [],
      };
    } catch {
      // Fallback: one-by-one with upsert param so server overwrites duplicates
      let created = 0, failed = 0;
      const errors: string[] = [];
      for (const c of contacts) {
        try {
          await apiPost<any>("/contacts", { phone: c.phone, name: c.name, upsert: true });
          created++;
        } catch (e: any) {
          failed++;
          errors.push(`${c.name} (${c.phone}): ${e?.message ?? "Error"}`);
        }
      }
      return { created, failed, errors };
    }
  },
};
