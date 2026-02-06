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

export function useCampaigns() {
  return useQuery({
    queryKey: [api.broadcast.listCampaigns.path],
    queryFn: async () => {
      const res = await fetch(api.broadcast.listCampaigns.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      const json = await res.json();
      return parseWithLogging(api.broadcast.listCampaigns.responses[200], json, "broadcast.listCampaigns");
    },
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.broadcast.createCampaign.input>) => {
      const validated = api.broadcast.createCampaign.input.parse(data);
      const res = await fetch(api.broadcast.createCampaign.path, {
        method: api.broadcast.createCampaign.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.broadcast.createCampaign.responses[400], await res.json(), "broadcast.createCampaign.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to create campaign");
      }
      const json = await res.json();
      return parseWithLogging(api.broadcast.createCampaign.responses[201], json, "broadcast.createCampaign.201");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.broadcast.listCampaigns.path] }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: z.infer<typeof api.broadcast.updateCampaign.input> }) => {
      const validated = api.broadcast.updateCampaign.input.parse(updates);
      const url = buildUrl(api.broadcast.updateCampaign.path, { id });
      const res = await fetch(url, {
        method: api.broadcast.updateCampaign.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.broadcast.updateCampaign.responses[400], await res.json(), "broadcast.updateCampaign.400");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.broadcast.updateCampaign.responses[404], await res.json(), "broadcast.updateCampaign.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to update campaign");
      }
      const json = await res.json();
      return parseWithLogging(api.broadcast.updateCampaign.responses[200], json, "broadcast.updateCampaign.200");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.broadcast.listCampaigns.path] }),
  });
}
