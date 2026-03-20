/**
 * src/services/contactsService.ts
 *
 * Endpoints:
 *   GET    /contacts           list + filter
 *   GET    /contacts/:id       single
 *   POST   /contacts           create
 *   PUT    /contacts/:id       update
 *   DELETE /contacts/:id       delete
 *   GET    /contacts/stats     stats summary
 *   POST   /contacts/:id/tags  add tag
 *   DELETE /contacts/:id/tags/:tag  remove tag
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

export interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  stage?: string | null;
  tags?: string[];
  created_at?: string;
  last_message?: string | null;
  message_count?: number;
  unread_count?: number;
}

export interface ContactStats {
  total: number;
  byStage: { stage: string; count: number }[];
  newThisMonth: number;
}

export interface ContactFilters {
  search?: string;
  stage?: string;
  tag?: string;
}

function normalize(c: any): Contact {
  return {
    id: Number(c.id),
    name: c.name ?? "Unnamed",
    phone: c.phone ?? "",
    email: c.email ?? null,
    stage: c.stage ?? null,
    tags: Array.isArray(c.tags) ? c.tags : [],
    created_at: c.created_at,
    last_message: c.last_message ?? null,
    message_count: c.message_count ?? 0,
    unread_count: c.unread_count ?? 0,
  };
}

export const contactsService = {
  async list(filters?: ContactFilters): Promise<Contact[]> {
    const params: Record<string, string> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.stage) params.stage = filters.stage;
    if (filters?.tag) params.tag = filters.tag;

    const raw = await apiGet<any>("/api/contacts", { params });

    // Backend may return { contacts: [] } or plain []
    const list = raw?.contacts ?? raw?.data ?? raw ?? [];
    return (Array.isArray(list) ? list : []).map(normalize);
  },

  async get(id: number): Promise<Contact> {
    const raw = await apiGet<any>(`/api/contacts/${id}`);
    return normalize(raw?.contact ?? raw);
  },

  async create(data: {
    name: string;
    phone: string;
    email?: string;
    stage?: string;
    tags?: string[];
  }): Promise<Contact> {
    const raw = await apiPost<any>("/api/contacts", data);
    return normalize(raw?.contact ?? raw);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      phone: string;
      email: string;
      stage: string;
      tags: string[];
    }>
  ): Promise<Contact> {
    const raw = await apiPut<any>(`/api/contacts/${id}`, data);
    return normalize(raw?.contact ?? raw);
  },

  async delete(id: number): Promise<void> {
    await apiDelete(`/api/contacts/${id}`);
  },

  async stats(): Promise<ContactStats> {
    try {
      const raw = await apiGet<any>("/contacts/stats");
      return {
        total: raw?.total ?? 0,
        byStage: raw?.byStage ?? raw?.contactsByStage ?? [],
        newThisMonth: raw?.newThisMonth ?? 0,
      };
    } catch {
      return { total: 0, byStage: [], newThisMonth: 0 };
    }
  },

  async addTag(contactId: number, tag: string): Promise<Contact> {
    const raw = await apiPost<any>(`/api/contacts/${contactId}/tags`, { tag });
    return normalize(raw?.contact ?? raw);
  },

  async removeTag(contactId: number, tag: string): Promise<void> {
    await apiDelete(`/api/contacts/${contactId}/tags/${encodeURIComponent(tag)}`);
  },
};
