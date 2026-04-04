/**
 * src/services/campaignsService.ts — REFACTORED
 * Delegates to typed Axios api client in @/api/api.
 */
import { api } from '@/api/api';
import type { CreateCampaignPayload } from '@/api/api';

export interface Campaign {
  id: number;
  name: string;
  templateId: number;
  templateName?: string | null;
  whatsappAccountId?: number | null;
  scheduledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  status?: 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled' | null;
  totalRecipients?: number;
  sentCount?: number;
  failedCount?: number;
  created_at?: string;
}

function normalize(c: any): Campaign {
  return {
    id: Number(c.id),
    name: c.name ?? '',
    templateId: Number(c.templateId ?? c.template_id ?? 0),
    templateName: c.templateName ?? c.template_name ?? null,
    whatsappAccountId: Number(c.whatsappAccountId ?? c.whatsapp_account_id ?? 0) || null,
    scheduledAt: c.scheduledAt ?? c.scheduled_at ?? null,
    startedAt: c.startedAt ?? c.started_at ?? null,
    completedAt: c.completedAt ?? c.completed_at ?? null,
    status: c.status ?? null,
    totalRecipients: Number(c.totalRecipients ?? c.total_recipients ?? 0),
    sentCount: Number(c.sentCount ?? c.sent_count ?? 0),
    failedCount: Number(c.failedCount ?? c.failed_count ?? 0),
    created_at: c.created_at,
  };
}

export const campaignsService = {
  async list(): Promise<Campaign[]> {
    const raw = await api.campaigns.list();
    return (raw.data ?? []).map(normalize);
  },

  async get(id: number): Promise<Campaign> {
    const raw = await api.campaigns.getById(id);
    return normalize(raw);
  },

  async create(data: {
    name: string;
    templateId: number;
    whatsappAccountId: number;
    scheduledAt?: string | null;
    contactIds?: number[];
    filters?: { stage?: string; tags?: string[] };
  }): Promise<Campaign> {
    const payload: CreateCampaignPayload = {
      name: data.name,
      templateId: data.templateId,
      whatsappAccountId: data.whatsappAccountId,
      contactIds: data.contactIds ?? [],
      scheduledAt: data.scheduledAt ?? undefined,
    };
    const raw = await api.campaigns.create(payload);
    return normalize(raw);
  },

  async send(id: number): Promise<{ campaignId: number; status: string }> {
    const raw = await api.campaigns.send(id);
    const d = (raw as any)?.data ?? raw;
    return {
      campaignId: Number(d?.campaignId ?? d?.campaign_id ?? id),
      status: d?.status ?? 'queued',
    };
  },

  async cancel(id: number): Promise<Campaign> {
    const raw = await api.campaigns.cancel(id);
    return normalize((raw as any)?.data ?? raw);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      templateId: number;
      whatsappAccountId: number;
      scheduledAt: string | null;
    }>
  ): Promise<Campaign> {
    // Use the underlying client via apiClient for PATCH until api namespace supports it
    const { apiPatch } = await import('@/lib/apiClient');
    const raw = await apiPatch<any>(`/campaigns/${id}`, data);
    return normalize(raw?.data ?? raw);
  },

  async delete(id: number): Promise<void> {
    const { apiDelete } = await import('@/lib/apiClient');
    await apiDelete(`/campaigns/${id}`);
  },
};
