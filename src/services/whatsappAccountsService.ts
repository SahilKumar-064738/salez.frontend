/**
 * src/services/whatsappAccountsService.ts — REFACTORED
 * Delegates to typed Axios api client in @/api/api.
 */
import { api } from '@/api/api';

export interface WhatsAppAccount {
  id: number;
  phoneNumber: string;
  displayName?: string | null;
  provider: 'meta' | 'twilio' | 'vonage' | 'wati';
  status: 'active' | 'inactive' | 'disconnected';
  connectedAt?: string | null;
  lastSentAt?: string | null;
  dailyMessageLimit?: number;
}

function normalize(a: any): WhatsAppAccount {
  return {
    id: Number(a.id),
    phoneNumber: a.phoneNumber ?? a.phone_number ?? '',
    displayName: a.displayName ?? a.display_name ?? null,
    provider: a.provider ?? 'meta',
    status: a.status ?? 'active',
    connectedAt: a.connectedAt ?? a.connected_at ?? null,
    lastSentAt: a.lastSentAt ?? a.last_sent_at ?? null,
    dailyMessageLimit: Number(a.dailyMessageLimit ?? a.daily_message_limit ?? 1000),
  };
}

export const whatsappAccountsService = {
  async list(): Promise<WhatsAppAccount[]> {
    const raw = await api.whatsapp.list();
    return (Array.isArray(raw) ? raw : []).map(normalize);
  },

  async create(data: {
    phoneNumber: string;
    displayName?: string;
    apiToken: string;
    provider?: 'meta' | 'twilio' | 'vonage' | 'wati';
    dailyMessageLimit?: number;
  }): Promise<WhatsAppAccount> {
    const raw = await api.whatsapp.create({
      phoneNumber: data.phoneNumber,
      displayName: data.displayName ?? '',
      apiToken: data.apiToken,
      provider: data.provider ?? 'meta',
      dailyMessageLimit: data.dailyMessageLimit ?? 1000,
    });
    return normalize(raw);
  },

  async update(
    id: number,
    data: Partial<{
      displayName: string;
      status: 'active' | 'inactive';
      apiToken: string;
      dailyMessageLimit: number;
    }>
  ): Promise<WhatsAppAccount> {
    const raw = await api.whatsapp.update(id, data);
    return normalize(raw);
  },

  async delete(id: number): Promise<void> {
    await api.whatsapp.disconnect(id);
  },
};
