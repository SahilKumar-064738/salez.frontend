import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useConversations(search?: string) {
  return useQuery({
    queryKey: [api.inbox.listConversations.path, { search: search || "" }],
    queryFn: async () => {
      const u = new URL(api.inbox.listConversations.path, window.location.origin);
      if (search) u.searchParams.set("search", search);
      const res = await fetch(u.toString().replace(window.location.origin, ""), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const json = await res.json();
      return parseWithLogging(api.inbox.listConversations.responses[200], json, "inbox.listConversations");
    },
  });
}

export function useMessages(conversationId?: number) {
  return useQuery({
    enabled: !!conversationId,
    queryKey: [api.inbox.listMessages.path, conversationId],
    queryFn: async () => {
      const url = buildUrl(api.inbox.listMessages.path, { id: conversationId as number });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return [];
      if (!res.ok) throw new Error("Failed to fetch messages");
      const json = await res.json();
      return parseWithLogging(api.inbox.listMessages.responses[200], json, "inbox.listMessages");
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { conversationId: number; body: string }) => {
      const url = buildUrl(api.inbox.sendMessage.path, { id: input.conversationId });
      const validated = api.inbox.sendMessage.input.parse({
        body: input.body,
        direction: "outbound" as const,
      });
      const res = await fetch(url, {
        method: api.inbox.sendMessage.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.inbox.sendMessage.responses[400], await res.json(), "inbox.sendMessage.400");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.inbox.sendMessage.responses[404], await res.json(), "inbox.sendMessage.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to send message");
      }
      const json = await res.json();
      return parseWithLogging(api.inbox.sendMessage.responses[201], json, "inbox.sendMessage.201");
    },
    onSuccess: (_created, vars) => {
      qc.invalidateQueries({ queryKey: [api.inbox.listMessages.path, vars.conversationId] });
      qc.invalidateQueries({ queryKey: [api.inbox.listConversations.path] });
    },
  });
}

export function useMarkConversationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: number) => {
      const url = buildUrl(api.inbox.markRead.path, { id: conversationId });
      const res = await fetch(url, {
        method: api.inbox.markRead.method,
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 404) {
          const err = parseWithLogging(api.inbox.markRead.responses[404], await res.json(), "inbox.markRead.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to mark as read");
      }
      const json = await res.json();
      return parseWithLogging(api.inbox.markRead.responses[200], json, "inbox.markRead.200");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.inbox.listConversations.path] });
    },
  });
}
