import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useContacts(filters?: { search?: string; stage?: string; tag?: string }) {
  return useQuery({
    queryKey: [api.contacts.list.path, filters || {}],
    queryFn: async () => {
      const u = new URL(api.contacts.list.path, window.location.origin);
      if (filters?.search) u.searchParams.set("search", filters.search);
      if (filters?.stage) u.searchParams.set("stage", filters.stage);
      if (filters?.tag) u.searchParams.set("tag", filters.tag);
      const res = await fetch(u.toString().replace(window.location.origin, ""), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const json = await res.json();
      return parseWithLogging(api.contacts.list.responses[200], json, "contacts.list");
    },
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.contacts.create.input>) => {
      const validated = api.contacts.create.input.parse(data);
      const res = await fetch(api.contacts.create.path, {
        method: api.contacts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.contacts.create.responses[400], await res.json(), "contacts.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create contact");
      }
      const json = await res.json();
      return parseWithLogging(api.contacts.create.responses[201], json, "contacts.create.201");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.contacts.list.path] });
      qc.invalidateQueries({ queryKey: [api.pipeline.list.path] });
      qc.invalidateQueries({ queryKey: [api.inbox.listConversations.path] });
    },
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: z.infer<typeof api.contacts.update.input> }) => {
      const validated = api.contacts.update.input.parse(updates);
      const url = api.contacts.update.path.replace(":id", String(id));
      const res = await fetch(url, {
        method: api.contacts.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.contacts.update.responses[400], await res.json(), "contacts.update.400");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.contacts.update.responses[404], await res.json(), "contacts.update.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to update contact");
      }
      const json = await res.json();
      return parseWithLogging(api.contacts.update.responses[200], json, "contacts.update.200");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.contacts.list.path] });
      qc.invalidateQueries({ queryKey: [api.pipeline.list.path] });
      qc.invalidateQueries({ queryKey: [api.inbox.listConversations.path] });
    },
  });
}
