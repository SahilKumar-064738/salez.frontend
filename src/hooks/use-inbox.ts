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
  contactId?: number;
  direction?: "inbound" | "outbound";
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
      // later: we will build conversations by grouping messages by contactId
      return [] as Conversation[];
    },
  });
}

/**
 * Messages list
 * Backend: GET /api/messages
 *
 * NOTE: InboxPage currently calls useMessages(conversationId)
 * We'll ignore conversationId for now and return all messages.
 */
export function useMessages(_conversationId?: number) {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const data = await api.get<any[]>("/api/messages");

      // normalize to Message shape for UI safety
      return (data || []).map((m) => ({
        id: m.id,
        contactId: m.contact_id ?? m.contactId,
        direction: m.direction,
        content: m.content ?? m.body ?? "",
        createdAt: m.created_at ?? m.createdAt,
      })) as Message[];
    },
  });
}

/**
 * Send message
 * Backend: POST /api/messages
 *
 * Your backend likely expects:
 * { contactId, content }
 */
export function useSendMessage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { conversationId: number; body: string }) => {
      // TEMP mapping:
      // conversationId is treated as contactId for now
      const res = await api.post("/api/messages", {
        contactId: input.conversationId,
        content: input.body,
      });

      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages"] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
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
    mutationFn: async (_conversationId: number) => {
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
