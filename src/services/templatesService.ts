/**
 * src/services/templatesService.ts
 *
 * Endpoints:
 *   GET    /templates          list all templates
 *   GET    /templates/:id      get single template
 *   POST   /templates          create template
 *   PUT    /templates/:id      update template
 *   DELETE /templates/:id      delete template
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

export interface Template {
  id: number;
  name: string;
  content: string;
  category?: string | null;
  status?: "Pending" | "Approved" | "Rejected" | null;
  rejectionReason?: string | null;
  imageUrl?: string | null;
  created_at?: string;
}

function normalize(t: any): Template {
  return {
    id: Number(t.id),
    name: t.name ?? "",
    content: t.content ?? "",
    category: t.category ?? null,
    status: t.status ?? null,
    rejectionReason: t.rejectionReason ?? t.rejection_reason ?? null,
    imageUrl: t.imageUrl ?? t.image_url ?? null,
    created_at: t.created_at,
  };
}

export const templatesService = {
  async list(): Promise<Template[]> {
    const raw = await apiGet<any>("/api/templates");
    const list = raw?.templates ?? raw?.data ?? raw ?? [];
    return (Array.isArray(list) ? list : []).map(normalize);
  },

  async get(id: number): Promise<Template> {
    const raw = await apiGet<any>(`/api/templates/${id}`);
    return normalize(raw?.template ?? raw);
  },

  async create(data: {
    name: string;
    content: string;
    category?: string | null;
  }): Promise<Template> {
    const raw = await apiPost<any>("/api/templates", data);
    return normalize(raw?.template ?? raw);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      content: string;
      category: string | null;
    }>
  ): Promise<Template> {
    const raw = await apiPut<any>(`/api/templates/${id}`, data);
    return normalize(raw?.template ?? raw);
  },

  async delete(id: number): Promise<void> {
    await apiDelete(`/api/templates/${id}`);
  },
};
