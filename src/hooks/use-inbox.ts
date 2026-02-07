import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

/**
 * These are basic types.
 * We'll refine them later based on backend response.
 */
export type Conversation = {
  id: number;
  title?: string;
  lastMessage?: string;
  unread?: boolean;
};

export type Message = {
  id: number;
  contactId: number;
  direction: "inbound" | "outbound" | string;
  content: string;
  createdAt?: string;
};

/**
 * TEMP: Backend doesn't have "conversations" endpoint.
 * To prevent InboxPage crash, we return an empty list for now.
 */
export function useConversations(search?: string) {
  return useQuery({
    queryKey: ["conversations", { search: search || "" }],
    queryFn: async () => {
      return [] as Conversation[];
    },
  });
}

/**
 * Messages list
 *
 * Backend has 2 endpoints:
 * 1) GET /api/messages -> returns { messages: [...], pagination: {...} }
 * 2) GET /api/messages/contact/:contactId -> returns [...]
 *
 * InboxPage currently calls useMessages(conversationId).
 * We'll treat conversationId as contactId for now.
 */
export function useMessages(conversationId?: number) {
  return useQuery({
    enabled: true,
    queryKey: ["messages", conversationId || "all"],
    queryFn: async () => {
      let raw: any;

      // If we have an ID, load messages for that contact (best for chat UI)
      if (conversationId) {
        raw = await api.get<any>(`/api/messages/contact/${conversationId}`);
      } else {
        // Otherwise load all messages (returns object with messages array)
        raw = await api.get<any>(`/api/messages`);
      }

      // Normalize:
      // - if backend returns array -> use it
      // - if backend returns { messages: [] } -> use raw.messages
      const arr = Array.isArray(raw) ? raw : raw?.messages || [];

      return arr.map((m: any) => ({
        id: m.id,
        contactId: m.contact_id ?? m.contactId,
        direction: m.direction,
        content: m.content ?? m.body ?? "",
        createdAt: m.sent_at ?? m.created_at ?? m.createdAt,
      })) as Message[];
    },
  });
}

/**
 * Send message
 * Backend: POST /api/messages
 * expects: { contactId, content, whatsappAccountId? }
 */
export function useSendMessage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { conversationId: number; body: string }) => {
      // conversationId is treated as contactId
      return api.post("/api/messages", {
        contactId: input.conversationId,
        content: input.body,
      });
    },
    onSuccess: (_data, vars) => {
      // refresh messages for this contact
      qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] });

      // refresh "all"
      qc.invalidateQueries({ queryKey: ["messages", "all"] });

      qc.invalidateQueries({ queryKey: ["conversations"] });
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

/**
 * TEMP: Backend doesn't have mark-read endpoint.
 * This exists only to stop InboxPage crashing.
 */
export function useMarkConversationRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (_conversationId: number) => true,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
