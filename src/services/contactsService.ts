/**
 * src/services/contactsService.ts — REFACTORED
 * Now delegates to the typed Axios api client in @/api/api.
 */
import { api } from '@/api/api';
import type { Contact as ApiContact, CreateContactPayload, UpdateContactPayload, ContactsQuery } from '@/api/api';

export type Contact = {
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
};

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
    name: c.name ?? 'Unnamed',
    phone: c.phone ?? '',
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
    const query: ContactsQuery = {
      search: filters?.search,
      stage: filters?.stage as any,
      tag: filters?.tag,
      cursor: filters?.cursor,
      limit: Math.min(filters?.limit ?? 50, 100),
    };
    const raw = await api.contacts.list(query);
    return {
      contacts: (raw.data ?? []).map(normalize),
      nextCursor: raw.pagination?.nextCursor ?? null,
      hasMore: raw.pagination?.hasMore ?? false,
    };
  },

  async pipelineStats(): Promise<PipelineStats> {
    try {
      const d = await api.contacts.getPipelineStats();
      return {
        new: Number((d as any).new ?? 0),
        contacted: Number((d as any).contacted ?? 0),
        qualified: Number((d as any).qualified ?? 0),
        converted: Number((d as any).converted ?? 0),
        lost: Number((d as any).lost ?? 0),
      };
    } catch {
      return { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 };
    }
  },

  async get(id: number): Promise<Contact> {
    const raw = await api.contacts.getById(id);
    return normalize(raw);
  },

  async create(data: {
    phone: string;
    name?: string;
    email?: string;
    stage?: string;
    notes?: string;
  }): Promise<Contact> {
    const raw = await api.contacts.create(data as CreateContactPayload);
    return normalize(raw);
  },

  async update(
    id: number,
    data: Partial<{ name: string; email: string; stage: string; notes: string }>
  ): Promise<Contact> {
    const raw = await api.contacts.update(id, data as UpdateContactPayload);
    return normalize(raw);
  },

  async delete(id: number): Promise<void> {
    await api.contacts.delete(id);
  },

  async addTag(contactId: number, tag: string): Promise<void> {
    await api.contacts.addTag(contactId, tag);
  },

  async removeTag(contactId: number, tag: string): Promise<void> {
    await api.contacts.removeTag(contactId, encodeURIComponent(tag));
  },

  async bulkCreate(contacts: { name: string; phone: string }[]): Promise<{ created: number; failed: number; errors: string[] }> {
    try {
      const raw = await api.contacts.bulkCreate(contacts as CreateContactPayload[]);
      return {
        created: Array.isArray(raw) ? raw.length : contacts.length,
        failed: 0,
        errors: [],
      };
    } catch {
      let created = 0, failed = 0;
      const errors: string[] = [];
      for (const c of contacts) {
        try {
          await api.contacts.create({ phone: c.phone, name: c.name });
          created++;
        } catch (e: any) {
          failed++;
          errors.push(`${c.name} (${c.phone}): ${e?.message ?? 'Error'}`);
        }
      }
      return { created, failed, errors };
    }
  },
};
