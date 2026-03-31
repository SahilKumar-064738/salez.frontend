/**
 * src/hooks/use-inbox.ts
 * Backend: /api/v1/messages/inbox, /messages/conversation/:contactId,
 *          /messages/send, /messages/conversation/:contactId/read
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messagesService } from "@/services/messagesService";
import type { InboxItem, Message } from "@/services/messagesService";

export type { InboxItem, Message };
export type Conversation = InboxItem;

/** GET /api/v1/messages/inbox merged with /api/v1/contacts so all contacts appear */
export function useConversations(search?: string) {
  return useQuery({
    queryKey: ["conversations", { search: search || "" }],
    queryFn: async () => {
      // Fetch both contacts list and inbox conversations in parallel
      const [contactsRaw, inboxResult] = await Promise.all([
        (async () => {
          try {
            const { apiGet } = await import("@/lib/apiClient");
            const raw = await apiGet<any>("/contacts", { params: { limit: "100" } });
            const list = raw?.data ?? raw ?? [];
            return Array.isArray(list) ? list : [];
          } catch {
            return [];
          }
        })(),
        messagesService.inbox({ limit: 100 }).catch(() => ({ items: [], nextCursor: null, hasMore: false })),
      ]);

      // Build a map from contactId → inbox item for quick lookup
      const inboxMap = new Map<number, InboxItem>();
      for (const item of inboxResult.items) {
        inboxMap.set(item.contactId, item);
      }

      // Merge: every contact gets a row; inbox data fills in message details
      const merged: InboxItem[] = contactsRaw.map((c: any) => {
        const existing = inboxMap.get(Number(c.id));
        if (existing) return existing;
        return {
          contactId: Number(c.id),
          contactName: c.name ?? "Unknown",
          contactPhone: c.phone ?? "",
          contactStage: c.stage ?? null,
          lastMessage: "",
          lastDirection: undefined,
          lastStatus: undefined,
          isRead: true,
          lastMessageAt: c.created_at ?? new Date().toISOString(),
          unreadCount: 0,
        } as InboxItem;
      });

      // Sort: contacts with messages first (by lastMessageAt desc), then rest
      merged.sort((a, b) => {
        const aHasMsg = inboxMap.has(a.contactId);
        const bHasMsg = inboxMap.has(b.contactId);
        if (aHasMsg && !bHasMsg) return -1;
        if (!aHasMsg && bHasMsg) return 1;
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      });

      if (!search) return merged;
      const q = search.toLowerCase();
      return merged.filter(
        (i) =>
          i.contactName.toLowerCase().includes(q) ||
          i.contactPhone.includes(q) ||
          i.lastMessage.toLowerCase().includes(q)
      );
    },
    refetchInterval: 30_000,
  });
}

/** GET /api/v1/messages/conversation/:contactId */
export function useMessages(contactId?: number) {
  return useQuery({
    enabled: !!contactId,
    queryKey: ["messages", contactId],
    queryFn: async () => {
      if (!contactId) return [] as Message[];
      const result = await messagesService.forContact(contactId, { limit: 50 });
      return result.messages;
    },
    refetchInterval: 15_000, // poll every 15s for live feel
  });
}

/** POST /api/v1/messages/send */
export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      contactId?: number;
      conversationId?: number; // legacy alias
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
    mutationFn: (contactId: number) => messagesService.markAllRead(contactId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
}
