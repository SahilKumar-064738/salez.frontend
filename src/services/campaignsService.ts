/**
 * src/services/campaignsService.ts
 *
 * Endpoints:
 *   GET    /campaigns           list campaigns
 *   GET    /campaigns/:id       get single campaign
 *   POST   /campaigns           create campaign
 *   POST   /campaigns/:id/send  trigger send
 *   PUT    /campaigns/:id       update campaign
 *   DELETE /campaigns/:id       delete campaign
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

export interface Campaign {
  id: number;
  name: string;
  templateId: number;
  templateName?: string | null;
  scheduledAt?: string | null;
  sentAt?: string | null;
  status?: string | null;
  recipientCount?: number;
  deliveredCount?: number;
  failedCount?: number;
  created_at?: string;
}

function normalize(c: any): Campaign {
  return {
    id: Number(c.id),
    name: c.name ?? "",
    templateId: Number(c.templateId ?? c.template_id ?? 0),
    templateName: c.templateName ?? c.template_name ?? null,
    scheduledAt: c.scheduledAt ?? c.scheduled_at ?? null,
    sentAt: c.sentAt ?? c.sent_at ?? null,
    status: c.status ?? null,
    recipientCount: Number(c.recipientCount ?? c.recipient_count ?? 0),
    deliveredCount: Number(c.deliveredCount ?? c.delivered_count ?? 0),
    failedCount: Number(c.failedCount ?? c.failed_count ?? 0),
    created_at: c.created_at,
  };
}

export const campaignsService = {
  async list(): Promise<Campaign[]> {
    const raw = await apiGet<any>("/api/campaigns");
    const list = raw?.campaigns ?? raw?.data ?? raw ?? [];
    return (Array.isArray(list) ? list : []).map(normalize);
  },

  async get(id: number): Promise<Campaign> {
    const raw = await apiGet<any>(`/api/campaigns/${id}`);
    return normalize(raw?.campaign ?? raw);
  },

  async create(data: {
    name: string;
    templateId: number;
    scheduledAt?: string | null;
    recipientContactIds?: number[];
  }): Promise<Campaign> {
    const raw = await apiPost<any>("/api/campaigns", {
      name: data.name,
      templateId: data.templateId,
      scheduledAt: data.scheduledAt ?? null,
      recipientContactIds: data.recipientContactIds ?? [],
    });
    return normalize(raw?.campaign ?? raw);
  },

  /**
   * POST /campaigns/:id/send — trigger immediate send
   */
  async send(id: number): Promise<Campaign> {
    const raw = await apiPost<any>(`/api/campaigns/${id}/send`);
    return normalize(raw?.campaign ?? raw);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      templateId: number;
      scheduledAt: string | null;
      status: string | null;
    }>
  ): Promise<Campaign> {
    const raw = await apiPut<any>(`/api/campaigns/${id}`, data);
    return normalize(raw?.campaign ?? raw);
  },

  async delete(id: number): Promise<void> {
    await apiDelete(`/api/campaigns/${id}`);
  },
};
