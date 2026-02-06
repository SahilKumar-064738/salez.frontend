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

export function useTemplates(filters?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: [api.templates.list.path, filters || {}],
    queryFn: async () => {
      const u = new URL(api.templates.list.path, window.location.origin);
      if (filters?.search) u.searchParams.set("search", filters.search);
      if (filters?.status) u.searchParams.set("status", filters.status);
      const res = await fetch(u.toString().replace(window.location.origin, ""), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch templates");
      const json = await res.json();
      return parseWithLogging(api.templates.list.responses[200], json, "templates.list");
    },
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.templates.create.input>) => {
      const validated = api.templates.create.input.parse(data);
      const res = await fetch(api.templates.create.path, {
        method: api.templates.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.templates.create.responses[400], await res.json(), "templates.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create template");
      }
      const json = await res.json();
      return parseWithLogging(api.templates.create.responses[201], json, "templates.create.201");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.templates.list.path] }),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: z.infer<typeof api.templates.update.input> }) => {
      const validated = api.templates.update.input.parse(updates);
      const url = buildUrl(api.templates.update.path, { id });
      const res = await fetch(url, {
        method: api.templates.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.templates.update.responses[400], await res.json(), "templates.update.400");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.templates.update.responses[404], await res.json(), "templates.update.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to update template");
      }
      const json = await res.json();
      return parseWithLogging(api.templates.update.responses[200], json, "templates.update.200");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.templates.list.path] }),
  });
}
