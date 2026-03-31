/**
 * src/services/templatesService.ts
 *
 * Backend contract (all under /api/v1 — handled by apiClient):
 *   GET    /campaigns/templates        list all templates
 *   GET    /campaigns/templates/:id    get single template
 *   POST   /campaigns/templates        create template
 *   PUT    /campaigns/templates/:id    update template
 *   DELETE /campaigns/templates/:id    delete (owner/admin only)
 *
 * Fix: Templates are mounted under /campaigns/templates, NOT /templates.
 * The old /api/templates path was wrong.
 *
 * Request payload:
 *   { name, content, variables[], category }
 *   category: "marketing" | "utility" | "authentication"
 */

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/apiClient";

export interface Template {
  id: number;
  name: string;
  content: string;
  variables?: string[];
  category?: "marketing" | "utility" | "authentication" | null;
  status?: "approved" | "pending" | "rejected" | null;
  rejectionReason?: string | null;
  created_at?: string;
}

function normalize(t: any): Template {
  return {
    id: Number(t.id),
    name: t.name ?? "",
    content: t.content ?? "",
    variables: Array.isArray(t.variables) ? t.variables : [],
    category: t.category ?? null,
    status: t.status ?? null,
    rejectionReason: t.rejectionReason ?? t.rejection_reason ?? null,
    created_at: t.created_at,
  };
}

export const templatesService = {
  async list(): Promise<Template[]> {
    const raw = await apiGet<any>("/campaigns/templates");
    const list = raw?.data ?? raw ?? [];
    return (Array.isArray(list) ? list : []).map(normalize);
  },

  async get(id: number): Promise<Template> {
    const raw = await apiGet<any>(`/campaigns/templates/${id}`);
    return normalize(raw?.data ?? raw);
  },

  async create(data: {
    name: string;
    content: string;
    variables?: string[];
    category?: "marketing" | "utility" | "authentication" | null;
  }): Promise<Template> {
    const raw = await apiPost<any>("/campaigns/templates", {
      name: data.name,
      content: data.content,
      variables: data.variables ?? [],
      category: data.category ?? "marketing",
    });
    return normalize(raw?.data ?? raw);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      content: string;
      variables: string[];
      category: "marketing" | "utility" | "authentication" | null;
    }>
  ): Promise<Template> {
    const raw = await apiPatch<any>(`/campaigns/templates/${id}`, data);
    return normalize(raw?.data ?? raw);
  },

  async delete(id: number): Promise<void> {
    await apiDelete(`/campaigns/templates/${id}`);
  },
};
