/**
 * src/services/messagesService.ts
 *
 * Backend contract (all under /api/v1 — handled by apiClient):
 *   GET  /messages/inbox                       inbox summary (queries inbox_summary view)
 *   GET  /messages/conversation/:contactId     conversation thread (cursor-paginated)
 *   POST /messages/send                        send a message
 *   PUT  /messages/conversation/:contactId/read  mark all read
 *
 * Fixes applied:
 *   Issue 3: /contacts/:id/messages → /messages/conversation/:contactId
 *   Issue 4: send() now requires whatsappAccountId
 *   Inbox + message response shapes match backend envelope
 */

import { apiGet, apiPost, apiPut } from "@/lib/apiClient";

export interface Message {
  id: number;
  contactId: number;
  content: string;
  direction: "inbound" | "outbound";
  status?: "pending" | "sent" | "delivered" | "read" | "failed";
  isRead: boolean;
  sentAt: string;
  // Legacy aliases for components that use sender/timestamp
  sender?: "user" | "contact";
  timestamp?: string;
}

export interface InboxItem {
  contactId: number;
  contactName: string;
  contactPhone: string;
  contactStage?: string | null;
  lastMessage: string;
  lastDirection?: "inbound" | "outbound";
  lastStatus?: string;
  isRead: boolean;
  lastMessageAt: string;
  unreadCount: number;
}

export interface SendMessageOptions {
  contactId: number;
  whatsappAccountId: number;  // required by backend
  content: string;
  mediaUrl?: string;
  mediaType?: string;
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
  const direction = m.direction === "inbound" ? "inbound" : "outbound";
  return {
    id: Number(m.id),
    contactId: Number(m.contactId ?? m.contact_id),
    content: m.content ?? m.body ?? "",
    direction,
    status: m.status ?? undefined,
    isRead: Boolean(m.isRead ?? m.is_read ?? false),
    sentAt: m.sentAt ?? m.sent_at ?? m.created_at ?? new Date().toISOString(),
    // Legacy aliases
    sender: direction === "inbound" ? "contact" : "user",
    timestamp: m.sentAt ?? m.sent_at ?? m.created_at ?? new Date().toISOString(),
  };
}

function normalizeInboxItem(item: any): InboxItem {
  return {
    contactId: Number(item.contactId ?? item.contact_id),
    contactName: item.contactName ?? item.contact_name ?? "Unknown",
    contactPhone: item.contactPhone ?? item.contact_phone ?? "",
    contactStage: item.contactStage ?? item.contact_stage ?? null,
    lastMessage: item.lastMessage ?? item.last_message ?? "",
    lastDirection: item.lastDirection ?? item.last_direction ?? undefined,
    lastStatus: item.lastStatus ?? item.last_status ?? undefined,
    isRead: Boolean(item.isRead ?? item.is_read ?? true),
    lastMessageAt: item.lastMessageAt ?? item.last_message_at ?? new Date().toISOString(),
    unreadCount: Number(item.unreadCount ?? item.unread_count ?? 0),
  };
}

export const messagesService = {
  /**
   * GET /messages/inbox
   * Backend response: { success, data: [...InboxItem], meta: { nextCursor, hasMore } }
   */
  async inbox(options?: { cursor?: string; limit?: number; unreadOnly?: boolean }): Promise<InboxListResult> {
    try {
      const params: Record<string, string> = {};
      if (options?.cursor) params.cursor = options.cursor;
      if (options?.limit) params.limit = String(options.limit);
      if (options?.unreadOnly) params.unreadOnly = "true";

      const raw = await apiGet<any>("/messages/inbox", { params });
      const list = raw?.data ?? raw ?? [];

      return {
        items: (Array.isArray(list) ? list : []).map(normalizeInboxItem),
        nextCursor: raw?.meta?.nextCursor ?? null,
        hasMore: raw?.meta?.hasMore ?? false,
      };
    } catch {
      return { items: [], nextCursor: null, hasMore: false };
    }
  },

  /**
   * GET /messages/conversation/:contactId
   * FIX (Issue 3): was /contacts/:id/messages — backend route is /messages/conversation/:contactId
   */
  async forContact(contactId: number, options?: { cursor?: string; limit?: number }): Promise<MessageListResult> {
    const params: Record<string, string> = {};
    if (options?.cursor) params.cursor = options.cursor;
    if (options?.limit) params.limit = String(options.limit);

    const raw = await apiGet<any>(`/messages/conversation/${contactId}`, { params });
    const list = raw?.data ?? raw ?? [];

    return {
      messages: (Array.isArray(list) ? list : []).map(normalizeMessage),
      nextCursor: raw?.meta?.nextCursor ?? null,
      hasMore: raw?.meta?.hasMore ?? false,
    };
  },

  /**
   * POST /messages/send
   * FIX (Issue 4): whatsappAccountId is now required.
   * Backend response: { success, data: { messageId, status, queuedAt } }
   */
  async send(options: SendMessageOptions): Promise<{ messageId: number; status: string; queuedAt: string }> {
    const raw = await apiPost<any>("/messages/send", {
      contactId: options.contactId,
      whatsappAccountId: options.whatsappAccountId,
      content: options.content,
      ...(options.mediaUrl && { mediaUrl: options.mediaUrl }),
      ...(options.mediaType && { mediaType: options.mediaType }),
    });
    const d = raw?.data ?? raw;
    return {
      messageId: Number(d?.messageId ?? d?.message_id ?? 0),
      status: d?.status ?? "pending",
      queuedAt: d?.queuedAt ?? d?.queued_at ?? new Date().toISOString(),
    };
  },

  /**
   * PUT /messages/conversation/:contactId/read
   * Mark all unread inbound messages in a conversation as read.
   */
  async markAllRead(contactId: number): Promise<void> {
    await apiPut(`/messages/conversation/${contactId}/read`);
  },
};
