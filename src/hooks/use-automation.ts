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

export function useAutomationRules() {
  return useQuery({
    queryKey: [api.automation.list.path],
    queryFn: async () => {
      const res = await fetch(api.automation.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch automation rules");
      const json = await res.json();
      return parseWithLogging(api.automation.list.responses[200], json, "automation.list");
    },
  });
}

export function useCreateAutomationRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.automation.create.input>) => {
      const validated = api.automation.create.input.parse(data);
      const res = await fetch(api.automation.create.path, {
        method: api.automation.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.automation.create.responses[400], await res.json(), "automation.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create rule");
      }
      const json = await res.json();
      return parseWithLogging(api.automation.create.responses[201], json, "automation.create.201");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.automation.list.path] }),
  });
}

export function useUpdateAutomationRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: z.infer<typeof api.automation.update.input> }) => {
      const validated = api.automation.update.input.parse(updates);
      const url = buildUrl(api.automation.update.path, { id });
      const res = await fetch(url, {
        method: api.automation.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.automation.update.responses[400], await res.json(), "automation.update.400");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.automation.update.responses[404], await res.json(), "automation.update.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to update rule");
      }
      const json = await res.json();
      return parseWithLogging(api.automation.update.responses[200], json, "automation.update.200");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.automation.list.path] }),
  });
}
