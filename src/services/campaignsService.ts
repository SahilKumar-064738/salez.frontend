/**
 * src/services/campaignsService.ts
 *
 * Backend contract (all under /api/v1 — handled by apiClient):
 *   GET    /campaigns                list campaigns
 *   GET    /campaigns/:id            get single campaign
 *   POST   /campaigns                create campaign
 *   POST   /campaigns/:id/send       trigger dispatch (owner/admin only)
 *   POST   /campaigns/:id/cancel     cancel campaign (owner/admin only)
 *   PUT    /campaigns/:id            update campaign
 *   DELETE /campaigns/:id            delete campaign
 *
 * Fixes applied:
 *   Issue 6: recipientContactIds → contactIds
 *   Issue 6: whatsappAccountId is now required on create
 *   Issue 7: PUT + DELETE routes added (were missing from frontend service)
 *   Response unwrapping: { success, data: {...} }
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

export interface Campaign {
  id: number;
  name: string;
  templateId: number;
  templateName?: string | null;
  whatsappAccountId?: number | null;
  scheduledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  status?: "draft" | "scheduled" | "running" | "completed" | "cancelled" | null;
  totalRecipients?: number;
  sentCount?: number;
  failedCount?: number;
  created_at?: string;
}

function normalize(c: any): Campaign {
  return {
    id: Number(c.id),
    name: c.name ?? "",
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
  /**
   * GET /campaigns
   * Backend response: { success, data: [...] }
   */
  async list(): Promise<Campaign[]> {
    const raw = await apiGet<any>("/campaigns");
    const list = raw?.data ?? raw ?? [];
    return (Array.isArray(list) ? list : []).map(normalize);
  },

  async get(id: number): Promise<Campaign> {
    const raw = await apiGet<any>(`/campaigns/${id}`);
    return normalize(raw?.data ?? raw);
  },

  /**
   * POST /campaigns
   * FIX (Issue 6):
   *   - recipientContactIds → contactIds
   *   - whatsappAccountId is required
   */
  async create(data: {
    name: string;
    templateId: number;
    whatsappAccountId: number;         // required by backend
    scheduledAt?: string | null;
    contactIds?: number[];              // renamed from recipientContactIds
    filters?: { stage?: string; tags?: string[] };
  }): Promise<Campaign> {
    const raw = await apiPost<any>("/campaigns", {
      name: data.name,
      templateId: data.templateId,
      whatsappAccountId: data.whatsappAccountId,
      scheduledAt: data.scheduledAt ?? null,
      contactIds: data.contactIds ?? [],        // ← correct field name
      filters: data.filters,
    });
    // Response: { success, data: { id, name, status, recipientCount } }
    return normalize(raw?.data ?? raw);
  },

  /**
   * POST /campaigns/:id/send
   * Enqueues campaign dispatch. Owner/admin only.
   * Response: { success, data: { campaignId, status: "queued" } }
   */
  async send(id: number): Promise<{ campaignId: number; status: string }> {
    const raw = await apiPost<any>(`/campaigns/${id}/send`);
    const d = raw?.data ?? raw;
    return {
      campaignId: Number(d?.campaignId ?? d?.campaign_id ?? id),
      status: d?.status ?? "queued",
    };
  },

  /**
   * POST /campaigns/:id/cancel
   */
  async cancel(id: number): Promise<Campaign> {
    const raw = await apiPost<any>(`/campaigns/${id}/cancel`);
    return normalize(raw?.data ?? raw);
  },

  /**
   * PUT /campaigns/:id
   * FIX (Issue 7): This route now exists — was missing from old service.
   */
  async update(
    id: number,
    data: Partial<{
      name: string;
      templateId: number;
      whatsappAccountId: number;
      scheduledAt: string | null;
    }>
  ): Promise<Campaign> {
    const raw = await apiPut<any>(`/campaigns/${id}`, data);
    return normalize(raw?.data ?? raw);
  },

  /**
   * DELETE /campaigns/:id
   * FIX (Issue 7): This route now exists — was missing from old service.
   * Cannot delete a running campaign (backend returns 409).
   */
  async delete(id: number): Promise<void> {
    await apiDelete(`/campaigns/${id}`);
  },
};
