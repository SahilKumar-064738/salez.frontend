/**
 * src/hooks/use-inbox.ts
 *
 * Uses messagesService which correctly maps to:
 *   GET  /api/v1/messages/inbox                     — inbox list
 *   GET  /api/v1/messages/conversation/:contactId   — message thread
 *   POST /api/v1/messages/send                      — send message
 *   PUT  /api/v1/messages/conversation/:contactId/read — mark read
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messagesService } from "@/services/messagesService";
import type { InboxItem, Message } from "@/services/messagesService";

export type { InboxItem, Message };

// Legacy type aliases so existing pages don't break
export type Conversation = InboxItem;

/** GET /api/v1/messages/inbox */
export function useConversations(search?: string) {
  return useQuery({
    queryKey: ["conversations", { search: search || "" }],
    queryFn: async () => {
      const result = await messagesService.inbox();
      // Filter client-side if search is provided
      if (search) {
        const q = search.toLowerCase();
        return result.items.filter(
          (i) =>
            i.contactName.toLowerCase().includes(q) ||
            i.contactPhone.includes(q) ||
            i.lastMessage.toLowerCase().includes(q)
        );
      }
      return result.items;
    },
  });
}

/** GET /api/v1/messages/conversation/:contactId */
export function useMessages(contactId?: number) {
  return useQuery({
    enabled: !!contactId,
    queryKey: ["messages", contactId],
    queryFn: async () => {
      if (!contactId) return [] as Message[];
      const result = await messagesService.forContact(contactId);
      return result.messages;
    },
  });
}

/** POST /api/v1/messages/send */
export function useSendMessage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      contactId?: number;
      conversationId?: number; // legacy alias — treated as contactId
      whatsappAccountId?: number;
      body: string;
    }) => {
      const cid = input.contactId ?? input.conversationId ?? 0;
      return messagesService.send({
        contactId: cid,
        whatsappAccountId: input.whatsappAccountId ?? 1,
        content: input.body,
      });
    },
    onSuccess: (_data, vars) => {
      const cid = vars.contactId ?? vars.conversationId;
      qc.invalidateQueries({ queryKey: ["messages", cid] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

/** PUT /api/v1/messages/conversation/:contactId/read */
export function useMarkConversationRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (contactId: number) => {
      await messagesService.markAllRead(contactId);
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
