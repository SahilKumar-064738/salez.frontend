/**
 * src/services/messagesService.ts
 *
 * Endpoints:
 *   GET  /messages/inbox               inbox list
 *   GET  /contacts/:id/messages        messages for a contact
 *   POST /contacts/:id/messages        send message to contact
 *   PUT  /messages/:id/read            mark single message as read
 *   PUT  /contacts/:id/messages/read   mark all contact messages as read
 */

import { apiGet, apiPost, apiPut } from "@/lib/apiClient";

export interface Message {
  id: number;
  contactId: number;
  content: string;
  sender: "user" | "contact";
  timestamp: string;
  isRead: boolean;
  status?: "sent" | "delivered" | "read" | "failed";
}

export interface InboxItem {
  contactId: number;
  contactName: string;
  contactPhone: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

function normalizeMessage(m: any): Message {
  return {
    id: Number(m.id),
    contactId: Number(m.contactId ?? m.contact_id),
    content: m.content ?? m.body ?? "",
    sender: m.sender === "contact" ? "contact" : "user",
    timestamp: m.timestamp ?? m.created_at ?? new Date().toISOString(),
    isRead: Boolean(m.isRead ?? m.is_read ?? false),
    status: m.status ?? undefined,
  };
}

export const messagesService = {
  /**
   * GET /messages/inbox — returns unified inbox
   */
  async inbox(): Promise<InboxItem[]> {
    try {
      const raw = await apiGet<any>("/api/messages/inbox");
      const list = raw?.inbox ?? raw?.data ?? raw ?? [];
      return (Array.isArray(list) ? list : []).map((item: any) => ({
        contactId: Number(item.contactId ?? item.contact_id),
        contactName: item.contactName ?? item.contact_name ?? "Unknown",
        contactPhone: item.contactPhone ?? item.contact_phone ?? "",
        lastMessage: item.lastMessage ?? item.last_message ?? "",
        lastMessageAt:
          item.lastMessageAt ?? item.last_message_at ?? new Date().toISOString(),
        unreadCount: Number(item.unreadCount ?? item.unread_count ?? 0),
      }));
    } catch {
      return [];
    }
  },

  /**
   * GET /contacts/:id/messages — all messages for a contact
   */
  async forContact(contactId: number): Promise<Message[]> {
    const raw = await apiGet<any>(`/api/contacts/${contactId}/messages`);
    const list = raw?.messages ?? raw?.data ?? raw ?? [];
    return (Array.isArray(list) ? list : []).map(normalizeMessage);
  },

  /**
   * POST /contacts/:id/messages — send a message
   */
  async send(contactId: number, content: string): Promise<Message> {
    const raw = await apiPost<any>(`/api/contacts/${contactId}/messages`, {
      content,
      sender: "user",
    });
    return normalizeMessage(raw?.message ?? raw);
  },

  /**
   * PUT /messages/:id/read — mark one message read
   */
  async markRead(messageId: number): Promise<void> {
    await apiPut(`/api/messages/${messageId}/read`);
  },

  /**
   * PUT /contacts/:id/messages/read — mark all messages from a contact read
   */
  async markAllRead(contactId: number): Promise<void> {
    await apiPut(`/api/contacts/${contactId}/messages/read`);
  },
};
