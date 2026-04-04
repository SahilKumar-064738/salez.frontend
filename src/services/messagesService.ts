/**
 * src/services/messagesService.ts — REFACTORED
 * Delegates to typed Axios api client in @/api/api.
 */
import { api } from '@/api/api';
import type { SendMessagePayload, InboxQuery } from '@/api/api';

export interface Message {
  id: number;
  contactId: number;
  content: string;
  direction: 'inbound' | 'outbound';
  status?: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  isRead: boolean;
  sentAt: string;
  sender?: 'user' | 'contact';
  timestamp?: string;
}

export interface InboxItem {
  contactId: number;
  contactName: string;
  contactPhone: string;
  contactStage?: string | null;
  lastMessage: string;
  lastDirection?: 'inbound' | 'outbound';
  lastStatus?: string;
  isRead: boolean;
  lastMessageAt: string;
  unreadCount: number;
}

export interface MessageListResult {
  messages: Message[];
  nextCursor?: string | null;
  hasMore: boolean;
}

export interface InboxListResult {
  items: InboxItem[];
  nextCursor?: string | null;
  hasMore: boolean;
}

function normalizeMessage(m: any): Message {
  const direction = m.direction === 'inbound' ? 'inbound' : 'outbound';
  return {
    id: Number(m.id),
    contactId: Number(m.contactId ?? m.contact_id),
    content: m.content ?? m.body ?? '',
    direction,
    status: m.status ?? undefined,
    isRead: Boolean(m.isRead ?? m.is_read ?? false),
    sentAt: m.sentAt ?? m.sent_at ?? m.created_at ?? new Date().toISOString(),
    sender: direction === 'inbound' ? 'contact' : 'user',
    timestamp: m.sentAt ?? m.sent_at ?? m.created_at ?? new Date().toISOString(),
  };
}

function normalizeInboxItem(item: any): InboxItem {
  return {
    contactId: Number(item.contactId ?? item.contact_id),
    contactName: item.contactName ?? item.contact_name ?? 'Unknown',
    contactPhone: item.contactPhone ?? item.contact_phone ?? '',
    contactStage: item.contactStage ?? item.contact_stage ?? null,
    lastMessage: item.lastMessage ?? item.last_message ?? '',
    lastDirection: item.lastDirection ?? item.last_direction ?? undefined,
    lastStatus: item.lastStatus ?? item.last_status ?? undefined,
    isRead: Boolean(item.isRead ?? item.is_read ?? true),
    lastMessageAt: item.lastMessageAt ?? item.last_message_at ?? new Date().toISOString(),
    unreadCount: Number(item.unreadCount ?? item.unread_count ?? 0),
  };
}

export const messagesService = {
  async inbox(options?: { cursor?: string; limit?: number; unreadOnly?: boolean }): Promise<InboxListResult> {
    try {
      const query: InboxQuery = {
        cursor: options?.cursor,
        limit: options?.limit,
        unreadOnly: options?.unreadOnly,
      };
      const raw = await api.messages.getInbox(query);
      return {
        items: (raw.data ?? []).map(normalizeInboxItem),
        nextCursor: raw.pagination?.nextCursor ?? null,
        hasMore: raw.pagination?.hasMore ?? false,
      };
    } catch {
      return { items: [], nextCursor: null, hasMore: false };
    }
  },

  async forContact(contactId: number, options?: { cursor?: string; limit?: number }): Promise<MessageListResult> {
    const raw = await api.messages.getConversation(contactId, options);
    return {
      messages: (raw.data ?? []).map(normalizeMessage),
      nextCursor: raw.pagination?.nextCursor ?? null,
      hasMore: raw.pagination?.hasMore ?? false,
    };
  },

  async send(options: SendMessagePayload): Promise<{ messageId: number; status: string; queuedAt: string }> {
    const d = await api.messages.send(options) as any;
    return {
      messageId: Number(d?.messageId ?? d?.message_id ?? 0),
      status: d?.status ?? 'pending',
      queuedAt: d?.queuedAt ?? d?.queued_at ?? new Date().toISOString(),
    };
  },

  async markAllRead(contactId: number): Promise<void> {
    await api.messages.markRead(contactId);
  },
};
