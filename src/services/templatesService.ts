import { api } from '@/api/api';
import type { CreateTemplatePayload } from '@/api/api';

export interface Template {
  id: number;
  name: string;
  content: string;
  variables?: string[];
  category?: 'marketing' | 'utility' | 'authentication' | null;
  status?: 'approved' | 'pending' | 'rejected' | null;
  rejectionReason?: string | null;
  created_at?: string;
}

function normalize(t: any): Template {
  return {
    id: Number(t.id),
    name: t.name ?? '',
    content: t.content ?? '',
    variables: Array.isArray(t.variables) ? t.variables : [],
    category: t.category ?? null,
    status: (t.status ?? t.template_status ?? '').toLowerCase() || null,
    rejectionReason: t.rejectionReason ?? t.rejection_reason ?? null,
    created_at: t.created_at,
  };
}

export const templatesService = {
  async list(): Promise<Template[]> {
    try {
      const raw = await api.campaigns.listTemplates();

      // 🔥 HANDLE DIFFERENT RESPONSE SHAPES
      const data = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      console.log("RAW API RESPONSE:", raw);
      console.log("PARSED DATA:", data);

      const normalized = data.map(normalize);

      console.log("NORMALIZED:", normalized);

      // ✅ SAFE FILTER (won’t break everything)
      const approved = normalized.filter(
        (t) => t.status?.toLowerCase() === "approved"
      );

      console.log("APPROVED:", approved);

      // 🔥 IMPORTANT: fallback if filter fails
      return approved.length > 0 ? approved : normalized;

    } catch (error: any) {
      console.error("TEMPLATES FETCH ERROR:", error?.response || error);
      return [];
    }
  },

  async get(id: number): Promise<Template> {
    const { apiGet } = await import('@/lib/apiClient');
    const raw = await apiGet<any>(`/campaigns/templates/${id}`);
    return normalize(raw?.data ?? raw);
  },

  async create(data: {
    name: string;
    content: string;
    variables?: string[];
    category?: 'marketing' | 'utility' | 'authentication' | null;
  }): Promise<Template> {
    const payload: CreateTemplatePayload = {
      name: data.name,
      content: data.content,
      variables: data.variables ?? [],
      category: data.category ?? 'marketing',
    };

    const raw = await api.campaigns.createTemplate(payload);
    return normalize(raw);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      content: string;
      variables: string[];
      category: 'marketing' | 'utility' | 'authentication' | null;
    }>
  ): Promise<Template> {
    const { apiPatch } = await import('@/lib/apiClient');
    const raw = await apiPatch<any>(`/campaigns/templates/${id}`, data);
    return normalize(raw?.data ?? raw);
  },

  async delete(id: number): Promise<void> {
    await api.campaigns.deleteTemplate(id);
  },
};