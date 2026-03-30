/**
 * src/services/whatsappAccountsService.ts
 *
 * Backend contract (all under /api/v1 — handled by apiClient):
 *   GET    /whatsapp-accounts        list accounts (never returns token)
 *   POST   /whatsapp-accounts        connect account (owner/admin only)
 *   PUT    /whatsapp-accounts/:id    update / rotate token (owner/admin only)
 *   DELETE /whatsapp-accounts/:id    soft-disconnect (owner/admin only)
 *
 * Fixes applied:
 *   Issue 5: URL was /whatsapp → correct is /whatsapp-accounts
 *   Issue 5: create() now requires apiToken (backend will 422 without it)
 *
 * NOTE: The raw API token is encrypted server-side via pgcrypto RPC.
 *       The token is never returned in any GET response.
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

export interface WhatsAppAccount {
  id: number;
  phoneNumber: string;
  displayName?: string | null;
  provider: "meta" | "twilio" | "vonage" | "wati";
  status: "active" | "inactive" | "disconnected";
  connectedAt?: string | null;
  lastSentAt?: string | null;
  dailyMessageLimit?: number;
}

function normalize(a: any): WhatsAppAccount {
  return {
    id: Number(a.id),
    phoneNumber: a.phoneNumber ?? a.phone_number ?? "",
    displayName: a.displayName ?? a.display_name ?? null,
    provider: a.provider ?? "meta",
    status: a.status ?? "active",
    connectedAt: a.connectedAt ?? a.connected_at ?? null,
    lastSentAt: a.lastSentAt ?? a.last_sent_at ?? null,
    dailyMessageLimit: Number(a.dailyMessageLimit ?? a.daily_message_limit ?? 1000),
  };
}

export const whatsappAccountsService = {
  /**
   * GET /whatsapp-accounts
   * FIX (Issue 5): was /whatsapp
   */
  async list(): Promise<WhatsAppAccount[]> {
    const raw = await apiGet<any>("/whatsapp-accounts");
    const list = raw?.data ?? raw ?? [];
    return (Array.isArray(list) ? list : []).map(normalize);
  },

  /**
   * POST /whatsapp-accounts
   * FIX (Issue 5): apiToken is required — backend will reject without it.
   */
  async create(data: {
    phoneNumber: string;
    displayName?: string;
    apiToken: string;             // required — encrypted server-side
    provider?: "meta" | "twilio" | "vonage" | "wati";
    dailyMessageLimit?: number;
  }): Promise<WhatsAppAccount> {
    const raw = await apiPost<any>("/whatsapp-accounts", {
      phoneNumber: data.phoneNumber,
      displayName: data.displayName,
      apiToken: data.apiToken,
      provider: data.provider ?? "meta",
      dailyMessageLimit: data.dailyMessageLimit ?? 1000,
    });
    return normalize(raw?.data ?? raw);
  },

  /**
   * PUT /whatsapp-accounts/:id
   * All fields optional. Use to update displayName, status, or rotate apiToken.
   */
  async update(
    id: number,
    data: Partial<{
      displayName: string;
      status: "active" | "inactive";
      apiToken: string;
      dailyMessageLimit: number;
    }>
  ): Promise<WhatsAppAccount> {
    const raw = await apiPut<any>(`/whatsapp-accounts/${id}`, data);
    return normalize(raw?.data ?? raw);
  },

  /**
   * DELETE /whatsapp-accounts/:id
   * Soft-disconnect — sets status to "disconnected".
   */
  async delete(id: number): Promise<void> {
    await apiDelete(`/whatsapp-accounts/${id}`);
  },
};
